import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import ContactSection2 from "../components/contact/ContactSection2";
import ContactSection3 from "../components/contact/ContactSection3";
import MapSection from "../components/contact/MapSection";
import CustomLayout from "../components/layout/CustomLayout";

const ContactPage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="Contact Us" />
        <ContactSection3 />
        <ContactSection2 />
        <MapSection />
    </CustomLayout>
  );
};

export default ContactPage;
