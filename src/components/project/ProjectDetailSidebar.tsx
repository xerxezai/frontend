import { Link } from "react-router-dom";
import Image from "../utils/Image";

const ProjectDetailSidebar = () => {
  return (
    <div className="project-details-sidebar">
      <div className="sidebar-widget">
        <div className="sideber-title">
          <h4 className="char-animation">Information</h4>
        </div>

        <ul className="project-infrom fade-in">
          <li>
            <span>Client:</span> William Smith
          </li>
          <li>
            <span>Start Date:</span> 12 June, 2025
          </li>
          <li>
            <span>End Date:</span> 23 June, 2025
          </li>
          <li>
            <span>Category:</span> Logistics
          </li>
          <li>
            <span>Cost:</span> 450000 USD
          </li>
        </ul>
      </div>
      <div className="sidebar-widget">
        <div className="sideber-title">
          <h4 className="char-animation">Need Any Help</h4>
          <p className="mt-2 fade-in">Need Any Help, Call Us 24/7 For Support</p>
        </div>

        <ul className="contact-info fade-in">
          <li>
            <div className="icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div className="content">
              <h5>Call Us</h5>
              <p>+286 985 2156</p>
            </div>
          </li>
          <li>
            <div className="icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="content">
              <h5>Mail Us</h5>
              <p>info@example.com</p>
            </div>
          </li>
          <li>
            <div className="icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="content">
              <h5>Office Address</h5>
              <p>125 Berlin, Germany</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="sidebar-widget-image">
        <Image
          src="assets/img/service/service-details-widget01.jpg"
          alt="img"
          width={416}
          height={549}
        />
        <div className="content">
          <h3 className="char-animation">Start Your Project?</h3>
          <p>
            Mauris ut enim sit amet lacus ornare ullamcorper. Praesent placerat
            neque eu.
          </p>
          <Link to="/contact" className="theme-btn">
            Contact Us
            <i className="far fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSidebar;
