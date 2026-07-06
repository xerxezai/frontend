import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Warp } from "@paper-design/shaders-react";

/* ─── 3D tilt wrapper ─── */
const Tilt3D = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5-y)*15}deg) rotateY(${(x-0.5)*15}deg) translateY(-10px) scale(1.02)`;
    el.style.boxShadow = `0 32px 72px rgba(0,0,0,0.60), 0 0 0 1.5px rgba(201,136,58,0.42)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.boxShadow = "0 4px 28px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.06)";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
      transformStyle: "preserve-3d",
      borderRadius: 18,
      willChange: "transform",
      boxShadow: "0 4px 28px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.06)",
      height: "100%",
    }}>
      {children}
    </div>
  );
};

/* ─── Service data ─── */
const SERVICES = [
  {
    icon: "fas fa-brain",
    title: "AI-Powered ERP",
    slug: "ai-powered-erp",
    desc: "Intelligent ERP systems that automate operations, forecast demand, and surface real-time insights across every business unit.",
    colors: ["hsl(16,55%,42%)", "hsl(30,70%,55%)", "hsl(8,50%,32%)", "hsl(25,65%,60%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-shield-alt",
    title: "DevSecOps Pipelines",
    slug: "devsecops-mlops-solutions",
    desc: "Security-embedded CI/CD pipelines and production ML infrastructure for teams that need to ship fast and stay compliant.",
    colors: ["hsl(215,60%,22%)", "hsl(210,75%,42%)", "hsl(220,65%,28%)", "hsl(200,80%,52%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-cloud",
    title: "Cloud Infrastructure",
    slug: "cloud-service-storage",
    desc: "Multi-cloud architecture and cost-optimized storage solutions built for high-throughput, data-intensive enterprise workloads.",
    colors: ["hsl(185,55%,25%)", "hsl(178,70%,42%)", "hsl(192,60%,30%)", "hsl(170,75%,52%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-code",
    title: "Software Development",
    slug: "software-development",
    desc: "Custom enterprise applications and strategic technology consulting to accelerate your digital transformation.",
    colors: ["hsl(32,70%,32%)", "hsl(42,80%,52%)", "hsl(28,65%,38%)", "hsl(48,85%,62%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-chalkboard-teacher",
    title: "AI Training & Consulting",
    slug: "ai-training-consulting",
    desc: "Corporate AI training programs to upskill teams on LLMs, MLOps, and AI-native workflows.",
    colors: ["hsl(250,55%,25%)", "hsl(262,65%,48%)", "hsl(244,60%,30%)", "hsl(268,72%,58%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-atom",
    title: "Quantum Computing",
    slug: "quantum-computing",
    desc: "Harness quantum algorithms for complex optimisation, cryptography, and next-gen enterprise computing challenges.",
    colors: ["hsl(340,55%,30%)", "hsl(352,68%,52%)", "hsl(334,60%,36%)", "hsl(358,75%,62%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Mobile Application",
    slug: "mobile-application",
    desc: "Native and cross-platform mobile apps built for performance, security, and seamless enterprise user experience.",
    colors: ["hsl(150,55%,20%)", "hsl(144,68%,40%)", "hsl(156,60%,26%)", "hsl(138,74%,50%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-server",
    title: "Web & Mobile Hosting",
    slug: "web-mobile-hosting",
    desc: "Scalable, secure hosting infrastructure with 99.9% uptime SLA across AWS, Azure, and GCP.",
    colors: ["hsl(20,60%,28%)", "hsl(28,72%,48%)", "hsl(14,55%,34%)", "hsl(35,78%,58%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-comments",
    title: "Software Consulting",
    slug: "software-consulting",
    desc: "Strategic technology advisory to align your software architecture with business goals and future growth.",
    colors: ["hsl(205,58%,22%)", "hsl(198,72%,42%)", "hsl(212,63%,28%)", "hsl(192,80%,52%)"],
    shape: "edge" as const,
  },
];

type ServiceItem = typeof SERVICES[number];

/* ─── Single card ─── */
const ServiceCard = ({ card }: { card: ServiceItem }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Tilt3D>
      <div
        style={{ position: "relative", height: 310, borderRadius: 18, overflow: "hidden" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Colorful background — static gradient, WebGL on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(140deg, ${card.colors[0]} 0%, ${card.colors[2]} 100%)`,
          pointerEvents: "none",
        }}>
          {hovered && (
            <Warp
              style={{ width: "100%", height: "100%" }}
              proportion={0.38}
              softness={0.95}
              distortion={0.20}
              swirl={0.80}
              swirlIterations={10}
              shape={card.shape}
              shapeScale={0.1}
              scale={1}
              rotation={0}
              speed={0.65}
              colors={card.colors}
            />
          )}
        </div>

        {/* Gold top-edge accent on hover */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: hovered
            ? "linear-gradient(90deg, transparent, #C9883A 30%, #E8A84E 70%, transparent)"
            : "transparent",
          transition: "background 0.30s ease",
          zIndex: 2,
        }} />

        {/* Glass overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: hovered ? "rgba(8,5,2,0.76)" : "rgba(10,6,3,0.80)",
          border: hovered
            ? "1px solid rgba(201,136,58,0.30)"
            : "1px solid rgba(255,255,255,0.08)",
          backdropFilter: hovered ? "blur(6px)" : "none",
          transition: "background 0.28s ease, border 0.28s ease, backdrop-filter 0.28s ease",
          borderRadius: 18,
        }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column",
          padding: "28px 28px 24px",
        }}>
          {/* Icon box */}
          <div style={{
            width: 54, height: 54, borderRadius: 14, flexShrink: 0,
            background: hovered
              ? "linear-gradient(135deg, rgba(201,136,58,0.28) 0%, rgba(201,136,58,0.12) 100%)"
              : "rgba(255,255,255,0.10)",
            border: hovered
              ? "1px solid rgba(201,136,58,0.50)"
              : "1px solid rgba(255,255,255,0.14)",
            boxShadow: hovered
              ? "0 4px 18px rgba(201,136,58,0.25), inset 0 1px 0 rgba(255,255,255,0.12)"
              : "inset 0 1px 0 rgba(255,255,255,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 21, marginBottom: 20,
            color: hovered ? "#E8A84E" : "rgba(255,255,255,0.88)",
            transition: "all 0.28s ease",
          }}>
            <i className={card.icon} />
          </div>

          {/* Title */}
          <h3 style={{
            marginBottom: 10, fontSize: 17, lineHeight: 1.3,
            fontWeight: 700,
            color: hovered ? "#fff" : "rgba(240,237,230,0.92)",
            fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.25s ease",
          }}>
            <Link to={`/service/${card.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
              {card.title}
            </Link>
          </h3>

          {/* Desc */}
          <p style={{
            color: hovered ? "rgba(240,237,230,0.75)" : "rgba(255,255,255,0.55)",
            fontSize: 13, lineHeight: 1.72,
            marginBottom: 20, flex: 1,
            fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.25s ease",
          }}>
            {card.desc}
          </p>

          {/* CTA link */}
          <Link
            to={`/service/${card.slug}`}
            style={{
              display: "inline-flex", alignItems: "center",
              gap: hovered ? 10 : 6,
              color: hovered ? "#E8A84E" : "rgba(255,255,255,0.55)",
              fontWeight: 600, fontSize: 11.5,
              textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "color 0.25s ease, gap 0.25s ease",
            }}
          >
            More Details
            <i className="far fa-arrow-right" style={{
              fontSize: 11,
              transition: "transform 0.25s ease",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
            }} />
          </Link>
        </div>
      </div>
    </Tilt3D>
  );
};

/* ─── Section ─── */
const ServiceSection2 = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  /* Stagger scroll-reveal on cards */
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLDivElement>(".svc-card-wrap");
    if (!cards) return;
    cards.forEach(c => {
      c.style.opacity = "0";
      c.style.transform = "translateY(40px)";
      c.style.transition = "opacity 0.60s ease, transform 0.60s cubic-bezier(0.22,1,0.36,1)";
    });
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.idx ?? "0");
            setTimeout(() => {
              (entry.target as HTMLElement).style.opacity = "1";
              (entry.target as HTMLElement).style.transform = "translateY(0)";
            }, idx * 70);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{
      background: "#F8F4EE",
      padding: "112px 0 100px",
      position: "relative",
      overflow: "hidden",
    }}>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: "center", marginBottom: 68 }}>
          {/* Eyebrow with flanking lines */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 22,
          }}>
            <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, transparent, #C9883A)", display: "block" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#C9883A",
            }}>Our Services</span>
            <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, #C9883A, transparent)", display: "block" }} />
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(30px, 3.8vw, 52px)",
            fontWeight: 800, lineHeight: 1.12,
            color: "#141413",
            margin: "0 auto 18px",
            maxWidth: 700,
          }}>
            Enterprise Solutions for<br />Every Business Challenge
          </h2>

          {/* Sub-line */}
          <p style={{
            color: "rgba(20,20,19,0.50)",
            fontSize: 15, lineHeight: 1.65,
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: 460, margin: "0 auto",
          }}>
            From AI-native ERP to quantum computing — architected, built, and delivered end to end.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="row g-4" ref={gridRef}>
          {SERVICES.map((card, i) => (
            <div
              key={card.slug}
              className="col-xl-4 col-lg-4 col-md-6 svc-card-wrap"
              data-idx={String(i)}
            >
              <ServiceCard card={card} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .svc-card-wrap { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
};

export default ServiceSection2;
