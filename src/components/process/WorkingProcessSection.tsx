const WorkingProcessSection = () => {
  return (
    <section className="working-process-section-2 section-padding fix">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <span className="text-white fade-in">Working Process</span>
            <h2 className="text-white char-animation">
              How We Work to Deliver Enterprise Results
            </h2>
          </div>
          <p className="text-white fade-in">
            XERXEZ follows a structured, outcome-driven delivery process â€” from discovery
            to deployment and beyond.
          </p>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-6 col-sm-6">
            <div
              className="icon-box-items-2 item_right_1"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <span className="number">01</span>
              <div className="icon">
                <i className="flaticon-video-marketing-1"></i>
              </div>
              <div className="content">
                <h3>Discovery &amp; Architecture</h3>
                <p>
                  We analyse your business goals, existing stack, and constraints
                  to design a scalable, secure technical blueprint.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-sm-6">
            <div
              className="icon-box-items-2"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <span className="number">02</span>
              <div className="icon style-2">
                <i className="flaticon-search"></i>
              </div>
              <div className="content">
                <h3>Build &amp; Integrate</h3>
                <p>
                  Agile sprints, CI/CD pipelines, and DevSecOps practices ensure
                  fast, reliable delivery with full transparency.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-sm-6">
            <div
              className="icon-box-items-2 item_left_1"
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <span className="number">03</span>
              <div className="icon style-3">
                <i className="flaticon-keyword"></i>
              </div>
              <div className="content">
                <h3>Optimise &amp; Scale</h3>
                <p>
                  Post-launch monitoring, AI-driven optimisation, and ongoing
                  support keep your systems performing at peak.
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

