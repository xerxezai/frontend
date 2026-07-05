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

/* ── Dark glass step card ── */
const StepCard = ({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity 0.65s ease ${index * 110}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 110}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
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
    el.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-5px) scale(1.015)`;
    el.style.transition = "transform 0.10s ease, box-shadow 0.10s ease";
    el.style.boxShadow =
      "0 24px 56px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(201,136,58,0.42)";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.transition = "transform 0.28s ease, box-shadow 0.28s ease";
    el.style.boxShadow =
      "0 4px 28px rgba(0,0,0,0.42), 0 0 0 1px rgba(201,136,58,0.10)";
    setHov(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHov(true)}
      style={{
        background:
          "linear-gradient(160deg, rgba(28,18,8,0.95) 0%, rgba(14,9,4,0.98) 100%)",
        border: "1px solid rgba(201,136,58,0.16)",
        borderTop: hov
          ? "2px solid rgba(201,136,58,0.60)"
          : "2px solid rgba(201,136,58,0.25)",
        borderRadius: 20,
        padding: "30px 30px 26px",
        position: "relative",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow:
          "0 4px 28px rgba(0,0,0,0.42), 0 0 0 1px rgba(201,136,58,0.10)",
        cursor: "default",
        transition: "border-top-color 0.25s ease",
      }}
    >
      {/* Ambient glow on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hov
            ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,136,58,0.07) 0%, transparent 70%)"
            : "none",
          pointerEvents: "none",
          transition: "background 0.30s ease",
        }}
      />

      {/* Watermark step number */}
      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: -6,
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1,
          color: "rgba(201,136,58,0.06)",
          userSelect: "none",
          fontFamily: "'DM Sans', sans-serif",
          pointerEvents: "none",
        }}
      >
        {step.number}
      </div>

      {/* Icon + step label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            flexShrink: 0,
            background: "linear-gradient(135deg, #E8A84E 0%, #C9883A 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 4px 16px rgba(201,136,58,0.30), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <i className={step.icon} style={{ color: "#fff", fontSize: 18 }} />
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#C9883A",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Step {step.number}
        </span>
      </div>

      {/* Title */}
      <h4
        style={{
          color: hov ? "#fff" : "rgba(240,237,230,0.92)",
          fontWeight: 700,
          fontSize: 19,
          margin: "0 0 11px",
          lineHeight: 1.3,
          fontFamily: "'DM Sans', sans-serif",
          transition: "color 0.25s ease",
          position: "relative",
        }}
      >
        {step.title}
      </h4>

      {/* Description */}
      <p
        style={{
          color: hov
            ? "rgba(240,237,230,0.65)"
            : "rgba(240,237,230,0.42)",
          fontSize: 14.5,
          lineHeight: 1.72,
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          transition: "color 0.25s ease",
          position: "relative",
        }}
      >
        {step.description}
      </p>
    </div>
  );
};

/* ── Spine dot ── */
const SpineDot = ({ icon, index }: { icon: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "scale(0.4)";
    el.style.transition = `opacity 0.40s ease ${index * 110 + 150}ms, transform 0.40s cubic-bezier(0.34,1.56,0.64,1) ${index * 110 + 150}ms`;
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
        width: 58,
        height: 58,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg, #E8A84E 0%, #C9883A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 0 0 8px rgba(201,136,58,0.14), 0 0 0 18px rgba(201,136,58,0.06), 0 6px 24px rgba(201,136,58,0.38)",
        zIndex: 2,
        position: "relative",
      }}
    >
      <i className={icon} style={{ color: "#fff", fontSize: 22 }} />
    </div>
  );
};

/* ── Section ── */
const ProcessTimeline = () => (
  <section
    style={{
      background: "linear-gradient(180deg, #100c07 0%, #0a0806 100%)",
      padding: "108px 0 100px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Ambient radial glow */}
    <div
      style={{
        position: "absolute",
        top: -80,
        left: "50%",
        transform: "translateX(-50%)",
        width: 900,
        height: 500,
        background:
          "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(201,136,58,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 32,
              height: 1,
              background: "linear-gradient(90deg, transparent, #C9883A)",
              display: "block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#C9883A",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            How We Work
          </span>
          <span
            style={{
              width: 32,
              height: 1,
              background: "linear-gradient(90deg, #C9883A, transparent)",
              display: "block",
            }}
          />
        </div>

        <h2
          style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            fontWeight: 800,
            color: "rgba(240,237,230,0.95)",
            lineHeight: 1.12,
            fontFamily: "'DM Sans', sans-serif",
            margin: "0 auto 16px",
            maxWidth: 560,
          }}
        >
          Our Delivery Process
        </h2>

        <p
          style={{
            color: "rgba(240,237,230,0.42)",
            fontSize: 15,
            lineHeight: 1.65,
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: 460,
            margin: "0 auto",
          }}
        >
          A proven five-step framework that turns complex enterprise requirements
          into reliable, production-grade software.
        </p>
      </div>

      {/* Timeline rows */}
      <div style={{ position: "relative" }}>
        {/* Vertical spine */}
        <div
          className="d-none d-lg-block"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            transform: "translateX(-50%)",
            background:
              "linear-gradient(180deg, rgba(201,136,58,0.70) 0%, rgba(201,136,58,0.06) 100%)",
          }}
        />

        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={step.number}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 36,
              }}
            >
              {/* Left slot */}
              <div style={{ flex: "0 0 41.666%", maxWidth: "41.666%", paddingRight: 32 }}>
                {isLeft && <StepCard step={step} index={i} />}
              </div>

              {/* Center dot — always at 50% */}
              <div
                style={{
                  flex: "0 0 16.666%",
                  maxWidth: "16.666%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "12px 0",
                }}
              >
                <SpineDot icon={step.icon} index={i} />
              </div>

              {/* Right slot */}
              <div style={{ flex: "0 0 41.666%", maxWidth: "41.666%", paddingLeft: 32 }}>
                {!isLeft && <StepCard step={step} index={i} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <style>{`
      @media (max-width: 991px) {
        .proc-row { flex-direction: column !important; }
        .proc-left, .proc-right, .proc-center {
          flex: 0 0 100% !important; max-width: 100% !important;
          padding: 0 !important; justify-content: flex-start !important;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        * { transition: none !important; opacity: 1 !important; transform: none !important; }
      }
    `}</style>
  </section>
);

export default ProcessTimeline;
