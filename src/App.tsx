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
      // This boundary wraps every route. The v2 navy/red theme is now the
      // main site, so it's the default fallback — the old cream v1 fallback
      // is reserved for the few still-standalone sub-apps (ERP/LMA/Partner)
      // that keep their own chrome. Checked at render time (not cached)
      // since the path that crashed is whatever the user was on when it happened.
      const isLegacyApp = typeof window !== "undefined"
        && ["/erp", "/lma", "/partner"].some(p => window.location.pathname.startsWith(p));
      return !isLegacyApp ? (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#071a33", fontFamily: "'Poppins',sans-serif", color: "#fff", fontSize: 15 }}>
          Something went wrong. <a href="/" style={{ marginLeft: 8, color: "#D93522" }}>Go home</a>
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
const HomePage2       = lazy(() => import("./page/HomePage2"));
const HomePage3       = lazy(() => import("./page/HomePage3"));
const HomePage4       = lazy(() => import("./page/HomePage4"));
const BlogPage        = lazy(() => import("./page/BlogPage"));
const BlogDetailPage  = lazy(() => import("./page/BlogDetailPage"));
const FaqPage         = lazy(() => import("./page/FaqPage"));
const PricingPage     = lazy(() => import("./page/PricingPage"));
const TeamPage        = lazy(() => import("./page/TeamPage"));
const TeamDetailPage  = lazy(() => import("./page/TeamDetailPage"));
const NotFoundPage    = lazy(() => import("./page/NotFoundPage"));
const DocsPage        = lazy(() => import("./page/DocsPage"));
const HealthPage      = lazy(() => import("./page/HealthPage"));
const MLMPage         = lazy(() => import("./page/MLMPage"));
const ERPPage         = lazy(() => import("./page/ERPPage"));
const ERPIndustriesPage      = lazy(() => import("./page/ERPIndustriesPage"));
const ERPLandingPage         = lazy(() => import("./page/ERPLandingPage"));
const ERPIndustryDetailPage  = lazy(() => import("./page/ERPIndustryDetailPage"));
const LandingPage        = lazy(() => import("./page/LandingPage"));
const PrivacyPolicyPage  = lazy(() => import("./page/PrivacyPolicyPage"));
const TermsPage          = lazy(() => import("./page/TermsPage"));
const PartnersPage       = lazy(() => import("./page/PartnersPage"));
const HomeV2             = lazy(() => import("./page/v2/HomeV2"));
const AboutV2            = lazy(() => import("./page/v2/AboutV2"));
const ServicesV2         = lazy(() => import("./page/v2/ServicesV2"));
const PortfolioV2        = lazy(() => import("./page/v2/PortfolioV2"));
const ContactV2          = lazy(() => import("./page/v2/ContactV2"));
const TrainingV2         = lazy(() => import("./page/v2/TrainingV2"));
const CareersV2          = lazy(() => import("./page/v2/CareersV2"));
const PrivacyPolicyV2    = lazy(() => import("./page/v2/PrivacyPolicyV2"));
const TermsOfUseV2       = lazy(() => import("./page/v2/TermsOfUseV2"));
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
const LMAAdminStudents          = lazy(() => import("./page/lma/LMAAdminStudents"));
const LMAAdminEnrollments       = lazy(() => import("./page/lma/LMAAdminEnrollments"));
const LMAAdminAnalytics         = lazy(() => import("./page/lma/LMAAdminAnalytics"));
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
          {/* v2 is now the main site — routes below are unprefixed. Old v1
              equivalents that conflicted (home, about, contact, training,
              careers, project, service*) were removed entirely; anything not
              listed here (home-2/3/4, blog, faq, pricing, team, documentation,
              health, mlm, landing, privacy, terms, partners, ai-erp,
              erp-industries) is untouched legacy content that never had a v2
              counterpart. */}
          <Route path="/"                        element={<HomeV2 />} />
          <Route path="/about"                   element={<AboutV2 />} />
          <Route path="/services"                element={<ServicesV2 />} />
          <Route path="/portfolio"               element={<PortfolioV2 />} />
          <Route path="/contact"                 element={<ContactV2 />} />
          <Route path="/training"                element={<TrainingV2 />} />
          <Route path="/careers"                 element={<CareersV2 />} />
          <Route path="/privacy-policy"          element={<PrivacyPolicyV2 />} />
          <Route path="/terms-of-use"            element={<TermsOfUseV2 />} />
          {/* one dynamic route for all 10 service detail pages */}
          <Route path="/services/:slug" element={<ServiceDetailPageV2 />} />
          {/* standalone industry pages — first of eventually 6, one per real sector */}
          <Route path="/industries/oil-gas" element={<OilGasPage />} />
          <Route path="/industries/construction" element={<ConstructionPage />} />
          <Route path="/industries/healthcare" element={<HealthcarePage />} />
          <Route path="/industries/facility-management" element={<FacilityManagementPage />} />
          <Route path="/industries/epc-engineering" element={<EpcEngineeringPage />} />
          <Route path="/industries/manufacturing" element={<ManufacturingPage />} />
          {/* standalone IoT Solutions pages — first two of eventually 7 */}
          <Route path="/iot/smart-asset-tracking" element={<SmartAssetTrackingPage />} />
          <Route path="/iot/industrial-iot" element={<IndustrialIoTPage />} />
          <Route path="/iot/smart-building-solutions" element={<SmartBuildingPage />} />
          <Route path="/iot/fleet-management-systems" element={<FleetManagementPage />} />
          <Route path="/iot/agriculture-iot" element={<AgricultureIoTPage />} />
          <Route path="/iot/healthcare-iot" element={<HealthcareIoTPage />} />
          <Route path="/iot/smart-retail" element={<SmartRetailPage />} />
          {/* portfolio case studies */}
          <Route path="/project/ai-erp-platform" element={<AIERPProjectPage />} />
          <Route path="/project/mlops-pipeline" element={<MLOpsProjectPage />} />
          <Route path="/project/cloud-infrastructure" element={<CloudInfraProjectPage />} />
          <Route path="/project/enterprise-saas" element={<EnterpriseSaaSPage />} />
          <Route path="/project/ai-training-program" element={<AITrainingProgramPage />} />
          <Route path="/project/digital-transformation" element={<DigitalTransformationPage />} />
          <Route path="/project/supply-chain-ai" element={<SupplyChainAIPage />} />
          <Route path="/project/kubernetes-security" element={<KubernetesSecurityPage />} />
          <Route path="/project/fraud-detection-mlops" element={<FraudDetectionPage />} />

          <Route path="/home-2"                  element={<HomePage2 />} />
          <Route path="/home-3"                  element={<HomePage3 />} />
          <Route path="/home-4"                  element={<HomePage4 />} />
          <Route path="/blog"                    element={<BlogPage />} />
          <Route path="/blog/:slug"              element={<BlogDetailPage />} />
          <Route path="/faq"                     element={<FaqPage />} />
          <Route path="/pricing"                 element={<PricingPage />} />
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
          <Route path="/landing"                 element={<LandingPage />} />
          <Route path="/privacy"                 element={<PrivacyPolicyPage />} />
          <Route path="/terms"                   element={<TermsPage />} />
          <Route path="/partners"                element={<PartnersPage />} />

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
          <Route path="/lma/admin/students"               element={<LMAAdminStudents />} />
          <Route path="/lma/admin/enrollments"            element={<LMAAdminEnrollments />} />
          <Route path="/lma/admin/analytics"              element={<LMAAdminAnalytics />} />
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
