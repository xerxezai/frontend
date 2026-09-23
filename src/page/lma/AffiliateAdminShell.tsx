import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Handshake, LogOut, ChevronLeft } from "lucide-react";
import { clearLmaSession } from "../../utils/lmaAuth";

const GOLD = "#D93522";
const DARK = "#071a33";
const FF = "'DM Sans', sans-serif";

const NAV_ITEMS = [
  { label: "All Affiliates", to: "/lma/admin/affiliates" },
  { label: "Affiliate Commissions", to: "/lma/admin/affiliate-commissions" },
];

// Shared chrome for the /lma/admin/affiliates and /lma/admin/affiliate-commissions
// pages. These are reached from three places — the affiliate dashboard's own
// ADMIN links, and the ADMIN sections of LMAStudentLayout/LMAInstructorDashboard
// — but they're affiliate-domain admin pages, not student/instructor content,
// so they always render inside this shell (matching AffiliateDashboard.tsx's
// look) instead of whichever dashboard the admin happened to click in from.
export default function AffiliateAdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => { clearLmaSession(); navigate("/lma/login"); };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FA", fontFamily: FF }}>
      <header style={{ background: DARK, padding: "16px 28px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button type="button" onClick={() => navigate("/lma/affiliate/dashboard")} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>
          <ChevronLeft size={13} /> Affiliate Dashboard
        </button>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(217,53,34,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Handshake size={16} color={GOLD} />
        </div>
        <div style={{ color: "#fff", fontSize: 14, fontWeight: 800, marginRight: 4, whiteSpace: "nowrap" }}>Affiliate Admin</div>
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.to;
            return (
              <button key={item.to} type="button" onClick={() => navigate(item.to)} style={{
                padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: FF, whiteSpace: "nowrap",
                background: active ? GOLD : "rgba(255,255,255,0.08)",
                color: active ? "#fff" : "rgba(255,255,255,0.8)",
              }}>{item.label}</button>
            );
          })}
        </nav>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>
          <LogOut size={13} /> Logout
        </button>
      </header>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 60px" }}>
        {children}
      </div>
    </div>
  );
}
