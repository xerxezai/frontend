import CounterSection from "../components/counter/CounterSection";
import CustomLayout from "../components/layout/CustomLayout";
import ServiceSection3 from "../components/service/ServiceSection3";
import ProcessTimeline from "../components/timeline/ProcessTimeline";

const ServicePage = () => (
  <CustomLayout>
    <ServiceSection3 mainSection />
    <ProcessTimeline />
    <CounterSection variant="style-3" />
  </CustomLayout>
);

export default ServicePage;
