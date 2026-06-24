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
                  <Link to="/" >
                    <Image
                      src="/assets/img/logo/xerxez_logo.png"
                      alt="Xerxez Solutions"
                      width={160}
                      height={40}
                      style={{ height: '40px', width: 'auto' }}
                    />
                  </Link>
                </div>
                <div className="footer-content">
                  <p>
                    XERXEZ delivers AI-powered ERP, cloud infrastructure, and DevSecOps
                    solutions that transform how enterprises operate at scale.
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
                    <Link to="/service/ai-powered-erp">AI Powered ERP</Link>
                  </li>
                  <li>
                    <Link to="/service/devsecops-mlops-solutions">DevSecOps / MLOps</Link>
                  </li>
                  <li>
                    <Link to="/service/cloud-service-storage">Cloud Service &amp; Storage</Link>
                  </li>
                  <li>
                    <Link to="/service/software-development">Software Development</Link>
                  </li>
                  <li>
                    <Link to="/service/quantum-computing">Quantum Computing</Link>
                  </li>
                  <li>
                    <Link to="/service/mobile-application">Mobile Application</Link>
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
                  <h3>Company</h3>
                </div>
                <ul className="list-area">
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/service">All Services</Link>
                  </li>
                  <li>
                    <Link to="/blog">Insights &amp; News</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Privacy Policy</Link>
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
          </div>
        </div>
      </div>
      <FooterBottomSection variant />
    </section>
  );
};

export default FooterSection4;






