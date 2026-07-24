import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Factory, Check, X, ArrowRight, Settings, ShieldCheck, Bot, Zap,
  ClipboardList, ChevronDown,
} from "lucide-react";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";
import { INDUSTRIES, type IndustryDef } from "../data/erpIndustriesData";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const OG    = "#C9883A";
const DARK  = "#1A1A1A";
const BODY  = "#4B4B4B";
const MUT   = "#6B6B6B";
const CREAM = "#F8F7F4";
const BEIGE = "#F0EDE8";
const WHITE = "#FFFFFF";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL   = "rgba(201,136,58,0.09)";
const OGBRD = "rgba(201,136,58,0.30)";
const BS    = "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";
const FF    = "'DM Sans',sans-serif";

const pref =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion:reduce)").matches;

const CONTACT_HREF = `/contact?service=${encodeURIComponent("ERP Industries")}`;

// ── Reusable fade-in wrapper (matches AIERPPage.tsx FI) ────────────────────────
const FI = ({
  children, delay = 0, y = 28, className = "",
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Section label pill (matches AIERPPage.tsx SL) ───────────────────────────────
const SL = ({ t, dark = false }: { t: string; dark?: boolean }) => (
  <div style={{ marginBottom: 14 }}>
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: dark ? "rgba(201,136,58,0.13)" : OGL,
      color: OG, fontSize: 10, fontWeight: 700,
      padding: "5px 16px", borderRadius: 20,
      letterSpacing: "0.16em", textTransform: "uppercase",
      border: `1px solid ${dark ? "rgba(201,136,58,0.28)" : OGBRD}`,
      fontFamily: FF,
    }}>✦ {t}</span>
  </div>
);

// ── Card3D — EXACT copy from AIERPPage.tsx, unmodified ─────────────────────────
const Card3D = ({
  children, accent = OG, style = {}, p = "28px 26px",
}: { children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: WHITE, borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.07)",
      borderTop: `3px solid ${accent}`,
      boxShadow: h ? BHOV : BCARD,
      transform: h ? "translateY(-7px)" : "translateY(0)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
      padding: p, cursor: "default", height: "100%", position: "relative", ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
};

// ── Dark glass card — EXACT copy from AIERPPage.tsx DC ──────────────────────────
const DC = ({
  children, accent = OG, style = {}, p = "28px 26px",
}: { children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: h ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderTop: `2px solid ${accent}`,
      borderRadius: 16, padding: p,
      transform: h ? "translateY(-6px)" : "translateY(0)",
      boxShadow: h
        ? "0 20px 60px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.06)"
        : "0 4px 20px rgba(0,0,0,0.20)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms ease,background 200ms ease",
      height: "100%", cursor: "default", position: "relative", ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
};

// ── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400) {
  const [v, setV] = useState(pref ? target : 0);
  useEffect(() => {
    if (pref || !target) { setV(target); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

// ── Small color utility for per-industry icon-badge gradients ──────────────────
function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HERO — cream
// ═══════════════════════════════════════════════════════════════════════════════
const HERO_STATS: { label: string; countTo?: number; suffix?: string; staticVal?: string }[] = [
  { countTo: 8,  suffix: "+", label: "Industries Served" },
  { countTo: 50, suffix: "+", label: "ERP Deployments" },
  { staticVal: "ISO 27001", label: "Certified" },
  { staticVal: "<6 Mo", label: "Deployment" },
];

const StatTile = ({ stat }: { stat: typeof HERO_STATS[number] }) => {
  const v = useCountUp(stat.countTo ?? 0);
  return (
    <Card3D p="16px 12px" style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 21, color: OG, lineHeight: 1 }}>
        {stat.staticVal ?? `${v}${stat.suffix ?? ""}`}
      </div>
      <div style={{ fontFamily: FF, fontSize: 10.5, color: MUT, marginTop: 6, lineHeight: 1.3 }}>{stat.label}</div>
    </Card3D>
  );
};

const HeroSideCard = () => (
  <div style={{ background: "#1a1208", borderRadius: 20, padding: "34px 30px", border: "1px solid rgba(180,140,100,0.15)", boxShadow: "0 40px 80px rgba(100,60,20,0.25),0 0 0 1px rgba(255,255,255,0.03) inset", position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "26px 26px", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 40% at 50% 0%,rgba(201,136,58,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: OG_G, boxShadow: BS, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Factory size={20} color="#fff" />
        </div>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(201,136,58,0.85)", textTransform: "uppercase" }}>Industry ERP</span>
      </div>
      <h3 style={{ color: "#fff", fontSize: 23, fontWeight: 800, fontFamily: FF, marginBottom: 22, letterSpacing: "-0.02em" }}>Tailored for your sector</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 15, marginBottom: 28 }}>
        {["Zero-compromise customization", "Industry-specific compliance built-in", "Deploy in under 6 months"].map((b) => (
          <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
            <div style={{ width: 21, height: 21, borderRadius: 6, background: "rgba(201,136,58,0.16)", border: "1px solid rgba(201,136,58,0.30)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <Check size={12} style={{ color: OG }} />
            </div>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14.5, lineHeight: 1.5, fontFamily: FF }}>{b}</span>
          </div>
        ))}
      </div>
      <Link to={CONTACT_HREF} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: OG_G, color: "#fff", fontWeight: 700, fontSize: 14.5, padding: "13px 20px", borderRadius: 10, textDecoration: "none", fontFamily: FF, boxShadow: BS }}>
        Get Industry Quote <ArrowRight size={14} />
      </Link>
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section style={{ background: CREAM, padding: "150px 0 90px", position: "relative", overflow: "hidden" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <FI delay={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, fontSize: 13, fontFamily: FF }}>
                <Link to="/" style={{ color: MUT, textDecoration: "none" }}>Home</Link>
                <span style={{ color: "rgba(0,0,0,0.22)" }}>/</span>
                <Link to="/service" style={{ color: MUT, textDecoration: "none" }}>Services</Link>
                <span style={{ color: "rgba(0,0,0,0.22)" }}>/</span>
                <span style={{ color: OG, fontWeight: 700 }}>ERP Industries</span>
              </div>
            </FI>
            <FI delay={0.08}><SL t="Industry Solutions" /></FI>
            <FI delay={0.16}>
              <h1 style={{ fontFamily: FF, fontWeight: 800, fontSize: "clamp(32px,4.2vw,52px)", lineHeight: 1.1, color: DARK, margin: "0 0 20px", letterSpacing: "-0.03em" }}>
                AI-Powered ERP for<br />
                <em style={{ color: OG, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>Every Industry.</em>
              </h1>
            </FI>
            <FI delay={0.24}>
              <p style={{ color: BODY, fontSize: 16.5, lineHeight: 1.75, marginBottom: 32, maxWidth: 480, fontFamily: FF }}>
                Purpose-built ERP modules designed for the unique workflows, compliance needs, and operational challenges of your industry.
              </p>
            </FI>
            <FI delay={0.32}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 34 }}>
                {HERO_STATS.map((s) => <StatTile key={s.label} stat={s} />)}
              </div>
            </FI>
            <FI delay={0.4}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate(CONTACT_HREF)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: OG_G, color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", fontFamily: FF, boxShadow: BS }}
                >
                  Book Free Demo <ArrowRight size={15} />
                </button>
                <Link to="/service" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: DARK, padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "1px solid rgba(0,0,0,0.15)", textDecoration: "none", fontFamily: FF }}>
                  View All Services
                </Link>
              </div>
            </FI>
          </div>
          <div className="col-lg-6">
            <FI delay={0.2} y={20}><HeroSideCard /></FI>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. INDUSTRY CARDS — white
// ═══════════════════════════════════════════════════════════════════════════════
const IndustryCard = ({ industry, index }: { industry: IndustryDef; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = industry.icon;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pref) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 8, y: px * 8 });
  };
  const onLeave = () => { setHover(false); setTilt({ x: 0, y: 0 }); };

  return (
    <FI delay={0.05 * index}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={onLeave}
        style={{ perspective: 1000, height: "100%" }}
      >
        <div style={{
          background: WHITE, borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.07)",
          borderTop: `3px solid ${industry.shelf}`,
          boxShadow: hover ? `0 0 0 1px ${industry.shelf}33,0 0 28px ${industry.shelf}40,${BHOV}` : BCARD,
          transform: `translateY(${hover ? -8 : 0}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hover ? "transform 80ms linear,box-shadow 240ms ease" : "transform 420ms cubic-bezier(0.22,1,0.36,1),box-shadow 240ms ease",
          padding: "26px 24px", height: "100%", cursor: "default",
          display: "flex", flexDirection: "column", transformStyle: "preserve-3d",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15, flexShrink: 0,
            background: `linear-gradient(145deg, ${lighten(industry.shelf, 34)} 0%, ${industry.shelf} 100%)`,
            boxShadow: `0 4px 0 ${industry.shelf}80,0 6px 18px ${industry.shelf}4D`,
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
            transform: hover ? "scale(1.1) rotate(6deg)" : "scale(1) rotate(0deg)",
            transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
          }}>
            <Icon size={24} color="#fff" strokeWidth={2} />
          </div>
          <h3 style={{ fontWeight: 800, fontSize: 17.5, color: DARK, marginBottom: 14, fontFamily: FF, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{industry.name}</h3>
          <ul style={{ padding: 0, margin: 0, marginBottom: 18, flex: 1 }}>
            {industry.features.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9, listStyle: "none", color: BODY, fontSize: 13, lineHeight: 1.5, fontFamily: FF }}>
                <Check size={14} style={{ color: industry.shelf, marginTop: 2, flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Link to={`/erp-industries/${industry.slug}`} style={{ flex: 1, textAlign: "center", padding: "9px 8px", borderRadius: 8, border: `1px solid ${OGBRD}`, color: OG, fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: FF, whiteSpace: "nowrap" }}>
              Learn More →
            </Link>
            <Link to={`/contact?service=${encodeURIComponent(`ERP for ${industry.name}`)}`} style={{ padding: "9px 14px", borderRadius: 8, background: OG_G, color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: FF, whiteSpace: "nowrap" }}>
              Book Demo
            </Link>
          </div>
        </div>
      </div>
    </FI>
  );
};

const IndustryGrid = () => (
  <section style={{ padding: "100px 0", background: WHITE }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 56 }}>
        <SL t="Our Industry Solutions" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,44px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em", marginBottom: 16 }}>
          Built for Your <span style={{ color: OG }}>Business Vertical</span>
        </h2>
        <p style={{ color: BODY, fontSize: 16, maxWidth: 600, marginInline: "auto", fontFamily: FF, lineHeight: 1.7 }}>
          Each solution is pre-configured with industry-specific modules, compliance frameworks, and AI workflows — ready to deploy.
        </p>
      </div></FI>
      <div className="row g-4">
        {INDUSTRIES.map((industry, i) => (
          <div key={industry.slug} className="col-lg-3 col-md-6 col-12">
            <IndustryCard industry={industry} index={i} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 3. WHY XERXEZ — beige
// ═══════════════════════════════════════════════════════════════════════════════
const ADVANTAGE = [
  { icon: Settings,     title: "Pre-configured Modules", desc: "Industry workflows built-in from day one" },
  { icon: ShieldCheck,  title: "Compliance Ready",       desc: "ISO 27001, GDPR, industry regulations built-in" },
  { icon: Bot,          title: "AI-Native",               desc: "Forecasting, anomaly detection, automation" },
  { icon: Zap,          title: "Fast Deployment",         desc: "Go live in under 6 months, guaranteed" },
];

const WhyXerxez = () => (
  <section style={{ padding: "100px 0", background: BEIGE }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Our Advantage" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Not Generic ERP. <span style={{ color: OG }}>Industry-Specific AI.</span>
        </h2>
      </div></FI>
      <div className="row g-4">
        {ADVANTAGE.map((a, i) => (
          <div key={a.title} className="col-lg-3 col-md-6">
            <FI delay={0.06 * i}>
              <Card3D p="30px 24px">
                <div style={{ width: 48, height: 48, borderRadius: 13, background: OG_G, boxShadow: BS, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <a.icon size={22} color="#fff" />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 16.5, color: DARK, marginBottom: 8, fontFamily: FF }}>{a.title}</h4>
                <p style={{ color: BODY, fontSize: 13.5, lineHeight: 1.6, margin: 0, fontFamily: FF }}>{a.desc}</p>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 4. COMPARISON — dark
// ═══════════════════════════════════════════════════════════════════════════════
const COMPARE_ROWS = [
  { feature: "Industry workflows", xerxez: "Built-in",        generic: "Manual setup" },
  { feature: "Compliance modules", xerxez: "Pre-configured",  generic: "Add-on cost" },
  { feature: "AI forecasting",     xerxez: "Included",        generic: "Not available" },
  { feature: "Deployment time",    xerxez: "<6 months",       generic: "12-18 months" },
  { feature: "IP ownership",       xerxez: "Yours forever",   generic: "Licensed" },
  { feature: "24/7 support",       xerxez: "Dedicated team",  generic: "Ticket system" },
];

const ComparisonSection = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Why Choose XERXEZ" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(24px,3.2vw,40px)", color: "#fff", lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Industry ERP vs <span style={{ color: OG }}>Generic ERP</span>
        </h2>
      </div></FI>
      <FI delay={0.15}>
        <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.09)", borderTop: `3px solid ${OG}`, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560, background: "rgba(255,255,255,0.03)" }}>
              <thead>
                <tr>
                  <th style={{ padding: "18px 24px", background: "rgba(255,255,255,0.04)", textAlign: "left", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.30)", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)", width: "34%", fontFamily: FF }}>Feature</th>
                  <th style={{ padding: "18px 24px", background: "rgba(201,136,58,0.10)", textAlign: "left", fontSize: 14, fontWeight: 800, color: OG, borderBottom: `1px solid ${OGBRD}`, width: "33%", fontFamily: FF }}>XERXEZ Industry ERP</th>
                  <th style={{ padding: "18px 24px", background: "rgba(255,255,255,0.03)", textAlign: "left", fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.08)", width: "33%", fontFamily: FF }}>Generic ERP</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "15px 24px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.70)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: FF }}>{row.feature}</td>
                    <td style={{ padding: "15px 24px", fontSize: 13, color: "rgba(255,255,255,0.68)", borderBottom: "1px solid rgba(255,255,255,0.06)", borderLeft: `2px solid ${OGBRD}`, fontFamily: FF }}>
                      <Check size={13} style={{ color: OG, marginRight: 8, verticalAlign: -2 }} />{row.xerxez}
                    </td>
                    <td style={{ padding: "15px 24px", fontSize: 13, color: "rgba(255,255,255,0.42)", borderBottom: "1px solid rgba(255,255,255,0.06)", borderLeft: "2px solid rgba(239,68,68,0.22)", fontFamily: FF }}>
                      <X size={13} style={{ color: "rgba(239,68,68,0.75)", marginRight: 8, verticalAlign: -2 }} />{row.generic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FI>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 5. FAQ — cream
// ═══════════════════════════════════════════════════════════════════════════════
const FAQS = [
  { q: "Can you customize the ERP for our specific workflows?", a: "Yes — every deployment is 100% custom to your processes, compliance requirements and team structure." },
  { q: "How long does industry ERP deployment take?", a: "Typically 4-6 months for full deployment with AI modules active and all staff trained." },
  { q: "Do you support migration from existing systems?", a: "Yes — we support migration from legacy ERP systems and all major platforms with zero downtime." },
  { q: "Is the ERP cloud or on-premise?", a: "Both options available — cloud (AWS/Azure/GCP) or on-premise air-gap deployment for government and defence." },
  { q: "What compliance standards do you support?", a: "ISO 27001, SOC 2, GDPR, industry-specific regulations based on your sector and region." },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ padding: "100px 0", background: CREAM }}>
      <div className="container">
        <FI><div className="text-center" style={{ marginBottom: 52 }}>
          <SL t="FAQ" />
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
            Questions About Industry ERP
          </h2>
        </div></FI>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {FAQS.map((faq, i) => (
              <FI key={i} delay={0.04 * i}>
                <div style={{
                  background: WHITE, borderRadius: 14, marginBottom: 12,
                  border: `1px solid ${open === i ? OGBRD : "rgba(0,0,0,0.07)"}`,
                  borderTop: `3px solid ${open === i ? OG : "rgba(0,0,0,0.07)"}`,
                  boxShadow: open === i ? BHOV : BCARD,
                  transform: open === i ? "translateY(-3px)" : "translateY(0)",
                  overflow: "hidden",
                  transition: "transform 240ms cubic-bezier(0.22,1,0.36,1),box-shadow 240ms,border-color 200ms",
                }}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16 }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15.5, color: open === i ? OG : DARK, fontFamily: FF, transition: "color 200ms" }}>{faq.q}</span>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: open === i ? OG_G : CREAM, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: open === i ? BS : "none", transition: "background 200ms,box-shadow 200ms,transform 240ms" }}>
                      <ChevronDown size={14} style={{ color: open === i ? "#fff" : MUT, transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 240ms" }} />
                    </div>
                  </button>
                  <div style={{ maxHeight: open === i ? "300px" : "0", overflow: "hidden", transition: pref ? "none" : "max-height 0.38s cubic-bezier(0.22,1,0.36,1)" }}>
                    <div style={{ padding: "0 28px 22px" }}>
                      <p style={{ color: BODY, fontSize: 15, lineHeight: 1.78, margin: 0, fontFamily: FF }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              </FI>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. CTA — dark
// ═══════════════════════════════════════════════════════════════════════════════
const AssessmentForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const label = industry || "Other";
    navigate(`/contact?service=${encodeURIComponent(`Industry Assessment — ${label}`)}${name ? `&name=${encodeURIComponent(name)}` : ""}`);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)",
    color: "#fff", fontFamily: FF, fontSize: 14, outline: "none",
  };

  return (
    <DC accent={OG} p="34px 30px">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: OG_G, boxShadow: BS, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ClipboardList size={19} color="#fff" />
        </div>
        <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 18, fontFamily: FF, margin: 0, lineHeight: 1.25 }}>Free Industry Assessment</h4>
      </div>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 24, fontFamily: FF }}>
        Get a free analysis of your current operations and ERP readiness.
      </p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: FF }}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={fieldStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: FF }}>Industry</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
            <option value="" style={{ color: "#1a1208" }}>— Select your industry —</option>
            {INDUSTRIES.map((i) => <option key={i.slug} value={i.name} style={{ color: "#1a1208" }}>{i.name}</option>)}
            <option value="Other" style={{ color: "#1a1208" }}>Other</option>
          </select>
        </div>
        <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: OG_G, color: "#fff", fontWeight: 700, fontSize: 14.5, padding: "13px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: FF, boxShadow: BS, marginTop: 6 }}>
          Request Assessment <ArrowRight size={14} />
        </button>
      </form>
    </DC>
  );
};

const CTASection = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <FI>
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(26px,3.5vw,44px)", lineHeight: 1.15, marginBottom: 20, fontFamily: FF, letterSpacing: "-0.025em" }}>
              Don't See Your Industry?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16.5, lineHeight: 1.75, fontFamily: FF, maxWidth: 460, marginBottom: 32 }}>
              We build custom ERP for any business sector. Tell us your requirements and we'll design a solution from scratch.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
              <Link to={CONTACT_HREF} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: OG_G, color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 26px", borderRadius: 10, textDecoration: "none", fontFamily: FF, boxShadow: BS }}>
                Start Free Consultation <ArrowRight size={15} />
              </Link>
              <a href="mailto:info@xerxez.com" style={{ color: OG, fontSize: 14, fontWeight: 600, fontFamily: FF, textDecoration: "none" }}>
                Or email: info@xerxez.com
              </a>
            </div>
          </FI>
        </div>
        <div className="col-lg-6">
          <FI delay={0.18}><AssessmentForm /></FI>
        </div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ═══════════════════════════════════════════════════════════════════════════════
const INDUSTRIES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: INDUSTRIES.map((i, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "Service",
      name: `AI ERP for ${i.name}`,
      description: i.tagline,
      url: `https://www.xerxez.com/erp-industries/${i.slug}`,
      provider: { "@type": "Organization", name: "XERXEZ", url: "https://www.xerxez.com" },
    },
  })),
};

const ERPIndustriesPage = () => (
  <>
    <SEO
      title="AI ERP for Every Industry | Healthcare, Manufacturing, Logistics — XERXEZ"
      description="Purpose-built AI ERP modules for Healthcare, Manufacturing, Logistics, Oil & Gas, Construction, EPC, Retail and Facility Management. Deploy in under 6 months."
      canonical="/erp-industries"
      keywords="industry ERP software, AI ERP healthcare, AI ERP manufacturing, AI ERP logistics, AI ERP construction, AI ERP oil and gas, XERXEZ industry solutions"
      jsonLd={INDUSTRIES_JSONLD}
    />
    <CustomLayout>
      <Hero />
      <IndustryGrid />
      <WhyXerxez />
      <ComparisonSection />
      <FAQSection />
      <CTASection />
    </CustomLayout>
  </>
);

export default ERPIndustriesPage;
