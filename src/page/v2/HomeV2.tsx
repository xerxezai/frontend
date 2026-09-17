// HomeV2.tsx
// Purpose: The / homepage. Just composition — every section is its own
//          component under src/components/v2/sections & /features.
// Used in: src/App.tsx  (route: /)
// Data source: none here — each section pulls its own copy/data. See those files.
//              <XerxezShell> provides the header, footer, Poppins font and mobile menu.

import SEO from "../../components/seo/SEO";
import {
  XerxezShell,
  XerxezHero,
  XerxezTrustedBy,
  XerxezServicesGrid,
  XerxezWhoWeAre,
  XerxezTechStack,
  XerxezIndustries,   // the interactive "pick your industry" section (signature)
  XerxezProductsShowcase,
  XerxezWhyChoose,
  XerxezProcess,
  XerxezCtaBand,
} from "../../components/v2";

const HomeV2 = () => (
  <XerxezShell>
    {/* per-page <head> tags; noIndex keeps / out of search while under review */}
    <SEO
      title="XERXEZ | AI-Powered ERP for UAE & India Enterprises"
      description="Transform your enterprise with XERXEZ AI-powered ERP. Built for UAE & India across EPC, Oil & Gas, Construction, Manufacturing and more."
      canonical="/"
      noIndex
    />
    {/* sections render top-to-bottom in this order */}
    <XerxezHero />
    <XerxezTrustedBy />
    <XerxezServicesGrid />
    <XerxezWhoWeAre />
    <XerxezTechStack />
    <XerxezIndustries />
    <XerxezProductsShowcase />
    <XerxezWhyChoose />
    <XerxezProcess />
    <XerxezCtaBand />
  </XerxezShell>
);

export default HomeV2;
