import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import TeamMainSection from "../components/team/TeamMainSection";

const TeamPage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="Our Team Members" />
        <TeamMainSection />
    </CustomLayout>
  );
};

export default TeamPage;
