import { useEffect, useRef, useState } from "react";

const GOLD = "#C9883A";
const AMBER = "#E8A84E";

const STEPS = [
  { n: "1", icon: "fas fa-phone-alt",         title: "Discovery Call (Free)", desc: "We understand your needs, current stack, and business goals." },
  { n: "2", icon: "fas fa-drafting-compass",  title: "Solution Design",       desc: "Custom architecture plan with clear scope, timeline, and pricing." },
  { n: "3", icon: "fas fa-code",              title: "Agile Delivery",        desc: "2-week sprints with full transparency and stakeholder demos." },
  { n: "4", icon: "fas fa-headset",           title: "Go Live & Support",     desc: "Zero-downtime launch backed by a 24/7 dedicated team." },
];

/* ── 3D tilt + scroll-reveal step card ── */
const StepCard = ({ step, index, isLast }: { step: typeof STEPS[number]; index: number; isLast: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = `opacity 0.55s ease ${index * 90}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 0.08s linear, box-shadow 0.08s linear";
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-6px) scale(1.015)`;
    el.style.boxShadow = "0 24px 52px rgba(201,136,58,0.20), 0 0 0 1.5px rgba(201,136,58,0.30)";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.boxShadow = "0 4px 22px rgba(0,0,0,0.07)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: "#fff", borderRadius: 18, height: "100%",
        border: "1px solid rgba(201,136,58,0.12)",
        borderTop: `3px solid ${GOLD}`,
        boxShadow: "0 4px 22px rgba(0,0,0,0.07)",
        padding: "28px 24px 26px", position: "relative",
        transformStyle: "preserve-3d", willChange: "transform",
        cursor: "default",
      }}
    >
      {/* Step number + connector arrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
          boxShadow: "0 4px 14px rgba(201,136,58,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <i className={step.icon} style={{ color: "#fff", fontSize: 17 }} />
        </div>
        <span style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700,
          color: "rgba(201,136,58,0.18)", lineHeight: 1, userSelect: "none",
        }}>
          {step.n}
        </span>
      </div>
      <h4 style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700,
        color: "#141413", marginBottom: 9, lineHeight: 1.3,
      }}>
        {step.title}
      </h4>
      <p style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, lineHeight: 1.68,
        color: "rgba(20,20,19,0.52)", margin: 0,
      }}>
        {step.desc}
      </p>
      {/* Arrow to next step (desktop only) */}
      {!isLast && (
        <i className="far fa-arrow-right d-none d-lg-block" aria-hidden="true" style={{
          position: "absolute", top: "50%", right: -22, transform: "translateY(-50%)",
          color: "rgba(201,136,58,0.45)", fontSize: 15, zIndex: 2,
        }} />
      )}
    </div>
  );
};

/** Homepage "How We Work" — 4-step process strip. */
const HowWeWork = () => {
  const headRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setReveal(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: "#F2EFE9", padding: "96px 0 90px", position: "relative", overflow: "hidden" }}>
      <div className="container">
        {/* Header */}
        <div ref={headRef} style={{
          textAlign: "center", marginBottom: 56,
          opacity: reveal ? 1 : 0, transform: reveal ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
              How We Work
            </span>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
          </div>
          <h2 style={{
            fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, lineHeight: 1.12,
            color: "#141413", fontFamily: "'DM Sans',sans-serif", margin: 0,
          }}>
            From First Call to Go-Live
          </h2>
        </div>

        {/* Steps */}
        <div className="row g-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="col-lg-3 col-md-6">
              <StepCard step={s} index={i} isLast={i === STEPS.length - 1} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
};

export default HowWeWork;
