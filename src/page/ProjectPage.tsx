import CustomLayout from "../components/layout/CustomLayout";
import ProjectMainSection from "../components/project/ProjectMainSection";
import SEO from "../components/seo/SEO";

const ProjectPage = () => {
  return (
    <CustomLayout>
        <SEO
          title="Projects & Case Studies — AI ERP, Healthcare, Oil & Gas | XERXEZ"
          description="Explore XERXEZ's portfolio of AI-powered ERP implementations, MLOps platforms, and cloud solutions across UAE, India, and the UK."
          canonical="/project"
        />
        <ProjectMainSection />
    </CustomLayout>
  );
};

export default ProjectPage;

