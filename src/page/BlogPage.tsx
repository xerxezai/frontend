import BlogMainSection from "../components/blog/BlogMainSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import CustomLayout from "../components/layout/CustomLayout";

const BlogPage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="Our Blog & News" />
        <BlogMainSection />
    </CustomLayout>
  );
};

export default BlogPage;
