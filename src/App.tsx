import { lazy, Suspense, Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class PageErrorBoundary extends Component<{ children: ReactNode }, { caught: boolean }> {
  state = { caught: false };
  componentDidCatch(_e: Error, _i: ErrorInfo) { this.setState({ caught: true }); }
  static getDerivedStateFromError() { return { caught: true }; }
  render() {
    if (this.state.caught) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", color: "#6b7280", fontSize: 15 }}>
          Something went wrong. <a href="/" style={{ marginLeft: 8, color: "#C9883A" }}>Go home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
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
const DevSecOpsPage   = lazy(() => import("./page/DevSecOpsPage"));
const CloudPage       = lazy(() => import("./page/CloudPage"));
const SoftwareDevPage = lazy(() => import("./page/SoftwareDevPage"));
const AITrainingPage  = lazy(() => import("./page/AITrainingPage"));
const QuantumPage     = lazy(() => import("./page/QuantumPage"));
const MobilePage      = lazy(() => import("./page/MobilePage"));
const HostingPage     = lazy(() => import("./page/HostingPage"));
const ConsultingPage  = lazy(() => import("./page/ConsultingPage"));
const TrainingPage       = lazy(() => import("./page/TrainingPage"));
const LandingPage        = lazy(() => import("./page/LandingPage"));
const PrivacyPolicyPage  = lazy(() => import("./page/PrivacyPolicyPage"));
const TermsPage          = lazy(() => import("./page/TermsPage"));

// LMA (Learning Management Application)
const LMALoginPage              = lazy(() => import("./page/lma/LMALoginPage"));
const LMARegisterPage           = lazy(() => import("./page/lma/LMARegisterPage"));
const LMAStudentDashboard       = lazy(() => import("./page/lma/LMAStudentDashboard"));
const LMAInstructorDashboard    = lazy(() => import("./page/lma/LMAInstructorDashboard"));
const LMACoursesPage            = lazy(() => import("./page/lma/LMACoursesPage"));
const LMACourseDetailPage       = lazy(() => import("./page/lma/LMACourseDetailPage"));
const LMAMyCoursesPage          = lazy(() => import("./page/lma/LMAMyCoursesPage"));
const LMABrowseCoursesPage      = lazy(() => import("./page/lma/LMABrowseCoursesPage"));
const LMAAssignmentsPage        = lazy(() => import("./page/lma/LMAAssignmentsPage"));
const LMACertificatesPage       = lazy(() => import("./page/lma/LMACertificatesPage"));
const LMAProgressPage           = lazy(() => import("./page/lma/LMAProgressPage"));
const LMAContinueLearningPage   = lazy(() => import("./page/lma/LMAContinueLearningPage"));
const LMAProfilePage            = lazy(() => import("./page/lma/LMAProfilePage"));

function App() {
  return (
    <Router>
      <PageProgress />
      <ScrollToTop />
      <PageErrorBoundary>
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
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
          <Route path="/service/ai-powered-erp"             element={<AIERPPage />} />
          <Route path="/service/devsecops-mlops-solutions" element={<DevSecOpsPage />} />
          <Route path="/service/cloud-service-storage"     element={<CloudPage />} />
          <Route path="/service/software-development"      element={<SoftwareDevPage />} />
          <Route path="/service/ai-training-consulting"    element={<AITrainingPage />} />
          <Route path="/service/quantum-computing"         element={<QuantumPage />} />
          <Route path="/service/mobile-application"        element={<MobilePage />} />
          <Route path="/service/web-mobile-hosting"        element={<HostingPage />} />
          <Route path="/service/software-consulting"       element={<ConsultingPage />} />
          <Route path="/service/:slug"                     element={<ServiceDetailPage />} />
          <Route path="/team"                    element={<TeamPage />} />
          <Route path="/team/:slug"              element={<TeamDetailPage />} />
          <Route path="/documentation"           element={<DocsPage />} />
          <Route path="/health"                  element={<HealthPage />} />
          <Route path="/mlm"                     element={<MLMPage />} />
          <Route path="/erp/*"                   element={<ERPPage />} />
          <Route path="/training"                element={<TrainingPage />} />
          <Route path="/landing"                 element={<LandingPage />} />
          <Route path="/privacy"                 element={<PrivacyPolicyPage />} />
          <Route path="/terms"                   element={<TermsPage />} />

          {/* LMA routes */}
          <Route path="/lma/login"                        element={<LMALoginPage />} />
          <Route path="/lma/register"                     element={<LMARegisterPage />} />
          <Route path="/lma/student/dashboard"            element={<LMAStudentDashboard />} />
          <Route path="/lma/student/courses"              element={<LMAMyCoursesPage />} />
          <Route path="/lma/student/continue-learning"    element={<LMAContinueLearningPage />} />
          <Route path="/lma/student/browse"               element={<LMABrowseCoursesPage />} />
          <Route path="/lma/student/assignments"          element={<LMAAssignmentsPage />} />
          <Route path="/lma/student/certificates"         element={<LMACertificatesPage />} />
          <Route path="/lma/student/progress"             element={<LMAProgressPage />} />
          <Route path="/lma/student/profile"              element={<LMAProfilePage />} />
          <Route path="/lma/instructor/dashboard"         element={<LMAInstructorDashboard />} />
          <Route path="/lma/courses"                      element={<LMACoursesPage />} />
          <Route path="/lma/courses/:id"                  element={<LMACourseDetailPage />} />

          <Route path="*"                        element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </PageErrorBoundary>
      <AnimationWrapper />
      <BackToTopBtn />
      <FloatingChat />
    </Router>
  );
}

export default App;
