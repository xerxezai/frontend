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
      <BreadcrumbSection
        title={projectInfo ? "Case Study Details" : "404 Page"}
      />

      {/* Wrap the conditional rendering block */}
      {projectInfo ? (
        <ProjectDetailSection
          projectInfo={projectInfo}
          currentIndex={currentIndex}
        />
      ) : (
        <ErrorSection />
      )}
    </CustomLayout>
  );
};

export default ProjectDetailPage;
