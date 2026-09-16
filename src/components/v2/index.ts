/* ============================================================================
   /v2 marketing-site component library — single public entry point.
   Import everything for the etiot-styled pages from here:
     import { XerxezShell, XerxezHero, T, Btn } from "../../components/v2";

   Folder map (see ARCHITECTURE.md for the full standard):
     01-core/      design tokens + primitives (v2theme, v2form, v2page, icons)
     02-layout/    page chrome (XerxezHeader, XerxezFooter, XerxezShell)
     03-sections/  reusable full-width sections, grouped by purpose
     04-features/  page-specific blocks (grids, carousels, forms)
   ========================================================================== */

// ── 01-core ─────────────────────────────────────────────────────────────────
export * from "./01-core/v2theme";
export * from "./01-core/v2form";
export * from "./01-core/v2page";
export * from "./01-core/icons";
export * from "./01-core/IndustryCards";

// ── 02-layout ───────────────────────────────────────────────────────────────
// (V2_HEADER_H is a core token, re-exported above via `export * from 01-core/v2theme`)
export { default as XerxezHeader, remap } from "./02-layout/XerxezHeader";
export { default as XerxezFooter } from "./02-layout/XerxezFooter";
export { default as XerxezShell } from "./02-layout/XerxezShell";

// ── 03-sections ─────────────────────────────────────────────────────────────
export { default as XerxezHero } from "./03-sections/hero/XerxezHero";
export { IndustryHero, type IndustryHeroCta } from "./03-sections/hero/IndustryHero";
export { default as XerxezCtaBand } from "./03-sections/cta/XerxezCtaBand";
export { default as XerxezWhoWeAre } from "./03-sections/about/XerxezWhoWeAre";
export { default as XerxezWhyChoose, WHY_XERXEZ_ITEMS } from "./03-sections/about/XerxezWhyChoose";
export { default as XerxezIndustries } from "./03-sections/industries/XerxezIndustries";
export { default as XerxezProcess } from "./03-sections/process/XerxezProcess";
export { default as XerxezTrustedBy } from "./03-sections/trusted/XerxezTrustedBy";
export { default as XerxezTechStack, XerxezTechLogoStrip, LOGOS } from "./03-sections/trusted/XerxezTechStack";

// ── 04-features ─────────────────────────────────────────────────────────────
export { default as XerxezServicesGrid } from "./04-features/services/XerxezServicesGrid";
export { default as XerxezServiceDeepGrid } from "./04-features/services/XerxezServiceDeepGrid";
export { default as XerxezServiceTemplate, getServiceDetail } from "./04-features/services/XerxezServiceTemplate";
export { default as XerxezPortfolio } from "./04-features/portfolio/XerxezPortfolio";
export { default as XerxezProductsShowcase } from "./04-features/portfolio/XerxezProductsShowcase";
export { default as XerxezCourses } from "./04-features/training/XerxezCourses";
export { default as XerxezTrainingCard } from "./04-features/training/XerxezTrainingCard";
export { default as XerxezContactForm } from "./04-features/contact/XerxezContactForm";
export { default as XerxezCareersForm, type Position } from "./04-features/careers/XerxezCareersForm";
