"use client";

import { useState, useEffect, useRef } from "react";
import LogoSymbol from "./components/LogoSymbol";

// ── 스크롤 애니메이션 훅 ─────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── 타이핑 효과 훅 ──────────────────────────────────────
function useTyping(texts: string[], speed = 80) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 2000);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setIdx(i => (i + 1) % texts.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, texts, speed]);

  return display;
}

// ── 로고 — LogoSymbol 컴포넌트로 위임 ───────────────────
function Logo({ light = false, size = "md" }: { light?: boolean; size?: "sm" | "md" }) {
  const px = size === "sm" ? 32 : 44;
  return <LogoSymbol variant={light ? "light" : "dark"} size={px} showText={true} />;
}

// ── 네비 ─────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [["소개","#about"],["출판 분야","#genre"],["투고 안내","#submission"],["문의","#contact"]];
  return (
    <nav className="site-nav" style={{ boxShadow: scrolled ? "0 2px 24px rgba(60,30,20,0.07)" : "none" }}>
      <div className="nav-inner">
        <Logo size="sm" />
        <ul className="nav-links">
          {links.map(([label, href]) => (
            <li key={label}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <a href="#submission" className="nav-cta">원고 투고</a>
      </div>
    </nav>
  );
}

// ── 히어로 ───────────────────────────────────────────────
function Hero() {
  const typed = useTyping(["소설을 씁니다.", "에세이를 씁니다.", "이야기를 씁니다.", "삶을 기록합니다."], 90);

  return (
    <section className="hero">
      {/* 배경 장식 */}
      <div className="hero-bg-lines">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="hero-bg-line" style={{ left: `${10 + i * 16}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      <div className="hero-content">
        {/* 손글씨 느낌 태그 */}
        <div className="hero-handwritten anim-fade-up d1">
          <svg width="180" height="32" viewBox="0 0 180 32" fill="none">
            <path d="M4 24 C40 8, 80 28, 120 12 C148 2, 164 18, 176 10" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinecap="round" fill="none" className="draw-path" />
          </svg>
          <span>Wehada Publishing House</span>
        </div>

        {/* 메인 타이틀 */}
        <h1 className="hero-title anim-fade-up d2">
          당신은 지금<br />
          <span className="hero-typing">
            <em>{typed}</em>
            <span className="cursor">|</span>
          </span>
        </h1>

        <div className="anim-fade-up d3" style={{ display: "flex", justifyContent: "center", margin: "24px 0 32px" }}>
          <span className="divider" />
        </div>

        <p className="hero-desc anim-fade-up d4">
          위하다는 당신의 원고가 책이 되는 모든 여정을 함께합니다.<br />
          기획부터 출간까지, 진심 어린 이야기를 세상에 전합니다.
        </p>

        <div className="hero-btns anim-fade-up d5">
          <a href="#submission" className="btn-primary">원고 투고하기</a>
          <a href="#process" className="btn-outline">출판 과정 보기</a>
        </div>

        {/* 통계 */}
        <div className="hero-stats anim-fade-up d6">
          {[["문학·에세이","출판 분야"],["1:1","작가 밀착 관리"],["처음부터","끝까지 함께"]].map(([num, label]) => (
            <div key={label} className="hero-stat">
              <span className="hero-stat-num">{num}</span>
              <span className="hero-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 장식 — 원고지 */}
      <div className="hero-manuscript">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="manuscript-line" style={{ width: `${60 + Math.random() * 40}%`, animationDelay: `${i * 0.15}s` }} />
        ))}
        <div className="manuscript-pen">✒</div>
      </div>
    </section>
  );
}

// ── 소개 ─────────────────────────────────────────────────
function About() {
  const { ref, inView } = useInView();
  return (
    <section id="about" className="section section-white" ref={ref}>
      <div className="container">
        <div className={`about-grid fade-section ${inView ? "visible" : ""}`}>
          <div className="about-text">
            <p className="section-tag">About Us</p>
            <h2 className="section-title" style={{ marginBottom: "28px" }}>
              글을 쓴다는 건<br /><em>살아있다는 증거입니다</em>
            </h2>
            <span className="divider" style={{ marginBottom: "28px" }} />
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "2.2", marginBottom: "20px" }}>
              누군가의 밤을 밝혀줄 문장이 지금 어딘가에서 쓰이고 있습니다. 위하다는 그 문장이 독자에게 닿을 수 있도록 함께 걷습니다.
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "2.2" }}>
              1인 출판사이기에 더 깊이, 더 천천히, 더 정성스럽게. 작가 한 분 한 분의 이야기를 온전히 마주합니다.
            </p>
            <div style={{ marginTop: "40px", display: "flex", gap: "40px" }}>
              {[["기획","아이디어부터"],["편집","원고를 다듬고"],["출간","세상에 전하다"]].map(([title, sub]) => (
                <div key={title}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--dusty-rose-deep)", marginBottom: "4px" }}>{title}</p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="quote-box">
            <span className="quote-mark">&ldquo;</span>
            <p className="quote-text">모든 사람에겐 스토리가 있습니다.<br />위하다는 그 이야기가<br />혼자 사라지지 않도록<br />곁에 머뭅니다.</p>
            <span className="quote-mark right">&rdquo;</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 출판 과정 타임라인 ────────────────────────────────────
function Process() {
  const { ref, inView } = useInView(0.1);
  const steps = [
    { icon: "✦", num: "01", title: "아이디어", desc: "마음속에 품어온 이야기를 꺼냅니다. 어떤 형태여도 괜찮습니다.", color: "var(--dusty-rose-pale)" },
    { icon: "✍", num: "02", title: "원고 작성", desc: "위하다와 함께 방향을 잡고, 한 문장씩 써내려갑니다.", color: "var(--cream)" },
    { icon: "⟳", num: "03", title: "편집·교정", desc: "원고를 다듬고 다듬습니다. 작가의 목소리를 살리면서.", color: "var(--dusty-rose-pale)" },
    { icon: "◈", num: "04", title: "디자인", desc: "표지와 내지, 당신의 글에 어울리는 옷을 입힙니다.", color: "var(--cream)" },
    { icon: "◉", num: "05", title: "출간", desc: "마침내 책이 되어 독자의 손에 닿습니다.", color: "var(--dusty-rose-pale)" },
  ];

  return (
    <section id="process" className="section" style={{ background: "var(--brown-deep)", overflow: "hidden" }} ref={ref}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <p className="section-tag" style={{ color: "var(--dusty-rose-light)" }}>Publishing Process</p>
          <h2 className="section-title" style={{ color: "var(--cream)" }}>원고에서 책으로</h2>
        </div>

        <div className="process-track">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`process-step ${inView ? "visible" : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="process-icon" style={{ background: s.color }}>
                <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
              </div>
              {i < steps.length - 1 && <div className="process-connector" />}
              <div className="process-body">
                <p className="process-num">{s.num}</p>
                <h3 className="process-title">{s.title}</h3>
                <p className="process-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 장르 ─────────────────────────────────────────────────
function Genre() {
  const { ref, inView } = useInView();
  const genres = [
    { num: "01", title: "문학", sub: "소설 · 시 · 희곡", desc: "삶의 결을 섬세하게 담아내는 이야기. 장르를 가리지 않고 진정성 있는 문학 작품을 출판합니다.", icon: "📖" },
    { num: "02", title: "에세이", sub: "회고록 · 일상 에세이", desc: "개인의 경험에서 출발해 보편적인 울림을 만드는 에세이. 당신의 일상이 누군가의 위로가 됩니다.", icon: "✒️" },
    { num: "03", title: "인문 · 교양", sub: "사회 · 철학 · 역사", desc: "세상을 더 깊이 이해하게 만드는 책. 어렵지 않게, 하지만 깊이 있게.", icon: "🔍" },
  ];

  return (
    <section id="genre" className="section section-cream" ref={ref}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "64px" }} className={`fade-section ${inView ? "visible" : ""}`}>
          <p className="section-tag">Publishing Fields</p>
          <h2 className="section-title">출판 분야</h2>
        </div>
        <div className="genre-grid">
          {genres.map((g, i) => (
            <div
              key={g.num}
              className={`genre-card-pro fade-section ${inView ? "visible" : ""}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="genre-card-inner">
                <div className="genre-card-front">
                  <p className="genre-num">{g.num}</p>
                  <div className="genre-icon">{g.icon}</div>
                  <h3 className="genre-name">{g.title}</h3>
                  <p className="genre-sub">{g.sub}</p>
                  <div className="genre-bar" />
                  <p className="genre-desc">{g.desc}</p>
                </div>
                <div className="genre-card-hover">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "var(--dusty-rose-pale)", marginBottom: "16px" }}>
                    당신의 이야기를 기다립니다
                  </p>
                  <a href="#submission" className="btn-primary" style={{ fontSize: "0.7rem", padding: "10px 24px" }}>투고하기</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 투고 폼 ──────────────────────────────────────────────
const MAX_FILE_MB = 20;
const ACCEPT_EXT = [".hwp", ".hwpx", ".pdf", ".docx"];

function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", genre: "", title: "", pages: "", synopsis: "", message: "" });

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const f = e.target.files?.[0] ?? null;
    if (!f) { setFile(null); return; }
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPT_EXT.includes(ext)) {
      setError(`원고 파일은 ${ACCEPT_EXT.join(", ")} 형식만 가능합니다.`);
      e.target.value = "";
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`파일 크기는 ${MAX_FILE_MB}MB 이하만 가능합니다.`);
      e.target.value = "";
      return;
    }
    setFile(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("file", file);
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "전송 실패");
      setSubmitted(true);
    } catch {
      setError("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    setLoading(false);
  };

  if (submitted) return (
    <div className="thanks">
      <p className="thanks-title">감사합니다</p>
      <span className="divider" style={{ margin: "16px auto 20px" }} />
      <p className="thanks-desc">투고가 접수되었습니다. 4~8주 내로 이메일로 연락드리겠습니다.</p>
    </div>
  );

  return (
    <div className="form-box">
      <h3 className="form-box-title">원고 투고 양식</h3>
      <p className="form-box-sub">모든 항목을 성실히 작성해주시면 검토에 도움이 됩니다.</p>
      <form onSubmit={submit}>
        <p className="form-section-label">저자 정보</p>
        <div className="form-row-3">
          {([["이름 *","name","본명","text",true],["이메일 *","email","연락 가능한 이메일","email",true],["연락처","phone","010-0000-0000","text",false]] as const).map(([label,name,ph,type,req]) => (
            <div key={name}>
              <label className="form-label">{label}</label>
              <input type={type} name={name} placeholder={ph} required={req} value={form[name as keyof typeof form]} onChange={change} className="form-input" />
            </div>
          ))}
        </div>
        <p className="form-section-label">작품 정보</p>
        <div className="form-row-3">
          <div>
            <label className="form-label">장르 *</label>
            <select name="genre" required value={form.genre} onChange={change} className="form-input">
              <option value="">선택해주세요</option>
              {["소설","시","에세이","회고록","인문·교양","기타"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">작품 제목 *</label>
            <input type="text" name="title" placeholder="작품 제목" required value={form.title} onChange={change} className="form-input" />
          </div>
          <div>
            <label className="form-label">분량 (원고지 매수)</label>
            <input type="text" name="pages" placeholder="예: 300매" value={form.pages} onChange={change} className="form-input" />
          </div>
        </div>
        <div className="form-row-1">
          <label className="form-label">작품 소개 *</label>
          <textarea name="synopsis" placeholder="기획 의도, 줄거리, 독자 대상 등을 500자 내외로 소개해주세요." required value={form.synopsis} onChange={change} rows={5} className="form-input" style={{ resize: "vertical" }} />
        </div>
        <div className="form-row-1">
          <label className="form-label">추가 전달 사항</label>
          <textarea name="message" placeholder="출판사에 전하고 싶은 말을 자유롭게 작성해주세요." value={form.message} onChange={change} rows={3} className="form-input" style={{ resize: "vertical" }} />
        </div>
        <div className="form-row-1">
          <label className="form-label">원고 파일</label>
          <input type="file" accept={ACCEPT_EXT.join(",")} onChange={changeFile} className="form-input form-file" />
          <p className="form-file-hint">
            {file ? `첨부됨: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)` : `HWP, HWPX, PDF, DOCX · 최대 ${MAX_FILE_MB}MB · 전체 원고 또는 샘플 원고`}
          </p>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="form-submit-row">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "제출 중..." : "투고 접수하기"}</button>
        </div>
      </form>
    </div>
  );
}

function Submission() {
  const { ref, inView } = useInView();
  const steps = [
    { step: "01", title: "원고 준비", desc: "A4 기준 200매 이상의 완성 원고 또는 50매 이상의 시범 원고를 준비해주세요." },
    { step: "02", title: "투고 양식 작성", desc: "아래 투고 양식에 기본 정보와 작품 소개를 작성해주세요." },
    { step: "03", title: "검토 및 연락", desc: "접수 후 4~8주 내 검토 결과를 이메일로 알려드립니다." },
    { step: "04", title: "계약 및 출판", desc: "출판 결정 시 계약 협의를 진행하고 함께 책을 만들어갑니다." },
  ];
  return (
    <section id="submission" className="section section-white" ref={ref}>
      <div className="container">
        <div className={`fade-section ${inView ? "visible" : ""}`} style={{ marginBottom: "64px" }}>
          <p className="section-tag">Submission Guide</p>
          <h2 className="section-title">투고 안내</h2>
        </div>
        <div className="steps-grid" style={{ marginBottom: "64px" }}>
          {steps.map((s, i) => (
            <div key={s.step} className={`fade-section ${inView ? "visible" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="step-num">{s.step}</p>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
        <SubmissionForm />
      </div>
    </section>
  );
}

// ── 푸터 ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Logo light size="md" />
            <p className="footer-desc">위하다출판사는 진심 어린 이야기와 함께합니다. 문학과 에세이를 중심으로, 당신의 글이 독자에게 닿을 수 있도록 함께 걸어갑니다.</p>
          </div>
          <div>
            <p className="footer-contact-label">Contact</p>
            <div className="footer-contact-info">
              <span>wehada.books@gmail.com</span>
              <span>투고 검토: 4~8주 소요</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 위하다출판사. All rights reserved.</p>
          <p className="footer-quote">&ldquo;당신의 이야기를 세상에&rdquo;</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Process />
        <Genre />
        <Submission />
      </main>
      <Footer />
    </>
  );
}
