const steps = [
  {
    number: "01",
    icon: "fas fa-search",
    title: "Discovery & Analysis",
    description:
      "We audit your current technology stack, pain points, and business goals to build a clear picture of what needs to change and why.",
  },
  {
    number: "02",
    icon: "fas fa-drafting-compass",
    title: "Architecture & Planning",
    description:
      "Our architects design the solution blueprint — technology choices, integration points, data flows, and a realistic project timeline.",
  },
  {
    number: "03",
    icon: "fas fa-code",
    title: "Development & Testing",
    description:
      "Agile two-week sprints with continuous integration, automated testing, and stakeholder demos keep quality high and surprises low.",
  },
  {
    number: "04",
    icon: "fas fa-rocket",
    title: "Deployment & Go-Live",
    description:
      "Zero-downtime deployment with blue/green or canary strategies, full monitoring dashboards, rollback plans, and complete handover documentation.",
  },
  {
    number: "05",
    icon: "fas fa-headset",
    title: "Support & Optimisation",
    description:
      "SLA-backed 24/7 support, proactive performance tuning, and ongoing feature roadmapping so your investment keeps compounding.",
  },
];

const ProcessTimeline = () => (
  <section className="fix section-padding" style={{ background: "#fff" }}>
    <div className="container">
      <div className="section-title text-center mb-50">
        <span className="fade-in">How We Work</span>
        <h2 className="char-animation">Our Delivery Process</h2>
        <p style={{ color: "#4B4B4B", maxWidth: 520, margin: "0 auto" }}>
          A proven five-step framework that turns complex enterprise requirements
          into reliable, production-grade software.
        </p>
      </div>

      <div style={{ position: "relative" }}>
        {/* Vertical spine line (desktop) */}
        <div
          className="d-none d-lg-block"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            background: "linear-gradient(180deg, #6c57d2 0%, rgba(108,87,210,0.15) 100%)",
            transform: "translateX(-50%)",
          }}
        />

        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={step.number}
              className="row g-0 align-items-center mb-4"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              {/* Left content (even) */}
              <div className={`col-lg-5 ${isLeft ? "text-lg-end pe-lg-5" : "order-lg-3 ps-lg-5"}`}>
                {isLeft && (
                  <StepCard step={step} align="right" />
                )}
              </div>

              {/* Center dot */}
              <div className="col-lg-2 d-flex justify-content-center">
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "#6c57d2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 0 6px rgba(108,87,210,0.15)",
                  zIndex: 1, position: "relative", flexShrink: 0,
                }}>
                  <i className={step.icon} style={{ color: "#fff", fontSize: 18 }} />
                </div>
              </div>

              {/* Right content (odd) */}
              <div className={`col-lg-5 ${!isLeft ? "text-lg-start ps-lg-5 order-lg-3" : "order-lg-last"}`}>
                {!isLeft && (
                  <StepCard step={step} align="left" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const StepCard = ({
  step,
  align,
}: {
  step: (typeof steps)[0];
  align: "left" | "right";
}) => (
  <div style={{
    background: "#F5F5F7",
    border: "1px solid #E5E5E5",
    borderRadius: 16,
    padding: "24px 28px",
    textAlign: align === "right" ? "right" : "left",
    marginBottom: 8,
  }}>
    <div style={{
      display: "inline-block",
      fontSize: 11, fontWeight: 800,
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: "#6c57d2", marginBottom: 8,
    }}>
      Step {step.number}
    </div>
    <h4 style={{ color: "#0A0A0A", fontWeight: 700, marginBottom: 8, fontSize: 18 }}>
      {step.title}
    </h4>
    <p style={{ color: "#4B4B4B", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
      {step.description}
    </p>
  </div>
);

export default ProcessTimeline;
