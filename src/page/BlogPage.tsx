import BlogMainSection from "../components/blog/BlogMainSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import NewsletterBar from "../components/newsletter/NewsletterBar";
import SEO from "../components/seo/SEO";

const BlogPage = () => (
  <CustomLayout>
    <SEO
      title="Blog | AI, ERP & Enterprise Tech Insights — XERXEZ India & UAE"
      description="Latest insights on AI, ERP, DevSecOps and enterprise technology from XERXEZ experts. Covering India, Dubai & Abu Dhabi UAE."
      canonical="/blog"
      keywords="AI blog India, ERP blog UAE, enterprise tech blog, DevSecOps articles India, tech blog Dubai, tech blog Abu Dhabi, Xerxez Solutions"
    />
    <BreadcrumbSection title="Our Blog & News" />
    <BlogMainSection />
    <NewsletterBar />
  </CustomLayout>
);

export default BlogPage;
