// 위하다출판사 로고 SVG 컴포넌트 — 열린 문 심볼 + 한글 워드마크
// SVG textLength로 PUBLISHING HOUSE를 위하다 폭에 정확히 맞춤

interface LogoSymbolProps {
  variant?: "dark" | "light" | "rose";
  size?: number;
  showText?: boolean;
  layout?: "horizontal" | "vertical";
  className?: string;
}

function getColors(variant: "dark" | "light" | "rose") {
  return {
    dark:  { symbol: "#0A0604", door: "#7A3D2E", text: "#0A0604", sub: "#7A5A4A" },
    light: { symbol: "#F8F4F1", door: "#EDD9D5", text: "#F8F4F1", sub: "#BEA99E" },
    rose:  { symbol: "#7A3D2E", door: "#7A3D2E", text: "#0A0604", sub: "#7A5A4A" },
  }[variant];
}

function DoorSymbol({ size, c }: { size: number; c: ReturnType<typeof getColors> }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 40 L8 16 Q8 8 16 8 L32 8 Q40 8 40 16 L40 40" stroke={c.symbol} strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="5" y1="40" x2="43" y2="40" stroke={c.symbol} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 40 L18 17 Q18 14 21 14 L32 14 Q35 14 35 17 L35 40" stroke={c.door} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M18 14 L14 11" stroke={c.door} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M18 40 L14 40" stroke={c.door} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M14 11 L14 40" stroke={c.door} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <circle cx="30.5" cy="27" r="1.5" fill={c.door} />
      <line x1="22" y1="22" x2="28" y2="22" stroke={c.door} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="22" y1="26" x2="29" y2="26" stroke={c.door} strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <line x1="22" y1="30" x2="27" y2="30" stroke={c.door} strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

// 워드마크를 SVG로 렌더링 — textLength로 정확한 폭 보장
// SVG 안에서 위하다 텍스트 폭을 ID로 참조해 PUBLISHING HOUSE를 동일 폭으로 맞춤
// — 두 text 모두 같은 textLength를 쓰면 수학적으로 완전히 일치
function WordmarkSVG({
  mainFontSize,
  textColor,
  doorColor,
  subColor,
  mainLetterSpacing = -0.4,
}: {
  mainFontSize: number;
  textColor: string;
  doorColor: string;
  subColor: string;
  mainLetterSpacing?: number;
}) {
  const charEm = 0.95;
  const ls = mainLetterSpacing;
  // 위하다 폭 = 글자 em폭 × 3 + letterSpacing × 3 (CSS는 모든 글자 뒤에 ls 추가)
  const mainW = mainFontSize * charEm * 3 + ls * 3;
  const subFontSize = mainFontSize * 0.35;
  const gap = mainFontSize * 0.06;
  const totalH = mainFontSize + gap + subFontSize;

  return (
    <svg
      width={mainW}
      height={totalH}
      viewBox={`0 0 ${mainW} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* 위하다 — textLength로 폭을 명시적으로 고정 */}
      <text
        x="0"
        y={mainFontSize * 0.92}
        fontFamily="'Noto Serif KR', serif"
        fontWeight="500"
        fontSize={mainFontSize}
        textLength={mainW}
        lengthAdjust="spacing"
        fill={textColor}
      >
        <tspan fill={doorColor}>위</tspan>하다
      </text>

      {/* PUBLISHING HOUSE — 위하다와 시각적 폭을 맞추기 위해 textLength를 살짝 줄이고 시작점을 보정 */}
      <text
        x={subFontSize * 0.05}
        y={totalH}
        fontFamily="'Jost', sans-serif"
        fontWeight="400"
        fontSize={subFontSize}
        textLength={mainW * 0.97}
        lengthAdjust="spacing"
        fill={subColor}
      >
        PUBLISHING HOUSE
      </text>
    </svg>
  );
}

export default function LogoSymbol({
  variant = "dark",
  size = 48,
  showText = true,
  layout = "horizontal",
  className = "",
}: LogoSymbolProps) {
  const c = getColors(variant);
  const scale = size / 48;
  const mainFontSize = 20 * scale;

  // ── 세로형 ──────────────────────────────────────────────
  if (layout === "vertical") {
    return (
      <div
        className={`wehada-logo wehada-logo--vertical ${className}`}
        style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: `${-4 * scale}px` }}
      >
        <DoorSymbol size={size} c={c} />
        {showText && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: `${4 * scale}px` }}>
            <WordmarkSVG
              mainFontSize={mainFontSize * 0.95}
              textColor={c.text}
              doorColor={c.door}
              subColor={c.sub}
              mainLetterSpacing={0}
            />
          </div>
        )}
      </div>
    );
  }

  // ── 가로형 ──────────────────────────────────────────────
  return (
    <div
      className={`wehada-logo ${className}`}
      style={{ display: "inline-flex", alignItems: "center", gap: `${-2 * scale}px` }}
    >
      <DoorSymbol size={size} c={c} />
      {showText && (
        <WordmarkSVG
          mainFontSize={mainFontSize}
          textColor={c.text}
          doorColor={c.door}
          subColor={c.sub}
          mainLetterSpacing={mainFontSize * -0.02} // -0.02em
        />
      )}
    </div>
  );
}
