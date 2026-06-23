import { Link } from "react-router-dom";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}
const CtaSection6 = ({ variant }: Props) => {
  return (
    <section
      className={`cta-call-section-5 ${
        variant ? "" : "fix"
      } section-padding bg-cover`}
    >
      <div className="container">
        <div className={`cta-call-wrapper ${variant ? "style-padding" : ""}`}>
          <div className="section-title text-center mb-0">
            <span className="text-white fade-in">Ready to modernise your enterprise?</span>
            <h2 className="text-white char-animation">
              Let's Build Something <br /> Extraordinary Together
            </h2>
          </div>
          <div className="cta-button fade-in">
            <Link to="/contact" className="theme-btn">
              Request a Demo
              <i className="far fa-arrow-right"></i>
            </Link>
            <Link to="/pricing" className="pricing-text">
              Pricing Plan <i className="far fa-arrow-right"></i>
            </Link>
          </div>
          <div className="carton-shape float-bob-x">
            <Image
              src="assets/img/cta/carton.png"
              alt="img"
              width={231}
              height={347}
            />
          </div>
          <div className="book-shape float-bob-y">
            <Image
              src="assets/img/cta/book-shape.png"
              alt="img"
              width={152}
              height={124}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection6;

