// 위하다출판사 로고 가이드 — 모든 버전을 한눈에 확인하는 페이지
import LogoSymbol from "../components/LogoSymbol";

export default function LogoPage() {
  return (
    <div style={{ fontFamily: "'Noto Serif KR', serif", background: "#F8F4F1", minHeight: "100vh", padding: "80px 60px" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Noto+Serif+KR:wght@300;400;500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      <div style={{ marginBottom: "80px", borderBottom: "1px solid #E0D0C8", paddingBottom: "40px" }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7A3D2E", marginBottom: "12px" }}>Brand Identity</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 400, color: "#0A0604", marginBottom: "8px" }}>위하다 로고 가이드</h1>
        <p style={{ fontSize: "0.85rem", color: "#7A5A4A" }}>Wehada Publishing House — Logo Versions</p>
      </div>

      {/* ── 가로형 버전들 ── */}
      <Section title="가로형 (Horizontal)" desc="웹사이트 네비, 이메일 서명, 명함에 사용">
        <Row label="기본 (Dark)" bg="#FFFFFF">
          <LogoSymbol variant="dark" size={48} layout="horizontal" />
        </Row>
        <Row label="라지 (Dark)" bg="#FFFFFF">
          <LogoSymbol variant="dark" size={64} layout="horizontal" />
        </Row>
        <Row label="스몰 (Dark)" bg="#FFFFFF">
          <LogoSymbol variant="dark" size={32} layout="horizontal" />
        </Row>
        <Row label="라이트 (밝은 배경 대비)" bg="#1E1410">
          <LogoSymbol variant="light" size={48} layout="horizontal" />
        </Row>
        <Row label="로즈" bg="#F8F4F1">
          <LogoSymbol variant="rose" size={48} layout="horizontal" />
        </Row>
      </Section>

      {/* ── 세로형 버전들 ── */}
      <Section title="세로형 (Vertical)" desc="책 판권페이지, 표지 안쪽, 봉투에 사용">
        <div style={{ display: "flex", gap: "80px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <VertRow label="기본 (Dark)" bg="#FFFFFF">
            <LogoSymbol variant="dark" size={56} layout="vertical" />
          </VertRow>
          <VertRow label="라지" bg="#FFFFFF">
            <LogoSymbol variant="dark" size={80} layout="vertical" />
          </VertRow>
          <VertRow label="스몰 (판권용)" bg="#FFFFFF">
            <LogoSymbol variant="dark" size={36} layout="vertical" />
          </VertRow>
          <VertRow label="라이트" bg="#1E1410">
            <LogoSymbol variant="light" size={56} layout="vertical" />
          </VertRow>
        </div>
      </Section>

      {/* ── 심볼 단독 ── */}
      <Section title="심볼 단독 (Symbol Only)" desc="SNS 프로필 이미지, 파비콘, 도장에 사용">
        <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", alignItems: "center" }}>
          {[24, 36, 48, 64, 96].map(s => (
            <VertRow key={s} label={`${s}px`} bg="#FFFFFF">
              <LogoSymbol variant="dark" size={s} showText={false} />
            </VertRow>
          ))}
          <VertRow label="라이트 48px" bg="#1E1410">
            <LogoSymbol variant="light" size={48} showText={false} />
          </VertRow>
        </div>
      </Section>

      {/* ── 색상 팔레트 ── */}
      <Section title="브랜드 컬러" desc="로고 구성 색상">
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[
            { name: "브랜드 브라운", hex: "#0A0604", role: "메인 텍스트" },
            { name: "와인 브라운", hex: "#7A3D2E", role: "심볼 포인트, '위' 강조" },
            { name: "크림", hex: "#F8F4F1", role: "배경" },
            { name: "더스티 로즈", hex: "#C4908A", role: "보조 장식" },
            { name: "더스티 로즈 페일", hex: "#EDD9D5", role: "연한 장식" },
          ].map(c => (
            <div key={c.hex} style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, background: c.hex, border: "1px solid #E0D0C8", marginBottom: 8 }} />
              <p style={{ fontSize: "0.7rem", fontWeight: 500, color: "#0A0604", marginBottom: 2 }}>{c.name}</p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", color: "#7A5A4A", letterSpacing: "0.1em" }}>{c.hex}</p>
              <p style={{ fontSize: "0.62rem", color: "#9B8075" }}>{c.role}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "80px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 400, color: "#0A0604", marginBottom: "6px" }}>{title}</h2>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#7A5A4A" }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ label, bg, children }: { label: string; bg: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "40px", marginBottom: "24px" }}>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", color: "#9B8075", letterSpacing: "0.08em", width: "140px", flexShrink: 0 }}>{label}</p>
      <div style={{ background: bg, padding: "20px 32px", border: "1px solid #E0D0C8" }}>
        {children}
      </div>
    </div>
  );
}

function VertRow({ label, bg, children }: { label: string; bg: string; children: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ background: bg, padding: "32px 40px", border: "1px solid #E0D0C8", marginBottom: "10px", display: "inline-flex" }}>
        {children}
      </div>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", color: "#9B8075", letterSpacing: "0.08em" }}>{label}</p>
    </div>
  );
}
