import { lazy, Suspense, Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
class PageErrorBoundary extends Component<{ children: ReactNode }, { caught: boolean }> {
  state = { caught: false };
  componentDidCatch(e: Error, i: ErrorInfo) { console.error('PageErrorBoundary caught:', e, i.componentStack); this.setState({ caught: true }); }
  static getDerivedStateFromError() { return { caught: true }; }
  render() {
    if (this.state.caught) {
      // This boundary wraps every route, v1 and /v2 alike. A crash on a /v2
      // page should show the v2 navy/red theme instead of the v1 fallback's
      // cream background — checked at render time (not cached) since the
      // path that crashed is whatever the user was on when it happened.
      const isV2 = typeof window !== "undefined" && window.location.pathname.startsWith("/v2");
      return isV2 ? (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#071a33", fontFamily: "'Poppins',sans-serif", color: "#fff", fontSize: 15 }}>
          Something went wrong. <a href="/v2" style={{ marginLeft: 8, color: "#D93522" }}>Go home</a>
        </div>
      ) : (
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
const ERPIndustriesPage      = lazy(() => import("./page/ERPIndustriesPage"));
const ERPLandingPage         = lazy(() => import("./page/ERPLandingPage"));
const ERPIndustryDetailPage  = lazy(() => import("./page/ERPIndustryDetailPage"));
const LandingPage        = lazy(() => import("./page/LandingPage"));
const PrivacyPolicyPage  = lazy(() => import("./page/PrivacyPolicyPage"));
const TermsPage          = lazy(() => import("./page/TermsPage"));
const CareersPage        = lazy(() => import("./page/CareersPage"));
const PartnersPage       = lazy(() => import("./page/PartnersPage"));
const HomeV2             = lazy(() => import("./page/v2/HomeV2"));
const AboutV2            = lazy(() => import("./page/v2/AboutV2"));
const ServicesV2         = lazy(() => import("./page/v2/ServicesV2"));
const PortfolioV2        = lazy(() => import("./page/v2/PortfolioV2"));
const ContactV2          = lazy(() => import("./page/v2/ContactV2"));
const TrainingV2         = lazy(() => import("./page/v2/TrainingV2"));
const CareersV2          = lazy(() => import("./page/v2/CareersV2"));
// One dynamic page for all 10 service detail routes (was 10 near-identical wrapper files)
const ServiceDetailPageV2 = lazy(() => import("./page/v2/services/ServiceDetailPageV2"));
// Standalone industry detail pages (more to follow per industry)
const OilGasPage = lazy(() => import("./page/v2/industries/OilGasPage"));
const ConstructionPage = lazy(() => import("./page/v2/industries/ConstructionPage"));
const HealthcarePage = lazy(() => import("./page/v2/industries/HealthcarePage"));
const FacilityManagementPage = lazy(() => import("./page/v2/industries/FacilityManagementPage"));
const EpcEngineeringPage = lazy(() => import("./page/v2/industries/EpcEngineeringPage"));
const ManufacturingPage = lazy(() => import("./page/v2/industries/ManufacturingPage"));

// IoT Solutions
const SmartAssetTrackingPage = lazy(() => import("./page/v2/iot/SmartAssetTrackingPage"));
const IndustrialIoTPage = lazy(() => import("./page/v2/iot/IndustrialIoTPage"));
const SmartBuildingPage = lazy(() => import("./page/v2/iot/SmartBuildingPage"));
const FleetManagementPage = lazy(() => import("./page/v2/iot/FleetManagementPage"));
const AgricultureIoTPage = lazy(() => import("./page/v2/iot/AgricultureIoTPage"));
const HealthcareIoTPage = lazy(() => import("./page/v2/iot/HealthcareIoTPage"));
const SmartRetailPage = lazy(() => import("./page/v2/iot/SmartRetailPage"));

// Portfolio case studies
const AIERPProjectPage = lazy(() => import("./page/v2/projects/AIERPProjectPage"));
const MLOpsProjectPage = lazy(() => import("./page/v2/projects/MLOpsProjectPage"));
const CloudInfraProjectPage = lazy(() => import("./page/v2/projects/CloudInfraProjectPage"));
const EnterpriseSaaSPage = lazy(() => import("./page/v2/projects/EnterpriseSaaSPage"));
const AITrainingProgramPage = lazy(() => import("./page/v2/projects/AITrainingPage"));
const DigitalTransformationPage = lazy(() => import("./page/v2/projects/DigitalTransformationPage"));
const SupplyChainAIPage = lazy(() => import("./page/v2/projects/SupplyChainAIPage"));
const KubernetesSecurityPage = lazy(() => import("./page/v2/projects/KubernetesSecurityPage"));
const FraudDetectionPage = lazy(() => import("./page/v2/projects/FraudDetectionPage"));

// LMA (Learning Management Application)
const LMABecomeInstructorPage   = lazy(() => import("./page/lma/BecomeInstructorPage"));
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
const PortalHub                 = lazy(() => import("./page/PortalHub"));
const PartnerApp                = lazy(() => import("./partner/PartnerApp"));

function App() {
  return (
    <HelmetProvider>
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
          <Route path="/ai-erp"                             element={<ERPLandingPage />} />
          <Route path="/erp-industries"                    element={<ERPIndustriesPage />} />
          <Route path="/erp-industries/:industry"          element={<ERPIndustryDetailPage />} />
          <Route path="/team"                    element={<TeamPage />} />
          <Route path="/team/:slug"              element={<TeamDetailPage />} />
          <Route path="/documentation"           element={<DocsPage />} />
          <Route path="/health"                  element={<HealthPage />} />
          <Route path="/mlm"                     element={<MLMPage />} />
          <Route path="/home"                    element={<PortalHub />} />
          <Route path="/partner/*"               element={<PartnerApp />} />
          <Route path="/erp/*"                   element={<ERPPage />} />
          <Route path="/training"                element={<TrainingPage />} />
          <Route path="/landing"                 element={<LandingPage />} />
          <Route path="/privacy"                 element={<PrivacyPolicyPage />} />
          <Route path="/terms"                   element={<TermsPage />} />
          <Route path="/careers"                 element={<CareersPage />} />
          <Route path="/partners"                element={<PartnersPage />} />
          <Route path="/v2"                      element={<HomeV2 />} />
          <Route path="/v2/about"                element={<AboutV2 />} />
          <Route path="/v2/services"             element={<ServicesV2 />} />
          <Route path="/v2/portfolio"            element={<PortfolioV2 />} />
          <Route path="/v2/contact"              element={<ContactV2 />} />
          <Route path="/v2/training"             element={<TrainingV2 />} />
          <Route path="/v2/careers"              element={<CareersV2 />} />
          {/* one dynamic route for all 10 service detail pages (was 10 separate routes) */}
          <Route path="/v2/services/:slug" element={<ServiceDetailPageV2 />} />
          {/* standalone industry pages — first of eventually 6, one per real sector */}
          <Route path="/v2/industries/oil-gas" element={<OilGasPage />} />
          <Route path="/v2/industries/construction" element={<ConstructionPage />} />
          <Route path="/v2/industries/healthcare" element={<HealthcarePage />} />
          <Route path="/v2/industries/facility-management" element={<FacilityManagementPage />} />
          <Route path="/v2/industries/epc-engineering" element={<EpcEngineeringPage />} />
          <Route path="/v2/industries/manufacturing" element={<ManufacturingPage />} />
          {/* standalone IoT Solutions pages — first two of eventually 7 */}
          <Route path="/v2/iot/smart-asset-tracking" element={<SmartAssetTrackingPage />} />
          <Route path="/v2/iot/industrial-iot" element={<IndustrialIoTPage />} />
          <Route path="/v2/iot/smart-building-solutions" element={<SmartBuildingPage />} />
          <Route path="/v2/iot/fleet-management-systems" element={<FleetManagementPage />} />
          <Route path="/v2/iot/agriculture-iot" element={<AgricultureIoTPage />} />
          <Route path="/v2/iot/healthcare-iot" element={<HealthcareIoTPage />} />
          <Route path="/v2/iot/smart-retail" element={<SmartRetailPage />} />
          {/* portfolio case studies */}
          <Route path="/v2/project/ai-erp-platform" element={<AIERPProjectPage />} />
          <Route path="/v2/project/mlops-pipeline" element={<MLOpsProjectPage />} />
          <Route path="/v2/project/cloud-infrastructure" element={<CloudInfraProjectPage />} />
          <Route path="/v2/project/enterprise-saas" element={<EnterpriseSaaSPage />} />
          <Route path="/v2/project/ai-training-program" element={<AITrainingProgramPage />} />
          <Route path="/v2/project/digital-transformation" element={<DigitalTransformationPage />} />
          <Route path="/v2/project/supply-chain-ai" element={<SupplyChainAIPage />} />
          <Route path="/v2/project/kubernetes-security" element={<KubernetesSecurityPage />} />
          <Route path="/v2/project/fraud-detection-mlops" element={<FraudDetectionPage />} />

          {/* LMA routes */}
          <Route path="/lma/become-instructor"               element={<LMABecomeInstructorPage />} />
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
    </HelmetProvider>
  );
}


export default App;
