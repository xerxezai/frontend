import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  type MotionValue,
} from "framer-motion";

// Default brand tokens — can be overridden via props for dark/light modes
const DEFAULT_GRID_COLOR  = "rgba(201,136,58,0.85)";
const DEFAULT_BLOB_TR     = "rgba(201,136,58,0.12)";  // top-right
const DEFAULT_BLOB_CENTER = "rgba(255,121,46,0.10)";  // center-right
const DEFAULT_BLOB_BL     = "rgba(201,136,58,0.08)";  // bottom-left

interface InfiniteGridBackgroundProps {
  children?: React.ReactNode;
  /** HTML element to render as (default: "div") */
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  /** Speed of the scrolling grid (pixels/frame). Default 0.4 */
  speed?: number;
  /** Radius of the mouse-reveal glow circle in px. Default 380 */
  revealRadius?: number;
  /** Opacity of the base (always-visible) grid layer. Default 0.06 */
  baseOpacity?: number;
  /** Opacity of the mouse-revealed bright grid layer. Default 0.50 */
  revealOpacity?: number;
  /** Color of the grid lines (default purple for light bg) */
  gridColor?: string;
  /** Blob colors for ambient glows */
  blobColors?: { topRight?: string; center?: string; bottomLeft?: string };
}

/**
 * InfiniteGridBackground
 *
 * Renders an animated grid that scrolls infinitely and is revealed brightly
 * under the cursor via a radial-gradient mask. Drop any content in as children.
 *
 * Usage:
 *   <InfiniteGridBackground as="section" className="hero-section hero-1 bg-cover">
 *     ...page content...
 *   </InfiniteGridBackground>
 */
export const InfiniteGridBackground: React.FC<InfiniteGridBackgroundProps> = ({
  children,
  as: Tag = "div",
  className,
  style,
  speed = 0.4,
  revealRadius = 380,
  baseOpacity = 0.06,
  revealOpacity = 0.50,
  gridColor = DEFAULT_GRID_COLOR,
  blobColors = {},
}) => {
  const blobTR = blobColors.topRight   ?? DEFAULT_BLOB_TR;
  const blobCT = blobColors.center     ?? DEFAULT_BLOB_CENTER;
  const blobBL = blobColors.bottomLeft ?? DEFAULT_BLOB_BL;
  const containerRef = useRef<HTMLElement>(null);

  // Mouse tracking
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseLeave = () => {
    // Push the reveal off-screen so it disappears when cursor leaves
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  // Infinite-scroll grid offset
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + speed) % 40);
    gridOffsetY.set((gridOffsetY.get() + speed) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(${revealRadius}px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLElement>}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Layer 1: always-visible faint grid ────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: baseOpacity,
          pointerEvents: "none",
        }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} color={gridColor} />
      </div>

      {/* ── Layer 2: cursor-revealed bright grid ──────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: revealOpacity,
          maskImage,
          WebkitMaskImage: maskImage,
          pointerEvents: "none",
        }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} color={gridColor} />
      </motion.div>

      {/* ── Layer 3: ambient glow blobs ───────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      >
        <div style={{
          position: "absolute",
          right: "-8%", top: "-22%",
          width: "44%", height: "44%",
          borderRadius: "50%",
          background: blobTR,
          filter: "blur(120px)",
        }} />
        <div style={{
          position: "absolute",
          right: "14%", top: "-8%",
          width: "20%", height: "20%",
          borderRadius: "50%",
          background: blobCT,
          filter: "blur(90px)",
        }} />
        <div style={{
          position: "absolute",
          left: "-6%", bottom: "-18%",
          width: "38%", height: "38%",
          borderRadius: "50%",
          background: blobBL,
          filter: "blur(120px)",
        }} />
      </div>

      {/* ── Children (page content) ───────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </Tag>
  );
};

// ─── Internal SVG grid pattern ──────────────────────────────────────────────

interface GridPatternProps {
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  color?: string;
}

const GridPattern: React.FC<GridPatternProps> = ({ offsetX, offsetY, color = "currentColor" }) => (
  <svg style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <motion.pattern
        id="xerxez-grid-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        x={offsetX}
        y={offsetY}
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
        />
      </motion.pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#xerxez-grid-pattern)" />
  </svg>
);

