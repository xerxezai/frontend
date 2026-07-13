import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import TeamMainSection from "../components/team/TeamMainSection";
import SEO from "../components/seo/SEO";

const TeamPage = () => {
  return (
    <CustomLayout>
        <SEO
          title="Our Team | AI & Enterprise Technology Experts India & UAE — XERXEZ"
          description="Meet the XERXEZ team of AI, ERP, DevSecOps and cloud experts serving enterprises across India, Dubai & Abu Dhabi UAE."
          canonical="/team"
          keywords="XERXEZ team, AI experts India, ERP consultants UAE, ERP consultants Dubai, ERP experts Abu Dhabi, enterprise tech team India"
        />
        <BreadcrumbSection title="Our Team Members" />
        <TeamMainSection />
    </CustomLayout>
  );
};

export default TeamPage;

