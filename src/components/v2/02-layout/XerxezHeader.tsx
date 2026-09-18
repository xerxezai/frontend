// XerxezHeader.tsx
// Purpose: Fixed top navigation bar for every /v2 page — logo, centred pill
//          nav, "Sign in" dropdown, "Book Free Demo" CTA, mobile hamburger.
//          Transparent over the hero at page top, solid navy once scrolled.
// Used in: layout/XerxezShell.tsx (so it renders on all 7 /v2 pages)
// Data source: nav links come from the existing site menu (src/data → menuData);
//              sign-in options from the existing src/components/header/SignInDropdown.

import { useEffect, useRef, useState } from "react";                 // hooks for scroll / dropdown state
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";                // routing + current path
import {
  ChevronDown, Menu, Sparkles,                                      // caret + hamburger + CTA icon
  Brain, Shield, Cloud, Code, GraduationCap, Atom, Smartphone, Server, MessageSquare, Building2,  // service row icons
  Users, Mail, Briefcase,                                           // "Who We Are" row icons
  Wifi, Radar, Factory, Truck, Sprout, HeartPulse, ShoppingBag,      // "IoT Solutions" row + panel icons
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { menuData } from "../../../data";                            // existing site nav data
import { INDUSTRIES, industryLabel } from "../../../data/erpIndustriesData";        // real 8-sector list (same data XerxezIndustries / the service-page Industries grid use)
import { useCustomContext } from "../../../context/context";         // mobile-menu open/close
import { SIGNIN_OPTIONS } from "../../header/SignInDropdown";        // existing ERP/Partner login list
import Image from "../../utils/Image";                               // base-path-aware <img>
import { T, ArrowRight, V2_HEADER_H } from "../01-core/v2theme";        // tokens + arrow glyph + bar height

// menuData is loosely typed in the data module; narrow it to what we read here.
type Sub = { title: string; link: string; desc?: string };
type MenuNode = { title: string; link: string; hasDropdown?: boolean; submenu?: Sub[] };
const RawNav = (menuData as unknown as MenuNode[]);

// ── Services mega-menu content ──────────────────────────────────────────
// One icon per service — the same choices already used on the /v2/services
// grid (XerxezServicesGrid), so the icon language is consistent site-wide.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "AI-Powered ERP": Brain,
  "DevSecOps Pipelines": Shield,
  "Cloud Infrastructure": Cloud,
  "Software Development": Code,
  "AI Training & Consulting": GraduationCap,
  "Quantum Computing": Atom,
  "Mobile Application": Smartphone,
  "Web & Mobile Hosting": Server,
  "Software Consulting": MessageSquare,
  "ERP Industries": Building2,
};
// Two labeled groups instead of an arbitrary odd/even split — "what we build"
// vs. "how we scale, secure, and advise around it". Rendered as the mega-menu's
// first two grid columns, in order.
const SERVICE_COLUMNS = [
  { label: "Build & Deliver", items: ["AI-Powered ERP", "Software Development", "Mobile Application", "ERP Industries", "AI Training & Consulting"] },
  { label: "Scale & Advise",  items: ["DevSecOps Pipelines", "Cloud Infrastructure", "Web & Mobile Hosting", "Quantum Computing", "Software Consulting"] },
];

// ── IoT Solutions mega-menu content ─────────────────────────────────────
// No v1 equivalent (no /v2/iot-solutions pages exist yet — see the standing
// note on each item's `link` below), so this is its own array here, same
// pattern as Who We Are. Two labeled columns, matching Services' layout:
// "Connected Operations" (cross-industry IoT capabilities) vs. "Industry
// Solutions" (sector-specific IoT applications).
const IOT_ICONS: Record<string, LucideIcon> = {
  "Smart Asset Tracking": Radar,
  "Industrial IoT": Factory,
  "Smart Building Solutions": Building2,
  "Fleet Management Systems": Truck,
  "Agriculture IoT": Sprout,
  "Healthcare IoT": HeartPulse,
  "Smart Retail": ShoppingBag,
};
const IOT_COLUMNS = [
  { label: "Connected Operations", items: ["Smart Asset Tracking", "Industrial IoT", "Smart Building Solutions", "Fleet Management Systems"] },
  { label: "Industry Solutions",   items: ["Agriculture IoT", "Healthcare IoT", "Smart Retail"] },
];
// Every link is a "#" placeholder — none of these pages exist yet. Update
// each `link` to its real /v2/iot-solutions/[slug] page as it's built,
// same one-at-a-time rollout INDUSTRY_PAGE_OVERRIDES (below) already used
// for the industry pages.
const IOT_ITEMS: Sub[] = [
  { title: "Smart Asset Tracking",     link: "/iot/smart-asset-tracking", desc: "Real-time visibility across high-value assets and inventory" },
  { title: "Industrial IoT",           link: "/iot/industrial-iot", desc: "Plant telemetry, predictive maintenance, and OT visibility" },
  { title: "Smart Building Solutions", link: "/iot/smart-building-solutions", desc: "Energy, access, and facility intelligence in one layer" },
  { title: "Fleet Management Systems", link: "/iot/fleet-management-systems", desc: "Live tracking, utilization, and route operations" },
  { title: "Agriculture IoT",          link: "/iot/agriculture-iot", desc: "Field sensors, irrigation, and yield intelligence" },
  { title: "Healthcare IoT",           link: "/iot/healthcare-iot", desc: "Connected care devices and clinical monitoring" },
  { title: "Smart Retail",             link: "/iot/smart-retail", desc: "Store operations, inventory, and customer experience" },
];

// ── Who We Are mega-menu content ────────────────────────────────────────
// A second, simpler dropdown — no v1 equivalent in menuData, so it's built
// here as its own small array rather than added to the shared data module
// (which /service and every other non-/v2 page also reads). Links reuse the
// same /about, /contact, /careers targets — V2_ROUTES (below) already
// remaps each one to its /v2 page.
const WHO_WE_ARE_ICONS: Record<string, LucideIcon> = {
  "About Us":   Users,
  "Contact Us": Mail,
  "Careers":    Briefcase,
};
const WHO_WE_ARE_ITEMS: Sub[] = [
  { title: "About Us",   link: "/about",   desc: "Our story, mission and values" },
  { title: "Contact Us", link: "/contact", desc: "Book a demo or get in touch" },
  { title: "Careers",    link: "/careers", desc: "Join the XERXEZ team" },
];

// The one page Industry We Serve owns — used both for its nav link and to
// tell it apart from Services' own /v2/services/* match (see `isActive`).
const INDUSTRY_PAGE_PATH = "/services/erp-industries";

// ── Industry We Serve mega-menu content ─────────────────────────────────
// The real 8-sector list from erpIndustriesData.tsx — the same data the
// homepage's XerxezIndustries and every /v2/services/[slug] page's
// Industries grid use, so this dropdown isn't a second, invented list.
// `shortName` is that data's own compact label (used for chips/nav
// elsewhere); `tagline` is its real one-line description. Each link points
// at the ERP Industries service page with the industry's real `slug` as a
// hash anchor — XerxezServiceTemplate's Industries grid (below) gives each
// card that same id so the hash actually scrolls to it.
// Only the first 6 of the real 8 — same subset (and same reasoning: fits
// without scrolling/overflow) the homepage's XerxezIndustries picker already
// uses via `INDUSTRIES.slice(0, 6)`, so this menu and that section agree on
// which sectors are "featured" rather than each picking their own cut.
const INDUSTRY_LIST = INDUSTRIES.slice(0, 6);
const INDUSTRY_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  INDUSTRY_LIST.map((ind) => [industryLabel(ind), ind.icon]),
);
// Sectors with their own standalone page (src/page/v2/industries/) link
// there instead of the hash-anchor fallback — add a slug here each time a
// new one is built, same pattern `remap`'s V2_ROUTES table (below) uses.
const INDUSTRY_PAGE_OVERRIDES: Record<string, string> = {
  "oil-gas": "/industries/oil-gas",
  "construction": "/industries/construction",
  "healthcare": "/industries/healthcare",
  "facility-management": "/industries/facility-management",
  "epc": "/industries/epc-engineering",
  "manufacturing": "/industries/manufacturing",
};
const INDUSTRY_ITEMS: Sub[] = INDUSTRY_LIST.map((ind) => ({
  title: industryLabel(ind),
  link: INDUSTRY_PAGE_OVERRIDES[ind.slug] ?? `${INDUSTRY_PAGE_PATH}#${ind.slug}`,
  desc: ind.tagline,
}));
// Split evenly into two columns, 3 rows each (no group labels — unlike
// Services, these aren't naturally two named categories).
const INDUSTRY_COLUMNS = [
  INDUSTRY_ITEMS.slice(0, 3),
  INDUSTRY_ITEMS.slice(3),
];

// Desktop nav: the site's real menuData, minus "Home" (replaced by IoT
// Solutions, below) and the two items folded into the Who We Are dropdown
// (Contact Us, Careers — dropped as standalone pill items, not from the data
// module itself), with Industry We Serve inserted after Services and Who We
// Are appended at the end. Final order: IoT Solutions | Services | Industry
// We Serve | Portfolio | AI Training | Who We Are.
const Nav: MenuNode[] = [
  // No page of its own yet (every row link is a "#" placeholder — see
  // IOT_ITEMS above), same as Industry We Serve, so it renders as a
  // hover-only <button> trigger below, not a dead/misleading <Link>.
  { title: "IoT Solutions", link: "#", hasDropdown: true, submenu: IOT_ITEMS },
];
for (const item of RawNav) {
  if (item.title === "Contact Us" || item.title === "Careers" || item.title === "Home") continue;
  Nav.push(item);
  if (item.title === "Services") {
    Nav.push({ title: "Industry We Serve", link: INDUSTRY_PAGE_PATH, hasDropdown: true, submenu: INDUSTRY_ITEMS });
  }
}
Nav.push({ title: "Who We Are", link: "/about", hasDropdown: true, submenu: WHO_WE_ARE_ITEMS });

// One row in a mega-menu column: icon tile + title (+ optional one-line
// description). Shared by the Services, Industry We Serve, and Who We Are
// panels — the icon is resolved by the caller (not looked up internally) so
// this one row component works for any icon map. Hover: a red left border
// (the etiot.in reference's cue) plus a soft background highlight and lift,
// and the icon tile pops onto its own raised layer (bigger shadow, flips to
// solid red) — not just a flat background-color swap. The border is
// transparent at rest (not absent) so it doesn't shift the row's content
// left by 3px on hover. `compact` (Industry We Serve — 8 rows in a smaller
// panel) drops the description and shrinks the icon/padding so the row is
// name-only and the panel stays tight instead of needing to fit 8 full
// descriptions.
const ServiceRow = ({ s, to, icon: Icon, compact = false, descMaxWidth }: { s: Sub; to: string; icon: LucideIcon; compact?: boolean; descMaxWidth?: number }) => {
  const [hover, setHover] = useState(false);
  const tile = compact ? 30 : 36;
  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: compact ? 10 : 12,
        padding: compact ? "7px 10px 7px 8px" : "9px 10px 9px 8px", borderRadius: 12,
        borderLeft: `3px solid ${hover ? T.red : "transparent"}`,
        textDecoration: "none",
        background: hover ? T.lightAlt : "transparent",
        boxShadow: hover ? "0 8px 18px rgba(16,42,77,0.10)" : "none",
        transform: hover ? "translateY(-1px)" : "none",
        transition: "background 140ms ease, box-shadow 200ms ease, transform 200ms ease, border-color 160ms ease",
      }}
    >
      <span style={{
        width: tile, height: tile, borderRadius: 10, flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: hover ? T.red : "rgba(217,53,34,0.08)",
        color: hover ? "#fff" : T.red,
        boxShadow: hover ? `0 6px 14px ${T.redGlow}` : "none",
        transform: hover ? "translateY(-1px) scale(1.06)" : "none",
        transition: "background 160ms ease, color 160ms ease, box-shadow 200ms ease, transform 200ms ease",
      }}>
        <Icon size={compact ? 15 : 17} strokeWidth={2} />
      </span>
      {/* flex:1 + minWidth:0 — without these, this text wrapper (a flex child
         of the row's `display:flex`) sizes to max-content and never wraps,
         so the description ran off in one long line instead of onto a
         second line within the actual column width. */}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: T.fontHead, fontSize: compact ? 13.5 : 14, fontWeight: 600, color: T.headNavy, whiteSpace: "nowrap" }}>
          {s.title}
        </span>
        {s.desc && !compact && (
          <span style={{
            display: descMaxWidth ? "-webkit-box" : "block", fontFamily: T.fontBody,
            fontSize: descMaxWidth ? 12.5 : 13, lineHeight: 1.5, whiteSpace: "normal",
            color: T.muted, marginTop: 2,
            // capped at 2 lines (Industry We Serve only) — a longer tagline
            // clips with an ellipsis instead of pushing the row taller
            ...(descMaxWidth ? {
              maxWidth: descMaxWidth, WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
              overflow: "hidden", textOverflow: "ellipsis",
            } : {}),
          }}>
            {s.desc}
          </span>
        )}
      </span>
    </Link>
  );
};

// While browsing /v2, nav links point at their /v2 equivalents. Anything not in
// this map passes through to the existing site unchanged, because it has no
// /v2 variant.
const V2_ROUTES: Record<string, string> = {
  "/":         "/",
  "/about":    "/about",
  "/service":  "/services",
  "/project":  "/portfolio",
  "/training": "/training",
  "/contact":  "/contact",
  "/careers":  "/careers",
  // The 10 mega-menu service rows — each now has its own /v2/services/[slug]
  // detail page (src/page/v2/services/), so every row stays on /v2 end to end.
  "/ai-erp":                            "/services/ai-powered-erp",
  "/service/software-development":      "/services/software-development",
  "/service/ai-training-consulting":    "/services/ai-training-consulting",
  "/service/mobile-application":        "/services/mobile-application",
  "/erp-industries":                    "/services/erp-industries",
  "/service/devsecops-mlops-solutions": "/services/devsecops-mlops-solutions",
  "/service/cloud-service-storage":     "/services/cloud-service-storage",
  "/service/quantum-computing":         "/services/quantum-computing",
  "/service/web-mobile-hosting":        "/services/web-mobile-hosting",
  "/service/software-consulting":       "/services/software-consulting",
};
// Exported so XerxezMobileMenu (the off-canvas nav) remaps links through this
// exact same table — one source of truth for "which /v2 page a v1 link maps to."
export const remap = (link: string) => V2_ROUTES[link] ?? link;   // /v2 route or original

// ── <V2SignIn> ───────────────────────────────────────────────────────────
// "Sign in ⌄" text link that opens a small white panel of login options.
const V2SignIn = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);          // is the panel open?
  const ref = useRef<HTMLDivElement>(null);         // wrapper, for outside-click detection
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null); // hover-close debounce

  // Close the panel when clicking anywhere outside it.
  useEffect(() => {
    if (!open) return;                              // only listen while open
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Hover opens the panel immediately; leaving waits a beat (so moving the
  // mouse from the button down into the panel doesn't flicker-close it) —
  // same debounced pattern the mega-menus below use.
  const onEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const onLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <div ref={ref} className={className} style={{ position: "relative" }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}           // toggle (keyboard / touch)
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 500,
          color: open ? "#fff" : "rgba(255,255,255,0.78)",   // brighten while open
          padding: "6px 12px",
          transition: "color 150ms ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseOut={(e) => { if (!open) e.currentTarget.style.color = "rgba(255,255,255,0.78)"; }}
      >
        Sign in
        {/* caret flips when the panel is open — width/height set explicitly,
           see the main-nav caret's comment for why (main.scss's global svg
           reset overrides the `size` prop's width/height attributes) */}
        <ChevronDown size={14} style={{ width: 14, height: 14, flexShrink: 0, transition: "transform 150ms ease", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        // dropdown panel — white card, anchored to the right edge of the button.
        // Sized to match the "Who We Are" panel (width 320, padding 12, compact
        // ServiceRow-style rows) rather than the taller first-pass sizing.
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          width: 320, background: "#fff",
          border: `1px solid ${T.border}`, borderRadius: 16,
          boxShadow: "0 20px 40px rgba(7,26,51,0.15)",
          zIndex: 3, padding: 8,
        }}>
          {SIGNIN_OPTIONS.map((opt) => (
            <Link
              key={opt.to}
              to={opt.to}
              onClick={() => setOpen(false)}          // close after choosing
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 10px 6px 8px", textDecoration: "none",
                borderRadius: 12,
                transition: "background 140ms ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = T.lightAlt)}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* icon tile — Academy Login gets the lucide GraduationCap icon;
                  the other two render their FontAwesome class from SIGNIN_OPTIONS. */}
              <span style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: T.tileBg, color: T.red,
                display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}>
                {opt.to === "/lma/login" ? <GraduationCap size={16} /> : <i className={opt.icon} />}
              </span>
              <span>
                <span style={{ display: "block", fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 700, color: T.headNavy }}>
                  {opt.label}
                </span>
                <span style={{ display: "block", fontFamily: T.fontBody, fontSize: 11.5, color: "#6b7280", marginTop: 1 }}>
                  {opt.subtitle}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ── <XerxezHeader> ───────────────────────────────────────────────────────────
const XerxezHeader = () => {
  const { toggleMobileMenu } = useCustomContext();          // opens the off-canvas menu
  const { pathname } = useLocation();                       // current route, for active state
  const [scrolled, setScrolled] = useState(false);          // false = at top (transparent)
  const [openKey, setOpenKey] = useState<string | null>(null); // which mega-menu is open
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null); // hover-close debounce

  // Transparent over the hero at page top; solid navy once the user scrolls past 12px.
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();                                                   // set initial state on mount
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close any open mega-menu whenever the route changes.
  useEffect(() => { setOpenKey(null); }, [pathname]);

  // Open a mega-menu immediately on hover-in.
  const openMenu = (k: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(k);
  };
  // Close after a short delay on hover-out, so moving between trigger and panel doesn't flicker.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 140);
  };

  // A nav item is "active" if the current path is (under) its /v2 target.
  // "Services" and "Industry We Serve" both remap under /v2/services (the
  // industries page is technically a service-detail route), so without a
  // special case both pills would light up together on the industries page.
  // Since Industry We Serve owns that one specific path, Services' match
  // explicitly excludes it.
  const isActive = (item: MenuNode) => {
    const to = remap(item.link);
    if (item.title === "Services") return pathname.startsWith(to) && pathname !== INDUSTRY_PAGE_PATH && !pathname.startsWith(`${INDUSTRY_PAGE_PATH}/`);
    return to === "/" ? pathname === "/" : pathname.startsWith(to);
  };

  return (
    <header
      style={{
        position: "fixed",                                  // stays on top while scrolling
        insetInline: 0,                                     // left:0; right:0
        top: 0,
        zIndex: 1000,                                       // above page content, below modals
        height: V2_HEADER_H,
        background: scrolled ? T.navy : "transparent",      // reveal the hero at page top
        boxShadow: scrolled ? `0 6px 24px ${T.scrim(0.30)}` : "none",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "background 240ms ease, box-shadow 240ms ease, border-color 240ms ease",
      }}
    >
      <div className="container" style={{ height: "100%" }}>
        {/* position:relative so the centred nav can be absolutely positioned within it */}
        <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", gap: 20 }}>
          {/* Logo → /v2 home */}
          <Link to="/" style={{ display: "inline-flex", flexShrink: 0, lineHeight: 0 }} aria-label="XERXEZ home">
            <Image src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" width={200} height={72}
              style={{ height: 90, width: "auto", display: "block" }} />
          </Link>

          {/* Centre pill nav (desktop ≥ xl) — absolutely centred in the full header width
             so the logo / right actions don't push it off-centre. */}
          <nav
            className="d-none d-xl-flex"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",           // true centre
              zIndex: 2,
              alignItems: "center",
              height: 44,
              gap: 4,
              padding: "0 16px",
              background: "rgba(255,255,255,0.06)",          // faint capsule fill
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {Nav.map((item) => {
              const active = isActive(item);
              const hasMenu = !!item.hasDropdown && !!item.submenu?.length;  // does it open a mega-menu?
              return (
                <div
                  key={item.title}
                  // Deliberately NOT `position: relative` for Services / Industry We
                  // Serve — their panels are `position: absolute` and need to resolve
                  // against the <nav> pill (already `position: absolute`, itself
                  // centered in the header) rather than this small per-item box, so
                  // they center under the whole navbar instead of under whichever
                  // trigger happens to be hovered. "Who We Are" is the exception: it
                  // sits at the far right of the pill, so its panel anchors to ITS
                  // OWN right edge instead (`position: relative` here + the panel's
                  // `right: 0`) — centering it like the others would push it partly
                  // off-screen.
                  style={item.title === "Who We Are" ? { position: "relative" } : undefined}
                  onMouseEnter={() => hasMenu && openMenu(item.title)}
                  onMouseLeave={scheduleClose}
                >
                  {/* Only the item currently hovered (or whose mega-menu is open)
                     gets the solid white pill + red text + soft red "lit" glow
                     (matches the etiot.in reference) — not the active route too,
                     which used to stay lit while hovering a different item,
                     showing two white pills at once. `active` still exists (see
                     `isActive` above) but no longer drives this pill's styling.
                     "Industry We Serve" and "IoT Solutions" have no page of
                     their own — the rows inside each dropdown do — so both
                     render as a <button> that only opens the panel on hover,
                     not a <Link>, so the trigger isn't a dead/misleading
                     navigation target. */}
                  {(() => {
                    const triggerStyle: CSSProperties = {
                      // These two trigger a <button>, unlike every sibling nav item
                      // which is a <Link> (<a>). Browser UA styles give <button>
                      // its own default line-height/box-sizing/margin, which made
                      // its hover pill render visibly taller/wider than the <Link>
                      // pills next to it — the resets below make it match exactly.
                      appearance: "none",
                      WebkitAppearance: "none",
                      margin: 0,
                      boxSizing: "border-box",
                      lineHeight: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: 999,
                      fontFamily: T.fontHead,
                      fontSize: 13.5,
                      fontWeight: 500,
                      textDecoration: "none",
                      border: "none",
                      background: openKey === item.title ? "#fff" : "transparent",
                      color: openKey === item.title ? T.red : "rgba(255,255,255,0.78)",
                      boxShadow: openKey === item.title ? "0 8px 20px rgba(217,53,34,0.25)" : "none",
                      cursor: (item.title === "Industry We Serve" || item.title === "IoT Solutions") ? "default" : "pointer",
                      transition: "color 160ms ease, background 160ms ease, box-shadow 200ms ease",
                    };
                    const hoverOn = (e: ReactMouseEvent<HTMLElement>) => {
                      e.currentTarget.style.color = T.red;
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(217,53,34,0.25)";
                    };
                    const hoverOff = (e: ReactMouseEvent<HTMLElement>) => {
                      const on = openKey === item.title;
                      e.currentTarget.style.color = on ? T.red : "rgba(255,255,255,0.78)";
                      e.currentTarget.style.background = on ? "#fff" : "transparent";
                      e.currentTarget.style.boxShadow = on ? "0 8px 20px rgba(217,53,34,0.25)" : "none";
                    };
                    return (item.title === "Industry We Serve" || item.title === "IoT Solutions") ? (
                      <button
                        type="button"
                        style={triggerStyle}
                        onMouseOver={hoverOn}
                        onMouseOut={hoverOff}
                        aria-haspopup={hasMenu || undefined}
                        aria-expanded={hasMenu ? openKey === item.title : undefined}
                      >
                        {item.title}
                        {hasMenu && (
                          <ChevronDown size={14} style={{
                            width: 14, height: 14, flexShrink: 0,
                            transition: "transform 180ms ease",
                            transform: openKey === item.title ? "rotate(180deg)" : "none",
                          }} />
                        )}
                      </button>
                    ) : (
                  <Link
                    to={remap(item.link)}
                    style={triggerStyle}
                    onMouseOver={hoverOn}
                    onMouseOut={hoverOff}
                    aria-haspopup={hasMenu || undefined}
                    aria-expanded={hasMenu ? openKey === item.title : undefined}
                    // active route no longer drives the visible pill styling (see
                    // above), but screen readers still get the current-page signal
                    aria-current={active ? "page" : undefined}
                  >
                    {item.title}
                    {hasMenu && (
                      // caret rotates when this item's panel is open. width/height
                      // set explicitly (not just the `size` prop, which only sets
                      // the <svg> width/height attributes) because main.scss's
                      // global `img, svg { max-width:100%; height:auto; }` reset
                      // overrides those attributes — inline `style` wins over that
                      // element-selector rule, which is what made this caret
                      // (unlike the Sign-in dropdown's own, sized the same way but
                      // sitting in a different flex context) collapse to invisible.
                      <ChevronDown size={14} style={{
                        width: 14, height: 14, flexShrink: 0,
                        transition: "transform 180ms ease",
                        transform: openKey === item.title ? "rotate(180deg)" : "none",
                      }} />
                    )}
                  </Link>
                    );
                  })()}

                  {/* Mega-menu panels. Services and Industry We Serve share one JSX
                     block: plain CSS `position: absolute; left: 50%; transform:
                     translateX(-50%)`, which resolves against the nearest positioned
                     ancestor (the <nav> pill above, not this per-item wrapper, which
                     deliberately has no `position` of its own for these two) so both
                     panels center under the WHOLE navbar — not under whichever
                     trigger happens to be hovered. Since <nav> is itself centered in
                     the header, this always lands them dead-center in the viewport
                     regardless of width, so they can't go off-screen on any normal
                     desktop width. Services is 900px (two labeled columns, 5
                     items/side); Industry We Serve is 860px (two plain columns, 3
                     items/side) — both share the white-card + navy-CTA-panel
                     padding/radius/shadow/row-sizing.
                     Who We Are is the exception, rendered as its own simple branch
                     below: it sits at the far right of the pill, so centering it
                     under <nav> would clip it off-screen — instead it's `position:
                     absolute; right: 0` against its own per-item wrapper (which DOES
                     get `position: relative`, set above), a single white card with no
                     navy panel. */}
                  {hasMenu && openKey === item.title && item.title === "Who We Are" ? (
                    // Who We Are — simple single-column white card, no navy panel.
                    // Anchored to ITS OWN right edge (not centered under <nav>, unlike
                    // Services / Industry We Serve) since it sits at the far right of
                    // the pill and would otherwise clip off-screen.
                    <div style={{
                      position: "absolute", top: "calc(100% + 14px)", right: 0,
                      width: 320, background: "#fff", borderRadius: 16,
                      border: `1px solid ${T.border}`, boxShadow: `0 24px 60px ${T.scrim(0.18)}`,
                      padding: 12,
                    }}>
                      {item.submenu!.map((s) => (
                        <ServiceRow key={s.link} s={s} to={remap(s.link)} icon={WHO_WE_ARE_ICONS[s.title] ?? Users} />
                      ))}
                    </div>
                  ) : hasMenu && openKey === item.title && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 14px)", left: "50%", transform: "translateX(-50%)",
                      width: item.title === "Industry We Serve" ? 860 : 900,
                      display: "flex", gap: 16, alignItems: "stretch",
                    }}>
                      <div style={{
                        flex: 1, background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`,
                        boxShadow: `0 30px 70px ${T.scrim(0.22)}`, padding: "24px 28px",
                        display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 20,
                      }}>
                        {item.title === "Services" ? (
                          SERVICE_COLUMNS.map((col) => (
                            <div key={col.label}>
                              <div style={{
                                fontFamily: T.fontHead, fontSize: 11, fontWeight: 700,
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                color: T.red, padding: "4px 10px 8px",
                              }}>
                                {col.label}
                              </div>
                              {item.submenu!
                                .filter((s) => col.items.includes(s.title))
                                .map((s) => <ServiceRow key={s.link} s={s} to={remap(s.link)} icon={SERVICE_ICONS[s.title] ?? Code} />)}
                            </div>
                          ))
                        ) : item.title === "IoT Solutions" ? (
                          // IoT Solutions — same labeled two-column layout as Services
                          // ("Connected Operations" cross-industry capabilities vs.
                          // "Industry Solutions" sector applications). Every row links
                          // to "#" for now (see IOT_ITEMS above) — no /v2/iot-solutions
                          // pages exist yet.
                          IOT_COLUMNS.map((col) => (
                            <div key={col.label}>
                              <div style={{
                                fontFamily: T.fontHead, fontSize: 11, fontWeight: 700,
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                color: T.red, padding: "4px 10px 8px",
                              }}>
                                {col.label}
                              </div>
                              {item.submenu!
                                .filter((s) => col.items.includes(s.title))
                                .map((s) => <ServiceRow key={s.link} s={s} to={remap(s.link)} icon={IOT_ICONS[s.title] ?? Wifi} />)}
                            </div>
                          ))
                        ) : (
                          // Industry We Serve — 6 industries, split evenly into two
                          // plain (unlabeled) columns — no natural two-category split
                          // like Services has. Full description (the real `tagline`
                          // from erpIndustriesData, via INDUSTRY_ITEMS' `desc`) shown,
                          // same as Services rows, but capped at descMaxWidth so it
                          // reliably wraps to ~2 lines regardless of the column's
                          // actual rendered width.
                          INDUSTRY_COLUMNS.map((col, i) => (
                            <div key={i}>
                              {col.map((s) => (
                                <ServiceRow key={s.link} s={s} to={remap(s.link)} icon={INDUSTRY_ICONS[s.title] ?? Building2} descMaxWidth={220} />
                              ))}
                            </div>
                          ))
                        )}
                      </div>

                      {/* navy CTA panel — #071a33, 12px radius; IoT Solutions is the
                         one panel with a button (the other two are text-only) */}
                      <div style={{
                        width: 240, flexShrink: 0, alignSelf: "flex-start", position: "relative", overflow: "hidden",
                        background: T.navy, borderRadius: 12,
                        padding: "24px 22px", display: "flex", flexDirection: "column",
                      }}>
                        <div aria-hidden="true" style={{
                          position: "absolute", bottom: "-30%", right: "-30%", width: 180, height: 180, borderRadius: "50%",
                          background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 70%)`, filter: "blur(16px)", pointerEvents: "none",
                        }} />
                        {/* icon in red, on a translucent tile — Wifi for IoT Solutions,
                           Building2 for Industry We Serve (a real industry/sector
                           glyph), Sparkles for Services */}
                        <span style={{
                          position: "relative", width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(255,255,255,0.12)", color: T.red, marginBottom: 16,
                        }}>
                          {item.title === "IoT Solutions"
                            ? <Wifi size={18} strokeWidth={2} />
                            : item.title === "Industry We Serve"
                            ? <Building2 size={18} strokeWidth={2} />
                            : <Sparkles size={18} strokeWidth={2} />}
                        </span>
                        {item.title === "Services" ? (
                          <>
                            <h4 style={{
                              position: "relative", fontFamily: T.fontHead, fontSize: 17, fontWeight: 700,
                              color: "#fff", margin: "0 0 10px", lineHeight: 1.3, whiteSpace: "normal", overflowWrap: "break-word",
                            }}>
                              Partner with our engineers
                            </h4>
                            <p style={{
                              position: "relative", fontFamily: T.fontBody, fontSize: 12.5, lineHeight: 1.6,
                              color: "rgba(255,255,255,0.70)", margin: 0, whiteSpace: "normal", overflowWrap: "break-word",
                            }}>
                              From product strategy to production systems — software, AI, cloud, and quality delivery under one roof.
                            </p>
                          </>
                        ) : item.title === "IoT Solutions" ? (
                          <>
                            <h4 style={{
                              position: "relative", fontFamily: T.fontHead, fontSize: 17, fontWeight: 700,
                              color: "#fff", margin: "0 0 10px", lineHeight: 1.3, whiteSpace: "normal", overflowWrap: "break-word",
                            }}>
                              Explore IoT Solutions
                            </h4>
                            <p style={{
                              position: "relative", fontFamily: T.fontBody, fontSize: 12.5, lineHeight: 1.6,
                              color: "rgba(255,255,255,0.70)", margin: 0, whiteSpace: "normal", overflowWrap: "break-word",
                            }}>
                              Connected platforms for assets, facilities, fleets, and industrial operations — engineered end to end.
                            </p>
                            <Link
                              // there's no standalone IoT overview page — send
                              // visitors to the first real IoT solution page
                              // instead of a dead "/v2/iot-solutions" route
                              to={IOT_ITEMS[0].link}
                              style={{
                                position: "relative", marginTop: 18,
                                display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
                                background: T.red, color: "#fff",
                                fontFamily: T.fontHead, fontSize: 13, fontWeight: 600,
                                padding: "9px 16px", borderRadius: 999, textDecoration: "none",
                                boxShadow: `0 8px 20px ${T.redGlow}`,
                              }}
                            >
                              Explore IoT <ArrowRight size={13} />
                            </Link>
                          </>
                        ) : (
                          <>
                            <h4 style={{
                              position: "relative", fontFamily: T.fontHead, fontSize: 17, fontWeight: 700,
                              color: "#fff", margin: "0 0 10px", lineHeight: 1.3, whiteSpace: "normal", overflowWrap: "break-word",
                            }}>
                              Built for your sector
                            </h4>
                            <p style={{
                              position: "relative", fontFamily: T.fontBody, fontSize: 12.5, lineHeight: 1.6,
                              color: "rgba(255,255,255,0.70)", margin: 0, whiteSpace: "normal", overflowWrap: "break-word",
                            }}>
                              Domain-ready ERP and AI platforms built for engineering, industrial, and enterprise operations.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </nav>

          {/* Right actions — pushed to the far right with margin-left:auto, then
             nudged past the container's own right padding (negative margin)
             so Sign in / Book Free Demo sit closer to the header's true edge. */}
          <div style={{ marginLeft: "auto", marginRight: -20, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Sign in dropdown — desktop only */}
            <V2SignIn className="d-none d-xl-block" />

            {/* Primary CTA — fully-rounded red pill (etiot "Hire Us" proportions:
               short height, full capsule radius), hidden on the smallest screens */}
            <Link
              to="/contact"
              // was d-sm-inline-flex (576px+) — too early: between sm and xl the hamburger
              // is *also* visible, and the two competing for space in a narrow right-actions
              // group is what clipped this button. md (768px+) gives them more room.
              className="d-none d-md-inline-flex"
              style={{
                alignItems: "center",
                gap: 8,
                background: T.red,
                color: "#fff",
                fontFamily: T.fontHead,
                fontSize: 13.5,
                fontWeight: 600,
                padding: "6px 18px",
                borderRadius: 999,
                textDecoration: "none",
                boxShadow: `0 10px 24px ${T.redGlow}`,
                transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = T.redDark;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = T.red;
              }}
            >
              Book Free Demo <ArrowRight size={15} />
            </Link>

            {/* Hamburger — shown below xl; opens the off-canvas menu via context */}
            <button
              className="d-xl-none"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,                                  // 44px = min touch target
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default XerxezHeader;
