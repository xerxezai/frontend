// PartnerCoursesAdmin.tsx
// Purpose: is_staff-only admin page for managing external "Partner Courses"
//          (Linux Foundation, Coursera, Udemy, …) shown on the public
//          Training page. Route: /admin/partner-courses.
// Auth: reachable from either the ERP admin sidebar or the LMA instructor
//       dashboard's ADMIN section, so it accepts EITHER session:
//       - ERP: auth_tokens JWT, decoded client-side for is_staff/is_superuser
//         (falls back to the xerxez_role check, same as ERPPage.tsx/ERPLayout.tsx).
//       - LMA: lma_token, checked against GET /lma/profile/'s live
//         is_staff/is_superuser fields (the token itself carries no such
//         claims — same backend issue as the ERP token, see below).
//       Both tokens are plain SimpleJWT tokens for the same underlying user
//       table, so whichever one is present also works as the Authorization
//       header for this page's own /partner-courses/admin/ API calls — real
//       enforcement happens server-side either way (IsStaffUser permission
//       in apps.partner_courses).

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Link2, ShieldAlert, Plus, Edit3, Trash2, X, Save, Check, Upload } from "lucide-react";
import { V2_API_BASE as API } from "../../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const DARK = "#071a33";
const FF = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06)";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

interface PartnerCourseRow {
  id: number;
  partner_name: string; partner_logo: string | null; partner_website: string;
  title: string; description: string; category: string; level: string;
  duration: string; price: string; thumbnail: string | null;
  affiliate_link: string; affiliate_code: string;
  is_active: boolean; is_featured: boolean; order: number; created_at: string;
}

const EMPTY_FORM = {
  partner_name: "", partner_website: "", title: "", description: "",
  category: "", level: "Beginner", duration: "", price: "",
  affiliate_link: "", affiliate_code: "", is_active: true, is_featured: false, order: "0",
};

// Same check as ERPLayout.tsx's isAdminUser() / ERPPage.tsx's login handler.
// The JWT this backend issues never actually embeds is_staff/is_superuser
// claims (apps.authentication.views.LoginView uses a plain
// RefreshToken.for_user() with no custom get_token() override), so the
// decode below realistically always misses — the xerxez_role fallback is
// what actually determines admin access for an already-logged-in ERP session.
function checkErpAdmin(): boolean {
  try {
    const tokens = localStorage.getItem("auth_tokens");
    if (tokens) {
      const access = JSON.parse(tokens).access;
      const payload = JSON.parse(atob(access.split(".")[1]));
      if (payload.is_staff === true || payload.is_superuser === true) return true;
    }
  } catch { /* malformed token — fall through to the role check */ }
  const role = localStorage.getItem("xerxez_role") || "";
  return role === "admin" || role === "super_admin" || role === "superuser";
}

// LMA side: lma_role in localStorage is just the selected login role
// ("student"/"instructor"/"affiliate"), never an admin indicator, and the
// lma_token itself carries no is_staff claim either — the only reliable
// source is a live check against GET /lma/profile/, same as
// LMAInstructorDashboard.tsx's isStaffOrSuperuser check.
async function checkLmaAdmin(api: string): Promise<boolean> {
  const lmaToken = localStorage.getItem("lma_token");
  if (!lmaToken) return false;
  try {
    const r = await fetch(`${api}/lma/profile/`, { headers: { Authorization: `Bearer ${lmaToken}` } });
    if (!r.ok) return false;
    const d = await r.json();
    return !!d.is_staff || !!d.is_superuser;
  } catch {
    return false;
  }
}

// Whichever admin session is present also doubles as the Authorization
// token for this page's own API calls — both are plain SimpleJWT tokens
// for the same user table, so either works against any IsAuthenticated/
// IsStaffUser-gated endpoint. Prefer the ERP token since that's this page's
// primary audience; fall back to the LMA token when only that's present.
function resolveAdminToken(): string {
  try {
    const erp = JSON.parse(localStorage.getItem("auth_tokens") || "{}").access;
    if (erp) return erp;
  } catch { /* ignore */ }
  return localStorage.getItem("lma_token") ?? "";
}


const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8,
  border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: FF, outline: "none",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 5, fontFamily: FF }}>{label}</label>
      {children}
    </div>
  );
}

export default function PartnerCoursesAdmin() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    // ERP check is synchronous; only fall back to the LMA network check if
    // the ERP side didn't already grant access, so an ERP-only admin never
    // waits on an LMA profile fetch that will 401 anyway.
    if (checkErpAdmin()) { setIsStaff(true); setAuthChecked(true); return; }
    checkLmaAdmin(API).then(lmaOk => { setIsStaff(lmaOk); setAuthChecked(true); });
  }, []);

  const token = resolveAdminToken();

  const [rows, setRows] = useState<PartnerCourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<PartnerCourseRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API}/partner-courses/admin/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : []))
      .then(d => setRows(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { if (isStaff) load(); }, [isStaff, load]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); }, [toast]);

  const set = (k: keyof typeof EMPTY_FORM, v: string | boolean) => setForm(f => ({ ...f, [k]: v as never }));

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setLogoFile(null); setThumbFile(null); setShowForm(true); };
  const openEdit = (row: PartnerCourseRow) => {
    setEditing(row);
    setForm({
      partner_name: row.partner_name, partner_website: row.partner_website,
      title: row.title, description: row.description, category: row.category, level: row.level,
      duration: row.duration, price: row.price,
      affiliate_link: row.affiliate_link, affiliate_code: row.affiliate_code,
      is_active: row.is_active, is_featured: row.is_featured, order: String(row.order),
    });
    setLogoFile(null); setThumbFile(null);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.partner_name.trim() || !form.partner_website.trim() || !form.title.trim() || !form.affiliate_link.trim()) {
      setToast({ msg: "Partner name, website, title, and affiliate link are required.", type: "error" }); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (logoFile) fd.append("partner_logo", logoFile);
      if (thumbFile) fd.append("thumbnail", thumbFile);

      const url = editing ? `${API}/partner-courses/admin/${editing.id}/` : `${API}/partner-courses/admin/create/`;
      const r = await fetch(url, { method: editing ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setToast({ msg: Object.values(d).flat().join(" ") || "Save failed", type: "error" }); return; }
      setToast({ msg: editing ? "Course updated." : "Course added.", type: "success" });
      setShowForm(false);
      load();
    } catch { setToast({ msg: "Network error", type: "error" }); } finally { setSaving(false); }
  };

  const remove = async (row: PartnerCourseRow) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    try {
      const r = await fetch(`${API}/partner-courses/admin/${row.id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok && r.status !== 204) { setToast({ msg: "Delete failed", type: "error" }); return; }
      setRows(prev => prev.filter(x => x.id !== row.id));
      setToast({ msg: "Course deleted.", type: "success" });
    } catch { setToast({ msg: "Network error", type: "error" }); }
  };

  const toggleField = async (row: PartnerCourseRow, field: "is_active" | "is_featured") => {
    try {
      const fd = new FormData();
      fd.append(field, String(!row[field]));
      const r = await fetch(`${API}/partner-courses/admin/${row.id}/`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const d = await r.json();
      if (r.ok) setRows(prev => prev.map(x => (x.id === row.id ? { ...x, [field]: d[field] } : x)));
    } catch { /* ignore */ }
  };

  if (!authChecked) return null;

  if (!isStaff) {
    return (
      <div style={{ minHeight: "100vh", background: "#F4F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FF, padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 36px", textAlign: "center", maxWidth: 420, border: "1px solid rgba(0,0,0,0.07)" }}>
          <ShieldAlert size={36} color="#dc2626" style={{ marginBottom: 14 }} />
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 8px" }}>Admin access required</h2>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 20px" }}>Log in with a staff account to manage partner courses.</p>
          <Link to="/erp" style={{ display: "inline-block", background: GOLD, color: "#fff", borderRadius: 10, padding: "10px 22px", fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const backBtnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb",
    borderRadius: 8, padding: "6px 12px", fontSize: 12.5, fontWeight: 600,
    cursor: "pointer", fontFamily: FF, textDecoration: "none",
  };

  // Which portal the admin actually came from — show only that one button.
  // ERP takes priority if somehow both sessions are active, matching
  // resolveAdminToken()'s own preference order.
  const hasErpToken = !!localStorage.getItem("auth_tokens");
  const hasLmaToken = !!localStorage.getItem("lma_token");
  const backTo = hasErpToken
    ? { to: "/erp/dashboard", label: "← Back to ERP Dashboard" }
    : hasLmaToken
      ? { to: "/lma/instructor/dashboard", label: "← Back to Instructor Dashboard" }
      : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FA", fontFamily: FF }}>
      {backTo && (
        <div style={{ padding: "12px 28px" }}>
          <Link to={backTo.to} style={backBtnStyle}>{backTo.label}</Link>
        </div>
      )}
      <header style={{ background: DARK, padding: "18px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(217,53,34,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Link2 size={17} color={GOLD} />
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Partner Courses</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11.5 }}>External courses shown on the Training page</div>
        </div>
        <button type="button" onClick={openCreate} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: GOLD, color: "#fff", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>
          <Plus size={14} /> Add Course
        </button>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Partner", "Course Title", "Category", "Active", "Featured", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No partner courses yet — add your first one.</td></tr>
              ) : (
                rows.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: "#141413" }}>{r.partner_name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#374151", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{r.category}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button type="button" onClick={() => toggleField(r, "is_active")} style={{ width: 40, height: 22, borderRadius: 999, border: "none", cursor: "pointer", background: r.is_active ? "#10b981" : "#d1d5db", position: "relative", transition: "background 0.15s" }}>
                        <span style={{ position: "absolute", top: 2, left: r.is_active ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.15s" }} />
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button type="button" onClick={() => toggleField(r, "is_featured")} style={{ width: 40, height: 22, borderRadius: 999, border: "none", cursor: "pointer", background: r.is_featured ? GOLD : "#d1d5db", position: "relative", transition: "background 0.15s" }}>
                        <span style={{ position: "absolute", top: 2, left: r.is_featured ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.15s" }} />
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" onClick={() => openEdit(r)} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(217,53,34,0.10)", color: GOLD, border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>
                          <Edit3 size={12} /> Edit
                        </button>
                        <button type="button" onClick={() => remove(r)} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "flex-end" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 480, height: "100vh", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: 0 }}>{editing ? "Edit Partner Course" : "Add Partner Course"}</h3>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
              <Field label="Partner Name *">
                <input style={inputStyle} value={form.partner_name} onChange={e => set("partner_name", e.target.value)} />
              </Field>
              <Field label="Partner Website *">
                <input style={inputStyle} value={form.partner_website} onChange={e => set("partner_website", e.target.value)} />
              </Field>
              <Field label="Partner Logo">
                <label style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px dashed #e5e7eb", borderRadius: 8, padding: "9px 12px", cursor: "pointer", fontSize: 12.5, color: "#6b7280" }}>
                  <Upload size={14} /> {logoFile ? logoFile.name : "Choose file…"}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setLogoFile(e.target.files?.[0] ?? null)} />
                </label>
              </Field>

              <Field label="Course Title *">
                <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} />
              </Field>
              <Field label="Description">
                <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Category">
                  <input style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)} />
                </Field>
                <Field label="Level">
                  <select style={inputStyle} value={form.level} onChange={e => set("level", e.target.value)}>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Duration">
                  <input style={inputStyle} value={form.duration} onChange={e => set("duration", e.target.value)} />
                </Field>
                <Field label="Price">
                  <input style={inputStyle} value={form.price} onChange={e => set("price", e.target.value)} />
                </Field>
              </div>
              <Field label="Thumbnail">
                <label style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px dashed #e5e7eb", borderRadius: 8, padding: "9px 12px", cursor: "pointer", fontSize: 12.5, color: "#6b7280" }}>
                  <Upload size={14} /> {thumbFile ? thumbFile.name : "Choose file…"}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setThumbFile(e.target.files?.[0] ?? null)} />
                </label>
              </Field>

              <Field label="Affiliate Link * — full URL with affiliate code">
                <input style={inputStyle} value={form.affiliate_link} onChange={e => set("affiliate_link", e.target.value)} />
              </Field>
              <Field label="Affiliate Code">
                <input style={inputStyle} value={form.affiliate_code} onChange={e => set("affiliate_code", e.target.value)} />
              </Field>
              <Field label="Order">
                <input type="number" style={inputStyle} value={form.order} onChange={e => set("order", e.target.value)} />
              </Field>

              <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#374151", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} /> Active
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#374151", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} /> Featured
                </label>
              </div>
            </div>

            <div style={{ padding: "14px 24px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#6b7280" }}>Cancel</button>
              <button type="button" onClick={save} disabled={saving} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 10, border: "none", background: GOLD, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                <Save size={14} /> {saving ? "Saving…" : editing ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 900, background: toast.type === "success" ? "#059669" : "#dc2626", color: "#fff", padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: "0 10px 30px rgba(0,0,0,0.20)", display: "flex", alignItems: "center", gap: 8 }}>
          {toast.type === "success" ? <Check size={15} /> : <ShieldAlert size={15} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
