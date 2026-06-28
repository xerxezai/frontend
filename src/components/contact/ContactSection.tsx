import { useState, useCallback } from "react";
import { toast } from "react-toastify";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const EMPTY: ContactInfo = { name: "", email: "", phone: "", subject: "", message: "" };

const ContactSection = () => {
  const [form, setForm] = useState<ContactInfo>(EMPTY);
  const [focused, setFocused] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);

  const set = useCallback((k: keyof ContactInfo, v: string) =>
    setForm(p => ({ ...p, [k]: v })), []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Please enter your name."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address."); return;
    }
    if (!form.phone.trim()) { toast.error("Please enter your phone number."); return; }
    if (!form.subject.trim()) { toast.error("Please enter a subject."); return; }
    if (!form.message.trim() || form.message.trim().length < 10) {
      toast.error("Please write a message (min 10 characters)."); return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Message sent! We'll respond within 24 hours.");
      setForm(EMPTY);
      setTimeout(() => setSent(false), 5000);
    }, 1800);
  }, [form]);

  // ── Shared input style ──────────────────────────────────────────────────────
  const fieldStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    border: `1.5px solid ${focused === name ? "#C9883A" : "#DDDAD4"}`,
    borderRadius: 12,
    padding: "13px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "#1A1A1A",
    background: "#ffffff",
    outline: "none",
    display: "block",
    transition: "border-color 0.18s, box-shadow 0.18s",
    boxShadow: focused === name ? "0 0 0 3px rgba(201,136,58,0.10)" : "none",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    color: "#6c6a64",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 7,
  };

  return (
    <section className="xz-contact-section" style={{ padding: "72px 0", background: "#ffffff" }}>
      <div className="container">
        <div className="row g-4 align-items-stretch">

          {/* ── LEFT: form ─────────────────────────────────────────────────── */}
          <div className="col-lg-7" data-aos="fade-right" data-aos-duration="900" data-aos-once="true">

            {/* Section label */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#C9883A", marginBottom: 16,
            }}>
              <span style={{ width: 22, height: 1.5, background: "#C9883A", display: "inline-block" }} />
              Contact Us
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#141413",
              marginBottom: 12,
            }}>
              Start Your Enterprise<br />
              <span style={{ color: "#C9883A", fontStyle: "italic" }}>Digital Transformation</span>
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, lineHeight: 1.7,
              color: "#6c6a64", marginBottom: 24, maxWidth: 460,
            }}>
              Fill out the form and our team will respond within 24 hours.
            </p>

            {/* Form card — 3D raised */}
            <div style={{
              background: "linear-gradient(160deg, #ffffff 0%, #faf7f2 100%)",
              border: "1px solid rgba(210,200,185,0.55)",
              borderTop: "1px solid rgba(255,255,255,0.95)",
              borderRadius: 20,
              padding: "36px",
              boxShadow: "0 6px 0 rgba(160,140,110,0.28), 0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}>
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">

                  {/* Name + Email */}
                  <div className="col-md-6">
                    <label style={labelStyle}>Name *</label>
                    <input type="text" placeholder="John Smith"
                      value={form.name}
                      style={fieldStyle("name")}
                      disabled={sending}
                      onChange={e => set("name", e.target.value)}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Email Address *</label>
                    <input type="email" placeholder="john@company.com"
                      value={form.email}
                      style={fieldStyle("email")}
                      disabled={sending}
                      onChange={e => set("email", e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)} />
                  </div>

                  {/* Phone + Subject */}
                  <div className="col-md-6">
                    <label style={labelStyle}>Phone Number *</label>
                    <input type="tel" placeholder="+1 234 567 8900"
                      value={form.phone}
                      style={fieldStyle("phone")}
                      disabled={sending}
                      onChange={e => set("phone", e.target.value)}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Subject *</label>
                    <input type="text" placeholder="Your subject"
                      value={form.subject}
                      style={fieldStyle("subject")}
                      disabled={sending}
                      onChange={e => set("subject", e.target.value)}
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused(null)} />
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project and goals…"
                      value={form.message}
                      style={{ ...fieldStyle("message"), resize: "vertical" }}
                      disabled={sending}
                      onChange={e => set("message", e.target.value)}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>

                  {/* Submit button — clean inline style, no theme-btn split icon */}
                  <div className="col-12" style={{ marginTop: 4 }}>
                    <button
                      type="submit"
                      disabled={sending || sent}
                      className={sending || sent ? "" : "xz-scale-btn"}
                      style={{
                        width: "100%",
                        height: 52,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        background: sent ? "#4ade80" : submitHovered && !sending ? "#a9583e" : "#cc785c",
                        color: "#ffffff",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        borderRadius: 100,
                        border: "none",
                        cursor: sending || sent ? "default" : "pointer",
                        transition: "background 180ms ease, transform 0.22s ease, box-shadow 0.22s ease",
                        letterSpacing: "0.01em",
                        boxShadow: "0 4px 0 rgba(150,80,40,0.45), 0 6px 18px rgba(204,120,92,0.25)",
                      }}
                      onMouseEnter={() => setSubmitHovered(true)}
                      onMouseLeave={() => setSubmitHovered(false)}
                    >
                      {sending ? (
                        <><i className="fas fa-spinner fa-spin" style={{ fontSize: 14 }} /> Sending…</>
                      ) : sent ? (
                        <><i className="fas fa-check" style={{ fontSize: 14 }} /> Message Sent!</>
                      ) : (
                        <><i className="far fa-paper-plane" style={{ fontSize: 14 }} /> Send Message</>
                      )}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT: image + info overlay ───────────────────────────────── */}
          <div className="col-lg-5 d-none d-lg-flex flex-column" data-aos="fade-left" data-aos-duration="900" data-aos-delay="120" data-aos-once="true">
            <div style={{ position: "relative", height: "100%", minHeight: 540 }}>

              {/* Main image */}
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80"
                alt="Enterprise team collaboration"
                className="xz-parallax-img"
                loading="lazy"
                width="900"
                height="600"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 20,
                  display: "block",
                }}
              />

              {/* Dark gradient overlay at bottom */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "55%",
                background: "linear-gradient(to top, rgba(12,8,4,0.85) 0%, transparent 100%)",
                borderRadius: "0 0 20px 20px",
                pointerEvents: "none",
              }} />

              {/* Bottom info card */}
              <div style={{
                position: "absolute", bottom: 28, left: 28, right: 28,
                zIndex: 2,
              }}>
                {/* Trust badges row */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {["24h Response", "15+ Countries", "120+ Projects"].map(tag => (
                    <span key={tag} style={{
                      background: "rgba(201,136,58,0.85)",
                      borderRadius: 100, padding: "4px 12px",
                      fontSize: 11, fontWeight: 600,
                      color: "#ffffff",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.04em",
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Quick contact info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: "fas fa-envelope", text: "info@xerxez.com", href: "mailto:info@xerxez.com" },
                    { icon: "fas fa-phone-alt", text: "+971 56 786 7451", href: "tel:+971567867451" },
                    { icon: "fas fa-map-marker-alt", text: "India & UAE — Remote-first" },
                  ].map(({ icon, text, href }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "rgba(204,120,92,0.90)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <i className={icon} style={{ color: "#fff", fontSize: 11 }} />
                      </div>
                      {href ? (
                        <a href={href} style={{
                          color: "rgba(255,255,255,0.88)",
                          fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                          textDecoration: "none",
                        }}>{text}</a>
                      ) : (
                        <span style={{
                          color: "rgba(255,255,255,0.88)",
                          fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                        }}>{text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top-right metric card */}
              <div style={{
                position: "absolute", top: 24, right: 24,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 14,
                padding: "16px 20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                textAlign: "center",
                minWidth: 110,
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 36, fontWeight: 700,
                  color: "#cc785c", lineHeight: 1,
                }}>120<span style={{ fontSize: 20, color: "#C9883A" }}>+</span></div>
                <div style={{
                  fontSize: 10, fontWeight: 600, color: "#6c6a64",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  marginTop: 4, fontFamily: "'DM Sans', sans-serif",
                }}>Projects Delivered</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
