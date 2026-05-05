import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import ProjectMainSection from "../components/project/ProjectMainSection";

const ProjectPage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="Our Case Study" />
        <ProjectMainSection />
    </CustomLayout>
  );
};

export default ProjectPage;
