import CustomLayout from "../components/layout/CustomLayout";
import ProjectMainSection from "../components/project/ProjectMainSection";
import SEO from "../components/seo/SEO";

const ProjectPage = () => {
  return (
    <CustomLayout>
        <SEO
          title="XERXEZ Portfolio | AI ERP Projects UAE & India"
          description="See XERXEZ enterprise projects and ERP implementations across UAE & India. AI-powered solutions for EPC, Construction & Manufacturing."
          canonical="/project"
          keywords="XERXEZ projects, ERP implementation India, erp implementation UAE, enterprise projects UAE, AI projects Dubai, AI projects Abu Dhabi, Xerxez Solutions, EPC ERP projects, construction ERP projects, manufacturing ERP projects"
        />
        <ProjectMainSection />
    </CustomLayout>
  );
};

export default ProjectPage;

