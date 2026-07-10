import AcademySection from "../components/academy/AcademySection";
import BrandSection from "../components/brand/BrandSection";
import ContactSection from "../components/contact/ContactSection";
import FooterSection2 from "../components/footer/FooterSection2";
import HeaderSection from "../components/header/HeaderSection";
import HeroSection from "../components/hero/HeroSection";
import MobileMenuModal from "../components/modal/MobileMenuModal";
import SectionProgressDots from "../components/nav/SectionProgressDots";
import ProjectSection from "../components/project/ProjectSection";
import ServiceSection2 from "../components/service/ServiceSection2";
import { useCustomContext } from "../context/context";
import SEO from "../components/seo/SEO";

const SECTIONS = [
  { id: "sec-hero",     label: "Home"     },
  { id: "sec-about",    label: "Services" },
  { id: "sec-projects", label: "Projects" },
  { id: "sec-contact",  label: "Contact"  },
];

const HomePage1 = () => {
  const { isMenuOpen, toggleMobileMenu } = useCustomContext();
  return (
    <>
      <SEO
        title="XERXEZ — AI-Powered ERP, MLOps & Cloud Solutions for Enterprises"
        description="XERXEZ builds enterprise-grade AI ERP systems, MLOps pipelines, SecOps solutions, and cloud infrastructure. Trusted by 40+ enterprises across UAE, India & UK."
        canonical="/"
      />
      <HeaderSection />

      <div id="sec-hero" style={{ paddingTop: 70 }}><HeroSection /></div>
      <div id="sec-about">
        <ServiceSection2 />
        <AcademySection />
        <BrandSection />
      </div>
      <div id="sec-projects"><ProjectSection /></div>
      <div id="sec-contact"><ContactSection /></div>

      <FooterSection2 />
      <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
      <SectionProgressDots sections={SECTIONS} />
    </>
  );
};

export default HomePage1;
