import { Link } from "react-router-dom";
import FooterBottomSection from "./FooterBottomSection";

const FooterSection2 = () => {
  return (
    <section className="footer-section fix bg-cover">
      <div className="container">
        <div className="footer-widget-wrapper style-2">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>About XERXEZ</h3>
                </div>
                <div className="footer-content">
                  <p>
                    We build AI-powered enterprise systems — ERP, DevSecOps pipelines,
                    and cloud infrastructure — that help organisations scale securely
                    and grow with confidence.
                  </p>
                  <div className="social-icon">
                    <a href="https://linkedin.com/company/xerxez" target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://twitter.com/xerxezai" target="_blank" rel="noreferrer">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://github.com/xerxezai" target="_blank" rel="noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="mailto:info@xerxez.com">
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="400"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>Our Services</h3>
                </div>
                <ul className="list-area">
                  <li><Link to="/service/ai-powered-erp">AI-Powered ERP</Link></li>
                  <li><Link to="/service/devsecops-mlops-solutions">DevSecOps Pipelines</Link></li>
                  <li><Link to="/service/cloud-service-storage">Cloud Infrastructure</Link></li>
                  <li><Link to="/service/software-development">Software Development</Link></li>
                  <li><Link to="/service/ai-training">AI Training &amp; Consulting</Link></li>
                  <li><Link to="/service/quantum-computing">Quantum Computing</Link></li>
                  <li><Link to="/service/mobile-application">Mobile Application</Link></li>
                  <li><Link to="/service/web-mobile-hosting">Web &amp; Mobile Hosting</Link></li>
                  <li><Link to="/service/software-consulting">Software Consulting</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-2">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="600"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>Contact Us</h3>
                </div>
                <ul className="footer-contect">
                  <li>
                    <div className="icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="content">
                      <h5>Phone</h5>
                      <p>
                        <a href="tel:+971567867451" className="text-white">+971 56 786 7451</a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="content">
                      <h5>Email</h5>
                      <p>
                        <a href="mailto:info@xerxez.com">info@xerxez.com</a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <div className="content">
                      <h5>Website</h5>
                      <p>
                        <a href="https://xerxez.com" className="text-white">
                          xerxez.com
                        </a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="content">
                      <h5>Headquarters</h5>
                      <p className="text-white">India &amp; UAE — Remote-first, Global delivery</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="800"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3>Quick Links</h3>
                </div>
                <ul className="list-area">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/service">Services</Link>
                  </li>
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                </ul>
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
