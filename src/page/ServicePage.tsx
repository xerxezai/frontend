import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CoreAdvantageSection from "../components/core-advantage/CoreAdvantageSection";
import CounterSection from "../components/counter/CounterSection";
import CustomLayout from "../components/layout/CustomLayout";
import TestimonySection6 from "../components/testimony/TestimonySection6";
import ServiceSection3 from "../components/service/ServiceSection3";

const ServicePage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="Our Services" />
        <ServiceSection3 mainSection />
        <CoreAdvantageSection variant />
        <CounterSection variant="style-3" />
        <TestimonySection6 />
    </CustomLayout>
  );
};

export default ServicePage;
