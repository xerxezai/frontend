import { useState, useCallback, useEffect, useRef, memo } from "react";
import { toast } from "react-toastify";
import apiService from '../../services/api';
import PhoneInput, { isValidPhone } from '../common/PhoneInput';

interface ContactInfo {
  name: string; email: string; phone: string;
  subject: string; message: string;
}
const EMPTY: ContactInfo = { name: "", email: "", phone: "", subject: "", message: "" };

// ── count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, trigger = false) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!trigger || target <= 0) { setVal(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(e * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, trigger]);
  return val;
}

// ── 3D icon badge ─────────────────────────────────────────────────────────────
const IconBadge = ({ icon, size = 38 }: { icon: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0,
    background: "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
    boxShadow: "0 4px 0 rgba(150,95,30,0.52), 0 6px 18px rgba(201,136,58,0.30)",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: Math.round(size * 0.37) }} />
  </div>
);

// ── info row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, href, delay }: {
  icon: string; label: string; value: string; href?: string; delay: number;
}) => (
  <div
    data-aos="fade-up" data-aos-delay={delay} data-aos-duration="600" data-aos-once="true"
    style={{ display: "flex", alignItems: "center", gap: 16 }}
  >
    <IconBadge icon={icon} size={40} />
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.32)",
        fontFamily: "'DM Sans',sans-serif", marginBottom: 2,
      }}>{label}</div>
      {href ? (
        <a href={href} style={{
          color: "rgba(255,255,255,0.85)", fontSize: 14,
          fontFamily: "'DM Sans',sans-serif", textDecoration: "none",
          transition: "color 150ms",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#C9883A")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
        >{value}</a>
      ) : (
        <span style={{
          color: "rgba(255,255,255,0.85)", fontSize: 14,
          fontFamily: "'DM Sans',sans-serif",
        }}>{value}</span>
      )}
    </div>
  </div>
);

// ── stat tile with count-up ───────────────────────────────────────────────────
const StatTile = ({
  rawVal, suffix, label, color, delay, trigger,
}: {
  rawVal: number; suffix: string; label: string;
  color: string; delay: number; trigger: boolean;
}) => {
  const [hov, setHov] = useState(false);
  const counted = useCountUp(rawVal, 1400, trigger);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="600"
      data-aos-once="true"
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: `2px solid ${color}`,
        borderRadius: 13, padding: "16px 14px",
        cursor: "default", textAlign: "center",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hov
          ? `0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)`
          : "0 2px 10px rgba(0,0,0,0.20)",
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms ease",
        animation: `xzCtFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
      }}
    >
      <div style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: 24, fontWeight: 700, color, lineHeight: 1,
      }}>
        {counted}{suffix}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.09em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.38)",
        fontFamily: "'DM Sans',sans-serif", marginTop: 6,
      }}>{label}</div>
    </div>
  );
};

// ── label style (constant — defined once outside render) ──────────────────────
const LBL: React.CSSProperties = {
  display: "block", fontFamily: "'DM Sans',sans-serif",
  fontSize: 11, fontWeight: 700, color: "#5a5650",
  letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6,
};

// ── form panel (memoized so parent re-renders never touch it) ─────────────────
const ContactFormPanel = memo(() => {
  const [form, setForm] = useState<ContactInfo>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const set = useCallback((k: keyof ContactInfo, v: string) =>
    setForm(p => ({ ...p, [k]: v })), []);

  const handleSubmit = useCallback(async () => {
    if (!form.name.trim()) { toast.error("Please enter your name."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address."); return;
    }
    if (!isValidPhone(form.phone)) { toast.error("Please enter a valid phone number with country code"); return; }
    if (!form.subject.trim()) { toast.error("Please enter a subject."); return; }
    if (!form.message.trim() || form.message.trim().length < 10) {
      toast.error("Please write a message (min 10 characters)."); return;
    }
    setSending(true);
    try {
      const result = await apiService.post('/contact/', {
        full_name: form.name, email: form.email, phone: form.phone,
        subject: form.subject, message: form.message,
        company: "", service: "General Inquiry", urgency: "normal",
      });
      if (result.success) {
        setSent(true);
        setForm(EMPTY);
        toast.success("Message sent! We'll respond within 24 hours.");
        setTimeout(() => setSent(false), 5000);
      } else {
        const details = (result as any).details;
        const firstErr = details && typeof details === 'object'
          ? Object.values(details).flat().find((v): v is string => typeof v === 'string')
          : null;
        toast.error(firstErr || (result as any).message || 'Failed to send. Please try again.');
      }
    } catch {
      toast.error('Network error — please check your connection and try again.');
    } finally {
      setSending(false);
    }
  }, [form]);

  return (
    <>
      <h3 style={{
        fontFamily: "'DM Sans',sans-serif",
        fontWeight: 800, fontSize: 21, color: "#141413",
        letterSpacing: "-0.02em", margin: "0 0 5px",
      }}>
        Send us a message
      </h3>
      <p style={{
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 13, color: "#9b9690", margin: "0 0 26px",
      }}>All fields marked * are required.</p>

      <form method="POST" noValidate>
        <div className="row g-3">

          {/* Name */}
          <div className="col-sm-6">
            <label style={LBL}>Name *</label>
            <div className="xz-ct-wrap">
              <span className="xz-ct-icon">
                <span className="xz-ct-badge-box"><i className="fas fa-user" /></span>
              </span>
              <input type="text" className="xz-ct-field" placeholder="John Smith"
                value={form.name} disabled={sending}
                onChange={e => set("name", e.target.value)} />
            </div>
          </div>

          {/* Email */}
          <div className="col-sm-6">
            <label style={LBL}>Email Address *</label>
            <div className="xz-ct-wrap">
              <span className="xz-ct-icon">
                <span className="xz-ct-badge-box"><i className="fas fa-envelope" /></span>
              </span>
              <input type="email" className="xz-ct-field" placeholder="john@company.com"
                value={form.email} disabled={sending}
                onChange={e => set("email", e.target.value)} />
            </div>
          </div>

          {/* Phone */}
          <div className="col-sm-6">
            <label style={LBL}>Phone Number *</label>
            <PhoneInput value={form.phone} disabled={sending} onChange={v => set("phone", v)} />
          </div>

          {/* Subject */}
          <div className="col-sm-6">
            <label style={LBL}>Subject *</label>
            <div className="xz-ct-wrap">
              <span className="xz-ct-icon">
                <span className="xz-ct-badge-box"><i className="fas fa-tag" /></span>
              </span>
              <input type="text" className="xz-ct-field" placeholder="How can we help?"
                value={form.subject} disabled={sending}
                onChange={e => set("subject", e.target.value)} />
            </div>
          </div>

          {/* Message */}
          <div className="col-12">
            <label style={LBL}>Message *</label>
            <div className="xz-ct-wrap">
              <span className="xz-ct-icon xz-ct-icon--ta">
                <span className="xz-ct-badge-box"><i className="fas fa-comment-alt" /></span>
              </span>
              <textarea rows={5} className="xz-ct-field xz-ct-field--ta"
                placeholder="Tell us about your project, goals, and timeline…"
                value={form.message} disabled={sending}
                onChange={e => set("message", e.target.value)} />
            </div>
          </div>

          {/* Submit */}
          <div className="col-12" style={{ marginTop: 4 }}>
            <button type="button" onClick={handleSubmit} disabled={sending || sent}
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
              style={{
                width: "100%", height: 52,
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 10,
                background: sent
                  ? "linear-gradient(145deg,#6ee7b7,#10b981)"
                  : "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)",
                color: "#fff",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 15, fontWeight: 700,
                borderRadius: 12, border: "none",
                cursor: sending || sent ? "default" : "pointer",
                letterSpacing: "0.01em",
                boxShadow: btnHov && !sending && !sent
                  ? "0 6px 0 rgba(150,95,30,0.50), 0 10px 28px rgba(201,136,58,0.32)"
                  : "0 4px 0 rgba(150,95,30,0.46), 0 6px 20px rgba(201,136,58,0.24)",
                transform: btnHov && !sending && !sent ? "translateY(-2px)" : "translateY(0)",
                transition: "transform 180ms cubic-bezier(0.22,1,0.36,1), box-shadow 180ms ease, background 200ms ease",
                opacity: sending ? 0.88 : 1,
              }}
            >
              {sending ? (
                <><i className="fas fa-spinner fa-spin" style={{ fontSize: 14 }} /> Sending…</>
              ) : sent ? (
                <><i className="fas fa-check-circle" style={{ fontSize: 14 }} /> Message Sent!</>
              ) : (
                <><i className="far fa-paper-plane" style={{ fontSize: 14 }} /> Send Message</>
              )}
            </button>
          </div>

          {/* privacy */}
          <div className="col-12">
            <p style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11.5, color: "#b8b2ab",
              textAlign: "center", margin: 0, lineHeight: 1.6,
            }}>
              <i className="fas fa-lock" style={{ fontSize: 10, marginRight: 5, color: "#C9883A" }} />
              Your data is encrypted and never shared with third parties.
            </p>
          </div>

        </div>
      </form>
    </>
  );
});

// ── main ─────────────────────────────────────────────────────────────────────
const ContactSection = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const base = (import.meta.env.VITE_API_BASE_URL ?? 'https://backend-production-b9f2.up.railway.app/api/v1').replace(/\/api\/v1\/?$/, '');
    fetch(`${base}/health/`).catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        @keyframes xzCtFadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes xzCtOrb1 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(-24px,32px) scale(1.08); }
        }
        @keyframes xzCtOrb2 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(28px,-20px) scale(0.94); }
        }
        @keyframes xzCtOrb3 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(-16px,-24px) scale(1.05); }
        }
        @keyframes xzCtPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(74,222,128,0.6); }
          50%     { box-shadow:0 0 0 6px rgba(74,222,128,0); }
        }
        .xz-ct-grid {
          display:grid;
          grid-template-columns:420px 1fr;
          gap:0;
          align-items:stretch;
          border-radius:22px;
          overflow:hidden;
          box-shadow:0 30px 90px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,136,58,0.14);
        }
        @media (max-width:1199px) { .xz-ct-grid { grid-template-columns:360px 1fr; } }
        @media (max-width:991px)  { .xz-ct-grid { grid-template-columns:1fr; } }
        @media (prefers-reduced-motion:reduce) {
          .xz-ct-grid * { animation:none!important; transition:none!important; }
        }
        /* ── field styles (CSS :focus replaces focused-state re-renders) ── */
        .xz-ct-field {
          width:100%; box-sizing:border-box;
          border:1.5px solid #E4DFD8; border-radius:10px;
          padding:11px 14px 11px 44px;
          font-family:'DM Sans',sans-serif; font-size:13.5px;
          color:#141413; background:#fafaf8;
          outline:none; display:block;
          transition:border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .xz-ct-field:focus {
          border-color:#C9883A;
          background:#FFFDF9;
          box-shadow:0 0 0 3px rgba(201,136,58,0.11);
        }
        .xz-ct-field--ta { resize:vertical; }
        .xz-ct-wrap { position:relative; }
        .xz-ct-icon {
          position:absolute; left:10px; top:50%;
          transform:translateY(-50%); pointer-events:none; z-index:1;
        }
        .xz-ct-icon--ta { top:12px; transform:none; }
        .xz-ct-badge-box {
          width:26px; height:26px; border-radius:7px; flex-shrink:0;
          background:linear-gradient(145deg,#e2ddd8,#ccc8c2);
          box-shadow:0 2px 0 rgba(0,0,0,0.12);
          display:flex; align-items:center; justify-content:center;
          transition:background 200ms, box-shadow 200ms;
        }
        .xz-ct-wrap:focus-within .xz-ct-badge-box {
          background:linear-gradient(145deg,#e8a84e,#C9883A);
          box-shadow:0 3px 0 rgba(150,95,30,0.48);
        }
        .xz-ct-badge-box i { color:#fff; font-size:10px; }
      `}</style>

      <section style={{
        background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)", padding: "80px 0 92px",
        position: "relative", overflow: "hidden",
      }}>
        {/* bg dot grid */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        {/* ambient glow */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "-10%", right: "-6%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(201,136,58,0.10) 0%,transparent 68%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>

          {/* section header */}
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div data-aos="fade-up" data-aos-duration="600" data-aos-once="true"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.20em", textTransform: "uppercase", color: "#C9883A",
                marginBottom: 14,
              }}>
              <span style={{ width: 24, height: 1.5, background: "#C9883A", display: "inline-block" }} />
              Get In Touch
              <span style={{ width: 24, height: 1.5, background: "#C9883A", display: "inline-block" }} />
            </div>
            <h2 data-aos="fade-up" data-aos-delay="80" data-aos-duration="700" data-aos-once="true"
              style={{
                fontFamily: "'Cormorant Garamond',Garamond,serif",
                fontWeight: 700, fontSize: "clamp(30px,4vw,52px)",
                lineHeight: 1.08, letterSpacing: "-0.02em", color: "#fff", margin: 0,
              }}>
              Start Your Enterprise{" "}
              <em style={{ color: "#C9883A", fontStyle: "italic" }}>Digital Transformation</em>
            </h2>
          </div>

          {/* two-column grid */}
          <div className="xz-ct-grid">

            {/* ══ LEFT — dark info panel ══ */}
            <div
              data-aos="fade-right" data-aos-duration="800" data-aos-once="true"
              style={{
                background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
                padding: "48px 38px",
                position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                minHeight: 580,
              }}
            >
              {/* animated orbs */}
              <div aria-hidden="true" style={{
                position: "absolute", top: "-18%", left: "-12%",
                width: 360, height: 360, borderRadius: "50%",
                background: "radial-gradient(circle,rgba(201,136,58,0.20) 0%,transparent 65%)",
                pointerEvents: "none", animation: "xzCtOrb1 20s ease-in-out infinite",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", bottom: "-15%", right: "-8%",
                width: 280, height: 280, borderRadius: "50%",
                background: "radial-gradient(circle,rgba(204,120,92,0.14) 0%,transparent 65%)",
                pointerEvents: "none", animation: "xzCtOrb2 26s ease-in-out infinite",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", top: "42%", right: "18%",
                width: 160, height: 160, borderRadius: "50%",
                background: "radial-gradient(circle,rgba(201,136,58,0.09) 0%,transparent 65%)",
                pointerEvents: "none", animation: "xzCtOrb3 16s ease-in-out infinite",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px)",
                backgroundSize: "26px 26px",
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div data-aos="fade-up" data-aos-duration="500" data-aos-once="true"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(201,136,58,0.12)",
                    border: "1px solid rgba(201,136,58,0.28)",
                    borderRadius: 100, padding: "5px 14px", marginBottom: 22,
                  }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#C9883A", display: "inline-block",
                    animation: "xzCtPulse 2s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10, fontWeight: 700, color: "#C9883A",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                  }}>We're ready to help</span>
                </div>

                <h3 data-aos="fade-up" data-aos-delay="60" data-aos-duration="650" data-aos-once="true"
                  style={{
                    fontFamily: "'Cormorant Garamond',Garamond,serif",
                    fontSize: "clamp(26px,2.4vw,38px)", fontWeight: 700,
                    color: "#fff", lineHeight: 1.12, marginBottom: 14,
                    letterSpacing: "-0.015em",
                  }}>
                  Let's build something<br />
                  <em style={{ color: "#C9883A", fontStyle: "italic" }}>remarkable together</em>
                </h3>

                <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="600" data-aos-once="true"
                  style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.72,
                    color: "rgba(255,255,255,0.48)", marginBottom: 36, maxWidth: 300,
                  }}>
                  Tell us about your project and we'll respond within 24 hours with a tailored plan.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 36 }}>
                  <InfoRow icon="fas fa-envelope"       label="Email"    value="info@xerxez.com"          href="mailto:info@xerxez.com" delay={120} />
                  <InfoRow icon="fas fa-phone-alt"      label="Phone"    value="+971 56 786 7451"          href="tel:+971567867451"      delay={160} />
                  <InfoRow icon="fas fa-map-marker-alt" label="Location" value="India & UAE — Remote-first"                             delay={200} />
                </div>

                <div data-aos="fade-up" data-aos-delay="220" data-aos-duration="500" data-aos-once="true"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(74,222,128,0.09)",
                    border: "1px solid rgba(74,222,128,0.20)",
                    borderRadius: 100, padding: "6px 14px",
                  }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
                    display: "inline-block", flexShrink: 0,
                    animation: "xzCtPulse 1.8s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 11.5,
                    fontWeight: 600, color: "rgba(255,255,255,0.65)",
                  }}>
                    Responds within{" "}
                    <strong style={{ color: "#4ade80" }}>24 hours</strong>
                  </span>
                </div>
              </div>

              <div ref={statsRef} style={{ display: "flex", gap: 10, position: "relative", zIndex: 1, marginTop: 44 }}>
                <StatTile rawVal={120} suffix="+"  label="Projects"  color="#C9883A" delay={240} trigger={statsVisible} />
                <StatTile rawVal={15}  suffix="+"  label="Countries" color="#60a5fa" delay={280} trigger={statsVisible} />
                <StatTile rawVal={99}  suffix="%"  label="Uptime"    color="#34d399" delay={320} trigger={statsVisible} />
              </div>
            </div>

            {/* ══ RIGHT — form panel ══ */}
            <div
              data-aos="fade-left" data-aos-duration="800" data-aos-delay="100" data-aos-once="true"
              style={{
                background: "#ffffff",
                borderTop: "3px solid #C9883A",
                padding: "48px 44px",
              }}
            >
              <ContactFormPanel />
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
