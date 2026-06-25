import { useEffect, useState } from "react";

const BackToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY >= 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: 90,
        right: 20,
        zIndex: 900,
        width: 46,
        height: 46,
        borderRadius: "50%",
        border: "none",
        background: hovered ? "#5a47c0" : "#6c57d2",
        boxShadow: "0 4px 16px rgba(108,87,210,0.35)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        transition: "background 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        color: "#fff",
      }}
    >
      <i className="fas fa-chevron-up" style={{ fontSize: 13, lineHeight: 1 }} />
      {hovered && (
        <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.06em", lineHeight: 1 }}>
          TOP
        </span>
      )}
    </button>
  );
};

export default BackToTopBtn;

