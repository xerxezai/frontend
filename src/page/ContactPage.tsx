import ContactSection2 from "../components/contact/ContactSection2";
import ContactTrustBar from "../components/contact/ContactTrustBar";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";

const ContactPage = () => (
  <CustomLayout>
    <SEO
      title="Contact XERXEZ | Book Free ERP Demo | Abu Dhabi & India"
      description="Contact XERXEZ for AI-powered ERP solutions in UAE & India. Book a free demo for EPC, Construction, Manufacturing ERP. Abu Dhabi office available."
      canonical="/contact"
      keywords="contact XERXEZ, book demo ERP India, ERP consultation Dubai, ERP consultation Abu Dhabi, XERXEZ support, Xerxez Solutions, ERP demo UAE, EPC ERP demo, construction ERP demo, manufacturing ERP demo"
    />
    <ContactSection2 />
    <ContactTrustBar />
  </CustomLayout>
);

export default ContactPage;
