import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Play, Search,
  ClipboardList, Award, TrendingUp, User,
  LogOut, ChevronRight, Bell, Menu, X,
  Maximize, Minimize,
} from "lucide-react";

const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const FF    = "'DM Sans', sans-serif";

/* ── Sidebar nav item ── */
const SideItem = ({
  icon: Icon, label, to, active, badge, danger, onClick,
}: {
  icon: React.ElementType;
  label: string;
  to?: string;
  active?: boolean;
  badge?: number;
  danger?: boolean;
  onClick?: () => void;
}) => {
  if (danger) {
    return (
      <div
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px", borderRadius: 10, cursor: "pointer",
          background: "transparent",
          borderLeft: "3px solid transparent",
          color: "rgba(239,68,68,0.80)",
          fontSize: 13.5, fontWeight: 500, fontFamily: FF,
          marginBottom: 2, transition: "all 0.18s ease", userSelect: "none",
        }}
      >
        <Icon size={16} /><span>{label}</span>
      </div>
    );
  }
  return (
    <Link
      to={to!}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px", borderRadius: 10,
        textDecoration: "none",
        background: active ? "rgba(201,136,58,0.14)" : "transparent",
        borderLeft: `3px solid ${active ? GOLD : "transparent"}`,
        color: active ? AMBER : "rgba(255,255,255,0.60)",
        fontSize: 13.5, fontWeight: active ? 700 : 500, fontFamily: FF,
        marginBottom: 2, transition: "all 0.18s ease",
      }}
    >
      <Icon size={16} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? (
        <span style={{ background: GOLD, color: "#0a0806", fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "1px 7px" }}>
          {badge}
        </span>
      ) : null}
      {active && <ChevronRight size={14} />}
    </Link>
  );
};

/* ── Avatar initials ── */
const avatarInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export interface LMAStudentLayoutProps {
  children: React.ReactNode;
  pendingBadge?: number;
}

export default function LMAStudentLayout({ children, pendingBadge }: LMAStudentLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const token = localStorage.getItem("lma_token");
  const name = localStorage.getItem("lma_name") ?? "Student";
  const canInstructor = localStorage.getItem("lma_can_instructor") === "true";

  // All hooks must be declared before any conditional return (Rules of Hooks)
  const [sideOpen, setSideOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // Redirect in an effect — never call navigate() during render
  useEffect(() => {
    if (!token) {
      navigate(`/lma/login?redirect=${encodeURIComponent(path)}`);
    }
  }, [token, navigate, path]);

  if (!token) return null;

  const logout = () => {
    ["lma_token", "lma_role", "lma_can_instructor", "lma_name"].forEach(k =>
      localStorage.removeItem(k)
    );
    navigate("/lma/login");
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const navSections = [
    {
      section: "LEARN",
      items: [
        { icon: LayoutDashboard, label: "Dashboard",          to: "/lma/student/dashboard" },
        { icon: BookOpen,        label: "My Courses",         to: "/lma/student/courses" },
        { icon: Play,            label: "Continue Learning",  to: "/lma/student/continue-learning" },
        { icon: Search,          label: "Browse Courses",     to: "/lma/student/browse" },
      ],
    },
    {
      section: "PROGRESS",
      items: [
        { icon: ClipboardList, label: "Assignments",     to: "/lma/student/assignments", badge: pendingBadge },
        { icon: Award,         label: "Certificates",   to: "/lma/student/certificates" },
        { icon: TrendingUp,    label: "Progress Report", to: "/lma/student/progress" },
      ],
    },
    {
      section: "ACCOUNT",
      items: [
        { icon: User, label: "Profile", to: "/lma/student/profile" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f2ef", fontFamily: FF }}>

      {/* Global styles */}
      <style>{`
        @keyframes lma-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes lma-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes lmaPage-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lma-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .lma-sidebar {
          width: 240px; background: ${DARK};
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; height: 100vh; z-index: 200;
          overflow-y: auto;
          transition: transform 0.30s cubic-bezier(0.22,1,0.36,1);
          flex-shrink: 0;
        }
        .lma-main {
          flex: 1; display: flex; flex-direction: column; min-height: 100vh;
          margin-left: 240px;
        }
        .lma-menu-btn { display: none !important; }
        @media (max-width: 1023px) {
          .lma-sidebar  { transform: translateX(-100%); }
          .lma-sidebar.open { transform: none; }
          .lma-main     { margin-left: 0 !important; }
          .lma-menu-btn { display: flex !important; }
        }
        .lma-side-item:hover {
          background: rgba(201,136,58,0.08) !important;
          color: rgba(255,255,255,0.85) !important;
        }
      `}</style>

      {/* Mobile overlay */}
      {sideOpen && (
        <div
          onClick={() => setSideOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 199 }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`lma-sidebar${sideOpen ? " open" : ""}`}>
        <div style={{ padding: "24px 16px 16px" }}>
          <Link to="/">
            <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 60, width: "auto" }} />
          </Link>
          <div style={{ marginTop: 8, fontSize: 10, color: AMBER, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Academy · Student
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {navSections.map(({ section, items }) => (
            <div key={section}>
              <div style={{
                fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.14em", textTransform: "uppercase",
                padding: "12px 4px 6px",
              }}>
                {section}
              </div>
              {items.map(it => (
                <SideItem
                  key={it.label}
                  icon={it.icon}
                  label={it.label}
                  to={it.to}
                  active={path === it.to || path.startsWith(it.to + "/")}
                  badge={(it as { badge?: number }).badge && (it as { badge?: number }).badge! > 0
                    ? (it as { badge?: number }).badge
                    : undefined}
                  onClick={() => setSideOpen(false)}
                />
              ))}
            </div>
          ))}
        </nav>

        {canInstructor && (
          <div style={{ padding: "0 12px 8px" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 4px 6px" }}>
              SWITCH PORTAL
            </div>
            <Link to="/lma/instructor/dashboard" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 16px", borderRadius: 10, textDecoration: "none",
              background: "linear-gradient(135deg, rgba(201,136,58,0.20) 0%, rgba(232,168,78,0.10) 100%)",
              border: "1px solid rgba(201,136,58,0.35)",
              color: AMBER, fontSize: 13.5, fontWeight: 700, fontFamily: FF,
              marginBottom: 2, transition: "all 0.18s ease",
            }}>
              <BookOpen size={16} />
              <span style={{ flex: 1 }}>Instructor Portal</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        )}

        <div style={{ padding: "12px 12px 24px" }}>
          <SideItem icon={LogOut} label="Logout" danger onClick={logout} />
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="lma-main">

        {/* Header */}
        <header style={{
          background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "0 28px", height: 64,
          display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button
            ref={bellRef}
            onClick={() => setSideOpen(o => !o)}
            className="lma-menu-btn"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#141413" }}
          >
            {sideOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#141413", fontFamily: FF }}>
              {greeting},{" "}
              <span style={{ color: GOLD, fontWeight: 800 }}>{name.split(" ")[0]}</span>!
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#6b7280" }}
          >
            {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
          </button>

          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#6b7280" }}>
            <Bell size={20} />
          </button>

          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0a0806", fontWeight: 800, fontSize: 13, cursor: "pointer",
            fontFamily: FF,
          }}>
            {avatarInitials(name)}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
