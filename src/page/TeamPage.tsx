import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import TeamMainSection from "../components/team/TeamMainSection";
import SEO from "../components/seo/SEO";

const TeamPage = () => {
  return (
    <CustomLayout>
        <SEO
          title="Our Team — AI & Cloud Engineers | XERXEZ"
          description="Meet the XERXEZ team of AI engineers, cloud architects, and ERP consultants building enterprise solutions across UAE and India."
          canonical="/team"
        />
        <BreadcrumbSection title="Our Team Members" />
        <TeamMainSection />
    </CustomLayout>
  );
};

export default TeamPage;

