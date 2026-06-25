import { Link } from "react-router-dom";
import NewsletterForm from "../forms/NewsletterForm";
import FooterBottomSection from "./FooterBottomSection";
import Image from "../utils/Image";

const FooterSection = () => {
  return (
    <section className="footer-section fix footer-bg">
      <div className="container">
        <div className="footer-widget-wrapper">
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
                  <Link to="/" >
                    <Image
                      src="/assets/img/logo/xerxez_logo.png"
                      alt="Xerxez Solutions"
                      width={160}
                      height={55}
                      style={{ height: '55px', width: 'auto', background: 'transparent', display: 'block' }}
                    />
                  </Link>
                </div>
                <div className="footer-content">
                  <p>
                    XERXEZ delivers AI-powered ERP, cloud infrastructure, and DevSecOps
                    solutions that transform how enterprises operate at scale.
                  </p>
                  <div className="social-icon">
                    <a href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/" target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com/" target="_blank" rel="noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://instagram.com/xerxez" target="_blank" rel="noreferrer">
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
                  <li><Link to="/service/ai-training-consulting">AI Training &amp; Consulting</Link></li>
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
                  <h3>Quick Link</h3>
                </div>
                <ul className="footer-contect">
                  <li>
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="content">
                      <h5>Mail Us</h5>
                      <p>
                        <a href="mailto:info@xerxez.com" className="text-white">
                          info@xerxez.com
                        </a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <div className="content">
                      <h5>Website</h5>
                      <p className="text-white">xerxez.com</p>
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
                  <h3>Subscribe Our Newsletter</h3>
                </div>
                <div className="footer-content">
                  <p>
                    Stay updated on AI trends, cloud insights, and XERXEZ product releases —
                    straight to your inbox.
                  </p>
                  <NewsletterForm />
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

export default FooterSection;






