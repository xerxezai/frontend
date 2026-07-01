import { useParams } from "react-router-dom";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import ErrorSection from "../components/error/ErrorSection";
import CustomLayout from "../components/layout/CustomLayout";
import ProjectDetailSection from "../components/project/ProjectDetailSection";
import { projectsData } from "../data";

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const currentIndex = projectsData.findIndex((item) => item.slug === slug);
  const projectInfo = projectsData[currentIndex];

  return (
    <CustomLayout>
      {projectInfo ? (
        // Hero replaces breadcrumb for valid projects
        <ProjectDetailSection projectInfo={projectInfo} currentIndex={currentIndex} />
      ) : (
        <>
          <BreadcrumbSection title="404 Page" />
          <ErrorSection />
        </>
      )}
    </CustomLayout>
  );
};

export default ProjectDetailPage;
