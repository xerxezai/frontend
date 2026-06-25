import AboutSection from "../components/about/AboutSection";
import BrandSection from "../components/brand/BrandSection";
import ComparisonSection from "../components/comparison/ComparisonSection";
import ContactSection from "../components/contact/ContactSection";
import CoreAdvantageSection from "../components/core-advantage/CoreAdvantageSection";
import CtaSection from "../components/cta/CtaSection";
import CtaSection2 from "../components/cta/CtaSection2";
import FooterSection2 from "../components/footer/FooterSection2";
import HeaderSection from "../components/header/HeaderSection";
import HeroSection from "../components/hero/HeroSection";
import MobileMenuModal from "../components/modal/MobileMenuModal";
import SectionProgressDots from "../components/nav/SectionProgressDots";
import ProjectSection from "../components/project/ProjectSection";
import ServiceSection from "../components/service/ServiceSection";
import ServiceSection2 from "../components/service/ServiceSection2";
import TestimonySection from "../components/testimony/TestimonySection";
import { useCustomContext } from "../context/context";

const SECTIONS = [
  { id: "sec-hero",     label: "Home"        },
  { id: "sec-services", label: "Services"    },
  { id: "sec-about",    label: "About"       },
  { id: "sec-cta",      label: "Assessment"  },
  { id: "sec-projects", label: "Projects"    },
  { id: "sec-clients",  label: "Clients"     },
  { id: "sec-contact",  label: "Contact"     },
];

const HomePage1 = () => {
  const { isMenuOpen, toggleMobileMenu } = useCustomContext();
  return (
    <>
      <HeaderSection />

      <div id="sec-hero"><HeroSection /></div>
      <div id="sec-services">
        <ServiceSection />
        <ComparisonSection />
      </div>
      <div id="sec-about">
        <AboutSection />
        <ServiceSection2 />
        <BrandSection />
        <CoreAdvantageSection />
      </div>
      <div id="sec-cta"><CtaSection /></div>
      <div id="sec-projects"><ProjectSection /></div>
      <div id="sec-clients">
        <TestimonySection />
        <CtaSection2 />
      </div>
      <div id="sec-contact"><ContactSection /></div>

      <FooterSection2 />
      <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
      <SectionProgressDots sections={SECTIONS} />
    </>
  );
};

export default HomePage1;
