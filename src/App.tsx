import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/utils/ScrollToTop";
import AnimationWrapper from "./components/utils/AnimationWrapper";
import BackToTopBtn from "./components/utils/BackToTopBtn";
import FloatingChat from "./components/chat/FloatingChat";
import PageProgress from "./components/utils/PageProgress";

// Direct imports for all pages
import HomePage1 from "./page/HomePage1";
import HomePage2 from "./page/HomePage2";
import HomePage3 from "./page/HomePage3";
import HomePage4 from "./page/HomePage4";
import AboutPage from "./page/AboutPage";
import BlogPage from "./page/BlogPage";
import BlogDetailPage from "./page/BlogDetailPage";
import ContactPage from "./page/ContactPage";
import FaqPage from "./page/FaqPage";
import PricingPage from "./page/PricingPage";
import ProjectPage from "./page/ProjectPage";
import ProjectDetailPage from "./page/ProjectDetailPage";
import ServicePage from "./page/ServicePage";
import ServiceDetailPage from "./page/ServiceDetailPage";
import TeamPage from "./page/TeamPage";
import TeamDetailPage from "./page/TeamDetailPage";
import NotFoundPage from "./page/NotFoundPage";
import DocsPage from "./page/DocsPage";
import HealthPage from "./page/HealthPage";
import MLMPage from "./page/MLMPage";
import ERPPage from "./page/ERPPage";
import AIERPPage from "./page/AIERPPage";
import TrainingPage from "./page/TrainingPage";

function App() {
  return (
    <Router>
      <PageProgress />
      <ScrollToTop />
      <Routes>
        <Route path="/"                       element={<HomePage1 />} />
        <Route path="/home-2"                 element={<HomePage2 />} />
        <Route path="/home-3"                 element={<HomePage3 />} />
        <Route path="/home-4"                 element={<HomePage4 />} />
        <Route path="/about"                  element={<AboutPage />} />
        <Route path="/blog"                   element={<BlogPage />} />
        <Route path="/blog/:slug"             element={<BlogDetailPage />} />
        <Route path="/contact"                element={<ContactPage />} />
        <Route path="/faq"                    element={<FaqPage />} />
        <Route path="/pricing"                element={<PricingPage />} />
        <Route path="/project"                element={<ProjectPage />} />
        <Route path="/project/:slug"          element={<ProjectDetailPage />} />
        <Route path="/service"                element={<ServicePage />} />
        <Route path="/service/ai-powered-erp" element={<AIERPPage />} />
        <Route path="/service/:slug"          element={<ServiceDetailPage />} />
        <Route path="/team"                   element={<TeamPage />} />
        <Route path="/team/:slug"             element={<TeamDetailPage />} />
        <Route path="/documentation"          element={<DocsPage />} />
        <Route path="/health"                 element={<HealthPage />} />
        <Route path="/mlm"                    element={<MLMPage />} />
        <Route path="/erp/*"                  element={<ERPPage />} />
        <Route path="/training"               element={<TrainingPage />} />
        <Route path="*"                       element={<NotFoundPage />} />
      </Routes>
      <AnimationWrapper />
      <BackToTopBtn />
      <FloatingChat />
    </Router>
  );
}

export default App;
