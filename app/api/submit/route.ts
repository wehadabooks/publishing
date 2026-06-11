// 투고 폼(텍스트+원고 파일)을 구글 Apps Script로 전송하는 API 라우트
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_MB = 20;
const ACCEPT_EXT = [".hwp", ".hwpx", ".pdf", ".docx"];
const FIELDS = ["name", "email", "phone", "genre", "title", "pages", "synopsis", "message"] as const;

export async function POST(req: NextRequest) {
  const fd = await req.formData();

  const data: Record<string, string> = {};
  for (const key of FIELDS) data[key] = String(fd.get(key) ?? "");

  if (!data.name || !data.email || !data.title || !data.synopsis) {
    return NextResponse.json({ ok: false, error: "필수 항목 누락" }, { status: 400 });
  }

  // 원고 파일 (선택) — base64로 변환해 Apps Script에 전달
  let fileName = "";
  let fileBase64 = "";
  let mimeType = "";
  const file = fd.get("file");
  if (file instanceof File && file.size > 0) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPT_EXT.includes(ext)) {
      return NextResponse.json({ ok: false, error: "허용되지 않는 파일 형식" }, { status: 400 });
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "파일 크기 초과" }, { status: 400 });
    }
    fileName = file.name;
    mimeType = file.type || "application/octet-stream";
    fileBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  }

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    // 개발 환경: 로그만 출력하고 성공 반환
    console.log("[투고 접수]", { ...data, fileName, fileSize: fileBase64.length });
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        fileName,
        fileBase64,
        mimeType,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error("구글 시트 전송 실패");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "전송 오류" }, { status: 500 });
  }
}
