// XerxezProductsShowcase.tsx
// Purpose: Homepage "work engineered for real-world operations" section — a
//          center-mode carousel of project/case-study cards (etiot.in-style):
//          the active card sits centered and full-size, neighbours peek in
//          dimmed at the edges, and it auto-advances every 5s.
// Used in: page/v2/HomeV2.tsx
// Data source: `homeOneProjectData` from src/data/index.ts (image, category,
//              title, description, link). Rendered verbatim.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { homeOneProjectData } from "../../../../data";
import Image from "../../../utils/Image";
import { T, SectionHeading, Reveal, ArrowRight, sectionPad, prefersReducedMotion } from "../../01-core/v2theme";

// The element type of one item in the project-data array.
type Project = (typeof homeOneProjectData)[number];

const SLIDES = homeOneProjectData;
const AUTOPLAY_MS = 5000;   // "should move after every 5 sec"
const CARD_MAX_TILT = 7;    // degrees — how far the active card tilts toward the cursor, at most

// The real slides, padded with one clone of the last slide up front and one
// clone of the first slide at the end. Without this, centering the first or
// last slide left one side with no neighbour to peek — a large blank gutter.
// With the padding, the active card (always rendered at a position 1..N) has
// a real neighbour on both sides at every step. `logicalIndex` is which real
// slide a clone stands in for, so clicking one still goes to the right slide.
const RENDER_SLIDES = [
  { ...SLIDES[SLIDES.length - 1], _renderKey: "clone-start", logicalIndex: SLIDES.length - 1, decorative: true },
  ...SLIDES.map((s, i) => ({ ...s, _renderKey: s.id, logicalIndex: i, decorative: false })),
  { ...SLIDES[0], _renderKey: "clone-end", logicalIndex: 0, decorative: true },
];

// One project card. `active` is the centered, full-strength slide; the rest
// are dimmed/scaled down so they read as peeking neighbours. Clicking a
// non-active card just recenters it instead of navigating away. While active,
// the card also tilts toward the cursor (real 3D perspective, not a flat lift)
// — the same pointer-tracked treatment as the homepage service cards.
const Card = ({
  p, active, decorative, onActivate, cardRef,
}: {
  p: Project;
  active: boolean;
  decorative?: boolean;   // true for the padding clones — hidden from a11y tree, not tab-stoppable
  onActivate: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const [hover, setHover] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Continuous pointer tracking on the active card only — written straight to
  // the DOM (not React state) so it tracks the cursor at 60fps with no re-render.
  const handleMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!active || prefersReducedMotion()) return;
    const el = linkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;    // 0 (left edge) .. 1 (right edge)
    const py = (e.clientY - rect.top) / rect.height;    // 0 (top edge) .. 1 (bottom edge)
    const rotateY = (px - 0.5) * CARD_MAX_TILT * 2;       // left/right tilt, toward the cursor
    const rotateX = (0.5 - py) * CARD_MAX_TILT * 2;       // up/down tilt, toward the cursor
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
  };

  const handleLeave = () => {
    setHover(false);
    const el = linkRef.current;
    // only the active card owns an imperative transform — reset it on leave
    if (el && active) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  };

  return (
    <div ref={cardRef} style={{ flex: "0 0 auto", width: "clamp(280px, 44vw, 560px)" }}>
      <Link
        ref={linkRef}
        // homeOneProjectData is shared with v1's ProjectSection.tsx, so its
        // `link` field is a v1 "/project/*" path — every one of these 6
        // projects now has a real /v2/project/* case study, so remap here
        // rather than editing the shared data.
        to={`/v2${p.link}`}
        // Only the centered card navigates; a peeking neighbour just recenters itself.
        onClick={(e) => { if (!active) { e.preventDefault(); onActivate(); } }}
        onMouseEnter={() => setHover(true)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        aria-current={active ? "true" : undefined}
        // a padding clone duplicates a real slide's content/link — keep it out of
        // the tab order and the a11y tree so screen readers/keyboard users only
        // ever encounter each project once
        aria-hidden={decorative ? "true" : undefined}
        tabIndex={decorative ? -1 : undefined}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#fff",
          border: `1px solid ${T.border}`,
          borderRadius: T.rcard,
          overflow: "hidden",                         // clip the zooming image
          textDecoration: "none",
          transformStyle: "preserve-3d",
          // layered ambient + directional + accent shadow reads as real lift, not a flat drop-shadow
          boxShadow: active
            ? (hover
              ? "0 2px 6px rgba(16,42,77,0.08), 0 34px 64px rgba(16,42,77,0.20), 0 0 0 1px rgba(217,53,34,0.06)"
              : "0 20px 48px rgba(16,42,77,0.14)")
            : "0 8px 20px rgba(16,42,77,0.06)",
          // the signature move: active card is full-scale/opaque, neighbours shrink and fade.
          // While active+hovered, `handleMove` owns the transform directly — leave it alone here
          // so the per-frame DOM write isn't clobbered by this declarative value on re-render.
          transform: active
            ? (hover ? undefined : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)")
            : "scale(0.87)",
          opacity: active ? 1 : 0.45,
          transition: active && hover
            ? "box-shadow 220ms ease"
            : "transform 480ms cubic-bezier(0.22,1,0.36,1), opacity 480ms ease, box-shadow 220ms ease",
          cursor: "pointer",
        }}
      >
        {/* image + category badge */}
        <div style={{ position: "relative", height: 190, overflow: "hidden", flexShrink: 0 }}>
          <Image
            src={p.imageUrl}
            alt={p.title}
            width={440}
            height={190}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: active && hover ? "scale(1.05)" : "none",       // subtle zoom on hover, active only
              transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: T.red, color: "#fff",
            fontFamily: T.fontHead, fontSize: 10.5, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "5px 12px", borderRadius: 999,
          }}>
            {p.category}
          </span>
        </div>
        {/* body */}
        <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{
            fontFamily: T.fontHead, fontSize: 18, fontWeight: 700,
            color: T.headNavy, margin: "0 0 10px", lineHeight: 1.3,
          }}>
            {p.title}
          </h3>
          <p style={{
            fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65,
            color: T.muted, margin: "0 0 18px", flex: 1,        // push the link row down
          }}>
            {p.description}
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600, color: T.red,
          }}>
            View case study
            {/* arrow nudges right while the active card is hovered */}
            <ArrowRight size={14} style={{
              transform: active && hover ? "translateX(4px)" : "none",
              transition: "transform 200ms ease",
            }} />
          </span>
        </div>
      </Link>
    </div>
  );
};

const XerxezProductsShowcase = () => {
  const [index, setIndex] = useState(0);           // active slide
  const [offset, setOffset] = useState(0);          // px the track is translated to center the active slide
  const [paused, setPaused] = useState(false);       // hover/focus/manual pause
  const viewportRef = useRef<HTMLDivElement>(null);  // overflow:hidden window
  const slideEls = useRef<(HTMLDivElement | null)[]>([]);   // each rendered slide, for measuring

  // `index` is the logical slide (0..N-1); `renderPos` is where that slide
  // sits in RENDER_SLIDES once the start/end clones are accounted for.
  const renderPos = index + 1;

  // Recenter the track on the active slide (measured, so it stays correct
  // across the fluid clamp()-based card width and any viewport resize).
  const recenter = useCallback(() => {
    const viewport = viewportRef.current;
    const slide = slideEls.current[renderPos];
    if (!viewport || !slide) return;
    const viewportCenter = viewport.clientWidth / 2;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    setOffset(viewportCenter - slideCenter);
  }, [renderPos]);

  useLayoutEffect(() => { recenter(); }, [recenter]);

  useEffect(() => {
    window.addEventListener("resize", recenter);
    return () => window.removeEventListener("resize", recenter);
  }, [recenter]);

  // Autoplay — advances one slide every 5s. Off while paused (hover/focus/manual)
  // or when the visitor has asked for reduced motion.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const goTo = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);

  return (
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Design & Development Center"
            title="Work engineered for real-world operations"
            subtitle="A selection of platforms XERXEZ has designed, built, and shipped into production."
          />
        </Reveal>
      </div>

      {/* full-bleed carousel viewport — deliberately outside .container so the
          dimmed neighbour cards can peek past the page's content edges */}
      <Reveal delay={80}>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured products"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          style={{ marginTop: 54, position: "relative" }}
        >
          <div ref={viewportRef} style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 24,
                transform: `translateX(${offset}px)`,
                transition: "transform 560ms cubic-bezier(0.22,1,0.36,1)",
                padding: "6px 0 10px",                 // room for the active card's shadow/lift
              }}
            >
              {RENDER_SLIDES.map((p, pos) => (
                <Card
                  key={p._renderKey}
                  p={p}
                  active={pos === renderPos}
                  decorative={p.decorative}
                  onActivate={() => goTo(p.logicalIndex)}
                  cardRef={(el) => { slideEls.current[pos] = el; }}
                />
              ))}
            </div>
          </div>

          {/* prev/next — 44px touch targets, sit over the dimmed neighbours */}
          <button
            type="button"
            aria-label="Previous product"
            onClick={() => goTo(index - 1)}
            style={{
              position: "absolute", left: "clamp(8px, 3vw, 28px)", top: "42%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%", border: `1px solid ${T.border}`,
              background: "#fff", color: T.headNavy, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 22px rgba(16,42,77,0.14)", cursor: "pointer", zIndex: 2,
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="Next product"
            onClick={() => goTo(index + 1)}
            style={{
              position: "absolute", right: "clamp(8px, 3vw, 28px)", top: "42%", transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%", border: `1px solid ${T.border}`,
              background: "#fff", color: T.headNavy, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 22px rgba(16,42,77,0.14)", cursor: "pointer", zIndex: 2,
            }}
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>

          {/* dots + pause/play — manual control, required alongside autoplay for accessibility (WCAG 2.2.2) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 28 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {SLIDES.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}: ${p.title}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === index ? 22 : 8, height: 8, borderRadius: 999,
                    border: "none", padding: 0, cursor: "pointer",
                    background: i === index ? T.red : T.border,
                    transition: "width 260ms ease, background 260ms ease",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
              aria-pressed={paused}
              onClick={() => setPaused((v) => !v)}
              style={{
                width: 30, height: 30, borderRadius: "50%", border: `1px solid ${T.border}`,
                background: "#fff", color: T.muted, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", marginLeft: 4,
              }}
            >
              {paused ? <Play size={13} strokeWidth={2.2} /> : <Pause size={13} strokeWidth={2.2} />}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default XerxezProductsShowcase;
