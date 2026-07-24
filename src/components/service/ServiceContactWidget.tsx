const ServiceContactWidget = () => {
  return (
    <div className="sidebar-widget">
      <div className="sideber-title fade-in">
        <h4 className="char-animation">Need Any Help</h4>
        <p className="mt-2 fade-in">Need Any Help? Contact Us 24/7 For Support</p>
      </div>
      <ul className="contact-info fade-in">
        <li>
          <div className="icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="content">
            <h5>Mail Us</h5>
            <p>
              <a href="mailto:info@xerxez.com" className="link">
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
            <p>xerxez.com</p>
          </div>
        </li>
        <li>
          <div className="icon">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="content">
            <h5>Headquarters</h5>
            <p>India &amp; UAE — Remote-first, Global delivery</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ServiceContactWidget;

