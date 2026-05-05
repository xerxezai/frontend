import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import ContactSection from "../components/contact/ContactSection";
import FaqSection from "../components/faq/FaqSection";
import CustomLayout from "../components/layout/CustomLayout";

const FaqPage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="Our FAQs" />
        <FaqSection variant />
        <ContactSection />
    </CustomLayout>
  );
};

export default FaqPage;
