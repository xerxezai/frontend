import { useState } from "react";

const ITEMS = [
  {
    icon: "fas fa-shield-alt",
    label: "SSL Encrypted",
    sub: "All data protected in transit",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.30)",
    grad: "linear-gradient(145deg,#93c5fd,#60a5fa)",
    deep: "rgba(37,99,235,0.50)",
  },
  {
    icon: "fas fa-certificate",
    label: "ISO 27001 Aligned",
    sub: "Enterprise security standard",
    color: "#C9883A",
    glow: "rgba(201,136,58,0.30)",
    grad: "linear-gradient(145deg,#e8a84e,#C9883A)",
    deep: "rgba(130,80,20,0.52)",
  },
  {
    icon: "fas fa-bolt",
    label: "Response < 24h",
    sub: "We reply every business day",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.30)",
    grad: "linear-gradient(145deg,#86efac,#4ade80)",
    deep: "rgba(21,128,61,0.45)",
  },
  {
    icon: "fas fa-lock",
    label: "No Spam, Ever",
    sub: "Your email stays private",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.30)",
    grad: "linear-gradient(145deg,#c4b5fd,#a78bfa)",
    deep: "rgba(91,33,182,0.45)",
  },
  {
    icon: "fas fa-building",
    label: "50+ Clients",
    sub: "Trusted by enterprises globally",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.30)",
    grad: "linear-gradient(145deg,#fdba74,#fb923c)",
    deep: "rgba(194,65,12,0.45)",
  },
];

const TrustItem = ({ item, index }: { item: typeof ITEMS[0]; index: number }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "16px 20px",
        background: hov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? `rgba(255,255,255,0.10)` : "rgba(255,255,255,0.04)"}`,
        borderRadius: 14,
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all 220ms cubic-bezier(0.22,1,0.36,1)",
        boxShadow: hov ? `0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px ${item.glow}` : "none",
        cursor: "default",
        animation: `xzTrustFade 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms both`,
        flex: "1 1 160px",
        minWidth: 0,
      }}
    >
      {/* 3D icon badge */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: item.grad,
        boxShadow: `0 4px 0 ${item.deep}, 0 6px 16px ${item.glow}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "transform 220ms ease",
      }}>
        <i className={item.icon} style={{ color: "#fff", fontSize: 16 }} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13, fontWeight: 700,
          color: hov ? "#fff" : "rgba(255,255,255,0.82)",
          lineHeight: 1.2, whiteSpace: "nowrap",
          transition: "color 200ms",
        }}>{item.label}</div>
        <div style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11, color: "rgba(255,255,255,0.34)",
          marginTop: 3, whiteSpace: "nowrap", overflow: "hidden",
          textOverflow: "ellipsis",
        }}>{item.sub}</div>
      </div>
    </div>
  );
};

const ContactTrustBar = () => (
  <>
    <style>{`
      @keyframes xzTrustFade {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @media (prefers-reduced-motion:reduce) {
        .xz-trust-inner * { animation:none!important; transition:none!important; }
      }
    `}</style>

    <div style={{
      background: "linear-gradient(135deg,#1a1208 0%,#0f0a05 100%)",
      borderTop: "1px solid rgba(201,136,58,0.18)",
      padding: "28px 0",
      position: "relative", overflow: "hidden",
    }}>
      {/* subtle dot grid */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.018) 1px,transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
      {/* warm ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 600, height: 120, borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(201,136,58,0.08) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container xz-trust-inner" style={{ position: "relative", zIndex: 1 }}>

        {/* label */}
        <div style={{
          textAlign: "center", marginBottom: 20,
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 10, fontWeight: 700,
          letterSpacing: "0.20em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.22)",
        }}>
          Trusted by enterprises worldwide
        </div>

        {/* items row */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", gap: 10,
        }}>
          {ITEMS.map((item, i) => (
            <TrustItem key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  </>
);

export default ContactTrustBar;
