import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CoreAdvantageSection from "../components/core-advantage/CoreAdvantageSection";
import CounterSection from "../components/counter/CounterSection";
import FaqSection2 from "../components/faq/FaqSection2";
import CustomLayout from "../components/layout/CustomLayout";
import PricingSection from "../components/pricing/PricingSection";
import TestimonySection6 from "../components/testimony/TestimonySection6";
import ServiceSection3 from "../components/service/ServiceSection3";

const ServicePage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="Our Services" />
        <ServiceSection3 mainSection />
        <CoreAdvantageSection variant />
        <CounterSection variant="style-3" />
        <PricingSection />
        <TestimonySection6 />
        <FaqSection2 variant reverse />
    </CustomLayout>
  );
};

export default ServicePage;
