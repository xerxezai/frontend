// v2theme.tsx
// Purpose: Design tokens + shared primitives for the /v2 marketing pages.
//          Everything visual on /v2 is derived from the `T` token object here.
// Used in: every file under src/components/v2/ and src/page/v2/
// Data source: colour/spacing values are the etiot.in style spec the client
//              supplied (navy #071a33, red #D93522, Poppins headings). No values
//              are taken from the existing site design system — /v2 is isolated.

import { Link } from "react-router-dom";                       // client-side nav for Btn / LearnMore
import { useEffect, useRef, useState } from "react";            // hooks used by <Reveal>
import type { CSSProperties, ReactNode } from "react";          // types only

// ── Reduced-motion check ───────────────────────────────────────────────────
// Returns true when the OS "reduce motion" setting is on, so <Reveal> (and any
// other v2 component with a decorative animation — tilts, autoplay, etc.) can
// skip it. Guarded with `typeof window` for SSR / test safety. Exported so
// other components don't each re-implement the same matchMedia check.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── API base ───────────────────────────────────────────────────────────────
// Env override, else the Railway production URL. Hoisted here so every /v2
// component that talks to the backend (XerxezCourses, XerxezContactForm) reads the
// same value instead of repeating the fallback URL.
export const V2_API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";

// ── <Reveal> ──────────────────────────────────────────────────────────────
// One shared scroll-in animation so every /v2 section fades/rises with the
// same rhythm. Wrap any block; pass `delay` (ms) to stagger siblings.
export const Reveal = ({
  children,                 // the content to animate in
  delay = 0,                // ms to wait before this element animates (stagger)
  as = "div",               // element tag to render ("li" when used inside a <ul>)
  fill = false,             // set height:100% — see the warning comment below
}: { children: ReactNode; delay?: number; as?: "div" | "li"; fill?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);   // the DOM node we observe for visibility
  const [shown, setShown] = useState(false);  // false = hidden/offset, true = animated in

  useEffect(() => {
    // Respect reduced-motion: show immediately, no observer, no transition.
    if (prefersReducedMotion()) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;                          // ref not attached yet — bail
    // Reveal once the element is ~12% visible; -8% bottom margin triggers it
    // slightly before it fully enters the viewport so it doesn't feel late.
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();             // cleanup on unmount
  }, []);

  const Tag = as as "div";                    // render <div> or <li>
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        // `fill` (height:100%) is ONLY for a single card sitting directly in a
        // stretched Bootstrap `.col` so a row of cards stays level. Do NOT pass
        // `fill` when stacking several <Reveal>s in one column — each would grow
        // to the full section height and the layout overflows.
        height: fill ? "100%" : undefined,
        opacity: shown ? 1 : 0,                                   // fade
        transform: shown ? "translateY(0)" : "translateY(24px)",  // rise 24px
        transition: `opacity 560ms ease ${delay}ms, transform 560ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
};

// ── Design tokens ─────────────────────────────────────────────────────────
// The single source of truth for /v2 colours, radii and fonts. Referenced as
// `T.navy`, `T.red`, etc. everywhere. `as const` keeps the literal types.
export const T = {
  navy:      "#071a33",                                             // primary dark background (etiot spec)
  navy2:     "#0c294d",                                             // lighter navy for card fills on dark bands
  navyGrad:  "linear-gradient(160deg,#0a2444 0%,#071a33 55%,#050f22 100%)", // dark section background
  red:       "#D93522",                                             // accent / primary CTA (etiot spec)
  redDark:   "#b52a1c",                                             // red button hover / active
  redLight:  "#ff6a55",                                             // lighter red — eyebrows / icons on navy (T.red fails contrast there)
  redGlow:   "rgba(217,53,34,0.40)",                                // red used for glows + button shadows
  ink:       "#0a0a0a",                                             // body text on white (near-black, etiot spec)
  headNavy:  "#0f2c4d",                                             // headings on light backgrounds
  muted:     "rgba(10,10,10,0.62)",                                 // secondary text on white (~4.5:1 contrast)
  mutedDark: "rgba(255,255,255,0.72)",                              // secondary text on navy
  page:      "#ffffff",                                             // light page background
  lightAlt:  "#f4f7fa",                                             // alternating light section band
  border:    "#e6ecf2",                                             // 1px card / divider colour on light
  tileBg:    "rgba(217,53,34,0.10)",                                // default (inactive) icon-tile background — soft red tint, brand-accent icon on top
  cardBg:    "#f7f8fa",                                             // flat card fill (feature/differentiator grids) — no shadow, no hover lift
  cardShadow:"0 10px 30px rgba(16,42,77,0.06)",                     // resting shadow for light cards
  rx:        12,                                                    // button corner radius (Tailwind "rounded-xl")
  rcard:     16,                                                    // card corner radius
  fontHead:  "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", // display font (etiot spec)
  fontBody:  "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",    // body font
  // Navy overlay/scrim over a photo or video, at a given opacity — e.g. hero
  // backgrounds. One function instead of every caller hand-typing
  // `rgba(7,26,51,<alpha>)` (the same navy as T.navy, #071a33, as rgb(7,26,51))
  // with its own alpha, which is how this value ended up duplicated across
  // several /v2 files with no shared source.
  scrim: (alpha: number) => `rgba(7,26,51,${alpha})`,
} as const;

// Height of the fixed <XerxezHeader>. Every page hero adds this to its top padding
// so content clears the bar; kept here (core) so nothing depends on layout/.
export const V2_HEADER_H = 84;

// Standard vertical padding for a full section (72px mobile → 120px desktop).
export const sectionPad: CSSProperties = { padding: "clamp(72px, 9vw, 120px) 0" };

// ── <Eyebrow> ─────────────────────────────────────────────────────────────
// Small uppercase kicker above a heading. Red by default; callers pass a
// light-blue `color` on the darkest navy sections for contrast, or T.redLight
// on a photo/navy hero. `mb` tunes the gap to the heading below — page heroes
// sit further from their H1 than a section heading does from its H2.
export const Eyebrow = ({ children, color = T.red, mb = 18 }: { children: ReactNode; color?: string; mb?: number }) => (
  <div style={{
    fontFamily: T.fontBody,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.28em",       // wide tracking — the etiot eyebrow look
    textTransform: "uppercase",
    color,
    marginBottom: mb,
  }}>
    {children}
  </div>
);

// ── <DotGrid> ─────────────────────────────────────────────────────────────
// The faint dot-grid texture layered over a navy section's background. Purely
// decorative, so it's aria-hidden and click-through. Absolutely positioned —
// the parent section must be position:relative with overflow:hidden.
export const DotGrid = ({ opacity = 0.5, size = 34 }: { opacity?: number; size?: number }) => (
  <div aria-hidden="true" style={{
    position: "absolute", inset: 0, pointerEvents: "none", opacity,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: `${size}px ${size}px`,
  }} />
);

// ── <SectionHeading> ──────────────────────────────────────────────────────
// Eyebrow + H2 + optional subtitle. Used at the top of almost every section.
export const SectionHeading = ({
  eyebrow,                 // kicker text
  title,                   // H2 content (string or JSX with <br/>)
  subtitle,                // optional supporting sentence
  align = "left",          // "center" also constrains width + centres margins
  dark = false,            // true on navy sections → white heading, blue eyebrow
  eyebrowColor,            // explicit override for the eyebrow colour
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  eyebrowColor?: string;
}) => (
  <div style={{
    textAlign: align,
    maxWidth: align === "center" ? 760 : undefined,   // keep centred headings readable
    margin: align === "center" ? "0 auto" : undefined,
  }}>
    {/* eyebrow: explicit override → else light-blue on dark → else red */}
    <Eyebrow color={eyebrowColor ?? (dark ? "#5aa9e6" : T.red)}>{eyebrow}</Eyebrow>
    <h2 style={{
      fontFamily: T.fontHead,
      fontWeight: 800,                          // extrabold, per spec
      fontSize: "clamp(30px, 4vw, 52px)",       // fluid 30 → 52px
      lineHeight: 1.1,
      letterSpacing: "-0.015em",                // slight tighten at large sizes
      color: dark ? "#ffffff" : T.headNavy,
      margin: 0,
    }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{
        fontFamily: T.fontBody,
        fontSize: 17,
        lineHeight: 1.7,
        color: dark ? T.mutedDark : T.muted,
        margin: "18px 0 0",
        maxWidth: 640,                                        // ~70 chars/line
        marginLeft: align === "center" ? "auto" : undefined,  // centre the block
        marginRight: align === "center" ? "auto" : undefined,
      }}>
        {subtitle}
      </p>
    )}
  </div>
);

// ── <ArrowRight> ──────────────────────────────────────────────────────────
// The small "→" glyph used inside buttons and inline links. `currentColor`
// so it inherits the parent's text colour. `style` is for callers that animate
// the glyph itself (card hovers nudge it right with a transform).
export const ArrowRight = ({ size = 16, style }: { size?: number; style?: CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={style}>
    <path d="M2 8h10M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── <Btn> ─────────────────────────────────────────────────────────────────
// The one button used across /v2. Renders an <a> when `href` is given
// (external / hash links, mailto, tel) or a router <Link> when `to` is given.
type BtnProps = {
  children: ReactNode;              // button label
  to?: string;                     // internal route → renders <Link>
  href?: string;                   // raw URL / #hash / mailto → renders <a>
  variant?: "primary" | "outline"; // solid red vs. bordered
  dark?: boolean;                  // outline variant on a dark background
  arrow?: boolean;                 // show the trailing → glyph
};

export const Btn = ({ children, to, href, variant = "primary", dark = false, arrow = true }: BtnProps) => {
  // Shared layout / typography for both variants.
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontFamily: T.fontHead,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1,
    padding: "15px 28px",
    borderRadius: T.rx,                           // rounded-xl, not a pill (spec)
    textDecoration: "none",
    cursor: "pointer",
    transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease",
    border: "1.5px solid transparent",           // reserve border space so outline doesn't shift layout
    whiteSpace: "nowrap",
  };
  // Variant-specific colours.
  const style: CSSProperties = variant === "primary"
    ? { ...base, background: T.red, color: "#ffffff", boxShadow: `0 10px 26px ${T.redGlow}` }
    : { ...base, background: "transparent",
        color: dark ? "#ffffff" : T.headNavy,
        borderColor: dark ? "rgba(255,255,255,0.45)" : "rgba(15,44,77,0.25)" };

  // Hover: lift 2px, and deepen the fill (primary) or border (outline).
  const onOver = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    if (variant === "primary") {
      e.currentTarget.style.background = T.redDark;
      e.currentTarget.style.boxShadow = `0 14px 34px ${T.redGlow}`;
    } else {
      e.currentTarget.style.borderColor = dark ? "#ffffff" : T.headNavy;
    }
  };
  // Mouse-out: restore the resting state.
  const onOut = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    if (variant === "primary") {
      e.currentTarget.style.background = T.red;
      e.currentTarget.style.boxShadow = `0 10px 26px ${T.redGlow}`;
    } else {
      e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.45)" : "rgba(15,44,77,0.25)";
    }
  };

  const inner = <>{children}{arrow && <ArrowRight />}</>;   // label + optional →

  // External / hash / protocol links → plain <a>. Open http(s) in a new tab.
  if (href) {
    return (
      <a href={href} style={style} onMouseOver={onOver} onMouseOut={onOut}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}>
        {inner}
      </a>
    );
  }
  // Internal route → router <Link>. Fallback "#" should never be hit in practice.
  return (
    <Link to={to ?? "#"} style={style} onMouseOver={onOver} onMouseOut={onOut}>
      {inner}
    </Link>
  );
};

// ── <LearnMore> ───────────────────────────────────────────────────────────
// Red inline "Learn more →" text link. The gap widens on hover so the arrow
// nudges right (etiot micro-interaction).
export const LearnMore = ({ to, label = "Learn more" }: { to: string; label?: string }) => (
  <Link to={to} style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: T.fontHead,
    fontSize: 14,
    fontWeight: 600,
    color: T.red,
    textDecoration: "none",
    transition: "gap 180ms ease",
  }}
    onMouseOver={e => (e.currentTarget.style.gap = "13px")}   // arrow nudges out
    onMouseOut={e => (e.currentTarget.style.gap = "8px")}     // …and back
  >
    {label}<ArrowRight size={15} />
  </Link>
);

// ── <IconTile> ────────────────────────────────────────────────────────────
// The rounded-square icon holder used on service / feature / process cards.
// Soft red tint + red icon at rest; `active` flips it to solid red with a
// glow (hover / featured state).
export const IconTile = ({ children, active = false, size = 52 }: { children: ReactNode; active?: boolean; size?: number }) => (
  <span style={{
    width: size, height: size, flexShrink: 0,
    borderRadius: 14,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: active ? T.red : T.tileBg,                    // solid red when active, soft red tint otherwise
    color: active ? "#ffffff" : T.red,                        // icon colour follows the tile
    boxShadow: active ? `0 8px 20px ${T.redGlow}` : "none",   // glow only when active
    fontSize: 20,                                             // sizes FontAwesome <i> icons
    transition: "background 200ms ease, color 200ms ease, box-shadow 200ms ease",
  }}>
    {children}
  </span>
);
