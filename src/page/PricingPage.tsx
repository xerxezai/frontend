import { Navigate } from "react-router-dom";
import SEO from "../components/seo/SEO";

const PricingPage = () => (
  <>
    <SEO
      title="Pricing | AI ERP & Enterprise Software Plans India & UAE — XERXEZ"
      description="Explore XERXEZ pricing plans for AI ERP, DevSecOps and cloud solutions for enterprises in India, Dubai & Abu Dhabi UAE."
      canonical="/pricing"
      keywords="ERP pricing India, AI software pricing UAE, ERP pricing Dubai, ERP pricing Abu Dhabi, enterprise software cost India"
    />
    <Navigate to="/contact" replace />
  </>
);

export default PricingPage;
