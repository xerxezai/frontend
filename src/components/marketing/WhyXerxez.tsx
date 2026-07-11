import { useEffect, useRef } from "react";

const GOLD = "#C9883A";

const ROWS: { feature: string; xerxez: boolean; agency: boolean; big4: boolean }[] = [
  { feature: "AI-Native Platform",   xerxez: true, agency: false, big4: false },
  { feature: "Fixed-Price Delivery", xerxez: true, agency: false, big4: false },
  { feature: "<6 Month Delivery",    xerxez: true, agency: false, big4: false },
  { feature: "24/7 Support",         xerxez: true, agency: false, big4: true  },
  { feature: "ISO 27001 Aligned",    xerxez: true, agency: false, big4: true  },
  { feature: "Full IP Transfer",     xerxez: true, agency: false, big4: false },
];

const Mark = ({ yes }: { yes: boolean }) => (
  <i
    className={yes ? "fas fa-check-circle" : "fas fa-times-circle"}
    aria-label={yes ? "Yes" : "No"}
    style={{ color: yes ? "#4ade80" : "rgba(255,255,255,0.16)", fontSize: 16 }}
  />
);

/** Homepage "Why XERXEZ" — competitor comparison table, dark section with a
 *  3D-tilting floating card. */
const WhyXerxez = () => {
  const headRef  = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [headRef.current, cardRef.current].filter(Boolean) as HTMLElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity 0.6s ease ${i * 120}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms`;
    });
    const obs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
          obs.unobserve(entry.target);
        }
      }),
      { threshold: 0.15 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 0.08s linear, box-shadow 0.08s linear";
    el.style.transform = `perspective(1400px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 5}deg)`;
    el.style.boxShadow = "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(201,136,58,0.30)";
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease";
    el.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    el.style.boxShadow = "0 24px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,136,58,0.16)";
  };

  return (
    <section style={{
      background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
      padding: "96px 0 90px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot-grid texture */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)",
        backgroundSize: "30px 30px",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "-15%", right: "-6%",
        width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(201,136,58,0.10) 0%,transparent 68%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
              Why XERXEZ
            </span>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
          </div>
          <h2 style={{
            fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, lineHeight: 1.12,
            color: "#fff", fontFamily: "'DM Sans',sans-serif", margin: 0,
          }}>
            Built Different, Delivered Better
          </h2>
        </div>

        {/* Comparison table — horizontally scrollable on small screens */}
        <div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            maxWidth: 860, margin: "0 auto", overflowX: "auto",
            borderRadius: 18, transformStyle: "preserve-3d", willChange: "transform",
            boxShadow: "0 24px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,136,58,0.16)",
          }}
        >
          <table style={{
            width: "100%", minWidth: 560, borderCollapse: "separate", borderSpacing: 0,
            background: "#1e1509", borderRadius: 18, overflow: "hidden",
            fontFamily: "'DM Sans',sans-serif",
          }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                <th style={{ textAlign: "left", padding: "16px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                  Feature
                </th>
                <th style={{ padding: "16px 18px", fontSize: 13, fontWeight: 800, color: "#E8A84E", textAlign: "center", whiteSpace: "nowrap" }}>
                  XERXEZ
                </th>
                <th style={{ padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.40)", textAlign: "center", whiteSpace: "nowrap" }}>
                  Generic Agency
                </th>
                <th style={{ padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.40)", textAlign: "center", whiteSpace: "nowrap" }}>
                  Big 4 Consulting
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.feature} style={{ background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <td style={{ padding: "14px 22px", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {r.feature}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(201,136,58,0.08)" }}>
                    <Mark yes={r.xerxez} />
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Mark yes={r.agency} />
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Mark yes={r.big4} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default WhyXerxez;
