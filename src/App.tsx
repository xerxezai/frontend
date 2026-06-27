import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/utils/ScrollToTop";
import AnimationWrapper from "./components/utils/AnimationWrapper";
import BackToTopBtn from "./components/utils/BackToTopBtn";
import FloatingChat from "./components/chat/FloatingChat";
import PageProgress from "./components/utils/PageProgress";

// Lazy-loaded page chunks — each page is its own split point
const HomePage1       = lazy(() => import("./page/HomePage1"));
const HomePage2       = lazy(() => import("./page/HomePage2"));
const HomePage3       = lazy(() => import("./page/HomePage3"));
const HomePage4       = lazy(() => import("./page/HomePage4"));
const AboutPage       = lazy(() => import("./page/AboutPage"));
const BlogPage        = lazy(() => import("./page/BlogPage"));
const BlogDetailPage  = lazy(() => import("./page/BlogDetailPage"));
const ContactPage     = lazy(() => import("./page/ContactPage"));
const FaqPage         = lazy(() => import("./page/FaqPage"));
const PricingPage     = lazy(() => import("./page/PricingPage"));
const ProjectPage     = lazy(() => import("./page/ProjectPage"));
const ProjectDetailPage = lazy(() => import("./page/ProjectDetailPage"));
const ServicePage     = lazy(() => import("./page/ServicePage"));
const ServiceDetailPage = lazy(() => import("./page/ServiceDetailPage"));
const TeamPage        = lazy(() => import("./page/TeamPage"));
const TeamDetailPage  = lazy(() => import("./page/TeamDetailPage"));
const NotFoundPage    = lazy(() => import("./page/NotFoundPage"));
const DocsPage        = lazy(() => import("./page/DocsPage"));
const HealthPage      = lazy(() => import("./page/HealthPage"));
const MLMPage         = lazy(() => import("./page/MLMPage"));
const ERPPage         = lazy(() => import("./page/ERPPage"));
const AIERPPage       = lazy(() => import("./page/AIERPPage"));
const TrainingPage    = lazy(() => import("./page/TrainingPage"));
const LandingPage     = lazy(() => import("./page/LandingPage"));

function App() {
  return (
    <Router>
      <PageProgress />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"                        element={<HomePage1 />} />
          <Route path="/home-2"                  element={<HomePage2 />} />
          <Route path="/home-3"                  element={<HomePage3 />} />
          <Route path="/home-4"                  element={<HomePage4 />} />
          <Route path="/about"                   element={<AboutPage />} />
          <Route path="/blog"                    element={<BlogPage />} />
          <Route path="/blog/:slug"              element={<BlogDetailPage />} />
          <Route path="/contact"                 element={<ContactPage />} />
          <Route path="/faq"                     element={<FaqPage />} />
          <Route path="/pricing"                 element={<PricingPage />} />
          <Route path="/project"                 element={<ProjectPage />} />
          <Route path="/project/:slug"           element={<ProjectDetailPage />} />
          <Route path="/service"                 element={<ServicePage />} />
          <Route path="/service/ai-powered-erp" element={<AIERPPage />} />
          <Route path="/service/:slug"           element={<ServiceDetailPage />} />
          <Route path="/team"                    element={<TeamPage />} />
          <Route path="/team/:slug"              element={<TeamDetailPage />} />
          <Route path="/documentation"           element={<DocsPage />} />
          <Route path="/health"                  element={<HealthPage />} />
          <Route path="/mlm"                     element={<MLMPage />} />
          <Route path="/erp/*"                   element={<ERPPage />} />
          <Route path="/training"                element={<TrainingPage />} />
          <Route path="/landing"                 element={<LandingPage />} />
          <Route path="*"                        element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <AnimationWrapper />
      <BackToTopBtn />
      <FloatingChat />
    </Router>
  );
}

export default App;
