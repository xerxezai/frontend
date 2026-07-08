import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const GOLD  = "#C9883A";
const WHITE = "#FFFFFF";
const CREAM = "#F8F7F4";
const FF    = "'DM Sans', sans-serif";
const OG_G  = "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)";

// ── Auth helpers ──────────────────────────────────────────────────────────────
function isAdminUser(): boolean {
  try {
    const stored = localStorage.getItem("auth_tokens");
    if (stored) {
      const payload = JSON.parse(atob(JSON.parse(stored).access.split(".")[1]));
      if (payload.is_staff === true || payload.is_superuser === true) return true;
    }
  } catch {}
  const role = localStorage.getItem("xerxez_role") || "";
  return role === "admin" || role === "super_admin" || role === "superuser";
}

function getUserFirstName(): string {
  const n = localStorage.getItem("xerxez_name") || localStorage.getItem("lma_name") || "User";
  return n.split(" ")[0];
}

// ── Portal definitions ────────────────────────────────────────────────────────
interface Portal {
  id: string;
  label: string;
  icon: string;
  color: string;
  req: "erp" | "instructor" | "student";
  desc: string;
  route: string;
}

const PORTALS: Portal[] = [
  { id: "erp",        label: "ERP Dashboard",     icon: "fas fa-chart-bar",           color: "#C9883A", desc: "Enterprise overview & analytics",   route: "/erp/dashboard",           req: "erp"        },
  { id: "instructor", label: "Academy Instructor", icon: "fas fa-chalkboard-teacher",  color: "#8B5CF6", desc: "Create & manage your courses",      route: "/lma/instructor/dashboard", req: "instructor" },
  { id: "student",    label: "Academy Student",    icon: "fas fa-graduation-cap",      color: "#10b981", desc: "Your courses & learning path",      route: "/lma/student/dashboard",   req: "student"    },
  { id: "crm",        label: "CRM",                icon: "fas fa-handshake",           color: "#3b82f6", desc: "Customers, leads & pipeline",       route: "/erp/crm",                 req: "erp"        },
  { id: "hr",         label: "HR & Payroll",       icon: "fas fa-users",               color: "#ec4899", desc: "Staff, attendance & salaries",      route: "/erp/hr",                  req: "erp"        },
  { id: "mlm",        label: "MLM",                icon: "fas fa-sitemap",             color: "#f59e0b", desc: "Network & commission tracking",     route: "/erp/mlm",                 req: "erp"        },
  { id: "sales",      label: "Sales",              icon: "fas fa-chart-line",          color: "#14b8a6", desc: "Orders, revenue & forecasts",       route: "/erp/sales",               req: "erp"        },
  { id: "invoicing",  label: "Invoicing",          icon: "fas fa-file-invoice-dollar", color: "#ef4444", desc: "Billing, invoices & payments",      route: "/erp/invoicing",           req: "erp"        },
];

function getVisiblePortals(): Portal[] {
  const hasERP  = !!localStorage.getItem("auth_tokens");
  const hasLMA  = !!localStorage.getItem("lma_token");
  const isAdmin = isAdminUser();
  const canInst = localStorage.getItem("lma_can_instructor") === "true";
  if (isAdmin && hasERP) return [...PORTALS];
  return PORTALS.filter(p => {
    if (p.req === "erp")        return hasERP;
    if (p.req === "instructor") return hasLMA && canInst;
    if (p.req === "student")    return hasLMA;
    return false;
  });
}

// ── hex → rgb helper ──────────────────────────────────────────────────────────
function hexRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── 3D Portal Card ────────────────────────────────────────────────────────────
const PortalCard = ({ portal, index }: { portal: Portal; index: number }) => {
  const navigate  = useNavigate();
  const wrapRef   = useRef<HTMLDivElement>(null);
  const shineRef  = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);
  const rgb = hexRgb(portal.color);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left)  / r.width  - 0.5;
    const y  = (e.clientY - r.top)   / r.height - 0.5;
    el.style.transform  = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(22px) scale(1.025)`;
    el.style.transition = "transform 0.06s linear";
    if (shineRef.current) {
      shineRef.current.style.opacity  = "1";
      shineRef.current.style.backgroundImage = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.28) 0%, transparent 55%)`;
    }
  };

  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform  = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0) scale(1)";
    el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
    if (shineRef.current) shineRef.current.style.opacity = "0";
    setHov(false);
  };

  const delay = `${0.08 + index * 0.07}s`;

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      onClick={() => navigate(portal.route)}
      style={{
        background:     WHITE,
        borderRadius:   20,
        border:         hov ? `1.5px solid rgba(${rgb},0.30)` : "1.5px solid rgba(0,0,0,0.06)",
        boxShadow:      hov
          ? `0 2px 4px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.09), 0 28px 56px rgba(${rgb},0.16), inset 0 1px 0 rgba(255,255,255,0.9)`
          : `0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.05), 0 12px 28px rgba(0,0,0,0.04)`,
        cursor:         "pointer",
        willChange:     "transform",
        transformStyle: "preserve-3d",
        display:        "flex",
        flexDirection:  "column",
        overflow:       "hidden",
        position:       "relative",
        transition:     "box-shadow 260ms cubic-bezier(0.22,1,0.36,1), border-color 260ms",
        animation:      `phCardIn 0.60s cubic-bezier(0.22,1,0.36,1) ${delay} both`,
      }}
    >
      {/* Colored shelf */}
      <div style={{
        height: 5,
        background: `linear-gradient(90deg, ${portal.color}, ${portal.color}70)`,
        flexShrink: 0,
      }} />

      {/* Mouse-tracked shine overlay */}
      <div ref={shineRef} style={{
        position: "absolute", inset: 0,
        borderRadius: 20, pointerEvents: "none",
        zIndex: 3, opacity: 0,
        transition: "opacity 0.18s",
        backgroundImage: "none",
      }} />

      {/* Content */}
      <div style={{ padding: "24px 24px 26px", flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        {/* Icon badge */}
        <div style={{
          width: 60, height: 60, borderRadius: 16, flexShrink: 0,
          background:   `linear-gradient(145deg, ${portal.color}cc, ${portal.color})`,
          boxShadow:    `0 6px 0 rgba(${rgb},0.32), 0 10px 28px rgba(${rgb},0.28)`,
          display:      "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 22,
          animation:    `phIconIn 0.70s cubic-bezier(0.34,1.56,0.64,1) ${0.18 + index * 0.07}s both`,
        }}>
          <i className={portal.icon} style={{ color: "#fff", fontSize: 24 }} />
        </div>

        <h3 style={{
          fontWeight: 800, fontSize: 17, color: "#141413",
          margin: "0 0 7px", fontFamily: FF, letterSpacing: "-0.02em",
        }}>
          {portal.label}
        </h3>

        <p style={{
          color: "rgba(20,20,19,0.50)", fontSize: 13.5, lineHeight: 1.65,
          margin: "0 0 22px", fontFamily: FF, flex: 1,
        }}>
          {portal.desc}
        </p>

        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          color: portal.color, fontSize: 13, fontWeight: 700, fontFamily: FF,
        }}>
          Open portal
          <i
            className="fas fa-arrow-right"
            style={{
              fontSize: 11,
              transition: "transform 0.20s cubic-bezier(0.22,1,0.36,1)",
              transform: hov ? "translateX(6px)" : "translateX(0)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Avatar dropdown ────────────────────────────────────────────────────────────
const AvatarDropdown = ({ name, onLogout }: { name: string; onLogout: () => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        style={{
          width: 40, height: 40, borderRadius: "50%",
          background: OG_G,
          boxShadow: "0 3px 0 rgba(150,95,30,0.38), 0 5px 16px rgba(201,136,58,0.30)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: FF,
          transition: "transform 160ms, box-shadow 160ms",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {initial}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          background: WHITE, borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          minWidth: 196, padding: "6px 0", zIndex: 300,
          animation: "phDdIn 0.18s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", fontFamily: FF }}>{name}</div>
            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.44)", fontFamily: FF, marginTop: 2 }}>Signed in</div>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              width: "100%", padding: "11px 16px",
              background: "none", border: "none", cursor: "pointer",
              color: "#ef4444", fontSize: 13, fontWeight: 600, fontFamily: FF,
              transition: "background 0.15s", textAlign: "left",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
          >
            <i className="fas fa-sign-out-alt" style={{ fontSize: 12 }} />
            Sign out of all portals
          </button>
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PortalHub() {
  const navigate = useNavigate();
  const [portals, setPortals] = useState<Portal[]>([]);
  const [name,    setName]    = useState("");
  const [ready,   setReady]   = useState(false);
  const isAdmin = isAdminUser();

  useEffect(() => {
    const visible = getVisiblePortals();
    if (visible.length === 0) { navigate("/lma/login", { replace: true }); return; }
    if (visible.length === 1) { navigate(visible[0].route, { replace: true }); return; }
    setPortals(visible);
    setName(getUserFirstName());
    setReady(true);
  }, [navigate]);

  const handleLogout = () => {
    ["auth_tokens","xerxez_token","xerxez_role","xerxez_name","lma_token","lma_role","lma_can_instructor","lma_name"]
      .forEach(k => localStorage.removeItem(k));
    navigate("/", { replace: true });
  };

  if (!ready) return null;

  return (
    <>
      <style>{`
        @keyframes phFadeDown   { from { opacity:0; transform:translateY(-22px);} to { opacity:1; transform:translateY(0);} }
        @keyframes phSlideUp    { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0);} }
        @keyframes phCardIn     { from { opacity:0; transform:translateY(28px) scale(0.96);} to { opacity:1; transform:translateY(0) scale(1);} }
        @keyframes phIconIn     { from { opacity:0; transform:scale(0.5) translateY(10px);} to { opacity:1; transform:scale(1) translateY(0);} }
        @keyframes phDdIn       { from { opacity:0; transform:translateY(-8px);} to { opacity:1; transform:translateY(0);} }
        @keyframes phBlob1      { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(30px,-20px) scale(1.08); } }
        @keyframes phBlob2      { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(-25px,25px) scale(1.06); } }
        @keyframes phBlob3      { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(20px,30px) scale(1.05); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration:0ms !important; transition-duration:0ms !important; }
        }
        .ph-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width:1199px){ .ph-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width:767px) { .ph-grid { grid-template-columns: repeat(2,1fr); gap: 16px; } }
        @media (max-width:479px) { .ph-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: CREAM, fontFamily: FF, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

        {/* ── Ambient background blobs ─────────────────────────────────────── */}
        <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-15%", left: "5%",
            width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,136,58,0.09) 0%, transparent 68%)",
            animation: "phBlob1 10s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "-10%", right: "5%",
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 68%)",
            animation: "phBlob2 13s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: "40%", right: "25%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 68%)",
            animation: "phBlob3 9s ease-in-out infinite",
          }} />
        </div>

        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <header style={{
          position:      "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background:    "rgba(255,255,255,0.88)",
          backdropFilter:"blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          animation:     "phFadeDown 0.5s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <div style={{
            maxWidth: 1280, margin: "0 auto", padding: "0 32px",
            height: 72,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Logo — bigger, more presence */}
            <img
              src="/assets/img/logo/xerxez_logo.png"
              alt="XERXEZ"
              style={{ height: 56, width: "auto", display: "block" }}
            />

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {isAdmin && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(201,136,58,0.09)",
                  border: "1px solid rgba(201,136,58,0.28)",
                  color: GOLD, fontSize: 10.5, fontWeight: 700,
                  padding: "5px 13px", borderRadius: 20,
                  letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FF,
                }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: 9 }} />
                  Admin
                </span>
              )}
              <AvatarDropdown name={name} onLogout={handleLogout} />
            </div>
          </div>

          {/* Gold gradient rule */}
          <div style={{
            height: 2,
            background: "linear-gradient(90deg, #C9883A 0%, #e8a84e 50%, transparent 100%)",
          }} />
        </header>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, paddingTop: 112, paddingBottom: 72, position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div style={{
              textAlign:  "center",
              marginBottom: 60,
              animation:  "phSlideUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.08s both",
            }}>
              <p style={{
                color: GOLD, fontSize: 11, fontWeight: 700,
                letterSpacing: "0.20em", textTransform: "uppercase",
                marginBottom: 16, fontFamily: FF,
              }}>
                ✦ XERXEZ Enterprise Suite
              </p>

              <h1 style={{
                fontWeight: 900,
                fontSize: "clamp(30px, 4.5vw, 56px)",
                color: "#141413",
                lineHeight: 1.08,
                letterSpacing: "-0.035em",
                margin: "0 0 18px",
                fontFamily: FF,
              }}>
                Welcome back,{" "}
                <span style={{
                  color: GOLD,
                  textShadow: "0 0 40px rgba(201,136,58,0.22)",
                }}>
                  {name}
                </span>
              </h1>

              <p style={{
                color: "rgba(20,20,19,0.48)", fontSize: 16,
                maxWidth: 420, margin: "0 auto",
                lineHeight: 1.75, fontFamily: FF,
              }}>
                {portals.length} workspace{portals.length !== 1 ? "s" : ""} available.
                Select a portal to get started.
              </p>
            </div>

            {/* ── Card grid ──────────────────────────────────────────────────── */}
            <div className="ph-grid">
              {portals.map((p, i) => (
                <PortalCard key={p.id} portal={p} index={i} />
              ))}
            </div>

          </div>
        </main>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer style={{
          textAlign: "center",
          padding: "18px 28px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.70)",
          backdropFilter: "blur(12px)",
          position: "relative", zIndex: 1,
        }}>
          <p style={{ color: "rgba(20,20,19,0.30)", fontSize: 12, margin: 0, fontFamily: FF }}>
            © {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
        </footer>

      </div>
    </>
  );
}
