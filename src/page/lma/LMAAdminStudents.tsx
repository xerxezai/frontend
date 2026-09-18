import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, Users, ShieldAlert, Eye, Pencil, Trash2, Plus, X } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF   = "'DM Sans', sans-serif";

type Role = "student" | "instructor" | "admin";
type AccountType = "student" | "student_admin";

interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  is_staff: boolean;
  courses_enrolled: number;
  join_date: string;
  status: "active" | "inactive";
}

const inputStyle: React.CSSProperties = {
  border: "1.5px solid rgba(0,0,0,0.10)", borderRadius: 9, padding: "8px 12px",
  fontSize: 13, fontFamily: FF, outline: "none", color: "#141413", boxSizing: "border-box", width: "100%",
};
const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = GOLD);
const blurGold  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.10)");

const ROLE_COLOR: Record<Role, string> = { student: "#3b82f6", instructor: "#8b5cf6", admin: GOLD };

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      </td>
    ))}
  </tr>
);

/* ── Modal shell — rendered via a portal straight into document.body.
   IMPORTANT: without the portal, this fixed-position overlay still lives
   inside LMAStudentLayout's scrollable <main>; inserting/removing it there
   triggers the browser's CSS scroll-anchoring heuristics, which measurably
   snap window.scrollY to a different position the instant the modal mounts
   (reproduced directly: scrollY jumped 400 -> 84 on open). Portaling to
   document.body takes the modal out of that scrollable ancestor entirely,
   so opening/closing it can never move the page's scroll position. ── */
const Modal = ({ title, onClose, children, width = 420 }: { title: string; onClose: () => void; children: React.ReactNode; width?: number }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Move focus into the modal as soon as it mounts. This is both correct
  // modal accessibility (focus should enter the dialog) and the actual fix
  // for the scroll jump reported here: the row button that opened the modal
  // keeps DOM focus by default, and once the modal's fixed overlay covers
  // it, the browser's native "keep the focused element visible" behavior
  // scrolls the page trying to bring that now-hidden button back into view.
  // Moving focus onto something inside the modal (which is always visible)
  // stops that entirely — reproduced directly: a synthetic click that never
  // touches focus causes zero scroll change, only real mouse clicks did.
  useEffect(() => { closeBtnRef.current?.focus(); }, []);

  return createPortal(
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.30)", fontFamily: FF }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: 0, fontFamily: FF }}>{title}</h3>
          <button ref={closeBtnRef} type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, display: "flex" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, fontFamily: FF }}>{label}</label>
    {children}
  </div>
);

export default function LMAAdminStudents() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const [viewing, setViewing] = useState<AdminUserRow | null>(null);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [deleting, setDeleting] = useState<AdminUserRow | null>(null);
  const [creating, setCreating] = useState(false);

  // Student-only, per the page's purpose — real Django/site superusers and
  // instructors are excluded server-side (see admin_users' ?role=student
  // handling). is_staff=True students ("student dashboard admins") DO still
  // show up here; that's a distinct concept from is_superuser.
  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true);
    setForbidden(false);
    fetch(`${API}/lma/admin/users/?role=student`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 403) { setForbidden(true); return []; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: AdminUserRow[]) => setRows(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); }, [toast]);

  const filtered = useMemo(() => rows.filter(r => {
    const q = search.trim().toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  }), [rows, search]);

  if (forbidden) {
    return (
      <LMAStudentLayout>
        <div style={{ background: "#fff", borderRadius: 16, padding: "64px 24px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <ShieldAlert size={40} color="#dc2626" style={{ display: "block", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Access denied</h3>
          <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>This page is only available to admins.</p>
        </div>
      </LMAStudentLayout>
    );
  }

  return (
    <LMAStudentLayout>
      <div style={{ fontFamily: FF }}>
        {toast && (
          <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 900, background: "#059669", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, fontFamily: FF, boxShadow: "0 8px 32px rgba(5,150,105,0.25)" }}>
            {toast}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>All Students</h2>
            <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.45)", margin: "4px 0 0", fontFamily: FF }}>Every student — including those with no enrollments yet. Instructors and site admins aren't shown here.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Search size={13} color="#9ca3af" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name or email…"
                style={{ ...inputStyle, width: 210, paddingLeft: 30 }}
                onFocus={focusGold} onBlur={blurGold}
              />
            </div>
            <button
              type="button"
              onClick={() => setCreating(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD, color: "#fff", fontSize: 13, fontWeight: 700,
                border: "none", borderRadius: 9, padding: "9px 16px", cursor: "pointer",
                boxShadow: "0 4px 0 rgba(139,31,23,0.30)", fontFamily: FF, whiteSpace: "nowrap",
              }}
            >
              <Plus size={15} /> Create Account
            </button>
          </div>
        </div>

        {!loading && (
          <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.42)", marginBottom: 10 }}>
            {filtered.length === rows.length ? `${rows.length} student${rows.length !== 1 ? "s" : ""}` : `${filtered.length} of ${rows.length} showing`}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Email", "Role", "Courses Enrolled", "Join Date", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "56px 16px", textAlign: "center" }}>
                    <Users size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>
                      {search ? "No students match your search." : "No students yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#141413", whiteSpace: "nowrap" }}>{r.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "rgba(20,20,19,0.55)", whiteSpace: "nowrap" }}>{r.email}</td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
                        background: r.is_staff ? `${GOLD}18` : `${ROLE_COLOR.student}18`,
                        color: r.is_staff ? GOLD : ROLE_COLOR.student,
                      }}>
                        {r.is_staff ? "Student Admin" : "Student"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: "#141413", whiteSpace: "nowrap" }}>{r.courses_enrolled}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "rgba(20,20,19,0.55)", whiteSpace: "nowrap" }}>
                      {new Date(r.join_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase",
                        background: r.status === "active" ? "rgba(5,150,105,0.10)" : "rgba(107,114,128,0.12)",
                        color: r.status === "active" ? "#059669" : "#6b7280",
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button type="button" onClick={() => setViewing(r)} aria-label={`View ${r.name}`} title="View"
                          style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", border: "none", borderRadius: 7, cursor: "pointer", color: "#6b7280" }}>
                          <Eye size={14} />
                        </button>
                        <button type="button" onClick={() => setEditing(r)} aria-label={`Edit ${r.name}`} title="Edit"
                          style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(217,53,34,0.10)", border: "none", borderRadius: 7, cursor: "pointer", color: GOLD }}>
                          <Pencil size={13} />
                        </button>
                        <button type="button" onClick={() => setDeleting(r)} aria-label={`Delete ${r.name}`} title="Delete"
                          style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(220,38,38,0.08)", border: "none", borderRadius: 7, cursor: "pointer", color: "#dc2626" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── View modal ── */}
        {viewing && (
          <Modal title="Student Details" onClose={() => setViewing(null)}>
            {[
              ["Name", viewing.name],
              ["Email", viewing.email],
              ["Role", viewing.is_staff ? "Student Admin" : "Student"],
              ["Courses Enrolled", String(viewing.courses_enrolled)],
              ["Join Date", new Date(viewing.join_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })],
              ["Status", viewing.status],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: 12.5, color: "#9ca3af", fontFamily: FF }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>{value}</span>
              </div>
            ))}
          </Modal>
        )}

        {/* ── Edit modal ── */}
        {editing && (
          <EditUserModal
            token={token}
            user={editing}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); setToast("Student updated"); load(); }}
          />
        )}

        {/* ── Delete confirmation ── */}
        {deleting && (
          <Modal title="Delete Student" onClose={() => setDeleting(null)} width={380}>
            <p style={{ fontSize: 13.5, color: "#374151", margin: "0 0 20px", lineHeight: 1.6, fontFamily: FF }}>
              Are you sure you want to delete <strong>{deleting.name}</strong> ({deleting.email})? This cannot be undone.
            </p>
            <DeleteConfirmActions
              token={token}
              userId={deleting.id}
              onClose={() => setDeleting(null)}
              onDeleted={() => { setDeleting(null); setToast("Student deleted"); load(); }}
            />
          </Modal>
        )}

        {/* ── Create account modal — student accounts only ── */}
        {creating && (
          <CreateUserModal
            token={token}
            onClose={() => setCreating(false)}
            onCreated={() => { setCreating(false); setToast("Account created"); load(); }}
          />
        )}
      </div>
    </LMAStudentLayout>
  );
}

/* ── Edit modal body ── */
function EditUserModal({ token, user, onClose, onSaved }: {
  token: string; user: AdminUserRow; onClose: () => void; onSaved: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [accountType, setAccountType] = useState<AccountType>(user.is_staff ? "student_admin" : "student");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const r = await fetch(`${API}/lma/admin/users/${user.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, account_type: accountType }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Could not update user."); return; }
      onSaved();
    } catch { setError("Network error. Please try again."); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Edit Student" onClose={onClose}>
      <form onSubmit={submit} autoComplete="off">
        <Field label="Full Name">
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} autoComplete="off" onFocus={focusGold} onBlur={blurGold} required />
        </Field>
        <Field label="Email">
          <input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" onFocus={focusGold} onBlur={blurGold} required />
        </Field>
        <Field label="Account Type">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={accountType} onChange={e => setAccountType(e.target.value as AccountType)} onFocus={focusGold} onBlur={blurGold}>
            <option value="student">Student</option>
            <option value="student_admin">Student Admin</option>
          </select>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0", fontFamily: FF }}>
            {accountType === "student_admin"
              ? "Admin of the student dashboard only — no instructor, ERP or Partner Portal access."
              : "Regular student — student dashboard access only."}
          </p>
        </Field>
        {error && <p style={{ color: "#dc2626", fontSize: 12.5, margin: "0 0 12px", fontFamily: FF }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 10, padding: 12, cursor: "pointer", fontFamily: FF }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} style={{ flex: 2, fontSize: 13, fontWeight: 700, color: "#fff", background: GOLD, border: "none", borderRadius: 10, padding: 12, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: FF, boxShadow: "0 4px 0 rgba(139,31,23,0.30)" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ── Delete confirmation actions ── */
function DeleteConfirmActions({ token, userId, onClose, onDeleted }: {
  token: string; userId: number; onClose: () => void; onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setDeleting(true); setError("");
    try {
      const r = await fetch(`${API}/lma/admin/users/${userId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Could not delete user."); return; }
      onDeleted();
    } catch { setError("Network error. Please try again."); }
    finally { setDeleting(false); }
  };

  return (
    <>
      {error && <p style={{ color: "#dc2626", fontSize: 12.5, margin: "0 0 12px", fontFamily: FF }}>{error}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 10, padding: 12, cursor: "pointer", fontFamily: FF }}>
          Cancel
        </button>
        <button type="button" onClick={confirm} disabled={deleting} style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#fff", background: "#dc2626", border: "none", borderRadius: 10, padding: 12, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1, fontFamily: FF }}>
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </>
  );
}

/* ── Create account modal — Student accounts only, two flavors. The backend
   (POST /lma/admin/users/create/) hardcodes role=student and never sets
   is_superuser regardless of what's sent, so a created account can only ever
   reach the student dashboard — never instructor, never ERP, never Partner
   Portal — no matter which Account Type is picked below. ── */
function CreateUserModal({ token, onClose, onCreated }: {
  token: string; onClose: () => void; onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("student");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setSaving(true); setError("");
    try {
      const r = await fetch(`${API}/lma/admin/users/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, password, account_type: accountType }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Could not create account."); return; }
      onCreated();
    } catch { setError("Network error. Please try again."); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Create Account" onClose={onClose}>
      {/* autoComplete="off" on the form + explicit off/new-password per field
          stops the browser from offering to autofill the logged-in admin's
          own saved credentials into this (different person's) account form. */}
      <form onSubmit={submit} autoComplete="off">
        <Field label="Full Name">
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma" autoComplete="off" onFocus={focusGold} onBlur={blurGold} required />
        </Field>
        <Field label="Email">
          <input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="priya@example.com" autoComplete="off" onFocus={focusGold} onBlur={blurGold} required />
        </Field>
        <Field label="Password">
          <input type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" autoComplete="new-password" onFocus={focusGold} onBlur={blurGold} required />
        </Field>
        <Field label="Account Type">
          <select style={{ ...inputStyle, cursor: "pointer" }} value={accountType} onChange={e => setAccountType(e.target.value as AccountType)} onFocus={focusGold} onBlur={blurGold}>
            <option value="student">Student</option>
            <option value="student_admin">Student Admin</option>
          </select>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0", fontFamily: FF }}>
            {accountType === "student_admin"
              ? "Admin of the student dashboard only — no instructor, ERP or Partner Portal access."
              : "Regular student — student dashboard access only."}
          </p>
        </Field>
        {error && <p style={{ color: "#dc2626", fontSize: 12.5, margin: "0 0 12px", fontFamily: FF }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 10, padding: 12, cursor: "pointer", fontFamily: FF }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} style={{ flex: 2, fontSize: 13, fontWeight: 700, color: "#fff", background: GOLD, border: "none", borderRadius: 10, padding: 12, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: FF, boxShadow: "0 4px 0 rgba(139,31,23,0.30)" }}>
            {saving ? "Creating…" : "Create Account"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
