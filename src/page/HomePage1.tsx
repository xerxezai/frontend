import AboutSection from "../components/about/AboutSection";
import BrandSection from "../components/brand/BrandSection";
import ContactSection from "../components/contact/ContactSection";
import FooterSection2 from "../components/footer/FooterSection2";
import HeaderSection from "../components/header/HeaderSection";
import HeroSection from "../components/hero/HeroSection";
import MobileMenuModal from "../components/modal/MobileMenuModal";
import SectionProgressDots from "../components/nav/SectionProgressDots";
import ProjectSection from "../components/project/ProjectSection";
import ServiceSection from "../components/service/ServiceSection";
import ServiceSection2 from "../components/service/ServiceSection2";
import { useCustomContext } from "../context/context";

const SECTIONS = [
  { id: "sec-hero",     label: "Home"     },
  { id: "sec-services", label: "Services" },
  { id: "sec-about",    label: "About"    },
  { id: "sec-projects", label: "Projects" },
  { id: "sec-contact",  label: "Contact"  },
];

const HomePage1 = () => {
  const { isMenuOpen, toggleMobileMenu } = useCustomContext();
  return (
    <>
      <HeaderSection />

      <div id="sec-hero"><HeroSection /></div>
      <div id="sec-services">
        <ServiceSection />
      </div>
      <div id="sec-about">
        <AboutSection />
        <ServiceSection2 />
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
