import ContactSection2 from "../components/contact/ContactSection2";
import ContactTrustBar from "../components/contact/ContactTrustBar";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";

const ContactPage = () => (
  <CustomLayout>
    <SEO
      title="Contact XERXEZ | Book Free Demo — AI ERP India, Dubai & Abu Dhabi"
      description="Contact XERXEZ for AI ERP, DevSecOps and cloud solutions. Book a free enterprise demo. Serving India, Dubai & Abu Dhabi UAE."
      canonical="/contact"
      keywords="contact XERXEZ, book demo ERP India, ERP consultation Dubai, ERP consultation Abu Dhabi, XERXEZ support"
    />
    <ContactSection2 />
    <ContactTrustBar />
  </CustomLayout>
);

export default ContactPage;
