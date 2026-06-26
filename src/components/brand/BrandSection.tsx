interface Props {
  variant?: string;
}

const techPartners = [
  { icon: "fab fa-aws",          name: "AWS" },
  { icon: "fas fa-cloud",        name: "Azure" },
  { icon: "fab fa-google",       name: "Google Cloud" },
  { icon: "fas fa-dharmachakra", name: "Kubernetes" },
  { icon: "fab fa-docker",       name: "Docker" },
  { icon: "fas fa-layer-group",  name: "TensorFlow" },
  { icon: "fas fa-fire-alt",     name: "PyTorch" },
  { icon: "fas fa-robot",        name: "OpenAI" },
  { icon: "fas fa-code-branch",  name: "Terraform" },
  { icon: "fas fa-database",     name: "Databricks" },
];

const BrandSection = ({ variant }: Props) => (
  <div style={{
    background: "#FDFCFB",
    padding: variant === "style-3" ? "0 0 60px" : "60px 0",
  }}>
    <div className="container">
      {/* Label */}
      <p style={{
        textAlign: "center",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#9c9690",
        marginBottom: 32,
      }}>
        Powered by industry-leading cloud &amp; AI platforms
      </p>

      <div className="row g-3 justify-content-center align-items-center">
        {techPartners.map((partner, index) => (
          <div
            key={partner.name}
            className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6"
            data-aos="fade-up"
            data-aos-delay={index * 60}
            data-aos-duration="700"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "22px 14px",
                background: "#ffffff",
                border: "1px solid #E8E3DA",
                borderRadius: 14,
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#C9883A";
                el.style.boxShadow = "0 6px 24px rgba(201,136,58,0.12)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#E8E3DA";
                el.style.boxShadow = "none";
              }}
            >
              <i
                className={partner.icon}
                style={{ fontSize: 28, color: "#C9883A" }}
              />
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#6c6a64",
                letterSpacing: "0.05em",
                textAlign: "center",
                lineHeight: 1.3,
                fontFamily: "'Inter', sans-serif",
              }}>
                {partner.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BrandSection;
