const ServiceContactWidget = () => {
  return (
    <div className="sidebar-widget">
      <div className="sideber-title fade-in">
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
            <p>
              <a href="tel:+2869852156">+286 985 2156</a>
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
              <a href="mailto:info@example.com" className="link">
                info@example.com
              </a>
            </p>
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
  );
};

export default ServiceContactWidget;
