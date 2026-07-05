import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    icon: "fas fa-search",
    title: "Discovery & Analysis",
    description:
      "We audit your current technology stack, pain points, and business goals to build a clear picture of what needs to change and why.",
  },
  {
    number: "02",
    icon: "fas fa-drafting-compass",
    title: "Architecture & Planning",
    description:
      "Our architects design the solution blueprint — technology choices, integration points, data flows, and a realistic project timeline.",
  },
  {
    number: "03",
    icon: "fas fa-code",
    title: "Development & Testing",
    description:
      "Agile two-week sprints with continuous integration, automated testing, and stakeholder demos keep quality high and surprises low.",
  },
  {
    number: "04",
    icon: "fas fa-rocket",
    title: "Deployment & Go-Live",
    description:
      "Zero-downtime deployment with blue/green or canary strategies, full monitoring dashboards, rollback plans, and complete handover documentation.",
  },
  {
    number: "05",
    icon: "fas fa-headset",
    title: "Support & Optimisation",
    description:
      "SLA-backed 24/7 support, proactive performance tuning, and ongoing feature roadmapping so your investment keeps compounding.",
  },
];

/* ── Step card with 3D tilt + scroll reveal ── */
const StepCard = ({
  step,
  align,
  index,
}: {
  step: (typeof steps)[number];
  align: "left" | "right";
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  /* Scroll reveal */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fromX = align === "right" ? -40 : 40;
    el.style.opacity = "0";
    el.style.transform = `translateX(${fromX}px)`;
    el.style.transition = `opacity 0.65s ease ${index * 90}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [align, index]);

  /* 3D tilt */
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 9}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-5px) scale(1.015)`;
    el.style.boxShadow = "0 18px 44px rgba(0,0,0,0.13), 0 0 0 1.5px rgba(201,136,58,0.28)";
    el.style.transition = "transform 0.10s ease, box-shadow 0.10s ease";
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
    el.style.transition = "transform 0.28s ease, box-shadow 0.28s ease";
    setHov(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHov(true)}
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "26px 28px",
        textAlign: align,
        marginBottom: 8,
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        border: "1px solid rgba(201,136,58,0.14)",
        borderLeft: align === "left" ? "3px solid #C9883A" : "1px solid rgba(201,136,58,0.14)",
        borderRight: align === "right" ? "3px solid #C9883A" : "1px solid rgba(201,136,58,0.14)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Hover gold top-edge shimmer */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: hov
          ? "linear-gradient(90deg, transparent, rgba(201,136,58,0.50), transparent)"
          : "transparent",
        transition: "background 0.28s ease",
        borderRadius: "16px 16px 0 0",
        pointerEvents: "none",
      }} />

      <div style={{
        fontSize: 10, fontWeight: 800,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#C9883A", marginBottom: 10,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Step {step.number}
      </div>

      <h4 style={{
        color: "#141413", fontWeight: 700,
        marginBottom: 10, fontSize: 18,
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.3, margin: "0 0 10px",
      }}>
        {step.title}
      </h4>

      <p style={{
        color: "rgba(20,20,19,0.55)", fontSize: 14,
        lineHeight: 1.72, margin: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {step.description}
      </p>
    </div>
  );
};

/* ── Spine icon dot with pop-in reveal ── */
const SpineDot = ({ icon, index }: { icon: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "scale(0.5)";
    el.style.transition = `opacity 0.45s ease ${index * 90 + 120}ms, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${index * 90 + 120}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      style={{
        width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #E8A84E 0%, #C9883A 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 0 8px rgba(201,136,58,0.12), 0 0 0 16px rgba(201,136,58,0.05), 0 6px 20px rgba(201,136,58,0.32)",
        zIndex: 2, position: "relative",
      }}
    >
      <i className={icon} style={{ color: "#fff", fontSize: 20 }} />
    </div>
  );
};

/* ── Section ── */
const ProcessTimeline = () => (
  <section style={{
    background: "#F8F4EE",
    padding: "108px 0 100px",
    position: "relative",
    overflow: "hidden",
  }}>
    {/* Dot-grid texture */}
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(201,136,58,0.07) 1px, transparent 1px)",
      backgroundSize: "36px 36px",
    }} />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, #C9883A)", display: "block" }} />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#C9883A",
            fontFamily: "'DM Sans', sans-serif",
          }}>How We Work</span>
          <span style={{ width: 32, height: 1, background: "linear-gradient(90deg, #C9883A, transparent)", display: "block" }} />
        </div>

        <h2 style={{
          fontSize: "clamp(28px, 3.5vw, 48px)",
          fontWeight: 800, color: "#141413",
          lineHeight: 1.12, fontFamily: "'DM Sans', sans-serif",
          margin: "0 auto 16px", maxWidth: 560,
        }}>
          Our Delivery Process
        </h2>

        <p style={{
          color: "rgba(20,20,19,0.50)", fontSize: 15, lineHeight: 1.65,
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: 480, margin: "0 auto",
        }}>
          A proven five-step framework that turns complex enterprise requirements
          into reliable, production-grade software.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical gold spine */}
        <div className="d-none d-lg-block" style={{
          position: "absolute", left: "50%",
          top: 0, bottom: 0, width: 2,
          background: "linear-gradient(180deg, #C9883A 0%, rgba(201,136,58,0.10) 100%)",
          transform: "translateX(-50%)",
        }} />

        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={step.number} className="row g-0 align-items-center mb-5">

              {/* Left column */}
              <div className={`col-lg-5 ${isLeft ? "pe-lg-5" : "order-lg-3 ps-lg-5"}`}>
                {isLeft && <StepCard step={step} align="right" index={i} />}
              </div>

              {/* Centre dot */}
              <div className="col-lg-2 d-flex justify-content-center py-3 py-lg-0">
                <SpineDot icon={step.icon} index={i} />
              </div>

              {/* Right column */}
              <div className={`col-lg-5 ${!isLeft ? "ps-lg-5" : "order-lg-last"}`}>
                {!isLeft && <StepCard step={step} align="left" index={i} />}
              </div>

            </div>
          );
        })}
      </div>
    </div>

    <style>{`
      @media (prefers-reduced-motion: reduce) {
        .proc-card, .proc-dot { transition: none !important; opacity: 1 !important; transform: none !important; }
      }
    `}</style>
  </section>
);

export default ProcessTimeline;
