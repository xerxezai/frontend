import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, AlertTriangle, Sparkles, MapPin, Layers } from "lucide-react";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";
import ErrorSection from "../components/error/ErrorSection";
import { INDUSTRIES, getIndustryBySlug, getIndustryPageContent } from "../data/erpIndustriesData";

const OG    = "#C9883A";
const DARK  = "#1A1A1A";
const BODY  = "#4B4B4B";
const MUT   = "#6B6B6B";
const CREAM = "#F8F7F4";
const WHITE = "#FFFFFF";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL   = "rgba(201,136,58,0.09)";
const OGBRD = "rgba(201,136,58,0.30)";
const BS    = "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";
const FF    = "'DM Sans',sans-serif";

const FI = ({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
  >
    {children}
  </motion.div>
);

// Card3D — EXACT copy from AIERPPage.tsx
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

// Why-XERXEZ boxes — identical across all industries
const WHY_BOXES = [
  { icon: Sparkles, title: "AI-First", body: "Every module has AI built in, not bolted on" },
  { icon: MapPin, title: "UAE-Based", body: "Local support team that understands your market" },
  { icon: Layers, title: "Modular", body: "Start with what you need, expand as you grow" },
];

const ERPIndustryDetailPage = () => {
  const { industry: slug } = useParams();
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return (
      <CustomLayout>
        <ErrorSection />
      </CustomLayout>
    );
  }

  const Icon = industry.icon;
  const contactHref = `/contact?service=${encodeURIComponent(`ERP for ${industry.name}`)}`;
  const others = INDUSTRIES.filter((i) => i.slug !== industry.slug).slice(0, 3);
  const content = getIndustryPageContent(industry.slug);

  return (
    <>
      <SEO
        title={`AI ERP for ${industry.name} | Industry-Specific ERP — XERXEZ`}
        description={`${industry.tagline} Purpose-built AI ERP for ${industry.name}, deployable in under 6 months.`}
        canonical={`/erp-industries/${industry.slug}`}
        keywords={`${industry.name} ERP software, AI ERP ${industry.shortName}, XERXEZ industry solutions`}
      />
      <CustomLayout>
        {/* ── HERO ── */}
        <section style={{ background: CREAM, padding: "150px 0 90px" }}>
          <div className="container">
            <FI>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, fontFamily: FF, flexWrap: "wrap" }}>
                <Link to="/" style={{ color: MUT, textDecoration: "none" }}>Home</Link>
                <span style={{ color: "rgba(0,0,0,0.22)" }}>/</span>
                <Link to="/service" style={{ color: MUT, textDecoration: "none" }}>Services</Link>
                <span style={{ color: "rgba(0,0,0,0.22)" }}>/</span>
                <Link to="/erp-industries" style={{ color: MUT, textDecoration: "none" }}>ERP Industries</Link>
                <span style={{ color: "rgba(0,0,0,0.22)" }}>/</span>
                <span style={{ color: OG, fontWeight: 700 }}>{industry.name}</span>
              </div>
            </FI>
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <FI delay={0.08}>
                  <div style={{ marginBottom: 18 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: OGL, color: OG, fontSize: 10, fontWeight: 700, padding: "5px 16px", borderRadius: 20, letterSpacing: "0.16em", textTransform: "uppercase", border: `1px solid ${OGBRD}`, fontFamily: FF }}>
                      ✦ Industry ERP
                    </span>
                  </div>
                  <h1 style={{ fontFamily: FF, fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.12, color: DARK, margin: "0 0 20px", letterSpacing: "-0.03em" }}>
                    AI-Powered ERP for<br />
                    <em style={{ color: OG, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>{industry.name}</em>
                  </h1>
                  <p style={{ color: BODY, fontSize: 16.5, lineHeight: 1.75, marginBottom: 32, maxWidth: 520, fontFamily: FF }}>
                    {industry.tagline}
                  </p>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <Link to={contactHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: OG_G, color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", fontFamily: FF, boxShadow: BS }}>
                      Book Free Demo <ArrowRight size={15} />
                    </Link>
                    <Link to="/erp-industries" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: DARK, padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "1px solid rgba(0,0,0,0.15)", textDecoration: "none", fontFamily: FF }}>
                      All Industries
                    </Link>
                  </div>
                </FI>
              </div>
              <div className="col-lg-5">
                <FI delay={0.18}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{
                      width: 180, height: 180, borderRadius: 32,
                      background: `linear-gradient(145deg, ${industry.shelf}CC 0%, ${industry.shelf} 100%)`,
                      boxShadow: `0 10px 0 ${industry.shelf}80,0 20px 50px ${industry.shelf}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={78} color="#fff" strokeWidth={1.6} />
                    </div>
                  </div>
                </FI>
              </div>
            </div>
          </div>
        </section>

        {/* ── PAIN POINTS ── */}
        <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", top: -80, right: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <FI><div className="text-center" style={{ marginBottom: 52 }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(201,136,58,0.12)", color: "#E8A84E", fontSize: 10, fontWeight: 700, padding: "5px 16px", borderRadius: 20, letterSpacing: "0.16em", textTransform: "uppercase", border: "1px solid rgba(201,136,58,0.30)", fontFamily: FF }}>
                  ✦ The Challenge
                </span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em", marginBottom: 14 }}>
                Sound Familiar?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, fontFamily: FF, maxWidth: 560, marginInline: "auto" }}>
                These are the challenges we hear from {industry.shortName} companies every day.
              </p>
            </div></FI>
            <div className="row g-4">
              {content.painPoints.map((p, i) => (
                <div key={p} className="col-lg-3 col-md-6">
                  <FI delay={0.08 * i}>
                    <div style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16, padding: "26px 22px", height: "100%",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 11,
                        background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.30)",
                        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
                      }}>
                        <AlertTriangle size={19} color="#F87171" />
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600, lineHeight: 1.55, margin: 0, fontFamily: FF }}>{p}</p>
                    </div>
                  </FI>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MODULES GRID ── */}
        <section style={{ padding: "100px 0", background: CREAM }}>
          <div className="container">
            <FI><div className="text-center" style={{ marginBottom: 52 }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: OGL, color: OG, fontSize: 10, fontWeight: 700, padding: "5px 16px", borderRadius: 20, letterSpacing: "0.16em", textTransform: "uppercase", border: `1px solid ${OGBRD}`, fontFamily: FF }}>
                  ✦ Modules
                </span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em", marginBottom: 14 }}>
                What's Included
              </h2>
              <p style={{ color: BODY, fontSize: 16, lineHeight: 1.7, fontFamily: FF, maxWidth: 560, marginInline: "auto" }}>
                Modules built specifically for {industry.shortName} operations
              </p>
            </div></FI>
            <div className="row g-4">
              {content.modules.map((m, i) => (
                <div key={m} className="col-lg-4 col-md-6">
                  <FI delay={0.06 * i}>
                    <Card3D accent={industry.shelf}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: `linear-gradient(145deg, ${industry.shelf}CC 0%, ${industry.shelf} 100%)`,
                        boxShadow: `0 3px 0 ${industry.shelf}80,0 5px 14px ${industry.shelf}40`,
                        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
                      }}>
                        <Check size={20} color="#fff" />
                      </div>
                      <p style={{ color: DARK, fontSize: 15.5, fontWeight: 700, lineHeight: 1.5, margin: 0, fontFamily: FF }}>{m}</p>
                    </Card3D>
                  </FI>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY XERXEZ ── */}
        <section style={{ padding: "100px 0", background: DBG }}>
          <div className="container">
            <FI><div className="text-center" style={{ marginBottom: 52 }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(201,136,58,0.12)", color: "#E8A84E", fontSize: 10, fontWeight: 700, padding: "5px 16px", borderRadius: 20, letterSpacing: "0.16em", textTransform: "uppercase", border: "1px solid rgba(201,136,58,0.30)", fontFamily: FF }}>
                  ✦ Why XERXEZ
                </span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
                Why {industry.shortName} Companies Choose XERXEZ
              </h2>
            </div></FI>
            <div className="row g-4">
              {WHY_BOXES.map((b, i) => {
                const BIcon = b.icon;
                return (
                  <div key={b.title} className="col-lg-4 col-md-6">
                    <FI delay={0.08 * i}>
                      <div style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,136,58,0.20)",
                        borderRadius: 16, padding: "32px 26px", textAlign: "center", height: "100%",
                      }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: 14, background: OG_G, boxShadow: BS,
                          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
                        }}>
                          <BIcon size={24} color="#fff" />
                        </div>
                        <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 19, fontFamily: FF, marginBottom: 10 }}>{b.title}</h3>
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14.5, lineHeight: 1.6, fontFamily: FF, margin: 0 }}>{b.body}</p>
                      </div>
                    </FI>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── OTHER INDUSTRIES ── */}
        <section style={{ padding: "90px 0", background: WHITE }}>
          <div className="container">
            <FI><h2 style={{ fontWeight: 800, fontSize: "clamp(22px,2.6vw,32px)", color: DARK, lineHeight: 1.2, fontFamily: FF, letterSpacing: "-0.02em", marginBottom: 36 }}>
              Explore Other Industries
            </h2></FI>
            <div className="row g-4">
              {others.map((o, i) => {
                const OIcon = o.icon;
                return (
                  <div key={o.slug} className="col-lg-4 col-md-6">
                    <FI delay={0.06 * i}>
                      <Link to={`/erp-industries/${o.slug}`} style={{ textDecoration: "none" }}>
                        <Card3D accent={o.shelf} p="24px 22px" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 11, background: o.shelf, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <OIcon size={19} color="#fff" />
                          </div>
                          <span style={{ color: DARK, fontWeight: 700, fontSize: 14.5, fontFamily: FF }}>{o.name}</span>
                        </Card3D>
                      </Link>
                    </FI>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ padding: "90px 0", background: OG, position: "relative", overflow: "hidden" }}>
          <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <FI>
              <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", lineHeight: 1.2, marginBottom: 18, fontFamily: FF, letterSpacing: "-0.02em" }}>
                Ready to See It in Action?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.7, fontFamily: FF, maxWidth: 560, marginInline: "auto", marginBottom: 32 }}>
                Book a free 30-minute demo tailored for {industry.shortName} workflows.
              </p>
              <Link to={contactHref} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: DARK, color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 30px", borderRadius: 10, textDecoration: "none", fontFamily: FF, boxShadow: "0 4px 0 rgba(0,0,0,0.35),0 6px 20px rgba(0,0,0,0.25)" }}>
                Book Free Demo <ArrowRight size={15} />
              </Link>
            </FI>
          </div>
        </section>
      </CustomLayout>
    </>
  );
};

export default ERPIndustryDetailPage;
