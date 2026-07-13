import { Navigate } from "react-router-dom";
import SEO from "../components/seo/SEO";

const FaqPage = () => (
  <>
    <SEO
      title="FAQ | Common Questions About XERXEZ AI ERP & Services India & UAE"
      description="Find answers to common questions about XERXEZ AI ERP, DevSecOps, cloud solutions, pricing and implementation for India, Dubai & Abu Dhabi."
      canonical="/faq"
      keywords="XERXEZ FAQ, ERP questions India, AI ERP FAQ UAE, ERP FAQ Dubai, ERP FAQ Abu Dhabi, enterprise software questions India UAE, Xerxez Solutions"
    />
    <Navigate to="/contact" replace />
  </>
);

export default FaqPage;
