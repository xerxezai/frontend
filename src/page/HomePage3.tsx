import AboutCompanySection2 from "../components/about/AboutCompanySection2";
import AboutSection3 from "../components/about/AboutSection3";
import AboutSection4 from "../components/about/AboutSection4";
import BlogSection3 from "../components/blog/BlogSection3";
import BrandSection2 from "../components/brand/BrandSection2";
import WorkingProcessSection2 from "../components/process/WorkingProcessSection2";
import CtaSection4 from "../components/cta/CtaSection4";
import FaqSection2 from "../components/faq/FaqSection2";
import FooterSection3 from "../components/footer/FooterSection3";
import HeaderSection2 from "../components/header/HeaderSection2";
import HeroSection3 from "../components/hero/HeroSection3";
import MarqueeSection from "../components/marquee/MarqueeSection";
import MobileMenuModal from "../components/modal/MobileMenuModal";
import VideoModal from "../components/modal/VideoModal";
import ProjectSection3 from "../components/project/ProjectSection3";
import ServiceSection4 from "../components/service/ServiceSection4";
import TestimonySection3 from "../components/testimony/TestimonySection3";
import { useCustomContext } from "../context/context";

const HomePage3 = () => {
  const { isMenuOpen, isVideoModalOpen, toggleMobileMenu, toggleVideoModal } =
    useCustomContext();
  return (
    <>
      <HeaderSection2 variant />
      <HeroSection3 />
      <AboutSection3 />
      <ServiceSection4 />
      <AboutCompanySection2 />
      <BrandSection2 />
      <AboutSection4 />
      <WorkingProcessSection2 />
      <ProjectSection3 />
      <MarqueeSection />
      <TestimonySection3 />
      <CtaSection4 />
      <FaqSection2 />
      <BlogSection3 />
      <FooterSection3 />
      <VideoModal isOpen={isVideoModalOpen} toggle={toggleVideoModal} />
      <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
    </>
  );
};

export default HomePage3;
