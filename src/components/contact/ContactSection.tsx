import ContactFormSection from "../forms/ContactFormSection";
import Image from "../utils/Image";

const ContactSection = () => {
  return (
    <section className="contact-section section-padding bg-cover fix">
      <div className="container">
        <div className="contect-wrapper">
          <div className="row">
            <div className="col-lg-6">
              <div className="contact-content">
                <div className="section-title mb-0">
                  <span className="fade-in">Contact Us</span>
                  <h2 className="char-animation">
                    Let Us Take Your Product
                    <br /> To The Next Level
                  </h2>
                </div>
                <ContactFormSection />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contect-image float-bob-y">
                <Image
                  src="assets/img/contact/02.png"
                  alt="img"
                  width={576}
                  height={555}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
