import { useEffect, useRef, useState } from "react";

interface Props {
  variant?: string;
}

const techPartners = [
  { icon: "fab fa-aws",          name: "AWS"         },
  { icon: "fas fa-cloud",        name: "Azure"        },
  { icon: "fab fa-google",       name: "Google Cloud" },
  { icon: "fas fa-dharmachakra", name: "Kubernetes"   },
  { icon: "fab fa-docker",       name: "Docker"       },
  { icon: "fas fa-layer-group",  name: "TensorFlow"   },
  { icon: "fas fa-fire-alt",     name: "PyTorch"      },
  { icon: "fas fa-robot",        name: "OpenAI"       },
  { icon: "fas fa-code-branch",  name: "Terraform"    },
  { icon: "fas fa-database",     name: "Databricks"   },
];

/* ── Single 3D partner card ── */
const PartnerCard = ({ partner, index }: { partner: typeof techPartners[number]; index: number }) => {
  const ref  = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  /* Scroll reveal */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px) scale(0.96)";
    el.style.transition = `opacity 0.55s ease ${index * 55}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 55}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  /* 3D tilt */
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(600px) rotateX(${(0.5 - y) * 18}deg) rotateY(${(x - 0.5) * 18}deg) translateY(-6px) scale(1.04)`;
    el.style.transition = "transform 0.08s ease, box-shadow 0.08s ease";
    el.style.boxShadow = "0 20px 44px rgba(201,136,58,0.22), 0 0 0 1.5px rgba(201,136,58,0.36), inset 0 1px 0 rgba(255,255,255,0.95)";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    el.style.transition = "transform 0.30s ease, box-shadow 0.30s ease";
    el.style.boxShadow = "0 4px 0 rgba(160,128,90,0.35), 0 8px 22px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.92)";
    setHov(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHov(true)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "26px 16px 20px",
        background: hov
          ? "linear-gradient(160deg, #fff 0%, #fef8ef 100%)"
          : "linear-gradient(160deg, #faf7f2 0%, #ede7db 100%)",
        border: hov
          ? "1px solid rgba(201,136,58,0.32)"
          : "1px solid rgba(210,196,175,0.55)",
        borderRadius: 16,
        boxShadow: "0 4px 0 rgba(160,128,90,0.35), 0 8px 22px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.92)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Gold shimmer top-edge on hover */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: hov
          ? "linear-gradient(90deg, transparent, rgba(201,136,58,0.60), transparent)"
          : "transparent",
        borderRadius: "16px 16px 0 0",
        pointerEvents: "none",
        transition: "background 0.25s ease",
      }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hov
          ? "linear-gradient(135deg, rgba(232,168,78,0.22) 0%, rgba(201,136,58,0.10) 100%)"
          : "rgba(201,136,58,0.07)",
        border: hov
          ? "1px solid rgba(201,136,58,0.36)"
          : "1px solid rgba(201,136,58,0.14)",
        boxShadow: hov
          ? "0 4px 16px rgba(201,136,58,0.22)"
          : "none",
        transition: "all 0.25s ease",
      }}>
        <i
          className={partner.icon}
          style={{
            fontSize: 22,
            color: hov ? "#C9883A" : "#B07A2C",
            transition: "color 0.25s ease, transform 0.25s ease",
            transform: hov ? "scale(1.12)" : "scale(1)",
          }}
        />
      </div>

      {/* Name */}
      <span style={{
        fontSize: 11.5,
        fontWeight: 700,
        color: hov ? "#6A4E1C" : "#7A7067",
        letterSpacing: "0.04em",
        textAlign: "center",
        lineHeight: 1.3,
        fontFamily: "'DM Sans', sans-serif",
        transition: "color 0.25s ease",
      }}>
        {partner.name}
      </span>
    </div>
  );
};

/* ── Section ── */
const BrandSection = ({ variant }: Props) => {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{
      background: "#F8F4EE",
      padding: variant === "style-3" ? "0 0 80px" : "72px 0 80px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Dot-grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(201,136,58,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* Label */}
        <div ref={labelRef} style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 28, height: 1, background: "linear-gradient(90deg, transparent, #C9883A)", display: "block" }} />
            <p style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#C9883A",
            }}>
              Powered by Industry-Leading Cloud &amp; AI Platforms
            </p>
            <span style={{ width: 28, height: 1, background: "linear-gradient(90deg, #C9883A, transparent)", display: "block" }} />
          </div>
        </div>

        {/* Cards grid */}
        <div className="row g-3 justify-content-center align-items-center">
          {techPartners.map((partner, index) => (
            <div key={partner.name} className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6">
              <PartnerCard partner={partner} index={index} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
};

export default BrandSection;
