import { useParams } from "react-router-dom";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import ErrorSection from "../components/error/ErrorSection";
import CustomLayout from "../components/layout/CustomLayout";
import TeamDetailSection from "../components/team/TeamDetailSection";
import { teamData } from "../data";

const TeamDetailPage = () => {
  const { slug } = useParams();

  const currentIndex = teamData.findIndex((item) => item.slug === slug);
  const teamInfo = teamData[currentIndex];
  return (
    <CustomLayout>
      <BreadcrumbSection title={teamInfo ? "Team Details" : "404 Page"} />
      {teamInfo ? <TeamDetailSection teamInfo={teamInfo} /> : <ErrorSection />}
    </CustomLayout>
  );
};

export default TeamDetailPage;
