import { Link } from "react-router-dom";
import Image from "../utils/Image";

const ErrorSection = () => {
  return (
    <section className="error-section fix section-padding">
      <div className="container">
        <div className="error-items">
          <div className="thumb">
            <Image
              src="assets/img/404.png"
              alt="img"
              width={1000}
              height={662}
            />
          </div>
          <div className="content">
            <h2 className="char-animation">404 Page Not Found</h2>
            <p>
              Welcome to SEOZ your trusted partner for comprehensive SEO and
              digital marketing solutions. With our proven expertise and
              innovative strategies the digital landscape.
            </p>
            <Link to="/" className="theme-btn">
              Go To Homepage
              <i className="far fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorSection;
