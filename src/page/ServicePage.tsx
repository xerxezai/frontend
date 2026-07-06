import CounterSection from "../components/counter/CounterSection";
import CustomLayout from "../components/layout/CustomLayout";
import ServiceSection3 from "../components/service/ServiceSection3";
import ProcessTimeline from "../components/timeline/ProcessTimeline";
import SEO from "../components/seo/SEO";

const ServicePage = () => (
  <CustomLayout>
    <SEO
      title="Enterprise AI Services — ERP, MLOps, SecOps & Cloud | XERXEZ"
      description="Explore XERXEZ enterprise services: AI ERP, MLOps pipelines, DevSecOps, cloud infrastructure, and software development. End-to-end solutions for modern enterprises."
      canonical="/service"
    />
    <ServiceSection3 mainSection />
    <ProcessTimeline />
    <CounterSection variant="style-3" />
  </CustomLayout>
);

export default ServicePage;
