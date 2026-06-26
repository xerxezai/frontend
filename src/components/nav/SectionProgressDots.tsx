import { useEffect, useRef, useState } from "react";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
}

const SectionProgressDots = ({ sections }: Props) => {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [hovered, setHovered] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const map = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          map.set(e.target.id, e.intersectionRatio);
        });
        let bestId = "";
        let bestRatio = -1;
        map.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      aria-label="Page sections navigation"
      style={{
        position: "fixed",
        right: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 900,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      {sections.map(({ id, label }) => {
        const isActive = active === id;
        const isHov = hovered === id;
        return (
          <div
            key={id}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {isHov && (
              <span style={{
                background: "rgba(201,136,58,0.92)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 6,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(201,136,58,0.25)",
                transition: "opacity 0.2s",
              }}>
                {label}
              </span>
            )}
            <button
              type="button"
              title={label}
              aria-label={`Go to ${label}`}
              onClick={() => scrollTo(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
                borderRadius: "50%",
                border: "none",
                background: isActive ? "#C9883A" : "rgba(201,136,58,0.30)",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.25s ease",
                boxShadow: isActive ? "0 0 0 3px rgba(201,136,58,0.20)" : "none",
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SectionProgressDots;

