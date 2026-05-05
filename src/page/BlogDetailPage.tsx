import { useParams } from "react-router-dom";
import BlogDetailSection from "../components/blog/BlogDetailSection";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import ErrorSection from "../components/error/ErrorSection";
import CustomLayout from "../components/layout/CustomLayout";
import { blogMainPosts } from "../data";

const BlogDetailPage = () => {
  const { slug } = useParams();

  const currentIndex = blogMainPosts.findIndex((item) => item.slug === slug);
  const blogInfo = blogMainPosts[currentIndex];
  return (
    <CustomLayout>
      <BreadcrumbSection title={blogInfo ? "Blog Details" : "404 Page"} />
        {blogInfo ? (
          <BlogDetailSection blogInfo={blogInfo} />
        ) : (
          <ErrorSection />
        )}
    </CustomLayout>
  );
};

export default BlogDetailPage;
