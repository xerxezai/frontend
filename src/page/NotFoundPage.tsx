import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import ErrorSection from "../components/error/ErrorSection";
import CustomLayout from "../components/layout/CustomLayout";

const NotFoundPage = () => {
  return (
    <CustomLayout>
        <BreadcrumbSection title="404 Page" />
        <ErrorSection />
    </CustomLayout>
  );
};

export default NotFoundPage;
