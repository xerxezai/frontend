import AboutSection2 from "../components/about/AboutSection2";
import AboutSection6 from "../components/about/AboutSection6";
import BlogSection2 from "../components/blog/BlogSection2";
import BrandSection from "../components/brand/BrandSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import FaqSection2 from "../components/faq/FaqSection2";
import CustomLayout from "../components/layout/CustomLayout";
import PricingSection from "../components/pricing/PricingSection";
import ProjectSection4 from "../components/project/ProjectSection4";
import TestimonySection5 from "../components/testimony/TestimonySection5";
const AboutPage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="About Company" />
        <AboutSection2 variant />
        <ProjectSection4 variant />
        <AboutSection6 />
        <BrandSection variant="style-3" />
        <PricingSection />
        <TestimonySection5 />
        <BlogSection2 variant />
        <FaqSection2 variant />
    </CustomLayout>
  );
};

export default AboutPage;
