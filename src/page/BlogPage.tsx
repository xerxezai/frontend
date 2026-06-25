import BlogMainSection from "../components/blog/BlogMainSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";
import NewsletterBar from "../components/newsletter/NewsletterBar";

const BlogPage = () => (
  <CustomLayout>
    <BreadcrumbSection title="Our Blog & News" />
    <BlogMainSection />
    <NewsletterBar />
  </CustomLayout>
);

export default BlogPage;
