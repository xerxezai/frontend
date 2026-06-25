import AboutSection2 from "../components/about/AboutSection2";
import BrandSection from "../components/brand/BrandSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import ProjectSection4 from "../components/project/ProjectSection4";
import TeamStatsBento from "../components/team/TeamStatsBento";
import CoreValuesSection from "../components/values/CoreValuesSection";

const AboutPage = () => (
  <CustomLayout>
    <BreadcrumbSection title="About Company" />
    <TeamStatsBento />
    <AboutSection2 variant />
    <CoreValuesSection />
    <ProjectSection4 variant />
    <BrandSection variant="style-3" />
  </CustomLayout>
);

export default AboutPage;
