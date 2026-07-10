import ContactSection2 from "../components/contact/ContactSection2";
import ContactTrustBar from "../components/contact/ContactTrustBar";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";

const ContactPage = () => (
  <CustomLayout>
    <SEO
      title="Contact XERXEZ — Book Free Enterprise Consultation | +971 56 786 7451"
      description="Get in touch with XERXEZ for enterprise AI ERP, DevSecOps, and cloud solutions. India & UAE, remote-first. We respond within 24 hours — free consultation available."
      canonical="/contact"
    />
    <ContactSection2 />
    <ContactTrustBar />
  </CustomLayout>
);

export default ContactPage;
