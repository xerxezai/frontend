import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Eye, EyeOff } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

interface Profile {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  date_joined: string;
  bio: string;
}

/* ── Card3D ── */
const Card3D = ({ children, accent = GOLD, style = {}, p = "24px" }: {
  children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
    el.style.transition = "transform 0.08s ease";
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) { el.style.transform = "translateY(0)"; el.style.transition = "transform 0.32s cubic-bezier(0.22,1,0.36,1)"; }
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={() => setH(true)} onMouseOut={() => setH(false)}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)",
        borderTop: `3px solid ${accent}`,
        boxShadow: h ? BHOV : BCARD,
        transition: "box-shadow 0.28s ease",
        padding: p, position: "relative", willChange: "transform",
        ...style,
      }}>
      {children}
    </div>
  );
};

/* ── Toast ── */
const Toast = ({ msg, type, onDone }: { msg: string; type: "success" | "error"; onDone: () => void }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 2000,
      background: type === "success" ? "#059669" : "#dc2626",
      color: "#fff", padding: "12px 20px",
      borderRadius: 12, fontSize: 13.5, fontWeight: 600, fontFamily: FF,
      boxShadow: `0 8px 32px ${type === "success" ? "rgba(5,150,105,0.25)" : "rgba(220,38,38,0.25)"}`,
      animation: "lmaPage-in 0.28s ease both",
    }}>
      {msg}
    </div>
  );
};

/* ── Field ── */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(20,20,19,0.55)", marginBottom: 6, fontFamily: FF, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid rgba(0,0,0,0.10)", fontSize: 14, fontFamily: FF,
  outline: "none", color: "#141413", background: "#fff",
  boxSizing: "border-box", transition: "border-color 0.18s ease",
};

/* ── Password strength ── */
const pwStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { score: 0, label: "", color: "#e5e7eb" },
    { score: 1, label: "Weak", color: "#ef4444" },
    { score: 2, label: "Fair", color: "#f59e0b" },
    { score: 3, label: "Good", color: "#3b82f6" },
    { score: 4, label: "Strong", color: "#10b981" },
  ];
  return map[score] ?? map[0];
};

/* ── Initials ── */
const avatarInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function LMAProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Password
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pwError, setPwError] = useState("");

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/profile/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((d: Profile) => {
        setProfile(d);
        setName(d.name ?? "");
        setEmail(d.email ?? "");
        setPhone(d.phone ?? "");
        setBio(d.bio ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleSave = async () => {
    setSaving(true); setSaveError("");
    try {
      const res = await fetch(`${API}/lma/profile/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, bio }),
      });
      if (!res.ok) throw new Error("Save failed");
      // Update localStorage name
      localStorage.setItem("lma_name", name);
      setToast({ msg: "Profile saved.", type: "success" });
    } catch {
      setSaveError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (!curPw || !newPw || !confPw) { setPwError("All fields required."); return; }
    if (newPw !== confPw) { setPwError("New passwords do not match."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    setChangingPw(true);
    try {
      const res = await fetch(`${API}/lma/profile/change-password/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: curPw, new_password: newPw }),
      });
      if (!res.ok) throw new Error("Failed");
      setCurPw(""); setNewPw(""); setConfPw("");
      setToast({ msg: "Password changed successfully.", type: "success" });
    } catch {
      setPwError("Failed to change password. Check your current password.");
    } finally {
      setChangingPw(false);
    }
  };

  const pwStr = pwStrength(newPw);
  const initials = profile ? avatarInitials(profile.name || `${profile.first_name} ${profile.last_name}`) : "S";

  return (
    <LMAStudentLayout>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: "0 0 24px", fontFamily: FF }}>
          My Profile
        </h2>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "start" }} className="lma-profile-grid">
            {[0, 1].map(i => (
              <div key={i} style={{ height: 280, borderRadius: 16, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "start" }} className="lma-profile-grid">

            {/* ── Avatar column ── */}
            <Card3D accent={GOLD} p="24px" style={{ textAlign: "center" }}>
              {/* Avatar circle */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 28, fontWeight: 900, color: "#0a0806", fontFamily: FF,
                boxShadow: "0 4px 16px rgba(201,136,58,0.30)",
              }}>
                {initials}
              </div>

              <div style={{ fontSize: 15, fontWeight: 800, color: "#141413", marginBottom: 4, fontFamily: FF }}>
                {profile?.name || `${profile?.first_name} ${profile?.last_name}`}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12, fontFamily: FF }}>
                @{profile?.username}
              </div>

              {/* Role badge */}
              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.12)", padding: "4px 12px", borderRadius: 999, marginBottom: 14 }}>
                {profile?.role ?? "Student"}
              </span>

              <div style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", fontFamily: FF }}>
                Member since<br />
                <strong style={{ color: "#141413" }}>
                  {profile?.date_joined
                    ? new Date(profile.date_joined).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                    : "—"}
                </strong>
              </div>
            </Card3D>

            {/* ── Form column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Profile info card */}
              <Card3D accent={GOLD} p="24px">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
                  Personal Information
                </h3>

                <Field label="Full Name">
                  <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="Your full name" />
                </Field>
                <Field label="Email">
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle} placeholder="your@email.com" />
                </Field>
                <Field label="Phone">
                  <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="+91 XXXXX XXXXX" />
                </Field>
                <Field label="Bio">
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Tell us about yourself…"
                  />
                </Field>

                {/* Read-only: username */}
                <Field label="Username">
                  <input value={profile?.username ?? ""} readOnly style={{ ...inputStyle, background: "#f9f8f6", color: "#9ca3af", cursor: "not-allowed" }} />
                </Field>

                {saveError && (
                  <p style={{ color: "#dc2626", fontSize: 13, margin: "0 0 12px", fontFamily: FF }}>{saveError}</p>
                )}

                <button type="button" onClick={handleSave} disabled={saving} style={{
                  padding: "10px 24px", borderRadius: 10, border: "none",
                  background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                  color: "#0a0806", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: FF,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  opacity: saving ? 0.75 : 1, transition: "opacity 0.18s ease",
                  boxShadow: "0 4px 0 rgba(140,80,20,0.25)",
                }}>
                  {saving ? <><Loader size={14} style={{ animation: "lma-spin 1s linear infinite" }} /> Saving…</> : "Save Profile"}
                </button>
              </Card3D>

              {/* Change password card */}
              <Card3D accent="#8b5cf6" p="24px">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
                  Change Password
                </h3>

                <Field label="Current Password">
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCur ? "text" : "password"}
                      value={curPw}
                      onChange={e => setCurPw(e.target.value)}
                      style={{ ...inputStyle, paddingRight: 40 }}
                      placeholder="Enter current password"
                    />
                    <button type="button" onClick={() => setShowCur(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                      {showCur ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                <Field label="New Password">
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      style={{ ...inputStyle, paddingRight: 40 }}
                      placeholder="At least 8 characters"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {newPw && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map(s => (
                          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= pwStr.score ? pwStr.color : "#e5e7eb", transition: "background 0.3s ease" }} />
                        ))}
                      </div>
                      {pwStr.label && <span style={{ fontSize: 11, fontWeight: 700, color: pwStr.color }}>{pwStr.label}</span>}
                    </div>
                  )}
                </Field>

                <Field label="Confirm New Password">
                  <input
                    type="password"
                    value={confPw}
                    onChange={e => setConfPw(e.target.value)}
                    style={{ ...inputStyle, borderColor: confPw && confPw !== newPw ? "#ef4444" : undefined }}
                    placeholder="Repeat new password"
                  />
                  {confPw && confPw !== newPw && (
                    <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: FF }}>Passwords do not match</p>
                  )}
                </Field>

                {pwError && (
                  <p style={{ color: "#dc2626", fontSize: 13, margin: "0 0 12px", fontFamily: FF }}>{pwError}</p>
                )}

                <button type="button" onClick={handleChangePassword} disabled={changingPw} style={{
                  padding: "10px 24px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                  color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: FF,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  opacity: changingPw ? 0.75 : 1, transition: "opacity 0.18s ease",
                  boxShadow: "0 4px 0 rgba(109,40,217,0.25)",
                }}>
                  {changingPw ? <><Loader size={14} style={{ animation: "lma-spin 1s linear infinite" }} /> Changing…</> : "Change Password"}
                </button>
              </Card3D>
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .lma-profile-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </LMAStudentLayout>
  );
}
