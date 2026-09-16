// XerxezShell.tsx
// Purpose: Shared page chrome for every /v2 route — loads the Poppins webfont,
//          renders the navy header + footer, and mounts the mobile-menu modal.
//          Pages render only their <SEO> + sections as children.
// Used in: all 7 pages in src/page/v2/
// Data source: none. The mobile menu is XerxezMobileMenuModal (links remapped to
//              /v2/*), driven by the shared open/close context (src/context/context).

import type { ReactNode } from "react";                          // children type
import { Helmet } from "react-helmet-async";                      // inject <link> tags into <head>
import XerxezMobileMenuModal from "./XerxezMobileMenuModal";              // v2 off-canvas nav (links remapped to /v2/*)
import { useCustomContext } from "../../../context/context";      // provides the menu open/close state
import { T } from "../01-core/v2theme";                             // tokens (page bg / text colour / font)
import XerxezHeader from "./XerxezHeader";                               // fixed navy top bar
import XerxezFooter from "./XerxezFooter";                               // navy footer

const XerxezShell = ({ children }: { children: ReactNode }) => {
  // Global mobile-menu state, shared with XerxezHeader's hamburger button.
  const { isMenuOpen, toggleMobileMenu } = useCustomContext();

  return (
    // Root wrapper: white page, near-black text, Inter body font for the whole variant.
    <div style={{ background: "#fff", color: T.ink, fontFamily: T.fontBody }}>
      {/* Load Poppins once for the whole /v2 area (headings use it). */}
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        />
      </Helmet>

      <XerxezHeader />
      {/* <main> landmark wraps the page's SEO tags + section content */}
      <main>{children}</main>
      <XerxezFooter />

      {/* Off-canvas mobile nav — opened by XerxezHeader's hamburger via context */}
      <XerxezMobileMenuModal isOpen={isMenuOpen} toggle={toggleMobileMenu} />
    </div>
  );
};

export default XerxezShell;
