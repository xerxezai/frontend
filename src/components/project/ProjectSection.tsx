import { useState } from "react";
import { Link } from "react-router-dom";
import { homeOneProjectData } from "../../data";
import Image from "../utils/Image";

// colour per category
const CAT_COLORS: Record<string, { accent: string; glow: string; grad: string }> = {
  "AI & ERP":             { accent: "#C9883A", glow: "rgba(201,136,58,0.30)",  grad: "linear-gradient(135deg,#e8a84e,#C9883A)" },
  "MLOps":                { accent: "#a78bfa", glow: "rgba(167,139,250,0.30)", grad: "linear-gradient(135deg,#c4b5fd,#a78bfa)" },
  "Cloud & DevSecOps":    { accent: "#60a5fa", glow: "rgba(96,165,250,0.30)",  grad: "linear-gradient(135deg,#93c5fd,#60a5fa)" },
  "Software Development": { accent: "#34d399", glow: "rgba(52,211,153,0.30)",  grad: "linear-gradient(135deg,#6ee7b7,#34d399)" },
  "AI Training":          { accent: "#fb923c", glow: "rgba(251,146,60,0.30)",  grad: "linear-gradient(135deg,#fdba74,#fb923c)" },
};

const DEFAULT_COL = { accent: "#C9883A", glow: "rgba(201,136,58,0.30)", grad: "linear-gradient(135deg,#e8a84e,#C9883A)" };

interface ProjectCardProps {
  project: (typeof homeOneProjectData)[number];
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [hovered, setHovered] = useState(false);
  const col = CAT_COLORS[project.category] ?? DEFAULT_COL;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-aos="fade-up"
      data-aos-delay={index * 80}
      data-aos-duration="700"
      data-aos-once="true"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderTop: `3px solid ${col.accent}`,
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.45), 0 8px 20px ${col.glow}, 0 0 0 1px rgba(255,255,255,0.10)`
          : "0 4px 20px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.05)",
        transition: "transform 300ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms cubic-bezier(0.22,1,0.36,1)",
        cursor: "default",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <Image
          src={project.imageUrl}
          alt={project.title}
          width={436}
          height={200}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />

        {/* dark overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,7,3,0.75) 0%, rgba(10,7,3,0.20) 60%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* category badge */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: col.grad,
          borderRadius: 100,
          padding: "4px 12px",
          fontSize: 10, fontWeight: 700,
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          boxShadow: `0 2px 8px ${col.glow}`,
        }}>
          {project.category}
        </div>
      </div>

      {/* content */}
      <div style={{ padding: "22px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h4 style={{
          fontFamily: "'Cormorant Garamond', Garamond, serif",
          fontSize: 20, fontWeight: 700,
          color: "#ffffff", margin: "0 0 10px",
          letterSpacing: "-0.01em", lineHeight: 1.25,
        }}>
          {project.title}
        </h4>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13.5, lineHeight: 1.65,
          color: "rgba(255,255,255,0.55)",
          margin: "0 0 20px", flex: 1,
        }}>
          {project.description}
        </p>

        <Link
          to={project.link}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600,
            color: col.accent,
            textDecoration: "none",
            letterSpacing: "0.01em",
            transition: "gap 200ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={e => (e.currentTarget.style.gap = "6px")}
        >
          View Case Study
          <i className="fas fa-arrow-right" style={{ fontSize: 10 }} />
        </Link>
      </div>
    </div>
  );
};

const ProjectSection = () => {
  return (
    <>
      <style>{`
        .xz-projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
        }
        @media (max-width: 991px) {
          .xz-projects-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 575px) {
          .xz-projects-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .xz-projects-grid * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <section style={{
        background: "linear-gradient(180deg, #1a1208 0%, #0f0a05 100%)",
        padding: "80px 0 88px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* ambient dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(201,136,58,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }} />

        {/* top ambient glow */}
        <div style={{
          position: "absolute", top: -120, left: "50%",
          transform: "translateX(-50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(201,136,58,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>

          {/* section label */}
          <div
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-once="true"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: "#C9883A",
              marginBottom: 16,
            }}
          >
            <span style={{ width: 24, height: 1.5, background: "#C9883A", display: "inline-block" }} />
            Case Studies
          </div>

          {/* heading */}
          <h2
            data-aos="fade-up"
            data-aos-delay="80"
            data-aos-duration="700"
            data-aos-once="true"
            style={{
              fontFamily: "'Cormorant Garamond', Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              margin: 0,
              maxWidth: 580,
            }}
          >
            Real-World Enterprise{" "}
            <span style={{ color: "#C9883A", fontStyle: "italic" }}>
              Projects We've Delivered
            </span>
          </h2>

          {/* cards grid */}
          <div className="xz-projects-grid">
            {homeOneProjectData.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* bottom CTA */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="600"
            data-aos-once="true"
            style={{ textAlign: "center", marginTop: 52 }}
          >
            <Link
              to="/project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
                color: "#ffffff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 600,
                padding: "13px 28px",
                borderRadius: 100,
                textDecoration: "none",
                boxShadow: "0 4px 0 rgba(150,95,30,0.50), 0 8px 24px rgba(201,136,58,0.28)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 0 rgba(150,95,30,0.45), 0 12px 32px rgba(201,136,58,0.32)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 0 rgba(150,95,30,0.50), 0 8px 24px rgba(201,136,58,0.28)";
              }}
            >
              View All Projects
              <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
};

export default ProjectSection;
