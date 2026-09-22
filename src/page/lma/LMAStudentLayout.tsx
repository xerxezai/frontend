import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Play, Search,
  ClipboardList, Award, TrendingUp, User,
  LogOut, ChevronRight, Bell, Menu, X, Globe,
  Maximize, Minimize, CheckCircle2,
  Users, ListChecks, BarChart3, ClipboardCheck, Handshake,
} from "lucide-react";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";
import { ensureLmaAccessToken, clearLmaSession, LMA_PROACTIVE_REFRESH_INTERVAL_MS } from "../../utils/lmaAuth";

interface PendingAssignment {
  id: number;
  title: string;
  course_title: string;
  due_date: string;
}

const GOLD  = "#D93522";
const AMBER = "#D93522";
const DARK  = "#071a33";
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
          display: "flex", alignItems: "center", gap: 10, minHeight: 44,
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
        display: "flex", alignItems: "center", gap: 10, minHeight: 44,
        padding: "10px 16px", borderRadius: 10,
        textDecoration: "none",
        background: active ? "rgba(217,53,34,0.14)" : "transparent",
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

  // `token` is state (not a plain localStorage read) so a silent refresh can
  // update it and have every child that receives `token` as a prop pick up
  // the new value on the next render — without touching each child's own
  // fetch calls individually.
  const [token, setToken] = useState(localStorage.getItem("lma_token") ?? "");
  const [sessionExpired, setSessionExpired] = useState(false);
  const name = localStorage.getItem("lma_name") ?? "Student";

  // Session persistence: refresh proactively on mount (covers the "closed
  // the browser overnight, token already expired" case) and again every 7
  // hours thereafter — inside the 8-hour access/refresh token lifetime — so
  // an active session's refresh always lands before expiry. If refresh
  // genuinely fails (refresh token itself expired/blacklisted — i.e. idle
  // 8+ hours), the token clears and the redirect effect below sends the
  // user to login with an explicit "session expired" message.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const check = async () => {
      const hadToken = !!localStorage.getItem("lma_token");
      const fresh = await ensureLmaAccessToken();
      if (cancelled) return;
      if (!fresh && hadToken) setSessionExpired(true);
      if (fresh !== token) setToken(fresh);
    };
    check();
    const iv = setInterval(check, LMA_PROACTIVE_REFRESH_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(iv); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // All hooks must be declared before any conditional return (Rules of Hooks)
  const [sideOpen, setSideOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const bellPanelRef = useRef<HTMLDivElement>(null);
  const [bellOpen, setBellOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Notification bell — its own lightweight fetch so it works on every student
  // page (not just the dashboard, which already loads this data itself but
  // doesn't hand the list down through the layout). `pendingBadge`, when the
  // caller passes it (the dashboard does), wins for the badge count so the
  // sidebar and bell never briefly disagree; the dropdown's list always comes
  // from this fetch either way.
  const [pendingAssignments, setPendingAssignments] = useState<PendingAssignment[]>([]);
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/lma/student/assignments/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : []))
      .then((d: any) => {
        const list = Array.isArray(d) ? d : d?.results ?? [];
        setPendingAssignments(
          list
            .filter((a: any) => !a.submitted)
            .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        );
      })
      .catch(() => {});
  }, [token]);
  const bellCount = pendingBadge ?? pendingAssignments.length;

  useEffect(() => {
    if (!bellOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        bellPanelRef.current && !bellPanelRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) setBellOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [bellOpen]);

  // Whether to show the "Instructor Portal" switch link. Starts false (hidden)
  // and is only flipped on once the backend confirms it via a live, token-
  // authenticated request to /lma/profile/ — the same endpoint LMAProfilePage
  // uses. Deliberately does NOT read the localStorage `lma_can_instructor`
  // flag: that value is just a display cache written at login time and is
  // trivially editable in DevTools, so trusting it here would let any student
  // reveal the link by flipping one localStorage value. The link itself isn't
  // a security boundary (the instructor dashboard independently checks auth),
  // but it shouldn't be visible to accounts that don't actually have access.
  const [canInstructor, setCanInstructor] = useState(false);
  // Same reasoning as canInstructor above — the Admin sidebar section is only
  // shown once the backend confirms is_staff/is_superuser via this live,
  // token-authenticated request, never from anything cached client-side.
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/lma/profile/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!d) return;
        setCanInstructor(!!d.can_access_instructor);
        setIsAdmin(!!(d.is_staff || d.is_superuser));
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // Redirect in an effect — never call navigate() during render. A session
  // that expired (refresh failed) carries `expired=1` so the login page can
  // show "Your session has expired. Please login again." instead of the
  // silent redirect a first-time/never-logged-in visitor gets.
  useEffect(() => {
    if (!token) {
      const expiredParam = sessionExpired ? "&expired=1" : "";
      navigate(`/lma/login?redirect=${encodeURIComponent(path)}${expiredParam}`);
    }
  }, [token, navigate, path, sessionExpired]);

  if (!token) return null;

  const logout = () => {
    // Was missing lma_refresh — an explicit logout must clear the refresh
    // token too, or a stale one lingers in localStorage after "signing out".
    clearLmaSession();
    navigate("/", { replace: true });
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
    // Admin section — only rendered when isAdmin (is_staff/is_superuser,
    // confirmed live from /lma/profile/) is true; hidden entirely otherwise.
    ...(isAdmin ? [{
      section: "ADMIN",
      items: [
        { icon: Users,      label: "All Students",     to: "/lma/admin/students" },
        { icon: ListChecks, label: "Enrollments",       to: "/lma/admin/enrollments" },
        { icon: BarChart3,  label: "Course Analytics", to: "/lma/admin/analytics" },
        { icon: ClipboardCheck, label: "Pending Courses", to: "/lma/admin/pending-courses" },
        { icon: Handshake,  label: "Affiliates",       to: "/lma/admin/affiliates" },
      ],
    }] : []),
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F7FA", fontFamily: FF }}>

      {/* Global styles */}
      <style>{`
        html, body { overflow-anchor: none; }
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
          background: rgba(217,53,34,0.08) !important;
          color: rgba(255,255,255,0.85) !important;
        }
        @media (max-width: 640px) {
          .lma-header  { padding: 0 16px !important; gap: 8px !important; }
          .lma-content { padding: 16px !important; }
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
          <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.70)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Academy · Student
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {navSections.map(({ section, items }) => (
            <div key={section}>
              <div style={{
                fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.40)",
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
            <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.40)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 4px 6px" }}>
              SWITCH PORTAL
            </div>
            <Link to="/lma/instructor/dashboard" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 16px", borderRadius: 10, textDecoration: "none",
              background: "linear-gradient(135deg, rgba(217,53,34,0.20) 0%, rgba(217,53,34,0.10) 100%)",
              border: "1px solid rgba(217,53,34,0.35)",
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
          <SideItem icon={Globe} label="Back to Website" to="/training" />
          <SideItem icon={LogOut} label="Logout" danger onClick={logout} />
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="lma-main">

        {/* Header */}
        <header className="lma-header" style={{
          background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "0 28px", height: 64,
          display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button
            type="button"
            onClick={() => setSideOpen(o => !o)}
            className="lma-menu-btn"
            aria-label={sideOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: "#141413",
              minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center",
            }}
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
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            style={{
              background: "none", border: "none", cursor: "pointer", borderRadius: 8, color: "#6b7280",
              minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
          </button>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              ref={bellRef}
              onClick={() => setBellOpen(o => !o)}
              aria-label="Notifications"
              aria-expanded={bellOpen}
              style={{
                background: bellOpen ? "rgba(217,53,34,0.08)" : "none", border: "none", cursor: "pointer",
                borderRadius: 8, color: "#6b7280", position: "relative",
                minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Bell size={20} />
              {bellCount > 0 && (
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  background: GOLD, color: "#fff", fontSize: 9.5, fontWeight: 800,
                  borderRadius: 999, minWidth: 16, height: 16, padding: "0 4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid #fff", lineHeight: 1,
                }}>
                  {bellCount > 9 ? "9+" : bellCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div ref={bellPanelRef} style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0, width: 300,
                background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.16)", overflow: "hidden", zIndex: 300,
              }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)", fontSize: 13, fontWeight: 800, color: "#141413", fontFamily: FF }}>
                  Pending Assignments
                </div>
                {pendingAssignments.length === 0 ? (
                  <div style={{ padding: "24px 16px", textAlign: "center" }}>
                    <CheckCircle2 size={22} color="#d1d5db" style={{ display: "block", margin: "0 auto 8px" }} />
                    <p style={{ margin: 0, fontSize: 12.5, color: "#9ca3af", fontFamily: FF }}>All caught up!</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {pendingAssignments.slice(0, 6).map(a => (
                      <Link
                        key={a.id}
                        to="/lma/student/assignments"
                        onClick={() => setBellOpen(false)}
                        style={{
                          display: "block", padding: "10px 16px", textDecoration: "none",
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "rgba(217,53,34,0.05)")}
                        onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#141413", fontFamily: FF }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(20,20,19,0.5)", marginTop: 2, fontFamily: FF }}>
                          {a.course_title} · due {new Date(a.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <Link
                  to="/lma/student/assignments"
                  onClick={() => setBellOpen(false)}
                  style={{
                    display: "block", textAlign: "center", padding: "10px", fontSize: 12, fontWeight: 700,
                    color: GOLD, textDecoration: "none", borderTop: "1px solid rgba(0,0,0,0.06)", fontFamily: FF,
                  }}
                >
                  View all assignments →
                </Link>
              </div>
            )}
          </div>

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
        {/* overflowAnchor: "none" disables CSS scroll-anchoring on this
            scrollable container — reproduced directly: without it, opening a
            modal (even portaled to document.body) still made the browser
            snap this container's scrollTop to a different position the
            instant new DOM was inserted anywhere on the page. This is the
            standards-track property for exactly that failure mode. */}
        <main className="lma-content" style={{ flex: 1, padding: "28px", overflowY: "auto", overflowAnchor: "none" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
