import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BackToTopBtn from "./components/utils/BackToTopBtn";
import ScrollToTop from "./components/utils/ScrollToTop";
import AnimationWrapper from "./components/utils/AnimationWrapper";

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

function App() {
  return (
    <Router>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage1 />} />
          <Route path="/home-2" element={<HomePage2 />} />
          <Route path="/home-3" element={<HomePage3 />} />
          <Route path="/home-4" element={<HomePage4 />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/service/:slug" element={<ServiceDetailPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:slug" element={<TeamDetailPage />} />
          <Route path="/documentation" element={<DocsPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <AnimationWrapper />
        <BackToTopBtn />
    </Router>
  );
}

export default App;
