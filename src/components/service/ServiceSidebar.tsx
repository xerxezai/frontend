import { Link } from "react-router-dom";
import RecentServices from "./RecentServices";
import ServiceContactWidget from "./ServiceContactWidget";
import Image from "../utils/Image";

const ServiceSidebar = () => {
  return (
    <div className="service-details-sidebar">
      <RecentServices />
      <ServiceContactWidget />
      <div className="sidebar-widget-image">
        <Image
          src="assets/img/service/service-details-widget01.jpg"
          alt="img"
          width={416}
          height={549}
        />
        <div className="content">
          <h3 className="char-animation">Start Your Project?</h3>
          <p className="fade-in">
            Mauris ut enim sit amet lacus ornare ullamcorper. Praesent placerat
            neque eu.
          </p>
          <Link to="/contact" className="theme-btn fade-in">
            Contact Us
            <i className="far fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceSidebar;
