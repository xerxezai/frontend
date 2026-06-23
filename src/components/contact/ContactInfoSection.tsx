const ContactInfoSection = () => {
  return (
    <div className="contact-info-inner">
      <div className="container">
        <div className="contact-info-inner-wrapper">
          <div
            className="icon-items"
            data-aos="fade-up"
            data-aos-delay="200" // stagger delay for each card
            data-aos-duration="1000" // smooth animation duration
            data-aos-easing="ease-out-cubic" // smooth easing
            data-aos-once="true"
          >
            <div className="icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="content">
              <h3>New York, USA</h3>
              <p>27 Division 10002 Main road</p>
            </div>
          </div>
          <div
            className="icon-items"
            data-aos="fade-up"
            data-aos-delay="400" // stagger delay for each card
            data-aos-duration="1000" // smooth animation duration
            data-aos-easing="ease-out-cubic" // smooth easing
            data-aos-once="true"
          >
            <div className="icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div className="content">
              <h3>Website</h3>
              <p>
                <a href="https://xerxez.com">xerxez.com</a>
              </p>
            </div>
          </div>
          <div
            className="icon-items"
            data-aos="fade-up"
            data-aos-delay="600"
            data-aos-duration="1000"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <div className="icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="content">
              <h3>Mail Us</h3>
              <p>
                <a href="mailto:hello@xerxez.com" className="link">
                  hello@xerxez.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
