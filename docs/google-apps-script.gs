// 위하다 출판사 투고 접수 백엔드 (구글 Apps Script)
// 역할: ① 투고 폼 → 시트 기록 + 원고를 Drive 투고함에 저장 (doPost)
//       ② n8n 폴링 API — "진행" 상태 투고 조회/원고 다운로드/처리 표시 (doGet)
//
// 설정 방법: docs/구글연동가이드.md 참고

// ── 설정 (관장님이 채울 것) ──────────────────────────────────────
var SHEET_ID = "여기에_구글시트_ID";        // 시트 URL의 /d/와 /edit 사이 문자열
var FOLDER_ID = "여기에_드라이브_폴더_ID";  // 투고함 폴더 URL의 /folders/ 뒤 문자열
var API_TOKEN = "여기에_아무_비밀문자열";   // n8n과 약속하는 비밀키 (예: wehada-2026-xxxx)

var SHEET_NAME = "투고";
var HEADER = ["접수일", "이름", "이메일", "연락처", "장르", "제목", "분량",
              "작품소개", "전달사항", "파일명", "파일ID", "상태", "파이프라인"];

// 컬럼 인덱스 (1-based)
var COL_TITLE = 6, COL_FILENAME = 10, COL_FILEID = 11, COL_STATUS = 12, COL_PIPELINE = 13;

function getSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── ① 투고 접수 (웹사이트 → 여기) ───────────────────────────────
function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  var fileName = "";
  var fileId = "";
  if (data.fileBase64) {
    var blob = Utilities.newBlob(
      Utilities.base64Decode(data.fileBase64),
      data.mimeType || "application/octet-stream",
      data.fileName
    );
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var saved = folder.createFile(blob);
    // 파일명: 제목_저자명_원본파일명 으로 정리
    saved.setName(data.title + "_" + data.name + "_" + data.fileName);
    fileName = saved.getName();
    fileId = saved.getId();
  }

  getSheet().appendRow([
    new Date(), data.name, data.email, data.phone, data.genre, data.title,
    data.pages, data.synopsis, data.message, fileName, fileId,
    "검토중", ""
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── ② n8n 폴링 API ──────────────────────────────────────────────
function doGet(e) {
  var p = e.parameter;
  if (p.token !== API_TOKEN) {
    return json({ ok: false, error: "unauthorized" });
  }

  // 진행 확정 + 아직 입고 안 된 투고 목록
  if (p.action === "pending") {
    var sheet = getSheet();
    var rows = sheet.getDataRange().getValues();
    var pending = [];
    for (var i = 1; i < rows.length; i++) {
      var status = String(rows[i][COL_STATUS - 1]).trim();
      var pipeline = String(rows[i][COL_PIPELINE - 1]).trim();
      var fileId = String(rows[i][COL_FILEID - 1]).trim();
      if (status === "진행" && pipeline === "" && fileId !== "") {
        pending.push({
          row: i + 1,
          title: rows[i][COL_TITLE - 1],
          fileName: rows[i][COL_FILENAME - 1],
          fileId: fileId
        });
      }
    }
    return json({ ok: true, pending: pending });
  }

  // 원고 파일 다운로드 (base64)
  if (p.action === "file" && p.id) {
    var file = DriveApp.getFileById(p.id);
    return json({
      ok: true,
      fileName: file.getName(),
      base64: Utilities.base64Encode(file.getBlob().getBytes())
    });
  }

  // 입고 완료 표시
  if (p.action === "mark" && p.row) {
    getSheet().getRange(Number(p.row), COL_PIPELINE).setValue("입고완료 " +
      Utilities.formatDate(new Date(), "Asia/Seoul", "MM-dd HH:mm"));
    return json({ ok: true });
  }

  return json({ ok: false, error: "unknown action" });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
