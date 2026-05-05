import { Link } from "react-router-dom";
import FooterBottomSection from "./FooterBottomSection";
import Image from "../utils/Image";
import NewsletterForm from "../forms/NewsletterForm";

interface Props {
  variant?: boolean;
}
const FooterSection2 = ({ variant }: Props) => {
  return (
    <section className="footer-section fix bg-cover">
      <div className="container">
        <div
          className={`footer-newsletter-wrapper-2 ${
            variant ? "style-margin" : ""
          }`}
        >
          <Link to="/" className="footer-logo">
            <Image
              src="assets/img/logo/white-logo.svg"
              alt="img"
              width={142}
              height={55}
            />
          </Link>
          <div className="footer-newsletter-right">
            <div className="icon-items">
              <div className="icon">
                <i className="far fa-bell-exclamation"></i>
              </div>
              <div className="content">
                <h4>Subscribe Newsletter</h4>
                <span>Effective SEO strategies not only elevate.</span>
              </div>
            </div>
            <NewsletterForm style="style-2" />
          </div>
        </div>

        <div className="footer-widget-wrapper style-2">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="200" // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>About Us</h3>
                </div>
                <div className="footer-content">
                  <p>
                    By optimizing content, leveraging relevant keywords, and
                    adhering to best practices, businesses can secure prominent
                    position (SEO)
                  </p>
                  <div className="social-icon">
                    <a href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-dribbble"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="400" // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>Our Services</h3>
                </div>
                <ul className="list-area">
                  <li>
                    <Link to="/service">SEO for Small Business</Link>
                  </li>
                  <li>
                    <Link to="/service">SEO for Local Services</Link>
                  </li>
                  <li>
                    <Link to="/service">Enterprise SEO</Link>
                  </li>
                  <li>
                    <Link to="/service">National SEO</Link>
                  </li>
                  <li>
                    <Link to="/service">SEO Optimization</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-2">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="600" // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>Quick Link</h3>
                </div>
                <ul className="footer-contect">
                  <li>
                    <div className="icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="content">
                      <h5>Call Us</h5>
                      <p>
                        <a href="tel:+00479394888">+00 (47) 939 4888</a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="content">
                      <h5>Mail Us</h5>
                      <p>
                        <a
                          href="mailto:helloseoz@gmial.com"
                          className="text-white"
                        >
                          helloseoz@gmial.com
                        </a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="content">
                      <h5>New York, USA</h5>
                      <p className="text-white">27 Division 10002 Main road</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="800" // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>View Map</h3>
                </div>
                <div className="google-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterBottomSection />
    </section>
  );
};

export default FooterSection2;
