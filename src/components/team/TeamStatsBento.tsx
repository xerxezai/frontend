const bento = [
  { value: "50+",   label: "Engineers",           icon: "fas fa-users",           bg: "#C9883A",   color: "#fff", span: 1 },
  { value: "12",    label: "Countries Served",    icon: "fas fa-globe",           bg: "#FFF8EE",  color: "#C9883A", span: 1 },
  { value: "120+",  label: "Projects Delivered",  icon: "fas fa-check-circle",    bg: "#F5F5F7",  color: "#0A0A0A", span: 1 },
  { value: "10+",   label: "Years Experience",    icon: "fas fa-calendar-check",  bg: "#FFF8EE",  color: "#C9883A", span: 1 },
  { value: "98%",   label: "Client Satisfaction", icon: "fas fa-heart",           bg: "#F5F5F7",  color: "#0A0A0A", span: 1 },
  { value: "0",     label: "Security Incidents",  icon: "fas fa-shield-alt",      bg: "#C9883A",  color: "#fff", span: 1 },
];

const TeamStatsBento = () => (
  <section className="fix section-padding" style={{ background: "#F5F5F7" }}>
    <div className="container">
      <div className="section-title text-center mb-50">
        <span className="fade-in">Our Team</span>
        <h2 className="char-animation">People Behind the Platform</h2>
        <p style={{ color: "#4B4B4B", maxWidth: 480, margin: "0 auto" }}>
          A multidisciplinary team of engineers, architects, and data scientists
          united by a single mission: enterprise transformation through technology.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
      }}>
        {bento.map((item, i) => (
          <div
            key={i}
            data-aos="fade-up"
            data-aos-delay={i * 80}
            style={{
              background: item.bg,
              borderRadius: 16,
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              minHeight: 160,
              border: item.bg.startsWith("#F") ? "1px solid #E5E5E5" : "none",
            }}
          >
            <i
              className={item.icon}
              style={{ fontSize: 28, color: item.color, opacity: item.bg === "#C9883A" ? 0.85 : 1 }}
            />
            <div style={{
              fontSize: 38, fontWeight: 900, lineHeight: 1,
              color: item.color,
            }}>
              {item.value}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: item.bg === "#C9883A" ? "rgba(255,255,255,0.80)" : "#6B6B6B",
              textAlign: "center",
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @media (max-width: 767px) {
        .team-bento-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
    `}</style>
  </section>
);

export default TeamStatsBento;

