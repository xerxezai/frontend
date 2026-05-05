import AboutSection from "../components/about/AboutSection";
import BlogSection from "../components/blog/BlogSection";
import BrandSection from "../components/brand/BrandSection";
import ContactSection from "../components/contact/ContactSection";
import CoreAdvantageSection from "../components/core-advantage/CoreAdvantageSection";
import CounterSection from "../components/counter/CounterSection";
import CtaSection from "../components/cta/CtaSection";
import CtaSection2 from "../components/cta/CtaSection2";
import FaqSection from "../components/faq/FaqSection";
import FooterSection from "../components/footer/FooterSection";
import HeaderSection from "../components/header/HeaderSection";
import HeroSection from "../components/hero/HeroSection";
import MobileMenuModal from "../components/modal/MobileMenuModal";
import PricingSection from "../components/pricing/PricingSection";
import ProjectSection from "../components/project/ProjectSection";
import ServiceSection from "../components/service/ServiceSection";
import ServiceSection2 from "../components/service/ServiceSection2";
import TestimonySection from "../components/testimony/TestimonySection";
import { useCustomContext } from "../context/context";

const HomePage1 = () => {
  const { isMenuOpen, toggleMobileMenu } = useCustomContext();
  return (
    <>
        <HeaderSection />
        <HeroSection />
        <ServiceSection />
        <AboutSection />
        <ServiceSection2 />
        <BrandSection />
        <CoreAdvantageSection />
        <CounterSection />
        <PricingSection />
        <CtaSection />
        <ProjectSection />
        <TestimonySection />
        <CtaSection2 />
        <FaqSection />
        <ContactSection />
        <BlogSection />
        <FooterSection />
        <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
    </>
  );
};

export default HomePage1;
