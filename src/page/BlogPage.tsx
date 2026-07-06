import BlogMainSection from "../components/blog/BlogMainSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import NewsletterBar from "../components/newsletter/NewsletterBar";
import SEO from "../components/seo/SEO";

const BlogPage = () => (
  <CustomLayout>
    <SEO
      title="Blog & Insights — AI ERP, MLOps & Cloud | XERXEZ"
      description="Read XERXEZ blog for insights on enterprise AI, ERP systems, MLOps best practices, and cloud infrastructure trends."
      canonical="/blog"
    />
    <BreadcrumbSection title="Our Blog & News" />
    <BlogMainSection />
    <NewsletterBar />
  </CustomLayout>
);

export default BlogPage;
