import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";

const SERVICES = [
  "AI-Powered ERP",
  "DevSecOps Pipelines",
  "Cloud Infrastructure",
  "Software Development",
  "AI Training & Consulting",
  "Quantum Computing",
  "Mobile Application",
  "Web & Mobile Hosting",
  "Software Consulting",
];

const URGENCY = [
  { value: "normal",   label: "Normal — Response within 24 hours" },
  { value: "urgent",   label: "Urgent — Response within 4 hours"  },
  { value: "critical", label: "Critical — Immediate response"      },
];

const CARDS = [
  { emoji: "📧", title: "Email Us",  value: "info@xerxez.com",    href: "mailto:info@xerxez.com", note: "We reply within 24 hours" },
  { emoji: "📞", title: "Call Us",   value: "+971 56 786 7451",    href: "tel:+971567867451",       note: "Mon–Fri, 9am–6pm GST"    },
  { emoji: "📍", title: "Visit Us",  value: "India & UAE",         href: undefined,                 note: "Remote-first company"     },
];

const P   = "#6B3FA0";
const PG  = "linear-gradient(135deg,#6B3FA0 0%,#8B5CF6 100%)";
const PGL = "rgba(107,63,160,0.12)";

interface F { fullName:string; email:string; phone:string; company:string; service:string; urgency:string; subject:string; message:string; }
const EMPTY: F = { fullName:"", email:"", phone:"", company:"", service:"", urgency:"", subject:"", message:"" };
const TRACKED: (keyof F)[] = ["fullName","email","phone","company","service","urgency","subject","message"];

const lbl: React.CSSProperties = {
  display:"block", fontFamily:"'Inter',sans-serif",
  fontSize:13, fontWeight:600, color:"#1A1A1A", marginBottom:7,
};

const SectionBadge = ({ n, label }: { n: string; label: string }) => (
  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
    <div style={{
      width:28, height:28, borderRadius:"50%", background:PG,
      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
    }}>
      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:700, color:"#fff" }}>{n}</span>
    </div>
    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:600, color:"#1A1A1A" }}>
      {label}
    </span>
    <div style={{ flex:1, height:1, background:"#F0F0F0" }} />
  </div>
);

const ContactSection2 = () => {
  const [form, setForm]     = useState<F>(EMPTY);
  const [focused, setFoc]   = useState<string|null>(null);
  const [sending, setSend]  = useState(false);
  const [sent, setSent]     = useState(false);
  const [mounted, setMount] = useState(false);
  const [cardHov, setCardHov] = useState<number|null>(null);

  useEffect(() => { const t = setTimeout(() => setMount(true), 80); return () => clearTimeout(t); }, []);

  const set = useCallback((k: keyof F, v: string) => setForm(p => ({ ...p, [k]: v })), []);

  const filled   = TRACKED.filter(k => form[k].trim() !== "").length;
  const progress = Math.round((filled / TRACKED.length) * 100);
  const chars    = form.message.length;

  const fld = (name: string): React.CSSProperties => ({
    width:"100%", boxSizing:"border-box",
    border:`1.5px solid ${focused===name ? P : "#E5E5E5"}`,
    borderRadius:10, padding:"14px 16px",
    fontFamily:"'Inter',sans-serif", fontSize:14, color:"#1A1A1A",
    background:"#ffffff", outline:"none", display:"block",
    transition:"border-color 0.18s,box-shadow 0.18s",
    boxShadow: focused===name ? `0 0 0 3px ${PGL}` : "none",
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim())  { toast.error("Full name is required."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address."); return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      toast.error("Message must be at least 10 characters."); return;
    }
    setSend(true);
    setTimeout(() => {
      setSend(false); setSent(true); setForm(EMPTY);
      setTimeout(() => setSent(false), 6000);
    }, 1800);
  }, [form]);

  const fo = (name: string) => () => setFoc(name);
  const bl = () => setFoc(null);

  return (
    <section style={{ background:"#F2EFE9", padding:"100px 0 120px" }}>
      <div className="container">

        {/* ── TOP: badge, heading, subtext, progress ── */}
        <div style={{
          textAlign:"center", maxWidth:640, margin:"0 auto 56px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition:"opacity 0.7s ease,transform 0.7s ease",
        }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            border:`1.5px solid ${P}`, borderRadius:9999,
            padding:"6px 18px", marginBottom:22,
            fontFamily:"'Inter',sans-serif", fontSize:11,
            fontWeight:600, letterSpacing:"0.12em",
            textTransform:"uppercase", color:P,
          }}>
            💬 Get In Touch
          </div>

          <h1 style={{
            fontFamily:"'Cormorant Garamond',Garamond,serif",
            fontSize:"clamp(40px,5.5vw,68px)", fontWeight:700,
            color:"#141413", letterSpacing:"-0.025em",
            lineHeight:1.06, marginBottom:16,
          }}>
            Get in Touch
          </h1>

          <p style={{
            fontFamily:"'Inter',sans-serif", fontSize:16,
            color:"#6B6B6B", lineHeight:1.7, marginBottom:32,
          }}>
            Tell us about your project and we'll respond within 24 hours.
          </p>

          {/* Progress bar */}
          <div>
            <div style={{
              display:"flex", justifyContent:"space-between",
              fontFamily:"'Inter',sans-serif", fontSize:12, color:"#999", marginBottom:8,
            }}>
              <span>Form Completion</span>
              <span style={{ fontWeight:600, color: progress===100 ? "#22c55e" : P }}>{progress}%</span>
            </div>
            <div style={{ height:6, background:"#E5E5E5", borderRadius:3, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${progress}%`,
                background: progress===100 ? "linear-gradient(90deg,#22c55e,#4ade80)" : PG,
                borderRadius:3, transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
          </div>
        </div>

        {/* ── 3 CONTACT CARDS ── */}
        <div className="row g-4" style={{ maxWidth:900, margin:"0 auto 56px" }}>
          {CARDS.map((c, i) => (
            <div className="col-12 col-md-4" key={c.title}>
              <div
                onMouseEnter={() => setCardHov(i)}
                onMouseLeave={() => setCardHov(null)}
                style={{
                  background:"#ffffff", borderRadius:16, padding:"28px 24px",
                  borderTop:`4px solid ${P}`, height:"100%",
                  boxShadow: cardHov===i
                    ? "0 16px 48px rgba(107,63,160,0.16),0 4px 16px rgba(107,63,160,0.08)"
                    : "0 2px 16px rgba(0,0,0,0.06)",
                  transform: cardHov===i ? "translateY(-5px)" : "translateY(0)",
                  transition:"all 0.28s cubic-bezier(0.22,1,0.36,1)",
                  cursor: c.href ? "pointer" : "default",
                }}
                onClick={() => c.href && (window.location.href = c.href)}
              >
                <div style={{
                  width:44, height:44, borderRadius:12,
                  background:"rgba(107,63,160,0.1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:16, fontSize:20,
                }}>{c.emoji}</div>
                <div style={{
                  fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600,
                  letterSpacing:"0.1em", textTransform:"uppercase", color:"#999", marginBottom:6,
                }}>{c.title}</div>
                {c.href ? (
                  <a href={c.href} onClick={e => e.stopPropagation()} style={{
                    fontFamily:"'Inter',sans-serif", fontSize:15, fontWeight:600,
                    color:"#141413", textDecoration:"none", display:"block", marginBottom:4,
                  }}>{c.value}</a>
                ) : (
                  <div style={{
                    fontFamily:"'Inter',sans-serif", fontSize:15,
                    fontWeight:600, color:"#141413", marginBottom:4,
                  }}>{c.value}</div>
                )}
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"#999" }}>{c.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FORM CARD ── */}
        <div style={{
          maxWidth:780, margin:"0 auto",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(32px)",
          transition:"opacity 0.8s ease 0.15s,transform 0.8s ease 0.15s",
        }}>
          <div className="xzc-form-card" style={{
            background:"#ffffff", borderRadius:20,
            padding:"44px 48px",
            boxShadow:"0 4px 40px rgba(0,0,0,0.07),0 1px 4px rgba(0,0,0,0.04)",
          }}>

            {/* SUCCESS */}
            {sent && (
              <div style={{
                textAlign:"center", padding:"60px 20px",
                animation:"xzcSuccessIn 0.55s cubic-bezier(0.22,1,0.36,1) both",
              }}>
                <div style={{
                  width:72, height:72, borderRadius:"50%",
                  background:"linear-gradient(135deg,#22c55e,#4ade80)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 24px",
                  boxShadow:"0 8px 32px rgba(34,197,94,0.3)",
                  animation:"xzcCheckPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M7 16.5l6.5 6.5L25 10" stroke="#fff" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ strokeDasharray:30, strokeDashoffset:30, animation:"xzcCheckDraw 0.45s ease 0.55s forwards" }} />
                  </svg>
                </div>
                <h3 style={{
                  fontFamily:"'Cormorant Garamond',serif", fontSize:34,
                  fontWeight:700, color:"#141413", marginBottom:12,
                }}>Message Sent!</h3>
                <p style={{
                  fontFamily:"'Inter',sans-serif", fontSize:15, color:"#6B6B6B",
                  lineHeight:1.7, maxWidth:380, margin:"0 auto",
                }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            )}

            {!sent && (
              <form onSubmit={handleSubmit} noValidate>

                {/* ① Personal Information */}
                <div style={{ marginBottom:36 }}>
                  <SectionBadge n="1" label="Personal Information" />
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={lbl}>Full Name <span style={{ color:"#ef4444" }}>*</span></label>
                      <input type="text" value={form.fullName} placeholder="John Smith"
                        style={fld("fullName")} disabled={sending}
                        onChange={e => set("fullName", e.target.value)}
                        onFocus={fo("fullName")} onBlur={bl} />
                    </div>
                    <div className="col-md-6">
                      <label style={lbl}>Email Address <span style={{ color:"#ef4444" }}>*</span></label>
                      <input type="email" value={form.email} placeholder="john@company.com"
                        style={fld("email")} disabled={sending}
                        onChange={e => set("email", e.target.value)}
                        onFocus={fo("email")} onBlur={bl} />
                    </div>
                    <div className="col-md-6">
                      <label style={lbl}>Phone Number</label>
                      <input type="tel" value={form.phone} placeholder="+971 50 000 0000"
                        style={fld("phone")} disabled={sending}
                        onChange={e => set("phone", e.target.value)}
                        onFocus={fo("phone")} onBlur={bl} />
                    </div>
                    <div className="col-md-6">
                      <label style={lbl}>Company Name</label>
                      <input type="text" value={form.company} placeholder="Acme Corp"
                        style={fld("company")} disabled={sending}
                        onChange={e => set("company", e.target.value)}
                        onFocus={fo("company")} onBlur={bl} />
                    </div>
                  </div>
                </div>

                {/* ② Enquiry Details */}
                <div>
                  <SectionBadge n="2" label="Enquiry Details" />
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={lbl}>Service of Interest</label>
                      <select value={form.service}
                        style={{ ...fld("service"), cursor:"pointer" } as React.CSSProperties}
                        disabled={sending}
                        onChange={e => set("service", e.target.value)}
                        onFocus={fo("service")} onBlur={bl}>
                        <option value="">Select a service…</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label style={lbl}>Urgency Level</label>
                      <select value={form.urgency}
                        style={{ ...fld("urgency"), cursor:"pointer" } as React.CSSProperties}
                        disabled={sending}
                        onChange={e => set("urgency", e.target.value)}
                        onFocus={fo("urgency")} onBlur={bl}>
                        <option value="">Select urgency…</option>
                        {URGENCY.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={lbl}>Subject</label>
                      <input type="text" value={form.subject}
                        placeholder="Brief summary of your enquiry"
                        style={fld("subject")} disabled={sending}
                        onChange={e => set("subject", e.target.value)}
                        onFocus={fo("subject")} onBlur={bl} />
                    </div>
                    <div className="col-12">
                      <label style={lbl}>Message <span style={{ color:"#ef4444" }}>*</span></label>
                      <textarea value={form.message} maxLength={1000} rows={6}
                        placeholder="Tell us about your project, timeline, and goals…"
                        style={{ ...fld("message"), resize:"vertical", minHeight:160 } as React.CSSProperties}
                        disabled={sending}
                        onChange={e => set("message", e.target.value)}
                        onFocus={fo("message")} onBlur={bl} />
                      <div style={{
                        display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:6,
                      }}>
                        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"#bbb" }}>
                          Start typing your message above…
                        </span>
                        <span style={{
                          fontFamily:"'Inter',sans-serif", fontSize:11,
                          color: chars > 900 ? "#ef4444" : "#bbb",
                          fontVariantNumeric:"tabular-nums",
                        }}>
                          {chars} / 1000
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}
                <div style={{ marginTop:32 }}>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    {/* Send button */}
                    <button type="submit" disabled={sending}
                      style={{
                        flex:"1 1 200px", height:56,
                        background: sending ? "rgba(107,63,160,0.55)" : PG,
                        color:"#ffffff",
                        fontFamily:"'Inter',sans-serif", fontSize:15, fontWeight:600,
                        border:"none", borderRadius:12,
                        cursor: sending ? "not-allowed" : "pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                        transition:"all 0.2s ease",
                        boxShadow: sending ? "none" : "0 4px 20px rgba(107,63,160,0.28)",
                      }}
                      onMouseOver={e => {
                        if (!sending) {
                          (e.currentTarget).style.boxShadow = "0 8px 28px rgba(107,63,160,0.38)";
                          (e.currentTarget).style.transform = "translateY(-1px)";
                        }
                      }}
                      onMouseOut={e => {
                        (e.currentTarget).style.boxShadow = sending ? "none" : "0 4px 20px rgba(107,63,160,0.28)";
                        (e.currentTarget).style.transform = "translateY(0)";
                      }}
                    >
                      {sending ? (
                        <>
                          <svg width="18" height="18" viewBox="0 0 18 18"
                            style={{ animation:"xzcSpin 1s linear infinite", display:"block" }}>
                            <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                            <path d="M9 2a7 7 0 0 1 7 7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          Sending Enquiry…
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Cancel button */}
                    <button type="button" onClick={() => setForm(EMPTY)} disabled={sending}
                      style={{
                        flex:"0 0 auto", height:56, padding:"0 24px",
                        background:"transparent", color:"#888",
                        fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500,
                        border:"1.5px solid #E5E5E5", borderRadius:12,
                        cursor: sending ? "not-allowed" : "pointer",
                        transition:"all 0.18s ease", whiteSpace:"nowrap",
                      }}
                      onMouseOver={e => {
                        (e.currentTarget).style.borderColor = "#bbb";
                        (e.currentTarget).style.color = "#555";
                      }}
                      onMouseOut={e => {
                        (e.currentTarget).style.borderColor = "#E5E5E5";
                        (e.currentTarget).style.color = "#888";
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Security badge + urgent line */}
                  <div style={{ marginTop:22, textAlign:"center" }}>
                    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"#aaa", marginBottom:6 }}>
                      🔒 Your information is secure and confidential
                    </div>
                    <a href="tel:+971567867451" style={{
                      fontFamily:"'Inter',sans-serif", fontSize:12,
                      color:P, textDecoration:"none", fontWeight:500,
                    }}>
                      For urgent matters, call us at +971 56 786 7451
                    </a>
                  </div>
                </div>

              </form>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes xzcSuccessIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes xzcCheckPop  { from{transform:scale(0.3);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes xzcCheckDraw { from{stroke-dashoffset:30} to{stroke-dashoffset:0} }
        @keyframes xzcSpin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width:575px) { .xzc-form-card { padding:28px 20px !important; } }
      `}</style>
    </section>
  );
};

export default ContactSection2;
