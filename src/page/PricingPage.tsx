import BrandSection2 from "../components/brand/BrandSection2";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import WorkingProcessSection2 from "../components/process/WorkingProcessSection2";
import CustomLayout from "../components/layout/CustomLayout";
import PricingSection from "../components/pricing/PricingSection";

const PricingPage = () => {
  return (
    <CustomLayout>
      <BreadcrumbSection title="Our Pricing Plan" />
      <PricingSection variant />
      <BrandSection2 variant />
      <WorkingProcessSection2 />
    </CustomLayout>
  );
};

export default PricingPage;
