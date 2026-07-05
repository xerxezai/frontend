import { useEffect, useRef, useState } from "react";
import { counterData } from "../../data";
import CountUp from "../utils/CountUp";

const BAR_TARGETS = [82, 85, 70, 98];

interface Props {
  variant?: string;
}

/* ── 3D tilt + bar-reveal stat card ── */
const StatCard = ({
  item,
  index,
  barTarget,
}: {
  item: (typeof counterData)[number];
  index: number;
  barTarget: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  /* Scroll-triggered bar + entrance */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = `opacity 0.55s ease ${index * 80}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          setTimeout(() => setBarWidth(barTarget), index * 150 + 300);
          setTimeout(() => setVisible(true), 100);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, barTarget]);

  /* 3-D tilt */
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-6px) scale(1.02)`;
    el.style.boxShadow = "0 24px 56px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(201,136,58,0.40)";
    el.style.transition = "transform 0.10s ease, box-shadow 0.10s ease";
  };
  const onLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.boxShadow = "0 4px 28px rgba(0,0,0,0.42), 0 0 0 1px rgba(201,136,58,0.10)";
    el.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: "linear-gradient(160deg, rgba(28,18,8,0.95) 0%, rgba(14,9,4,0.98) 100%)",
        border: "1px solid rgba(201,136,58,0.18)",
        borderTop: "2px solid rgba(201,136,58,0.55)",
        borderRadius: 18,
        padding: "30px 24px 24px",
        boxShadow: "0 4px 28px rgba(0,0,0,0.42), 0 0 0 1px rgba(201,136,58,0.10)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        cursor: "default",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 50, height: 50, borderRadius: 13, flexShrink: 0,
        background: "linear-gradient(135deg, rgba(201,136,58,0.28) 0%, rgba(201,136,58,0.10) 100%)",
        border: "1px solid rgba(201,136,58,0.42)",
        boxShadow: "0 4px 16px rgba(201,136,58,0.22), inset 0 1px 0 rgba(255,255,255,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 22,
      }}>
        <i className={item.iconClass} style={{ color: "#E8A84E", fontSize: 20 }} />
      </div>

      {/* Number */}
      <div style={{
        fontSize: 44, fontWeight: 900,
        background: "linear-gradient(135deg, #E8A84E 0%, #C9883A 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: 8,
        minHeight: 44,
      }}>
        {visible && <CountUp value={item.variantTargetValue} suffix={item.variantSuffix} />}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 13, fontWeight: 500,
        color: "rgba(240,237,230,0.60)",
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: 18,
        letterSpacing: "0.01em",
      }}>
        {item.variantLabel}
      </div>

      {/* Progress bar */}
      <div style={{
        height: 3, borderRadius: 3,
        background: "rgba(201,136,58,0.14)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: "linear-gradient(90deg, #C9883A, #E8A84E)",
          width: `${barWidth}%`,
          transition: "width 1.5s cubic-bezier(0.22,1,0.5,1)",
          boxShadow: "0 0 10px rgba(232,168,78,0.55)",
        }} />
      </div>
      <div style={{
        fontSize: 10, color: "rgba(201,136,58,0.55)",
        marginTop: 6, textAlign: "right",
        fontWeight: 700, letterSpacing: "0.08em",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {barTarget}% milestone
      </div>
    </div>
  );
};

const CounterSection = ({ variant }: Props) => {
  if (variant === "style-3") {
    return (
      <section style={{
        background: "linear-gradient(180deg, #0d0906 0%, #0a0806 100%)",
        padding: "108px 0 100px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: -40, left: "50%",
          transform: "translateX(-50%)",
          width: 800, height: 440,
          background: "radial-gradient(ellipse 60% 55% at 50% 20%, rgba(201,136,58,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, #C9883A)", display: "block" }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#C9883A",
                fontFamily: "'DM Sans', sans-serif",
              }}>By the Numbers</span>
              <span style={{ width: 32, height: 1, background: "linear-gradient(90deg, #C9883A, transparent)", display: "block" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 800, lineHeight: 1.12,
              color: "rgba(240,237,230,0.95)",
              fontFamily: "'DM Sans', sans-serif",
              margin: 0,
            }}>
              Proven at Enterprise Scale
            </h2>
          </div>

          {/* Stat cards */}
          <div className="row g-4">
            {counterData.map((item, i) => (
              <div key={item.id} className="col-6 col-lg-3">
                <StatCard item={item} index={i} barTarget={BAR_TARGETS[i] ?? 80} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (prefers-reduced-motion: reduce) {
            [style*="translateY"] { transition: none !important; }
          }
        `}</style>
      </section>
    );
  }

  /* ── default / style-2 variant (unchanged) ── */
  return (
    <section
      className={`counter-section fix section-padding pt-0 ${
        variant === "style-2" ? "sec-bg-4" : ""
      }`}
    >
      <div className="container">
        <div className="counter-wrapper">
          {counterData.map((item, index) => (
            <div
              key={item.id}
              className={`counter-items ${item.styleClass}`}
              data-aos="fade-up"
              data-aos-delay={index * 200}
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <div className="icon">
                <i className={item.iconClass}></i>
              </div>
              <div className="content">
                <CountUp value={item.targetValue} suffix={item.suffix} />
                <p className={variant === "style-2" ? "text-white" : ""}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
