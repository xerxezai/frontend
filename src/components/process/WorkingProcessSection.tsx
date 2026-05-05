const WorkingProcessSection = () => {
  return (
    <section className="working-process-section-2 section-padding fix">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <span className="text-white fade-in">Working Process</span>
            <h2 className="text-white char-animation">
              How We Work to Help Your Business Grow
            </h2>
          </div>
          <p className="text-white fade-in">
            Welcome to SEOZ your trusted partner for comprehensive SEO and
            digital marketing solutions with our proven expertise
          </p>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-6 col-sm-6">
            <div
              className="icon-box-items-2 item_right_1"
              data-aos="fade-up"
              data-aos-delay="200" // stagger delay for each card
              data-aos-duration="1000" // smooth animation duration
              data-aos-easing="ease-out-cubic" // smooth easing
              data-aos-once="true"
            >
              <span className="number">01</span>
              <div className="icon">
                <i className="flaticon-video-marketing-1"></i>
              </div>
              <div className="content">
                <h3>SEO Consultancy</h3>
                <p>
                  Donec sagittis nulla metus, nec vulputate nisi molestie
                  accumsan a at justo hendrerit auctor velit.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-sm-6">
            <div
              className="icon-box-items-2"
              data-aos="fade-up"
              data-aos-delay="400" // stagger delay for each card
              data-aos-duration="1000" // smooth animation duration
              data-aos-easing="ease-out-cubic" // smooth easing
              data-aos-once="true"
            >
              <span className="number">02</span>
              <div className="icon style-2">
                <i className="flaticon-search"></i>
              </div>
              <div className="content">
                <h3>Build Your Site</h3>
                <p>
                  Donec sagittis nulla metus, nec vulputate nisi molestie
                  accumsan a at justo hendrerit auctor velit.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-sm-6">
            <div
              className="icon-box-items-2 item_left_1"
              data-aos="fade-up"
              data-aos-delay="600" // stagger delay for each card
              data-aos-duration="1000" // smooth animation duration
              data-aos-easing="ease-out-cubic" // smooth easing
              data-aos-once="true"
            >
              <span className="number">03</span>
              <div className="icon style-3">
                <i className="flaticon-keyword"></i>
              </div>
              <div className="content">
                <h3>Update Solution</h3>
                <p>
                  Donec sagittis nulla metus, nec vulputate nisi molestie
                  accumsan a at justo hendrerit auctor velit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkingProcessSection;
