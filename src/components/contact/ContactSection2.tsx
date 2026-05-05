import ContactFormSection from "../forms/ContactFormSection";
import Image from "../utils/Image";

const ContactSection2 = () => {
  return (
    <section className="contact-section-6">
      <div className="container">
        <div className="contact-wrapper-6">
          <div className="plane-shape float-bob-y">
            <Image
              src="assets/img/plane-shape.png"
              alt="img"
              width={196}
              height={195}
            />
          </div>
          <div className="section-title text-center">
            <span className="fade-in">Contact Us</span>
            <h2 className="char-animation">
              Let Us Take Your Product <br /> To The Next Level
            </h2>
          </div>
          <ContactFormSection variant />
        </div>
      </div>
    </section>
  );
};

export default ContactSection2;
