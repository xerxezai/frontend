import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.xerxez.com";
const DEFAULT_IMG = `${BASE_URL}/assets/img/og-image.png`;
const SITE_NAME = "XERXEZ";
const TWITTER_HANDLE = "@xerxez";

const DEFAULT_KEYWORDS = "XERXEZ, xerxez, xerxez solutions, XERXEZ Solutions, xerxez.com, xerxez erp, xerxez academy, xerxez ai, xerxez software, xerxez software solutions, xerxez software company, xerxez software development, xerxez software development company, xerxez software development services, xerxez software development solutions, xerxez software development company in india, xerxez software development company in delhi, xerxez software development company in gurgaon, xerxez software development company in noida, xerxez software development company in mumbai, xerxez software development company in bangalore, xerxez software development company in hyderabad, xerxez software development company in pune, xerxez software development company in chennai, xerxez software development company in kolkata, xerxez software development company in jaipur, xerxez software development company in lucknow, xerxez software development company in chandigarh, xerxez software development company in indore, xerxez software development company in bhopal, xerxez software development company in coimbatore, xerxez software development company in visakhapatnam, xerxez software development company in nagpur, xerxez software development company in vadodara, xerxez software development company in surat, xerxez erp abu dhabi, xerxez erp dubai, xerxez erp uae, xerxez erp saudi arabia, xerxez erp oman, xerxez erp qatar, xerxez erp kuwait, xerxez erp bahrain, xerxez erp middle east, xerxez erp africa, xerxez erp europe, xerxez erp asia, xerxez erp australia, xerxez erp canada, xerxez erp usa, xerxez erp uk, xerxez erp germany, xerxez erp france, xerxez erp italy, xerxez erp spain, xerxez erp netherlands, xerxez erp belgium, xerxez erp switzerland, xerxez erp austria, xerxez erp sweden, xerxez erp norway, xerxez erp denmark, xerxez erp finland, xerxez erp ireland , xerxez UAE, xerxez saudi arabia, xerxez oman, xerxez qatar, xerxez kuwait, xerxez bahrain, xerxez middle east, xerxez africa, xerxez europe, xerxez asia, xerxez australia, xerxez canada, xerxez usa, xerxez uk, xerxez germany, xerxez france, xerxez italy, xerxez spain, xerxez netherlands, xerxez belgium, xerxez switzerland, xerxez austria, xerxez sweden, xerxez norway, xerxez denmark, xerxez finland, xerxez ireland, xerxez software solutions abu dhabi, xerxez software solutions dubai, xerxez software solutions uae, xerxez software solutions saudi arabia, xerxez software solutions oman, xerxez software solutions qatar, xerxez software solutions kuwait, xerxez software solutions bahrain, xerxez software solutions middle east, xerxez software solutions africa, xerxez software solutions europe, xerxez software solutions asia, xerxez software solutions australia, xerxez software solutions canada, xerxez software solutions usa, xerxez software solutions uk, xerxez software solutions germany, xerxez software solutions france, xerxez software solutions italy, xerxez software solutions spain, xerxez software solutions netherlands, xerxez software solutions belgium, xerxez software solutions switzerland, xerxez software solutions austria, xerxez software solutions sweden, xerxez software solutions norway, xerxez software solutions denmark, xerxez software solutions finland, xerxez software solutions ireland , xerxez abu dhabi, xerxez dubai, xerxez uae, xerxez saudi arabia, xerxez oman, xerxez qatar, xerxez kuwait, xerxez bahrain, xerxez middle east, xerxez africa, xerxez europe, xerxez asia, xerxez australia, xerxez canada, xerxez usa, xerxez uk, xerxez germany, xerxez france, xerxez italy, xerxez spain, xerxez netherlands, xerxez belgium, xerxez switzerland, xerxez austria, xerxez sweden, xerxez norway, xerxez denmark, xerxez finland, xerxez ireland, AI ERP UAE, ERP Abu Dhabi, ERP software UAE, EPC ERP system, Construction ERP UAE, Manufacturing ERP India, Oil Gas ERP UAE, Healthcare ERP UAE, Facility Management ERP, AI powered ERP India, Enterprise ERP Abu Dhabi, Custom ERP UAE, XERXEZ ERP, MLM software UAE, HR software UAE, CRM software UAE, ERP partner program UAE India, Sell ERP earn commission, XERXEZ partner program, ERP reseller opportunity, 30% commission ERP sales";

// ─── Page-specific SEO presets ────────────────────────────────────────────────
export const PAGE_SEO = {
  careers: {
    title: "Careers at XERXEZ | AI & ERP Jobs UAE & India",
    description:
      "Join XERXEZ team. AI, ERP & DevSecOps careers in UAE & India. Work on cutting-edge AI-powered enterprise solutions.",
    canonical: "/careers",
    keywords:
      "xerxez careers, xerxez jobs, xerxez hiring, full stack ai trainer jobs, mlops engineer jobs, mlflow jobs, remote ai jobs, django react jobs, ai erp jobs india, xerxez remote jobs, ai erp jobs uae, erp careers abu dhabi",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "Full Stack AI Trainer",
        description:
          "Train and develop AI models, create AI course content for the Xerxez Academy platform, and work with students and instructors.",
        hiringOrganization: {
          "@type": "Organization",
          name: "XERXEZ",
          sameAs: "https://www.xerxez.com",
        },
        jobLocation: {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressCountry: "Remote" },
        },
        employmentType: "FULL_TIME",
        workHours: "Flexible",
        datePosted: "2026-07-14",
        applicantLocationRequirements: {
          "@type": "Country",
          name: "Worldwide",
        },
        jobLocationType: "TELECOMMUTE",
      },
      {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "MLOps Engineer (MLflow)",
        description:
          "Build and maintain ML pipelines using MLflow, monitor model performance, and deploy models to production environments.",
        hiringOrganization: {
          "@type": "Organization",
          name: "XERXEZ",
          sameAs: "https://www.xerxez.com",
        },
        jobLocation: {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressCountry: "Remote" },
        },
        employmentType: "FULL_TIME",
        workHours: "Flexible",
        datePosted: "2026-07-14",
        applicantLocationRequirements: {
          "@type": "Country",
          name: "Worldwide",
        },
        jobLocationType: "TELECOMMUTE",
      },
    ],
  },
};

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
  keywords?: string;
  jsonLd?: object | object[];
}

export default function SEO({
  title,
  description,
  canonical = "/",
  ogImage = DEFAULT_IMG,
  ogType = "website",
  ogTitle,
  ogDescription,
  noIndex = false,
  keywords = DEFAULT_KEYWORDS,
  jsonLd,
}: SEOProps) {
  const url = `${BASE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={ogTitle ?? title} />
      <meta property="og:description" content={ogDescription ?? description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={ogTitle ?? title} />
      <meta name="twitter:description" content={ogDescription ?? description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}