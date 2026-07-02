import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

/* ── Design tokens ──────────────────────────────────────── */
const T = {
  dk:    "#0A0806",
  dk2:   "#110E0B",
  dk3:   "#1A1208",
  gold:  "#C9883A",
  gold2: "#E8A84E",
  cream: "#F0EDE6",
  muted: "rgba(240,237,230,0.55)",
  dim:   "rgba(240,237,230,0.26)",
  glass: "rgba(255,255,255,0.035)",
  gb:    "rgba(255,255,255,0.07)",
  goldg: "linear-gradient(135deg,#E8A84E 0%,#C9883A 100%)",
};

/* ── Shared inline style helpers ────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  secLabel: { fontSize: ".66rem", fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: T.gold, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 },
  heading:  { fontSize: "clamp(1.7rem,4vw,2.8rem)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-.025em", fontFamily: "'DM Sans',sans-serif" },
  bodyText: { fontSize: "1rem", color: T.muted, lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" },
  divider:  { width: 44, height: 2, background: T.goldg, margin: "18px 0" },
  btnP:     { background: T.goldg, color: "#08060A", borderRadius: 10, padding: "12px 26px", fontSize: ".88rem", fontWeight: 800, letterSpacing: ".03em", textDecoration: "none", display: "inline-block", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  btnG:     { background: "transparent", color: T.cream, border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "12px 26px", fontSize: ".88rem", fontWeight: 600, textDecoration: "none", display: "inline-block", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
};

/* ═══════════════════════════════════════════════════════════
   HERO — particle-canvas neural network
═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d")!;
    let W = 0, H = 0, raf = 0;
    let mx = -999, my = -999;

    const pts = Array.from({ length: 85 }, () => ({
      x: 0, y: 0, vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
      r: Math.random() * 1.4 + .7, a: Math.random() * .42 + .18,
      ph: Math.random() * Math.PI * 2, ps: Math.random() * .018 + .007,
    }));

    const resize = () => {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      pts.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; });
    };

    const tick = () => {
      cx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(pts[j].x, pts[j].y);
            cx.strokeStyle = `rgba(201,136,58,${(1 - d / 120) * .18})`; cx.lineWidth = .7; cx.stroke();
          }
        }
      }
      pts.forEach(p => {
        p.ph += p.ps;
        const dx = mx - p.x, dy = my - p.y, md = Math.hypot(dx, dy);
        if (md < 180) { p.vx += dx * .000075; p.vy += dy * .000075; }
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > .85) { p.vx *= .85 / sp; p.vy *= .85 / sp; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -8) p.x = W + 8; if (p.x > W + 8) p.x = -8;
        if (p.y < -8) p.y = H + 8; if (p.y > H + 8) p.y = -8;
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.28);
        cx.fillStyle = `rgba(201,136,58,${p.a * (.65 + .35 * Math.sin(p.ph))})`;
        cx.fill();
      });
      raf = requestAnimationFrame(tick);
    };

    const onMouse = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    resize(); tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return (
    <section style={{ position: "relative", height: "92vh", minHeight: 580, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: T.dk, overflow: "hidden", padding: "0 clamp(20px,5vw,80px)" }}>
      <canvas ref={cvRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {/* ambient gold glow */}
      <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", width: "70vw", height: "60vh", background: "radial-gradient(ellipse,rgba(201,136,58,.14) 0%,transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,136,58,.09)", border: "1px solid rgba(201,136,58,.22)", borderRadius: 40, padding: "5px 16px", marginBottom: 28, fontSize: ".67rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold2, fontFamily: "'DM Sans',sans-serif" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.gold, display: "inline-block", animation: "abt-dot 2s ease-in-out infinite" }} />
          About XERXEZ
        </div>
        {/* title */}
        <h1 style={{ fontSize: "clamp(2.6rem,9vw,7rem)", fontWeight: 900, lineHeight: .94, letterSpacing: "-.04em", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
          <span style={{ display: "block", color: T.cream }}>WE BUILD THE</span>
          <span style={{ display: "block", background: "linear-gradient(125deg,#E8A84E,#C9883A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>INFRASTRUCTURE</span>
        </h1>
        <p style={{ ...S.bodyText, margin: "22px auto 0", maxWidth: 480, color: T.muted }}>
          That moves enterprise forward. AI-native ERP, cloud architecture, MLOps, and DevSecOps — owned end-to-end by one team.
        </p>
        {/* quick stats */}
        <div style={{ display: "flex", gap: "clamp(20px,4vw,48px)", justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
          {[["50+","Engineers"],["12","Countries"],["120+","Projects"],["0","Security Incidents"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: T.gold2, lineHeight: 1, fontFamily: "'DM Sans',sans-serif" }}>{n}</div>
              <div style={{ fontSize: ".62rem", color: T.dim, letterSpacing: ".12em", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          <Link to="/contact" style={S.btnP}>Work With Us →</Link>
          <a href="#abt-story" style={S.btnG}>Our Story</a>
        </div>
      </div>
      {/* scroll cue */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: .3, animation: "abt-bob 2.2s ease-in-out infinite" }}>
        <span style={{ fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: T.cream }}>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MARQUEE STRIP
═══════════════════════════════════════════════════════════ */
function MarqueeSection() {
  const items = ["AI-Powered ERP","MLOps Pipelines","Cloud Infrastructure","Enterprise Software","DevSecOps","Zero-Trust Security","AI-Native Architecture","ISO 27001","SOC 2","Data Engineering","Global Delivery"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: T.gold, overflow: "hidden", padding: "13px 0" }} aria-hidden="true">
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "abt-mq 28s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "0 28px", fontSize: ".73rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#08060A", fontFamily: "'DM Sans',sans-serif" }}>
            {item} <span style={{ opacity: .4 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STORY — 3D rotating CSS cube + narrative text
═══════════════════════════════════════════════════════════ */
const CUBE_FACES = [
  { cls: "abt-cf-f",  svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E8A84E" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/></svg>, label: "AI / ML",    sub: "Intelligent Systems" },
  { cls: "abt-cf-b",  svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E8A84E" strokeWidth="1.5" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>, label: "Cloud",    sub: "Native Architecture" },
  { cls: "abt-cf-l",  svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E8A84E" strokeWidth="1.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, label: "MLOps",  sub: "Pipeline Automation" },
  { cls: "abt-cf-r",  svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E8A84E" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "DevSecOps", sub: "Zero-Trust Security" },
  { cls: "abt-cf-t",  svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E8A84E" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label: "ERP",     sub: "Enterprise Software" },
  { cls: "abt-cf-d",  svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E8A84E" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>, label: "Global", sub: "12 Countries" },
];

function StorySection() {
  return (
    <section id="abt-story" style={{ background: T.dk, padding: "clamp(60px,9vw,120px) clamp(20px,5vw,80px)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "center" }} className="abt-story-grid">
        {/* 3D cube */}
        <div className="abt-rv" style={{ perspective: 900, display: "flex", justifyContent: "center", alignItems: "center", height: 340, position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", width: 300, height: 300, background: "radial-gradient(ellipse,rgba(201,136,58,.22) 0%,transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          <div className="abt-cube" role="img" aria-label="Rotating cube showing Xerxez technology areas">
            {CUBE_FACES.map(f => (
              <div key={f.cls} className={`abt-cf ${f.cls}`}>
                {f.svg}
                <span className="abt-cf-name">{f.label}</span>
                <span className="abt-cf-sub">{f.sub}</span>
              </div>
            ))}
          </div>
        </div>
        {/* story text */}
        <div>
          <div className="abt-rv" style={{ ...S.secLabel }}>
            <span style={{ display: "block", width: 26, height: 1, background: T.gold }} />
            Our Story
          </div>
          <h2 className="abt-rv" style={{ ...S.heading, color: T.cream, marginBottom: 0 }}>Founded on a single conviction</h2>
          <div className="abt-rv" style={{ ...S.divider }} />
          <p className="abt-rv" style={{ ...S.bodyText, marginBottom: 16 }}>
            <strong style={{ color: T.cream, fontWeight: 700 }}>Enterprise technology should not require 18-month waterfall projects.</strong>{" "}
            XERXEZ was built to change that — shipping production-grade AI systems in weeks, not years.
          </p>
          <p className="abt-rv" style={{ ...S.bodyText, marginBottom: 16 }}>
            From day one, we embedded intelligence at every layer. Our ERP modules predict demand before procurement asks. Our security pipelines detect anomalies before they escalate. This is what AI-native looks like in practice.
          </p>
          <p className="abt-rv" style={S.bodyText}>
            Today we're <strong style={{ color: T.cream }}>50+ engineers</strong> serving{" "}
            <strong style={{ color: T.cream }}>12 countries</strong> — architects, data scientists, and platform engineers united by one refusal: shipping anything we wouldn't trust with our own systems.
          </p>
          {/* mini facts */}
          <div className="abt-rv" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 26 }}>
            {[["2015","Year Founded"],["10+","Years Delivering"],["90%+","Renewal Rate"],["ISO 27001","Compliance Ready"]].map(([v,l]) => (
              <div key={l} style={{ padding: "16px 18px", background: T.glass, border: `1px solid ${T.gb}`, borderRadius: 10 }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: T.gold2, lineHeight: 1, fontFamily: "'DM Sans',sans-serif" }}>{v}</div>
                <div style={{ fontSize: ".65rem", color: T.muted, letterSpacing: ".08em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATS — 3D tilt cards + count-up on scroll
═══════════════════════════════════════════════════════════ */
const STATS = [
  { svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#C9883A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, n: 50, sfx: "+", lbl: "Engineers Worldwide" },
  { svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#C9883A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20"/></svg>, n: 12, sfx: "", lbl: "Countries Served" },
  { svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#C9883A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, n: 120, sfx: "+", lbl: "Projects Delivered" },
  { svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#C9883A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, n: 10, sfx: "+", lbl: "Years Experience" },
  { svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#C9883A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>, n: 98, sfx: "%", lbl: "Client Satisfaction" },
  { svg: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#C9883A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, n: 0, sfx: "", lbl: "Security Incidents" },
];

function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const numEl = numRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.classList.add("abt-on");
        if (numEl && !numEl.dataset.done) {
          numEl.dataset.done = "1";
          let cur = 0;
          const inc = stat.n / 55;
          const tm = setInterval(() => {
            cur = Math.min(cur + inc, stat.n);
            numEl.textContent = Math.round(cur) + stat.sfx;
            if (cur >= stat.n) clearInterval(tm);
          }, 22);
        }
        obs.disconnect();
      }
    }, { threshold: .15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [stat.n, stat.sfx]);

  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${y * -14}deg) translateZ(6px)`;
  };

  return (
    <div ref={ref} className="abt-rv abt-stat-card" style={{ transitionDelay: `${delay}s` }}
      onMouseMove={tilt} onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
      <div style={{ marginBottom: 14, opacity: .8 }}>{stat.svg}</div>
      <div ref={numRef} style={{ fontSize: "3rem", fontWeight: 900, color: T.gold2, lineHeight: 1, fontVariantNumeric: "tabular-nums", fontFamily: "'DM Sans',sans-serif" }}>
        0{stat.sfx}
      </div>
      <div style={{ fontSize: ".72rem", color: T.muted, textTransform: "uppercase", letterSpacing: ".12em", marginTop: 8 }}>{stat.lbl}</div>
    </div>
  );
}

function StatsSection() {
  return (
    <section style={{ background: T.dk2, padding: "clamp(60px,9vw,120px) clamp(20px,5vw,80px)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="abt-rv" style={S.secLabel}><span style={{ display:"block",width:26,height:1,background:T.gold }}/> By the Numbers</div>
        <h2 className="abt-rv" style={{ ...S.heading, color: T.cream, marginBottom: 0 }}>Performance you can measure</h2>
        <div className="abt-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 50 }}>
          {STATS.map((s, i) => <StatCard key={s.lbl} stat={s} delay={i * .07} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   VALUES — glassmorphism 3D tilt cards
═══════════════════════════════════════════════════════════ */
const VALUES = [
  { svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9883A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.6-1.4 4.9-3.5 6.3L15 16H9l-.5-.7A7 7 0 0 1 12 2z"/></svg>, title: "Innovation First", desc: "We adopt AI, cloud-native architectures, and MLOps before they become industry standard — because early movers set the standards." },
  { svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9883A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Security by Design", desc: "ISO 27001, SOC 2, and zero-trust are embedded from day one — not bolted on before go-live." },
  { svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9883A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "Client Partnership", desc: "We measure success in outcomes, not deliverables. 90%+ renewal rates reflect our long-term commitment." },
  { svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9883A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, title: "Engineering Excellence", desc: "Clean code, high test coverage, rigorous code review. We build systems that are maintainable for years." },
  { svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9883A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, title: "Continuous Learning", desc: "20% of engineer time goes to R&D, certifications, and open-source contribution. Stale teams build stale software." },
  { svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9883A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: "Impact Over Activity", desc: "Every engagement starts with a measurable success metric — and we don't stop until we hit it." },
];

function ValCard({ val, delay }: { val: typeof VALUES[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { ref.current?.classList.add("abt-on"); obs.disconnect(); } }, { threshold: .12 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateZ(4px)`;
  };
  return (
    <div ref={ref} className="abt-rv abt-val-card" style={{ transitionDelay: `${delay}s` }}
      onMouseMove={tilt} onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
      <div className="abt-v-icon">{val.svg}</div>
      <div style={{ fontSize: ".95rem", fontWeight: 700, color: T.cream, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{val.title}</div>
      <div style={{ fontSize: ".84rem", color: T.muted, lineHeight: 1.72, fontFamily: "'DM Sans',sans-serif" }}>{val.desc}</div>
    </div>
  );
}

function ValuesSection() {
  return (
    <section style={{ background: T.dk, padding: "clamp(60px,9vw,120px) clamp(20px,5vw,80px)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="abt-rv" style={S.secLabel}><span style={{ display:"block",width:26,height:1,background:T.gold }}/> What Drives Us</div>
        <h2 className="abt-rv" style={{ ...S.heading, color: T.cream }}>Six principles. Every decision.</h2>
        <p className="abt-rv" style={{ ...S.bodyText, marginTop: 12, maxWidth: 500 }}>
          From architecture choices to client conversations — these commitments govern how we build and how we behave.
        </p>
        <div className="abt-vals-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 50 }}>
          {VALUES.map((v, i) => <ValCard key={v.title} val={v} delay={i * .07} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TECH ORBIT — CSS orbital ring animation
═══════════════════════════════════════════════════════════ */
const INNER_TECH = ["Python","Django","React","AWS","Docker","Kubernetes","TensorFlow","PostgreSQL"];
const OUTER_TECH = ["Kafka","Redis","Terraform","GitOps"];

function TechOrbitSection() {
  return (
    <section style={{ background: T.dk2, padding: "clamp(60px,9vw,120px) clamp(20px,5vw,80px)", textAlign: "center" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="abt-rv" style={{ ...S.secLabel, justifyContent: "center" }}><span style={{ display:"block",width:26,height:1,background:T.gold }}/> Technology</div>
        <h2 className="abt-rv" style={{ ...S.heading, color: T.cream }}>Built on proven foundations</h2>
        <p className="abt-rv" style={{ ...S.bodyText, margin: "12px auto 0", maxWidth: 440 }}>
          Chosen for resilience, not trend — spanning cloud, AI, and security from the ground up.
        </p>
        {/* orbit */}
        <div className="abt-rv" style={{ position: "relative", width: 420, height: 420, margin: "56px auto 0" }}>
          {/* rings */}
          <div className="abt-r1" style={{ position: "absolute", top: "50%", left: "50%", width: 240, height: 240, marginTop: -120, marginLeft: -120, border: "1px dashed rgba(201,136,58,.2)", borderRadius: "50%" }} />
          <div className="abt-r2" style={{ position: "absolute", top: "50%", left: "50%", width: 380, height: 380, marginTop: -190, marginLeft: -190, border: "1px dashed rgba(201,136,58,.12)", borderRadius: "50%" }} />
          {/* center */}
          <div className="abt-oc" style={{ position: "absolute", top: "50%", left: "50%", width: 96, height: 96, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(201,136,58,.1)", border: "2px solid rgba(201,136,58,.32)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <span style={{ fontSize: ".56rem", color: T.gold, letterSpacing: ".1em", textTransform: "uppercase" }}>Powered by</span>
            <span style={{ fontSize: "1.05rem", fontWeight: 900, color: T.gold2, fontFamily: "'DM Sans',sans-serif" }}>XERXEZ</span>
          </div>
          {/* inner badges */}
          {INNER_TECH.map((t, i) => (
              <div key={t} className="abt-badge" style={{ position: "absolute", top: "50%", left: "50%", marginTop: -15, marginLeft: -36, animation: `abt-oi${i} 20s linear infinite` as React.CSSProperties["animation"] }}>
                {t}
              </div>
          ))}
          {/* outer badges */}
          {OUTER_TECH.map((t, i) => (
              <div key={t} className="abt-badge" style={{ position: "absolute", top: "50%", left: "50%", marginTop: -15, marginLeft: -36, fontSize: ".58rem", animation: `abt-oo${i} 32s linear infinite reverse` as React.CSSProperties["animation"] }}>
                {t}
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA — close section
═══════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { ref.current?.classList.add("abt-on"); obs.disconnect(); } }, { threshold: .1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section style={{ background: T.dk3, padding: "clamp(80px,10vw,140px) clamp(20px,5vw,80px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 640, height: 400, background: "radial-gradient(ellipse,rgba(201,136,58,.16) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div ref={ref} className="abt-rv" style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ ...S.secLabel, justifyContent: "center" }}><span style={{ display:"block",width:26,height:1,background:T.gold }}/> Get Started</div>
        <h2 style={{ ...S.heading, color: T.cream, marginBottom: 16 }}>Ready to build<br />what's next?</h2>
        <p style={{ ...S.bodyText, margin: "0 auto" }}>
          Book a discovery call with our engineering team. No sales pitch — just an honest conversation about what your stack needs.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 34, flexWrap: "wrap" }}>
          <Link to="/contact" style={S.btnP}>Schedule a Call →</Link>
          <Link to="/portfolio" style={S.btnG}>Explore Our Work</Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
const AboutPage = () => {
  // Generate orbit keyframe styles
  const orbitStyles = [
    ...INNER_TECH.map((_, i) => {
      const a = (i / INNER_TECH.length) * 360;
      return `@keyframes abt-oi${i}{from{transform:rotate(${a}deg) translateX(120px) rotate(${-a}deg) translate(-50%,-50%)}to{transform:rotate(${a + 360}deg) translateX(120px) rotate(${-(a + 360)}deg) translate(-50%,-50%)}}`;
    }),
    ...OUTER_TECH.map((_, i) => {
      const a = (i / OUTER_TECH.length) * 360;
      return `@keyframes abt-oo${i}{from{transform:rotate(${a}deg) translateX(190px) rotate(${-a}deg) translate(-50%,-50%)}to{transform:rotate(${a - 360}deg) translateX(190px) rotate(${-(a - 360)}deg) translate(-50%,-50%)}}`;
    }),
  ].join("\n");

  return (
    <CustomLayout>
      <style>{`
        /* ── Keyframes ── */
        @keyframes abt-dot  { 0%,100%{opacity:1}50%{opacity:.3} }
        @keyframes abt-bob  { 0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(7px)} }
        @keyframes abt-mq   { from{transform:translateX(0)}to{transform:translateX(-50%)} }
        @keyframes abt-cube { from{transform:rotateX(22deg) rotateY(0)}to{transform:rotateX(22deg) rotateY(360deg)} }
        @keyframes abt-cpulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,136,58,.28)}50%{box-shadow:0 0 0 14px rgba(201,136,58,0)} }
        @keyframes abt-rspin { to{transform:rotate(360deg)} }
        ${orbitStyles}

        /* ── Cube ── */
        .abt-cube { position:relative;width:190px;height:190px;transform-style:preserve-3d;animation:abt-cube 15s linear infinite }
        .abt-cf   { position:absolute;width:190px;height:190px;border:1px solid rgba(201,136,58,.30);background:rgba(201,136,58,.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;backface-visibility:hidden }
        .abt-cf-name { font-size:.74rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0EDE6;font-family:'DM Sans',sans-serif }
        .abt-cf-sub  { font-size:.58rem;color:rgba(240,237,230,.5);letter-spacing:.1em;text-transform:uppercase }
        .abt-cf-f { transform:translateZ(95px) }
        .abt-cf-b { transform:rotateY(180deg) translateZ(95px) }
        .abt-cf-l { transform:rotateY(-90deg) translateZ(95px) }
        .abt-cf-r { transform:rotateY(90deg) translateZ(95px) }
        .abt-cf-t { transform:rotateX(90deg) translateZ(95px) }
        .abt-cf-d { transform:rotateX(-90deg) translateZ(95px) }

        /* ── Reveal ── */
        .abt-rv { opacity:0;transform:translateY(26px);transition:opacity .65s ease,transform .65s ease }
        .abt-rv.abt-on { opacity:1;transform:translateY(0) }

        /* ── Stat card ── */
        .abt-stat-card { background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:34px 22px;text-align:center;transition:transform .18s ease,border-color .2s,box-shadow .2s,opacity .65s ease;will-change:transform;cursor:default }
        .abt-stat-card:hover { border-color:rgba(201,136,58,.28);box-shadow:0 8px 40px rgba(201,136,58,.10) }

        /* ── Value card ── */
        .abt-val-card { background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:30px 22px;transition:transform .18s ease,border-color .2s,box-shadow .2s,opacity .65s ease;will-change:transform;cursor:default;position:relative;overflow:hidden }
        .abt-val-card::after { content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(135deg,#E8A84E,#C9883A);transform:scaleX(0);transform-origin:left;transition:transform .3s ease }
        .abt-val-card:hover::after { transform:scaleX(1) }
        .abt-val-card:hover { border-color:rgba(201,136,58,.2);box-shadow:0 12px 48px rgba(201,136,58,.08) }
        .abt-v-icon { width:46px;height:46px;border-radius:11px;background:rgba(201,136,58,.1);border:1px solid rgba(201,136,58,.18);display:flex;align-items:center;justify-content:center;margin-bottom:18px;transition:background .2s }
        .abt-val-card:hover .abt-v-icon { background:rgba(201,136,58,.18) }

        /* ── Orbit ── */
        .abt-badge { height:30px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:7px;display:flex;align-items:center;justify-content:center;padding:0 12px;font-size:.61rem;font-weight:700;letter-spacing:.06em;color:rgba(240,237,230,.5);white-space:nowrap;font-family:'DM Sans',sans-serif }
        .abt-r1 { animation:abt-rspin 20s linear infinite }
        .abt-r2 { animation:abt-rspin 32s linear infinite reverse }
        .abt-oc { animation:abt-cpulse 3s ease-in-out infinite }

        /* ── Responsive ── */
        @media(max-width:768px) {
          .abt-story-grid { grid-template-columns:1fr!important }
          .abt-stats-grid { grid-template-columns:repeat(2,1fr)!important }
          .abt-vals-grid  { grid-template-columns:repeat(2,1fr)!important }
        }
        @media(max-width:480px) {
          .abt-stats-grid { grid-template-columns:1fr!important }
          .abt-vals-grid  { grid-template-columns:1fr!important }
        }
        @media(prefers-reduced-motion:reduce) {
          .abt-cube,.abt-r1,.abt-r2,.abt-badge,.abt-oc { animation:none!important }
          .abt-rv { opacity:1!important;transform:none!important }
        }
      `}</style>

      {/* Scroll-reveal wiring for non-card elements */}
      <RevealWatcher />

      <HeroSection />
      <MarqueeSection />
      <StorySection />
      <StatsSection />
      <ValuesSection />
      <TechOrbitSection />
      <CTASection />
    </CustomLayout>
  );
};

/* Wire IntersectionObserver for .abt-rv elements that don't self-observe */
function RevealWatcher() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("abt-on"); obs.unobserve(e.target); } });
    }, { threshold: .1 });
    // Observe after a tick so all elements are mounted
    const id = setTimeout(() => {
      document.querySelectorAll(".abt-rv:not([data-self-obs])").forEach(el => obs.observe(el));
    }, 50);
    return () => { clearTimeout(id); obs.disconnect(); };
  }, []);
  return null;
}

export default AboutPage;
