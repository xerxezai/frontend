interface Props {
  variant?: string;
}

const techPartners = [
  { icon: "fab fa-aws",         name: "AWS" },
  { icon: "fas fa-cloud",       name: "Azure" },
  { icon: "fab fa-google",      name: "Google Cloud" },
  { icon: "fas fa-dharmachakra", name: "Kubernetes" },
  { icon: "fab fa-docker",      name: "Docker" },
  { icon: "fas fa-layer-group", name: "TensorFlow" },
  { icon: "fas fa-fire-alt",    name: "PyTorch" },
  { icon: "fas fa-robot",       name: "OpenAI" },
  { icon: "fas fa-code-branch", name: "Terraform" },
  { icon: "fas fa-database",    name: "Databricks" },
];

const BrandSection = ({ variant }: Props) => {
  return (
    <div
      className={`brand-section section-padding ${variant ? "" : "has-bg"} ${
        variant === "style-2"
          ? "pb-0"
          : variant === "style-3"
          ? "pt-0"
          : "fix pt-0"
      }`}
    >
      <div className="container">
        <div
          className={`section-title text-center ${
            variant === "style-2" ? "" : "mb-4"
          }`}
        >
          <p
            className={`${
              variant === "style-3" ? "text-color" : ""
            } char-animation`}
          >
            Powered by industry-leading cloud &amp; AI platforms
          </p>
        </div>

        <div className="row g-3 justify-content-center align-items-center">
          {techPartners.map((partner, index) => (
            <div
              key={partner.name}
              className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6"
              data-aos="fade-up"
              data-aos-delay={index * 80}
              data-aos-duration="800"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "18px 12px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  transition: "background 0.2s, border-color 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(108,87,210,0.18)";
                  el.style.borderColor = "rgba(108,87,210,0.45)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.08)";
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                <i
                  className={partner.icon}
                  style={{ fontSize: 26, color: "rgba(255,255,255,0.75)" }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.06em",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSection;
