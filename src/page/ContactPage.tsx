import ContactSection2 from "../components/contact/ContactSection2";
import ContactTrustBar from "../components/contact/ContactTrustBar";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";

const ContactPage = () => (
  <CustomLayout>
    <SEO
      title="Contact XERXEZ — Enterprise AI Solutions"
      description="Get in touch with XERXEZ for enterprise AI ERP, MLOps, and cloud solutions. Offices in UAE & India. Free consultation available."
      canonical="/contact"
    />
    <ContactSection2 />
    <ContactTrustBar />
  </CustomLayout>
);

export default ContactPage;
