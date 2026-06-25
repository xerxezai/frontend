import ContactSection2 from "../components/contact/ContactSection2";
import ContactTrustBar from "../components/contact/ContactTrustBar";
import MapSection from "../components/contact/MapSection";
import CustomLayout from "../components/layout/CustomLayout";

const ContactPage = () => (
  <CustomLayout>
    <ContactSection2 />
    <ContactTrustBar />
    <MapSection />
  </CustomLayout>
);

export default ContactPage;
