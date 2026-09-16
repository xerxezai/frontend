// ServiceDetailPageV2.tsx
// Purpose: /v2/services/:slug — ONE dynamic page for all 10 service detail
//          pages, replacing the 10 near-identical wrapper files (Software
//          DevelopmentPage.tsx, MobileApplicationPage.tsx, etc.) that each
//          only varied a slug string, an eyebrow label, and two image
//          imports. Reads the slug from the URL, looks up its entry in
//          `services` (via getServiceDetail) and its per-slug config below,
//          and renders the shared XerxezServiceTemplate. A slug with no match
//          (bad link, stale bookmark, a renamed slug) redirects to
//          /v2/services with a toast — the same class of "recoverable 404"
//          the app's top-level catch-all route already handles for unknown
//          URLs — instead of crashing the whole route.
// Used in: src/App.tsx  (route: /v2/services/:slug)
// Data source: services[] in src/data/index.ts (via getServiceDetail); the
//              eyebrow/hero photo/illustration photo per slug are this
//              file's own SERVICE_PAGE_CONFIG, the same values every one of
//              the 10 former page files hardcoded individually.

import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../components/seo/SEO";
import { XerxezShell, XerxezServiceTemplate, getServiceDetail } from "../../../components/v2";

import aiPoweredErpHero from "../../../assets/images/services/ai-powered-erp.jpg";
import aiPoweredErpIllustration from "../../../assets/images/services/ai-powered-erp-illustration.jpg";
import softwareDevelopmentHero from "../../../assets/images/services/software-development.jpg";
import softwareDevelopmentIllustration from "../../../assets/images/services/software-development-illustration.jpg";
import aiTrainingConsultingHero from "../../../assets/images/services/ai-training-consulting.jpg";
import aiTrainingConsultingIllustration from "../../../assets/images/services/ai-training-consulting-illustration.jpg";
import mobileApplicationHero from "../../../assets/images/services/mobile-application.jpg";
import mobileApplicationIllustration from "../../../assets/images/services/mobile-application-illustration.jpg";
import erpIndustriesHero from "../../../assets/images/services/erp-industries.jpg";
import erpIndustriesIllustration from "../../../assets/images/services/erp-industries-illustration.jpg";
import devSecOpsHero from "../../../assets/images/services/devsecops-mlops-solutions.jpg";
import devSecOpsIllustration from "../../../assets/images/services/devsecops-mlops-solutions-illustration.jpg";
import cloudInfrastructureHero from "../../../assets/images/services/cloud-service-storage.jpg";
import cloudInfrastructureIllustration from "../../../assets/images/services/cloud-service-storage-illustration.jpg";
import quantumComputingHero from "../../../assets/images/services/quantum-computing.jpg";
import quantumComputingIllustration from "../../../assets/images/services/quantum-computing-illustration.jpg";
import webMobileHostingHero from "../../../assets/images/services/web-mobile-hosting.jpg";
import webMobileHostingIllustration from "../../../assets/images/services/web-mobile-hosting-illustration.jpg";
import softwareConsultingHero from "../../../assets/images/services/software-consulting.jpg";
import softwareConsultingIllustration from "../../../assets/images/services/software-consulting-illustration.jpg";

// Per-slug: the short category eyebrow + hero/illustration photos. The only
// thing that ever varied across the old 10 page files — everything else
// (SEO shape, XerxezShell wrap, template props) is identical and now lives once,
// below, instead of copy-pasted per file.
const SERVICE_PAGE_CONFIG: Record<string, { eyebrow: string; heroImage: string; illustrationImage: string }> = {
  "ai-powered-erp":            { eyebrow: "Enterprise ERP",       heroImage: aiPoweredErpHero,          illustrationImage: aiPoweredErpIllustration },
  "software-development":      { eyebrow: "Custom Software",      heroImage: softwareDevelopmentHero,    illustrationImage: softwareDevelopmentIllustration },
  "ai-training-consulting":    { eyebrow: "AI Training",          heroImage: aiTrainingConsultingHero,   illustrationImage: aiTrainingConsultingIllustration },
  "mobile-application":        { eyebrow: "Mobile Apps",          heroImage: mobileApplicationHero,      illustrationImage: mobileApplicationIllustration },
  "erp-industries":            { eyebrow: "Industry ERP",         heroImage: erpIndustriesHero,          illustrationImage: erpIndustriesIllustration },
  "devsecops-mlops-solutions": { eyebrow: "DevSecOps",            heroImage: devSecOpsHero,              illustrationImage: devSecOpsIllustration },
  "cloud-service-storage":     { eyebrow: "Cloud Infrastructure", heroImage: cloudInfrastructureHero,    illustrationImage: cloudInfrastructureIllustration },
  "quantum-computing":         { eyebrow: "Quantum Computing",    heroImage: quantumComputingHero,       illustrationImage: quantumComputingIllustration },
  "web-mobile-hosting":        { eyebrow: "Managed Hosting",      heroImage: webMobileHostingHero,       illustrationImage: webMobileHostingIllustration },
  "software-consulting":       { eyebrow: "Strategic Consulting", heroImage: softwareConsultingHero,     illustrationImage: softwareConsultingIllustration },
};

const ServiceDetailPageV2 = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceDetail(slug) : undefined;
  const config = slug ? SERVICE_PAGE_CONFIG[slug] : undefined;

  // A bad/renamed slug (or a slug missing its config entry) is a recoverable
  // 404, not a crash — tell the visitor once, then send them somewhere useful.
  const notFound = !service || !config;
  useEffect(() => {
    if (notFound) toast.error("That service page doesn't exist — showing all services instead.");
  }, [notFound]);

  if (notFound) return <Navigate to="/v2/services" replace />;

  return (
    <XerxezShell>
      <SEO
        title={`${service.title} | XERXEZ`}
        description={service.description}
        canonical={`/v2/services/${slug}`}   // derived from the URL param, not retyped per page
        noIndex
      />
      <XerxezServiceTemplate service={service} heroImage={config.heroImage} illustrationImage={config.illustrationImage} eyebrow={config.eyebrow} />
    </XerxezShell>
  );
};

export default ServiceDetailPageV2;
