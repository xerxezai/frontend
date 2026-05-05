import AboutSection5 from "../components/about/AboutSection5";
import BlogSection4 from "../components/blog/BlogSection4";
import BrandSection from "../components/brand/BrandSection";
import CounterSection from "../components/counter/CounterSection";
import CtaSection5 from "../components/cta/CtaSection5";
import CtaSection6 from "../components/cta/CtaSection6";
import FooterSection4 from "../components/footer/FooterSection4";
import HeaderSection from "../components/header/HeaderSection";
import HeroSection4 from "../components/hero/HeroSection4";
import MobileMenuModal from "../components/modal/MobileMenuModal";
import VideoModal from "../components/modal/VideoModal";
import PricingSection2 from "../components/pricing/PricingSection2";
import ProjectSection4 from "../components/project/ProjectSection4";
import ServiceSection5 from "../components/service/ServiceSection5";
import TeamSection2 from "../components/team/TeamSection2";
import TestimonySection4 from "../components/testimony/TestimonySection4";
import VideoSection from "../components/video/VideoSection";
import { useCustomContext } from "../context/context";

const HomePage4 = () => {
  const { isMenuOpen, isVideoModalOpen, toggleMobileMenu, toggleVideoModal } =
    useCustomContext();
  return (
    <main className="body-bg-4">
      <HeaderSection variant />
      <HeroSection4 />
      <BrandSection variant="style-2" />
      <AboutSection5 />
      <ServiceSection5 />
      <VideoSection />
      <ProjectSection4 />
      <CounterSection variant="style-2" />
      <CtaSection5 />
      <TestimonySection4 />
      <TeamSection2 />
      <PricingSection2 />
      <BlogSection4 />
      <CtaSection6 />
      <FooterSection4 />
      <VideoModal isOpen={isVideoModalOpen} toggle={toggleVideoModal} />
      <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
    </main>
  );
};

export default HomePage4;
