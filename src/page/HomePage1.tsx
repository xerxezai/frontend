import AcademySection from "../components/academy/AcademySection";
import BrandSection from "../components/brand/BrandSection";
import ContactSection from "../components/contact/ContactSection";
import FooterSection2 from "../components/footer/FooterSection2";
import HeaderSection, { HEADER_TOTAL_H } from "../components/header/HeaderSection";
import HeroSection from "../components/hero/HeroSection";
import HomeFaq, { HOME_FAQS } from "../components/marketing/HomeFaq";
import HowWeWork from "../components/marketing/HowWeWork";
import IndustriesBar from "../components/marketing/IndustriesBar";
import TestimonialsSection from "../components/marketing/TestimonialsSection";
import WhyXerxez from "../components/marketing/WhyXerxez";
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

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "XERXEZ",
  url: "https://www.xerxez.com",
  logo: "https://www.xerxez.com/assets/img/logo/xerxez_logo.png",
  description: "AI-Powered ERP, DevSecOps & Cloud Solutions for Enterprises.",
  email: "info@xerxez.com",
  telephone: "+971567867451",
  areaServed: ["IN", "AE"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+971567867451",
    contactType: "sales",
    email: "info@xerxez.com",
    availableLanguage: "en",
  },
  sameAs: ["https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/"],
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const HomePage1 = () => {
  const { isMenuOpen, toggleMobileMenu } = useCustomContext();
  return (
    <>
      <SEO
        title="XERXEZ — AI-Powered ERP, DevSecOps & Cloud Solutions for Enterprises"
        description="XERXEZ helps mid-to-large enterprises cut operational costs by 40%, deploy 60% faster, and achieve 99.9% system uptime. AI ERP, DevSecOps pipelines & cloud infrastructure — India & UAE."
        canonical="/"
        jsonLd={[ORG_JSONLD, FAQ_JSONLD]}
      />
      <HeaderSection />

      {/* Alternating dark / light rhythm, hero to footer: D L D L D L D L D L D L
          content-visibility:auto lets the browser skip layout/paint for
          sections that are scrolled off-screen — the page has a lot of
          concurrently-animating sections, so this is the main lag fix. */}
      <div id="sec-hero" style={{ paddingTop: HEADER_TOTAL_H }}><HeroSection /></div>
      <IndustriesBar />
      <div id="sec-about"><ServiceSection2 /></div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" } as React.CSSProperties}><BrandSection /></div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" } as React.CSSProperties}><AcademySection /></div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" } as React.CSSProperties}><HowWeWork /></div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" } as React.CSSProperties}><WhyXerxez /></div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" } as React.CSSProperties}><TestimonialsSection /></div>
      <div id="sec-projects" style={{ contentVisibility: "auto", containIntrinsicSize: "0 900px" } as React.CSSProperties}><ProjectSection /></div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" } as React.CSSProperties}><HomeFaq /></div>
      <div id="sec-contact" style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" } as React.CSSProperties}><ContactSection /></div>

      <FooterSection2 />
      <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
      <SectionProgressDots sections={SECTIONS} />
    </>
  );
};

export default HomePage1;
