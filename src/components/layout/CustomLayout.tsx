import React from "react";
import HeaderSection2 from "../header/HeaderSection2";
import FooterSection2 from "../footer/FooterSection2";
import SectionErrorBoundary from "../error-boundaries/SectionErrorBoundary";
import MobileMenuModal from "../modal/MobileMenuModal";
import { useCustomContext } from "../../context/context";
interface Props {
  children: React.ReactNode;
}
const CustomLayout = ({ children }: Props) => {
  const { isMenuOpen, toggleMobileMenu } = useCustomContext();
  return (
    <>
      <SectionErrorBoundary sectionName="Header">
        <HeaderSection2 variant />
      </SectionErrorBoundary>

      {children}

      <SectionErrorBoundary sectionName="Footer">
        <FooterSection2 />
      </SectionErrorBoundary>
      <SectionErrorBoundary sectionName="Mobile Menu">
        <MobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
      </SectionErrorBoundary>
    </>
  );
};

export default CustomLayout;

