const values = [
  {
    icon: "fas fa-lightbulb",
    title: "Innovation First",
    description:
      "We adopt the most effective emerging technologies — AI, cloud-native architectures, and MLOps — before they become industry standard.",
    accent: "#C9883A",
  },
  {
    icon: "fas fa-shield-alt",
    title: "Security by Design",
    description:
      "Compliance and security are not bolt-ons. We embed ISO 27001, SOC 2, and zero-trust principles into every layer from day one.",
    accent: "#C9883A",
  },
  {
    icon: "fas fa-handshake",
    title: "Client Partnership",
    description:
      "We measure success in outcomes, not deliverables. Long-term retainer relationships with 90%+ renewal rates reflect our commitment.",
    accent: "#C9883A",
  },
  {
    icon: "fas fa-code",
    title: "Engineering Excellence",
    description:
      "Clean code, high test coverage, and rigorous code review are non-negotiable. We build systems that are maintainable for years.",
    accent: "#C9883A",
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Continuous Learning",
    description:
      "Our engineers spend 20% of their time on R&D, certifications, and open-source contribution — because stale teams build stale software.",
    accent: "#C9883A",
  },
  {
    icon: "fas fa-chart-line",
    title: "Impact Over Activity",
    description:
      "We track ROI, not hours. Every engagement starts with a measurable success metric — and we don't stop until we hit it.",
    accent: "#C9883A",
  },
];

const CoreValuesSection = () => (
  <section className="fix section-padding" style={{ background: "#fff" }}>
    <div className="container">
      <div className="section-title text-center mb-50">
        <span className="fade-in">What Drives Us</span>
        <h2 className="char-animation">Our Core Values</h2>
        <p style={{ color: "#4B4B4B", maxWidth: 500, margin: "0 auto" }}>
          Six principles that govern every decision we make — from architecture
          choices to client conversations.
        </p>
      </div>

      <div className="row g-4">
        {values.map((v, i) => (
          <div
            key={i}
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay={i * 80}
          >
            <div style={{
              background: "#F5F5F7",
              border: "1px solid #E5E5E5",
              borderRadius: 16,
              padding: "28px 24px",
              height: "100%",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.boxShadow = "0 8px 32px rgba(201,136,58,0.12)";
              el.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.boxShadow = "none";
              el.style.transform = "translateY(0)";
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "rgba(201,136,58,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 18,
              }}>
                <i className={v.icon} style={{ color: v.accent, fontSize: 22 }} />
              </div>
              <h4 style={{ color: "#0A0A0A", fontWeight: 700, marginBottom: 10, fontSize: 17 }}>
                {v.title}
              </h4>
              <p style={{ color: "#4B4B4B", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {v.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CoreValuesSection;

