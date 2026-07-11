import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.xerxez.com";
const DEFAULT_IMG = `${BASE_URL}/assets/img/og-image.png`;
const SITE_NAME = "XERXEZ";
const TWITTER_HANDLE = "@xerxez";

const DEFAULT_KEYWORDS = "XERXEZ, xerxez, xerxez solutions, XERXEZ Solutions, xerxez.com, xerxez erp, xerxez academy, xerxez ai";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  /** Comma-separated keywords. Defaults to the core XERXEZ brand keyword set. */
  keywords?: string;
  /** Structured data — one or more schema.org objects rendered as JSON-LD. */
  jsonLd?: object | object[];
}

export default function SEO({
  title,
  description,
  canonical = "/",
  ogImage = DEFAULT_IMG,
  ogType = "website",
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
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
