import AboutCompanySection from "../components/about/AboutCompanySection";
import AboutSection2 from "../components/about/AboutSection2";
import BlogSection2 from "../components/blog/BlogSection2";
import BrandSection2 from "../components/brand/BrandSection2";
import CoreAdvantageSection2 from "../components/core-advantage/CoreAdvantageSection2";
import CounterSection2 from "../components/counter/CounterSection2";
import CtaSection3 from "../components/cta/CtaSection3";
import FooterSection2 from "../components/footer/FooterSection2";
import HeaderSection2 from "../components/header/HeaderSection2";
import HeroSection2 from "../components/hero/HeroSection2";
import MobileMenuModal from "../components/modal/MobileMenuModal";
import VideoModal from "../components/modal/VideoModal";
import WorkingProcessSection from "../components/process/WorkingProcessSection";
import ProjectSection2 from "../components/project/ProjectSection2";
import ServiceSection3 from "../components/service/ServiceSection3";
import TeamSection from "../components/team/TeamSection";
import TestimonySection2 from "../components/testimony/TestimonySection2";
import { useCustomContext } from "../context/context";

const HomePage2 = () => {
  const { isMenuOpen, isVideoModalOpen, toggleMobileMenu, toggleVideoModal } =
    useCustomContext();
  return (
    <>
        <HeaderSection2 />
        <HeroSection2 />
        <AboutSection2 />
        <ServiceSection3 />
        <WorkingProcessSection />
        <AboutCompanySection />
        <ProjectSection2 />
        <TestimonySection2 />
        <BrandSection2 />
        <TeamSection />
        <CoreAdvantageSection2 />
        <CounterSection2 />
        <BlogSection2 />
        <CtaSection3 />
        <FooterSection2 />
        <VideoModal isOpen={isVideoModalOpen} toggle={toggleVideoModal} />
        <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
    </>
  );
};

export default HomePage2;
