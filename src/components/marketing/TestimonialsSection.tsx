import { useEffect, useRef, useState } from "react";

const GOLD = "#C9883A";

const QUOTES = [
  {
    quote: "We finally have full visibility into our procurement approvals and document workflows. No more chasing emails.",
    role: "Operations Manager",
    org: "Engineering Company, UAE",
  },
  {
    quote: "The AI assistant alone saved our team hours every week. It actually understands how our processes work.",
    role: "Project Director",
    org: "Industrial Company, Abu Dhabi",
  },
  {
    quote: "Implementation was straightforward and the support team is responsive. Exactly what we needed.",
    role: "IT Manager",
    org: "EPC Contractor, UAE",
  },
];

const Stars = () => (
  <div style={{ display: "flex", gap: 3, marginBottom: 16 }} aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map(i => (
      <i key={i} className="fas fa-star" style={{ color: GOLD, fontSize: 12 }} />
    ))}
  </div>
);

/* ── 3D tilt + scroll-reveal testimonial card ── */
const TestimonialCard = ({ t, index }: { t: typeof QUOTES[number]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = `opacity 0.55s ease ${index * 90}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 0.08s linear, box-shadow 0.08s linear";
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-6px) scale(1.015)`;
    el.style.boxShadow = "0 24px 52px rgba(201,136,58,0.20), 0 0 0 1.5px rgba(201,136,58,0.30)";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.boxShadow = "0 4px 22px rgba(0,0,0,0.07)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: "#fff", borderRadius: 18, height: "100%",
        border: "1px solid rgba(201,136,58,0.12)",
        borderTop: `3px solid ${GOLD}`,
        boxShadow: "0 4px 22px rgba(0,0,0,0.07)",
        padding: "28px 26px 24px",
        display: "flex", flexDirection: "column",
        transformStyle: "preserve-3d", willChange: "transform",
        cursor: "default",
      }}
    >
      <Stars />
      <p style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, lineHeight: 1.72,
        color: "#3A3530", marginBottom: 20, flex: 1,
      }}>
        “{t.quote}”
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(145deg,#e8a84e,#C9883A)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <i className="fas fa-user-tie" style={{ color: "#fff", fontSize: 15 }} />
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 700, color: "#141413", lineHeight: 1.2 }}>
            {t.role}
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(20,20,19,0.48)", marginTop: 2 }}>
            {t.org}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Homepage client testimonials — anonymised role-level attributions. */
const TestimonialsSection = () => {
  const headRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setReveal(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: "#F2EFE9", padding: "96px 0 90px" }}>
      <div className="container">
        {/* Header */}
        <div ref={headRef} style={{
          textAlign: "center", marginBottom: 52,
          opacity: reveal ? 1 : 0, transform: reveal ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
              Client Feedback
            </span>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
          </div>
          <h2 style={{
            fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, lineHeight: 1.12,
            color: "#141413", fontFamily: "'DM Sans',sans-serif", margin: 0,
          }}>
            What Our Clients Experience
          </h2>
        </div>

        <div className="row g-4">
          {QUOTES.map((t, i) => (
            <div key={t.role} className="col-lg-4 col-md-6">
              <TestimonialCard t={t} index={i} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
