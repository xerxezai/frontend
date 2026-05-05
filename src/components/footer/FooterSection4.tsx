import FooterBottomSection from "./FooterBottomSection";
import { Link } from "react-router-dom";
import Image from "../utils/Image";
import NewsletterForm from "../forms/NewsletterForm";

const FooterSection4 = () => {
  return (
    <section className="footer-section fix">
      <div className="container">
        <div className="footer-widget-wrapper">
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
                  <Link to="/">
                    <Image
                      src="assets/img/footer/Logo.png"
                      alt="img"
                      width={135}
                      height={47}
                    />
                  </Link>
                </div>
                <div className="footer-content">
                  <p>
                    The time it will take for your website's search engine
                    rankings to begin improving.
                  </p>
                  <NewsletterForm style="style-3" />
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
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="600" // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>Resources</h3>
                </div>
                <ul className="list-area">
                  <li>
                    <Link to="/contact">Help Center</Link>
                  </li>
                  <li>
                    <Link to="/service">Keyword Generator</Link>
                  </li>
                  <li>
                    <Link to="/blog">News & Events</Link>
                  </li>
                  <li>
                    <Link to="/contact">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/contact">Clients Feedback</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-2">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="800" // stagger delay for each card
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
          </div>
        </div>
      </div>
      <FooterBottomSection variant />
    </section>
  );
};

export default FooterSection4;
