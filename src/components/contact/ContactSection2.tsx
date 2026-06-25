import { useState, useCallback } from "react";
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

const METRICS = [
  { val: "99.9%", label: "Uptime SLA" },
  { val: "<6 mo", label: "Time to Deploy" },
  { val: "40%",   label: "Cost Reduction" },
];

const CONTACT_ITEMS = [
  { icon: "fas fa-envelope",       label: "Email",    value: "info@xerxez.com",              href: "mailto:info@xerxez.com" },
  { icon: "fas fa-phone-alt",      label: "Phone",    value: "+971 56 786 7451",             href: "tel:+971567867451" },
  { icon: "fas fa-map-marker-alt", label: "Location", value: "India & UAE — Remote-first",   href: undefined },
];

interface FormState {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  company:   string;
  service:   string;
  message:   string;
}

const EMPTY: FormState = {
  firstName: "", lastName: "", email: "",
  phone: "", company: "", service: "", message: "",
};

const ALERT_MS = 1800;

const labelCss: React.CSSProperties = {
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#1A1A1A",
  letterSpacing: "0.04em",
  marginBottom: 7,
  textTransform: "uppercase" as const,
};

const baseCss: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #DDDAD4",
  borderRadius: 12,
  padding: "13px 16px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: "#1A1A1A",
  background: "#fafafa",
  outline: "none",
  display: "block",
  transition: "border-color 0.18s, box-shadow 0.18s",
};

const ContactSection2 = () => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [focused, setFocused] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  const set = useCallback((k: keyof FormState, v: string) =>
    setForm(p => ({ ...p, [k]: v })), []);

  const fieldCss = (name: string): React.CSSProperties => ({
    ...baseCss,
    borderColor: focused === name ? "#6c57d2" : "#DDDAD4",
    boxShadow:   focused === name ? "0 0 0 3px rgba(108,87,210,0.10)" : "none",
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) { toast.error("First name is required."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email."); return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      toast.error("Please write a message (min 10 chars)."); return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Message sent! We'll respond within 24 hours.");
      setForm(EMPTY);
      setTimeout(() => setSent(false), 5000);
    }, ALERT_MS);
  }, [form]);

  return (
    <section style={{ background: "#F2EFE9", padding: "100px 0" }}>
      <div className="container">
        <div className="row g-5 align-items-start">

          {/* ── LEFT: form ── */}
          <div
            className="col-lg-7"
            data-aos="fade-right"
            data-aos-duration="900"
            data-aos-once="true"
          >
            {/* overline label */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#6c57d2",
            }}>
              <span style={{ display: "inline-block", width: 24, height: 1.5, background: "#6c57d2" }} />
              Contact Us
            </div>

            {/* heading */}
            <h2 className="editorial-headline" style={{ fontSize: "clamp(32px,4.5vw,56px)", marginBottom: 14 }}>
              Start Your Enterprise<br />
              <span className="headline-accent">Transformation</span>
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              lineHeight: 1.75, color: "#4A4A4A",
              marginBottom: 36, maxWidth: 480,
            }}>
              Tell us about your project — we respond within 24 hours.
            </p>

            {/* form card */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #DDDAD4",
              borderRadius: 20,
              padding: "40px",
            }}>
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">

                  {/* First + Last */}
                  <div className="col-md-6">
                    <label style={labelCss}>First Name *</label>
                    <input type="text" value={form.firstName} placeholder="John"
                      style={fieldCss("firstName")} disabled={sending}
                      onChange={e => set("firstName", e.target.value)}
                      onFocus={() => setFocused("firstName")}
                      onBlur={() => setFocused(null)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelCss}>Last Name</label>
                    <input type="text" value={form.lastName} placeholder="Smith"
                      style={fieldCss("lastName")} disabled={sending}
                      onChange={e => set("lastName", e.target.value)}
                      onFocus={() => setFocused("lastName")}
                      onBlur={() => setFocused(null)} />
                  </div>

                  {/* Email + Phone */}
                  <div className="col-md-6">
                    <label style={labelCss}>Email *</label>
                    <input type="email" value={form.email} placeholder="john@company.com"
                      style={fieldCss("email")} disabled={sending}
                      onChange={e => set("email", e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelCss}>Phone</label>
                    <input type="tel" value={form.phone} placeholder="+971 50 000 0000"
                      style={fieldCss("phone")} disabled={sending}
                      onChange={e => set("phone", e.target.value)}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)} />
                  </div>

                  {/* Company + Service */}
                  <div className="col-md-6">
                    <label style={labelCss}>Company</label>
                    <input type="text" value={form.company} placeholder="Acme Corp"
                      style={fieldCss("company")} disabled={sending}
                      onChange={e => set("company", e.target.value)}
                      onFocus={() => setFocused("company")}
                      onBlur={() => setFocused(null)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelCss}>Service Interested In</label>
                    <select value={form.service}
                      style={{ ...fieldCss("service"), cursor: "pointer", appearance: "auto" }}
                      disabled={sending}
                      onChange={e => set("service", e.target.value)}
                      onFocus={() => setFocused("service")}
                      onBlur={() => setFocused(null)}>
                      <option value="">Select a service…</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label style={labelCss}>Message *</label>
                    <textarea value={form.message} rows={5}
                      placeholder="Tell us about your project, timeline, and goals…"
                      style={{ ...fieldCss("message"), resize: "vertical" as const }}
                      disabled={sending}
                      onChange={e => set("message", e.target.value)}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)} />
                  </div>

                  {/* Submit */}
                  <div className="col-12" style={{ marginTop: 8 }}>
                    <button
                      type="submit"
                      className="pill-btn"
                      disabled={sending || sent}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      {sending ? (
                        <>Sending <i className="fas fa-spinner fa-spin" /></>
                      ) : sent ? (
                        <>Sent! We'll be in touch <i className="fas fa-check" style={{ color: "#4ade80" }} /></>
                      ) : (
                        <>
                          Send Message
                          <span className="btn-arrow">
                            <i className="far fa-arrow-right" />
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT: dark info panel ── */}
          <div
            className="col-lg-5"
            data-aos="fade-left"
            data-aos-duration="900"
            data-aos-delay="150"
            data-aos-once="true"
          >
            <div style={{ position: "sticky", top: 120 }}>
              <div style={{
                background: "#1C1C1E",
                borderRadius: 20,
                padding: "40px 36px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "-16px 16px 60px rgba(0,0,0,0.22), 0 4px 20px rgba(0,0,0,0.12)",
              }}>
                {/* purple glow */}
                <div style={{
                  position: "absolute", width: 240, height: 240, borderRadius: "50%",
                  background: "rgba(108,87,210,0.18)", filter: "blur(64px)",
                  bottom: -70, right: -50, pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 2 }}>

                  {/* Available dot */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                    fontWeight: 600, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
                    marginBottom: 28,
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 0 3px rgba(74,222,128,0.22)",
                      display: "block", flexShrink: 0,
                      animation: "greenPulse 2s ease infinite",
                    }} />
                    Available for New Projects
                  </div>

                  {/* Big number */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 72, fontWeight: 900,
                        color: "#ffffff", lineHeight: 1,
                      }}>120</span>
                      <span style={{
                        fontSize: 26, fontWeight: 800, color: "#6c57d2",
                        paddingTop: 6, fontFamily: "'DM Sans', sans-serif",
                      }}>+</span>
                    </div>
                    <div style={{
                      fontSize: 11, color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      fontFamily: "'DM Sans', sans-serif", marginTop: 6,
                    }}>
                      Enterprise Projects Delivered
                    </div>
                  </div>

                  {/* 3 metrics */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                    gap: 10, marginBottom: 28,
                    borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20,
                  }}>
                    {METRICS.map(({ val, label }) => (
                      <div key={val} style={{
                        background: "rgba(108,87,210,0.1)",
                        border: "1px solid rgba(108,87,210,0.2)",
                        borderRadius: 12, padding: "14px 10px", textAlign: "center",
                      }}>
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 17, fontWeight: 800,
                          color: "#fff", lineHeight: 1,
                        }}>{val}</div>
                        <div style={{
                          fontSize: 9, color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase", letterSpacing: "0.08em",
                          marginTop: 5, fontFamily: "'DM Sans', sans-serif",
                        }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Contact info */}
                  <div style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: 20, marginBottom: 24,
                  }}>
                    {CONTACT_ITEMS.map(({ icon, label, value, href }) => (
                      <div key={label} style={{
                        display: "flex", alignItems: "center",
                        gap: 12, marginBottom: 14,
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "#6c57d2", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <i className={icon} style={{ color: "#fff", fontSize: 13 }} />
                        </div>
                        <div>
                          <div style={{
                            fontSize: 9, color: "rgba(255,255,255,0.3)",
                            textTransform: "uppercase", letterSpacing: "0.12em",
                            fontFamily: "'DM Sans', sans-serif",
                          }}>{label}</div>
                          {href ? (
                            <a href={href} style={{
                              fontSize: 13, color: "rgba(255,255,255,0.7)",
                              fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
                            }}>{value}</a>
                          ) : (
                            <span style={{
                              fontSize: 13, color: "rgba(255,255,255,0.7)",
                              fontFamily: "'DM Sans', sans-serif",
                            }}>{value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trust badges */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["ISO 27001", "SOC 2", "24h Response", "15+ Countries"].map(tag => (
                      <span key={tag} style={{
                        background: "rgba(108,87,210,0.12)",
                        border: "1px solid rgba(108,87,210,0.22)",
                        borderRadius: 100, padding: "4px 12px",
                        fontSize: 10, color: "rgba(255,255,255,0.5)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>{tag}</span>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection2;
