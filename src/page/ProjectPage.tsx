import CustomLayout from "../components/layout/CustomLayout";
import ProjectMainSection from "../components/project/ProjectMainSection";
import SEO from "../components/seo/SEO";

const ProjectPage = () => {
  return (
    <CustomLayout>
        <SEO
          title="Our Projects | Enterprise AI & ERP Implementations India & UAE — XERXEZ"
          description="Explore XERXEZ enterprise projects — AI ERP implementations, DevSecOps and cloud solutions across India, Dubai & Abu Dhabi UAE."
          canonical="/project"
          keywords="XERXEZ projects, ERP implementation India, erp implementation UAE, enterprise projects UAE, AI projects Dubai, AI projects Abu Dhabi, Xerxez Solutions"
        />
        <ProjectMainSection />
    </CustomLayout>
  );
};

export default ProjectPage;

