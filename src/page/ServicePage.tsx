import CounterSection from "../components/counter/CounterSection";
import CustomLayout from "../components/layout/CustomLayout";
import ReadyCTA from "../components/marketing/ReadyCTA";
import ServiceSection3 from "../components/service/ServiceSection3";
import ProcessTimeline from "../components/timeline/ProcessTimeline";
import SEO from "../components/seo/SEO";
import { services } from "../data";

const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.description,
      url: `https://www.xerxez.com/service/${s.slug}`,
      provider: { "@type": "Organization", name: "XERXEZ", url: "https://www.xerxez.com" },
    },
  })),
};

const ServicePage = () => (
  <CustomLayout>
    <SEO
      title="Enterprise AI Services — ERP, DevSecOps, Cloud Infrastructure | XERXEZ"
      description="Explore XERXEZ enterprise services: AI ERP, MLOps pipelines, DevSecOps, cloud infrastructure, and software development. End-to-end solutions for modern enterprises."
      canonical="/service"
      jsonLd={SERVICES_JSONLD}
    />
    <ServiceSection3 mainSection />
    <ProcessTimeline />
    <CounterSection variant="style-3" />
    <ReadyCTA />
  </CustomLayout>
);

export default ServicePage;
