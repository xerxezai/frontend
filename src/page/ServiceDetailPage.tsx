import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import ErrorSection from "../components/error/ErrorSection";
import CustomLayout from "../components/layout/CustomLayout";
import ServiceDetailSection from "../components/service/ServiceDetailSection";
import { services } from "../data";
import { useParams } from "react-router-dom";

const ServiceDetailPage = () => {
  const { slug } = useParams();

  const currentIndex = services.findIndex((item) => item.slug === slug);
  const serviceInfo = services[currentIndex];
  return (
    <CustomLayout>
      <BreadcrumbSection title={serviceInfo ? "Service Details" : "404 Page"} />

      {serviceInfo ? (
        <ServiceDetailSection serviceInfo={serviceInfo} />
      ) : (
        <ErrorSection />
      )}
    </CustomLayout>
  );
};

export default ServiceDetailPage;
