import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const DARK = "#1a1208";
const OG = "#C9883A";

// Themify Icons (ti-*) aren't loaded in this project — using the same FontAwesome set
// every other nav icon here uses (fas fa-building / fas fa-handshake are close visual
// equivalents to ti-building / ti-handshake).
export const SIGNIN_OPTIONS = [
  { icon: "fas fa-building", label: "ERP Login", subtitle: "Access your ERP dashboard", to: "/erp" },
  { icon: "fas fa-handshake", label: "Partner Login", subtitle: "Access your partner portal", to: "/partner/training" },
];

interface Props {
  className?: string;
}

const SignInDropdown = ({ className }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className={className} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          fontSize: 14, fontWeight: 500,
          color: open ? "#C9883A" : "rgba(255,255,255,0.72)",
          padding: "8px 12px",
          transition: "color 150ms ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#C9883A")}
        onMouseLeave={e => { if (!open) e.currentTarget.style.color = "rgba(255,255,255,0.72)"; }}
      >
        Sign in
        <i className="fas fa-chevron-down" style={{ fontSize: 10, transition: "transform 150ms ease", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: 260, background: DARK,
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 12,
          boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
          overflow: "hidden", zIndex: 500,
        }}>
          {SIGNIN_OPTIONS.map(opt => (
            <Link
              key={opt.to}
              to={opt.to}
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 16px", textDecoration: "none",
                transition: "background 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 2,
                background: "rgba(201,136,58,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: OG, fontSize: 14,
              }}>
                <i className={opt.icon} />
              </span>
              <span>
                <span style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}>
                  {opt.label}
                </span>
                <span style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                  {opt.subtitle}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignInDropdown;
