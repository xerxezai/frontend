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
      title="Our Services | AI ERP, DevSecOps, Cloud & More — XERXEZ India & UAE"
      description="Explore XERXEZ services: AI ERP, DevSecOps, cloud infrastructure, software development, mobile apps, AI training for enterprises in India, Dubai & Abu Dhabi UAE."
      canonical="/service"
      keywords="AI ERP services India, DevSecOps services UAE, cloud services India, IT services Dubai, IT services Abu Dhabi, AI consulting UAE, Xerxez Solutions"
      jsonLd={SERVICES_JSONLD}
    />
    <ServiceSection3 mainSection />
    <ProcessTimeline />
    <CounterSection variant="style-3" />
    <ReadyCTA />
  </CustomLayout>
);

export default ServicePage;
