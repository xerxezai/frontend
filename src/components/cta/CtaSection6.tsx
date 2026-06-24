import { Link } from "react-router-dom";

interface Props {
  variant?: boolean;
}
const CtaSection6 = ({ variant }: Props) => {
  return (
    <section
      className={`cta-call-section-5 ${variant ? "" : "fix"} section-padding`}
      style={{
        background: "linear-gradient(135deg, #003566 0%, #0a031e 50%, #1a0a5c 100%)",
      }}
    >
      <div className="container">
        <div
          className={`cta-call-wrapper ${variant ? "style-padding" : ""}`}
          style={{ textAlign: "center", paddingBottom: variant ? 0 : undefined }}
        >
          <div className="section-title text-center mb-0">
            <span className="text-white fade-in" style={{ opacity: 0.75, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Ready to modernise your enterprise?
            </span>
            <h2 className="text-white char-animation" style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, marginTop: 12 }}>
              Ready to Transform Your <br /> Enterprise Operations?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", maxWidth: 580, margin: "16px auto 0", fontSize: 16, lineHeight: 1.7 }}>
              Join 120+ enterprises that trust XERXEZ to deliver AI-powered ERP, DevSecOps pipelines,
              and cloud infrastructure that scales securely.
            </p>
          </div>
          <div className="cta-button fade-in" style={{ marginTop: 36 }}>
            <Link to="/contact" className="theme-btn" style={{ borderRadius: 55, background: "#ff792e" }}>
              Request a Demo
              <i className="far fa-arrow-right"></i>
            </Link>
            <Link to="/service/ai-powered-erp" className="pricing-text">
              Explore AI ERP <i className="far fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection6;
