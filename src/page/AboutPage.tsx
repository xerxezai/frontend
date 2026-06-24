import AboutSection2 from "../components/about/AboutSection2";
import AboutSection6 from "../components/about/AboutSection6";
import BrandSection from "../components/brand/BrandSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
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
        <TestimonySection5 />
    </CustomLayout>
  );
};

export default AboutPage;
