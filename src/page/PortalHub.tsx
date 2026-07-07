import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const GOLD  = "#C9883A";
const WHITE = "#FFFFFF";
const CREAM = "#F8F7F4";
const FF    = "'DM Sans', sans-serif";
const OG_G  = "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

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
  colorDeep: string;
  desc: string;
  route: string;
  req: "erp" | "instructor" | "student";
}

const PORTALS: Portal[] = [
  { id: "erp",        label: "ERP Dashboard",     icon: "fas fa-chart-bar",           color: "#C9883A", colorDeep: "rgba(150,95,30,0.40)",  desc: "Enterprise overview & analytics",   route: "/erp/dashboard",           req: "erp"        },
  { id: "instructor", label: "Academy Instructor", icon: "fas fa-chalkboard-teacher",  color: "#8B5CF6", colorDeep: "rgba(91,33,182,0.35)",   desc: "Create & manage your courses",      route: "/lma/instructor/dashboard", req: "instructor" },
  { id: "student",    label: "Academy Student",    icon: "fas fa-graduation-cap",      color: "#10b981", colorDeep: "rgba(4,120,87,0.35)",    desc: "Your courses & learning path",      route: "/lma/student/dashboard",   req: "student"    },
  { id: "crm",        label: "CRM",                icon: "fas fa-handshake",           color: "#3b82f6", colorDeep: "rgba(37,99,235,0.35)",   desc: "Customers, leads & pipeline",       route: "/erp/crm",                 req: "erp"        },
  { id: "hr",         label: "HR & Payroll",       icon: "fas fa-users",               color: "#ec4899", colorDeep: "rgba(190,24,93,0.35)",   desc: "Staff, attendance & salaries",      route: "/erp/hr",                  req: "erp"        },
  { id: "mlm",        label: "MLM",                icon: "fas fa-sitemap",             color: "#f59e0b", colorDeep: "rgba(180,115,0,0.35)",   desc: "Network & commission tracking",     route: "/erp/mlm",                 req: "erp"        },
  { id: "sales",      label: "Sales",              icon: "fas fa-chart-line",          color: "#14b8a6", colorDeep: "rgba(13,148,136,0.35)",  desc: "Orders, revenue & forecasts",       route: "/erp/sales",               req: "erp"        },
  { id: "invoicing",  label: "Invoicing",          icon: "fas fa-file-invoice-dollar", color: "#ef4444", colorDeep: "rgba(185,28,28,0.35)",   desc: "Billing, invoices & payments",      route: "/erp/invoicing",           req: "erp"        },
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

// ── 3D Portal Card ────────────────────────────────────────────────────────────
const PortalCard = ({ portal, index }: { portal: Portal; index: number }) => {
  const navigate = useNavigate();
  const cardRef  = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform  = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
    el.style.transition = "transform 0.08s linear";
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform  = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
    setHov(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      onClick={() => navigate(portal.route)}
      style={{
        background:     WHITE,
        borderRadius:   16,
        border:         "1px solid rgba(0,0,0,0.07)",
        borderTop:      `3px solid ${portal.color}`,
        boxShadow:      hov ? BHOV : BCARD,
        padding:        "28px 26px",
        cursor:         "pointer",
        willChange:     "transform",
        transformStyle: "preserve-3d",
        display:        "flex",
        flexDirection:  "column",
        transition:     "box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
        animation:      `phCardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${0.1 + index * 0.075}s both`,
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background:   `linear-gradient(145deg, ${portal.color}cc, ${portal.color})`,
        boxShadow:    `0 4px 0 ${portal.colorDeep}, 0 6px 20px ${portal.color}40`,
        display:      "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20,
        animation:    `phIconBounce 0.65s cubic-bezier(0.34,1.56,0.64,1) ${0.22 + index * 0.075}s both`,
      }}>
        <i className={portal.icon} style={{ color: "#fff", fontSize: 22 }} />
      </div>

      <h3 style={{
        fontWeight: 800, fontSize: 17, color: "#141413",
        margin: "0 0 8px", fontFamily: FF, letterSpacing: "-0.02em",
      }}>
        {portal.label}
      </h3>

      <p style={{
        color: "rgba(20,20,19,0.52)", fontSize: 13.5, lineHeight: 1.65,
        margin: "0 0 20px", fontFamily: FF, flex: 1,
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
            transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
            transform: hov ? "translateX(5px)" : "translateX(0)",
          }}
        />
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
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        style={{
          width: 38, height: 38, borderRadius: "50%",
          background: OG_G,
          boxShadow: "0 2px 0 rgba(150,95,30,0.40), 0 4px 12px rgba(201,136,58,0.28)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: FF,
          transition: "transform 160ms, box-shadow 160ms",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.07)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {initial}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          background: WHITE, borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          minWidth: 192, padding: "6px 0", zIndex: 200,
          animation: "phDdIn 0.18s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <div style={{ padding: "10px 16px 10px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", fontFamily: FF }}>{name}</div>
            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", fontFamily: FF, marginTop: 2 }}>Signed in</div>
          </div>

          <button
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              width: "100%", padding: "10px 16px",
              background: "none", border: "none", cursor: "pointer",
              color: "#ef4444", fontSize: 13, fontWeight: 600, fontFamily: FF,
              transition: "background 0.15s", textAlign: "left",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
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

// ── Page Root ─────────────────────────────────────────────────────────────────
export default function PortalHub() {
  const navigate = useNavigate();
  const [portals, setPortals] = useState<Portal[]>([]);
  const [name,    setName]    = useState("");
  const [ready,   setReady]   = useState(false);
  const isAdmin = isAdminUser();

  useEffect(() => {
    const visible = getVisiblePortals();

    if (visible.length === 0) {
      navigate("/lma/login", { replace: true });
      return;
    }
    if (visible.length === 1) {
      navigate(visible[0].route, { replace: true });
      return;
    }

    setPortals(visible);
    setName(getUserFirstName());
    setReady(true);
  }, [navigate]);

  const handleLogout = () => {
    [
      "auth_tokens", "xerxez_token", "xerxez_role", "xerxez_name",
      "lma_token",   "lma_role",     "lma_can_instructor", "lma_name",
    ].forEach(k => localStorage.removeItem(k));
    navigate("/", { replace: true });
  };

  if (!ready) return null;

  return (
    <>
      <style>{`
        @keyframes phFadeDown   { from { opacity:0; transform:translateY(-18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes phSlideUp    { from { opacity:0; transform:translateY(28px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes phCardIn     { from { opacity:0; transform:translateY(22px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes phIconBounce { from { opacity:0; transform:scale(0.68);       } to { opacity:1; transform:scale(1);     } }
        @keyframes phDdIn       { from { opacity:0; transform:translateY(-7px);  } to { opacity:1; transform:translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0ms !important; transition-duration: 0ms !important; }
        }
        .ph-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1199px) { .ph-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 767px)  { .ph-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 479px)  { .ph-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: CREAM, fontFamily: FF, display: "flex", flexDirection: "column" }}>

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header style={{
          position:   "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: WHITE,
          animation:  "phFadeDown 0.5s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <div style={{
            maxWidth: 1280, margin: "0 auto", padding: "0 28px",
            height: 64,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Logo */}
            <img
              src="/assets/img/logo/xerxez_logo.png"
              alt="XERXEZ"
              style={{ height: 44, width: "auto" }}
            />

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {isAdmin && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(201,136,58,0.09)",
                  border: "1px solid rgba(201,136,58,0.25)",
                  color: GOLD, fontSize: 10.5, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 20,
                  letterSpacing: "0.11em", textTransform: "uppercase", fontFamily: FF,
                }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: 9 }} />
                  Admin
                </span>
              )}
              <AvatarDropdown name={name} onLogout={handleLogout} />
            </div>
          </div>

          {/* Gold gradient bottom accent line */}
          <div style={{
            height: 2,
            background: "linear-gradient(90deg, #C9883A 0%, #e8a84e 55%, transparent 100%)",
          }} />
        </header>

        {/* ── MAIN ──────────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, paddingTop: 100, paddingBottom: 64 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div style={{
              textAlign: "center",
              marginBottom: 56,
              position: "relative",
              animation: "phSlideUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both",
            }}>
              {/* Warm amber glow */}
              <div aria-hidden style={{
                position: "absolute", top: -40, left: "50%",
                transform: "translateX(-50%)",
                width: 560, height: 280, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(201,136,58,0.10) 0%, transparent 68%)",
                pointerEvents: "none", zIndex: 0,
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{
                  color: GOLD, fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  marginBottom: 14, fontFamily: FF,
                }}>✦ XERXEZ Enterprise Suite</p>

                <h1 style={{
                  fontWeight: 800,
                  fontSize: "clamp(28px,4vw,52px)",
                  color: "#141413",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  margin: "0 0 16px",
                  fontFamily: FF,
                }}>
                  Welcome back,{" "}
                  <span style={{ color: GOLD }}>{name}</span>
                </h1>

                <p style={{
                  color: "rgba(20,20,19,0.50)", fontSize: 16.5,
                  maxWidth: 480, margin: "0 auto",
                  lineHeight: 1.7, fontFamily: FF,
                }}>
                  {portals.length} workspace{portals.length !== 1 ? "s" : ""} available.
                  Select a portal to get started.
                </p>
              </div>
            </div>

            {/* ── Card grid ─────────────────────────────────────────────────── */}
            <div className="ph-grid">
              {portals.map((p, i) => (
                <PortalCard key={p.id} portal={p} index={i} />
              ))}
            </div>

          </div>
        </main>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer style={{
          textAlign: "center",
          padding: "18px 28px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: WHITE,
        }}>
          <p style={{
            color: "rgba(20,20,19,0.32)", fontSize: 12,
            margin: 0, fontFamily: FF,
          }}>
            © {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
        </footer>

      </div>
    </>
  );
}
