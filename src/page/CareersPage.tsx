import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CustomLayout from "../components/layout/CustomLayout";
import SEO, { PAGE_SEO } from "../components/seo/SEO";
import XzHeroSection from "../components/common/XzHeroSection";
import apiService from "../services/api";

// ── Brand tokens (verbatim — see AIERPPage.tsx) ───────────────────────────────
const OG    = "#C9883A";
const DARK  = "#1A1A1A";
const BODY  = "#4B4B4B";
const MUT   = "#6B6B6B";
const CREAM = "#F2EFE9";
const WHITE = "#FFFFFF";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL   = "rgba(201,136,58,0.09)";
const OGBRD = "rgba(201,136,58,0.30)";
const BS    = "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";
const FF    = "'DM Sans',sans-serif";

// ── Motion fade-in wrapper (verbatim pattern) ─────────────────────────────────
const FI = ({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
  >
    {children}
  </motion.div>
);

// ── Section label pill ────────────────────────────────────────────────────────
const SL = ({ t, dark = false }: { t: string; dark?: boolean }) => (
  <div style={{ marginBottom: 14 }}>
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: dark ? "rgba(201,136,58,0.13)" : OGL,
      color: OG, fontSize: 10, fontWeight: 700,
      padding: "5px 16px", borderRadius: 20,
      letterSpacing: "0.16em", textTransform: "uppercase",
      border: `1px solid ${dark ? "rgba(201,136,58,0.28)" : OGBRD}`,
      fontFamily: FF,
    }}>✦ {t}</span>
  </div>
);

// ── Light 3D card (verbatim — Card3D) ─────────────────────────────────────────
const Card3D = ({
  children, accent = OG, style = {}, p = "28px 26px",
}: { children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: WHITE, borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.07)",
      borderTop: `3px solid ${accent}`,
      boxShadow: h ? BHOV : BCARD,
      transform: h ? "translateY(-7px)" : "translateY(0)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
      padding: p, cursor: "default", height: "100%", position: "relative", ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
};

// ── Dark glass card (verbatim — DC) ────────────────────────────────────────────
const DC = ({
  children, accent = OG, style = {}, p = "28px 26px",
}: { children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: h ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderTop: `2px solid ${accent}`,
      borderRadius: 16, padding: p,
      transform: h ? "translateY(-6px)" : "translateY(0)",
      boxShadow: h
        ? "0 20px 60px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.06)"
        : "0 4px 20px rgba(0,0,0,0.20)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms ease,background 200ms ease",
      height: "100%", cursor: "default", position: "relative", ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
};

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════════════
const WHY_US = [
  { icon: "🚀", title: "Fast Growth",            desc: "Work on cutting-edge AI and ERP products" },
  { icon: "🌍", title: "Remote First",           desc: "Work from anywhere in the world" },
  { icon: "📚", title: "Learning & Development",  desc: "Continuous upskilling opportunities" },
  { icon: "💰", title: "Performance Bonus",       desc: "Rewarded for your contributions" },
];

interface Position {
  id: string; title: string; type: string; location: string;
  description: string; requirements: string[];
}

const FALLBACK_POSITIONS: Position[] = [
  {
    id: "full-stack-ai-trainer",
    title: "Full Stack AI Trainer",
    type: "Full Time",
    location: "Remote",
    description: "Train and develop AI models, create AI course content for our Academy platform, work with students and instructors.",
    requirements: ["Python", "Machine Learning", "React", "Django", "Content Creation"],
  },
  {
    id: "mlops-engineer-mlflow",
    title: "MLOps Engineer (MLflow)",
    type: "Full Time",
    location: "Remote",
    description: "Build and maintain ML pipelines using MLflow, monitor model performance, deploy models to production.",
    requirements: ["MLflow", "Docker", "Kubernetes", "Python", "AWS/GCP", "CI/CD"],
  },
];

const CULTURE = [
  { icon: "🤝", title: "Collaborative",   desc: "We work as one team across all time zones" },
  { icon: "💡", title: "Innovative",      desc: "We build AI-first solutions for real businesses" },
  { icon: "🎯", title: "Impact-Driven",   desc: "Every feature we build serves real users" },
];

const BENEFITS = [
  { icon: "🏠", title: "Remote Work",              desc: "Work from anywhere, no commute" },
  { icon: "⏰", title: "Flexible Hours",            desc: "Own your schedule and work-life balance" },
  { icon: "📖", title: "Learning & Development",    desc: "Access to courses, tools, and training" },
  { icon: "🏆", title: "Performance Bonus",         desc: "Extra rewards for exceptional work" },
];

const EXPERIENCE_LEVELS = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];

// ═══════════════════════════════════════════════════════════════════════════
// 1. HERO
// ═══════════════════════════════════════════════════════════════════════════
const CAREERS_CASCADE_A = ["AI Training", "MLOps", "Machine Learning", "Enterprise ERP", "Remote First", "Full Stack"];
const CAREERS_CASCADE_B = ["Python · Django", "React · TypeScript", "MLflow · Docker", "Kubernetes · AWS", "CI/CD", "GCP"];

const Hero = () => (
  <XzHeroSection
    id="hero"
    badgeText="We're Hiring"
    headline={
      <h1 style={{ fontFamily: FF, fontWeight: 800, fontSize: "clamp(32px,4.5vw,58px)", lineHeight: 1.1, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
        Join the<br />
        <em style={{ color: OG, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
          Xerxez Team
        </em>
      </h1>
    }
    description="Build the future of AI-powered enterprise software — with a remote-first team that ships fast and learns constantly."
    ctas={[
      { label: "View Open Positions", href: "#positions", primary: true },
      { label: "Apply Now",           href: "#apply-form", primary: false },
    ]}
    stats={[
      { val: "Remote", label: "First" },
      { val: "AI-First", label: "Products" },
      { val: "2", label: "Open Roles" },
    ]}
    cascadeA={CAREERS_CASCADE_A}
    cascadeB={CAREERS_CASCADE_B}
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// 2. WHY WORK WITH US — cream
// ═══════════════════════════════════════════════════════════════════════════
const WhyWorkWithUs = () => (
  <section style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Why XERXEZ" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Why Work With Us
        </h2>
      </div></FI>
      <div className="row g-4">
        {WHY_US.map((item, i) => (
          <div key={item.title} className="col-lg-3 col-md-6">
            <FI delay={0.08 * i}>
              <Card3D style={{ textAlign: "center" }}>
                <div style={{ fontSize: 34, marginBottom: 16 }}>{item.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: 16.5, color: DARK, marginBottom: 8, fontFamily: FF }}>{item.title}</h4>
                <p style={{ color: BODY, fontSize: 14, lineHeight: 1.6, margin: 0, fontFamily: FF }}>{item.desc}</p>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// 3. OPEN POSITIONS — dark
// ═══════════════════════════════════════════════════════════════════════════
const JobCard = ({ job, index, onApply }: { job: Position; index: number; onApply: (title: string) => void }) => (
  <FI delay={0.1 * index}>
    <DC p="32px 30px">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <span style={{ background: "rgba(201,136,58,0.13)", color: OG, fontSize: 11, fontWeight: 700, padding: "4px 13px", borderRadius: 20, border: `1px solid ${OGBRD}`, fontFamily: FF }}>
          {job.type}
        </span>
        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF }}>
          <i className="fas fa-map-marker-alt" style={{ marginRight: 5, color: OG }} />{job.location}
        </span>
      </div>
      <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 21, marginBottom: 12, fontFamily: FF, letterSpacing: "-0.01em" }}>
        {job.title}
      </h3>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14.5, lineHeight: 1.68, marginBottom: 20, fontFamily: FF }}>
        {job.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        {job.requirements.map(r => (
          <span key={r} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, padding: "5px 13px", borderRadius: 20, fontFamily: FF }}>
            {r}
          </span>
        ))}
      </div>
      <button
        onClick={() => onApply(job.title)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: OG_G, color: "#fff",
          fontWeight: 700, fontSize: 14.5, padding: "13px 26px", borderRadius: 10, border: "none",
          cursor: "pointer", fontFamily: FF, boxShadow: BS,
        }}
      >
        Apply for This Role <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
      </button>
    </DC>
  </FI>
);

const OpenPositions = ({ positions, onApply }: { positions: Position[]; onApply: (title: string) => void }) => (
  <section id="positions" style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: -80, right: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Open Positions" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Come Build With Us
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, fontFamily: FF, maxWidth: 560, marginInline: "auto", marginTop: 14 }}>
          Two roles open right now — both remote, both shipping real product.
        </p>
      </div></FI>
      <div className="row g-4">
        {positions.map((job, i) => (
          <div key={job.id} className="col-lg-6">
            <JobCard job={job} index={i} onApply={onApply} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// 4. COMPANY CULTURE — cream
// ═══════════════════════════════════════════════════════════════════════════
const CompanyCulture = () => (
  <section style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Our Culture" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Company Culture
        </h2>
      </div></FI>
      <div className="row g-4 justify-content-center">
        {CULTURE.map((item, i) => (
          <div key={item.title} className="col-lg-4 col-md-6">
            <FI delay={0.08 * i}>
              <Card3D style={{ textAlign: "center" }} p="36px 30px">
                <div style={{ fontSize: 38, marginBottom: 18 }}>{item.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: 18, color: DARK, marginBottom: 10, fontFamily: FF }}>{item.title}</h4>
                <p style={{ color: BODY, fontSize: 14.5, lineHeight: 1.65, margin: 0, fontFamily: FF }}>{item.desc}</p>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// 5. EMPLOYEE BENEFITS — dark
// ═══════════════════════════════════════════════════════════════════════════
const EmployeeBenefits = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Benefits" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Employee Benefits
        </h2>
      </div></FI>
      <div className="row g-4">
        {BENEFITS.map((item, i) => (
          <div key={item.title} className="col-lg-3 col-md-6">
            <FI delay={0.06 * i}>
              <DC style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8, fontFamily: FF }}>{item.title}</h4>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.6, margin: 0, fontFamily: FF }}>{item.desc}</p>
              </DC>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// 6. APPLICATION FORM — cream
// ═══════════════════════════════════════════════════════════════════════════
interface FormState {
  name: string; email: string; phone: string; position: string; experience: string;
  linkedin: string; portfolio: string; cover_letter: string;
}
const EMPTY_FORM: FormState = {
  name: "", email: "", phone: "", position: "", experience: "",
  linkedin: "", portfolio: "", cover_letter: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 16px", borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.12)", background: WHITE,
  fontFamily: FF, fontSize: 14.5, color: DARK, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.18s ease",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700, color: MUT,
  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7, fontFamily: FF,
};

const ApplicationForm = ({ positions, prefillPosition }: { positions: Position[]; prefillPosition: string }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefillPosition) setForm(f => ({ ...f, position: prefillPosition }));
  }, [prefillPosition]);

  const set = (k: keyof FormState, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const onFileChange = (file: File | null) => {
    if (file && file.type !== "application/pdf") {
      setErrors(e => ({ ...e, resume: "Resume must be a PDF file." }));
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, resume: "Resume must be under 5 MB." }));
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setResume(file);
    setErrors(e => ({ ...e, resume: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.position) next.position = "Select the position you're applying for.";
    if (!form.experience) next.experience = "Select your experience level.";
    if (!resume) next.resume = "Attach your resume (PDF only).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      fd.append("position", form.position);
      fd.append("experience", form.experience);
      fd.append("linkedin", form.linkedin.trim());
      fd.append("portfolio", form.portfolio.trim());
      fd.append("cover_letter", form.cover_letter.trim());
      if (resume) fd.append("resume_file", resume);

      const result = await apiService.postFormData("/careers/apply/", fd);
      if (result.success) {
        setSubmitted(true);
        toast.success("Application submitted!");
      } else {
        const details = (result as any).details;
        const firstErr = details && typeof details === "object"
          ? (Object.values(details)[0] as any)
          : null;
        const firstErrText = Array.isArray(firstErr) ? firstErr[0] : firstErr;
        toast.error(firstErrText || result.message || "Failed to submit application. Please try again.");
      }
    } catch {
      toast.error("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: OG_G, boxShadow: BS,
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px",
        }}>
          <i className="fas fa-check" style={{ color: "#fff", fontSize: 26 }} />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 22, color: DARK, marginBottom: 10, fontFamily: FF }}>
          Application submitted!
        </h3>
        <p style={{ color: BODY, fontSize: 15, lineHeight: 1.7, maxWidth: 440, marginInline: "auto", marginBottom: 4, fontFamily: FF }}>
          We will contact you within 3-5 business days.
        </p>
        <p style={{ color: MUT, fontSize: 13.5, marginTop: 18, fontFamily: FF }}>
          Or email your resume directly to{" "}
          <a href="mailto:info@xerxez.com" style={{ color: OG, fontWeight: 700, textDecoration: "none" }}>info@xerxez.com</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label style={labelStyle}>Full Name *</label>
          <input style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "rgba(0,0,0,0.12)" }}
            value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
          {errors.name && <span style={{ color: "#ef4444", fontSize: 12, fontFamily: FF }}>{errors.name}</span>}
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Email *</label>
          <input type="email" style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : "rgba(0,0,0,0.12)" }}
            value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
          {errors.email && <span style={{ color: "#ef4444", fontSize: 12, fontFamily: FF }}>{errors.email}</span>}
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Phone</label>
          <input style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+971 5X XXX XXXX" />
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Position *</label>
          <select style={{ ...inputStyle, borderColor: errors.position ? "#ef4444" : "rgba(0,0,0,0.12)" }}
            value={form.position} onChange={e => set("position", e.target.value)}>
            <option value="">Select a position</option>
            {positions.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
            <option value="Other">Other / General Application</option>
          </select>
          {errors.position && <span style={{ color: "#ef4444", fontSize: 12, fontFamily: FF }}>{errors.position}</span>}
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Experience *</label>
          <select style={{ ...inputStyle, borderColor: errors.experience ? "#ef4444" : "rgba(0,0,0,0.12)" }}
            value={form.experience} onChange={e => set("experience", e.target.value)}>
            <option value="">Select experience level</option>
            {EXPERIENCE_LEVELS.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
          {errors.experience && <span style={{ color: "#ef4444", fontSize: 12, fontFamily: FF }}>{errors.experience}</span>}
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>LinkedIn URL</label>
          <input style={inputStyle} value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Portfolio / GitHub URL</label>
          <input style={inputStyle} value={form.portfolio} onChange={e => set("portfolio", e.target.value)} placeholder="https://github.com/..." />
        </div>
        <div className="col-12">
          <label style={labelStyle}>Cover Letter</label>
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 110 }}
            value={form.cover_letter} onChange={e => set("cover_letter", e.target.value)}
            placeholder="Tell us why you're a great fit for this role..." />
        </div>
        <div className="col-12">
          <label style={labelStyle}>Resume (PDF only) *</label>
          <div style={{
            border: `1.5px dashed ${errors.resume ? "#ef4444" : "rgba(201,136,58,0.40)"}`,
            borderRadius: 10, padding: "20px 18px", textAlign: "center", background: OGL, cursor: "pointer",
          }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef} type="file" accept="application/pdf,.pdf" style={{ display: "none" }}
              onChange={e => onFileChange(e.target.files?.[0] ?? null)}
            />
            <i className="fas fa-file-pdf" style={{ color: OG, fontSize: 22, marginBottom: 8, display: "block" }} />
            <span style={{ color: resume ? DARK : MUT, fontSize: 13.5, fontWeight: resume ? 700 : 500, fontFamily: FF }}>
              {resume ? resume.name : "Click to upload your resume (PDF, max 5 MB)"}
            </span>
          </div>
          {errors.resume && <span style={{ color: "#ef4444", fontSize: 12, fontFamily: FF }}>{errors.resume}</span>}
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <button
          type="submit" disabled={submitting}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: submitting ? "rgba(201,136,58,0.55)" : OG_G, color: "#fff",
            fontWeight: 700, fontSize: 15.5, padding: "15px 40px", borderRadius: 10, border: "none",
            cursor: submitting ? "not-allowed" : "pointer", fontFamily: FF, boxShadow: BS,
            minWidth: 220, justifyContent: "center",
          }}
        >
          {submitting ? "Submitting…" : "Submit Application"}
          {!submitting && <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />}
        </button>
        <p style={{ color: MUT, fontSize: 13, fontFamily: FF, textAlign: "center" }}>
          Or email your resume directly to{" "}
          <a href="mailto:info@xerxez.com" style={{ color: OG, fontWeight: 700, textDecoration: "none" }}>info@xerxez.com</a>
        </p>
      </div>
    </form>
  );
};

const ApplicationSection = ({ positions, prefillPosition }: { positions: Position[]; prefillPosition: string }) => (
  <section id="apply-form" style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <FI><div className="text-center" style={{ marginBottom: 44 }}>
            <SL t="Apply Now" />
            <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
              Start Your Application
            </h2>
          </div></FI>
          <FI delay={0.1}>
            <div style={{ background: WHITE, borderRadius: 20, padding: "40px 36px", border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${OG}`, boxShadow: BCARD }}>
              <ApplicationForm positions={positions} prefillPosition={prefillPosition} />
            </div>
          </FI>
        </div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ═══════════════════════════════════════════════════════════════════════════
const CareersPage = () => {
  const [positions, setPositions] = useState<Position[]>(FALLBACK_POSITIONS);
  const [prefillPosition, setPrefillPosition] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await apiService.get<{ positions: Position[] }>("/careers/positions/");
      if (!cancelled && result.success && Array.isArray((result.data as any)?.positions)) {
        setPositions((result.data as any).positions);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleApply = (title: string) => {
    setPrefillPosition(title);
    scrollToId("apply-form");
  };

  return (
    <>
      <SEO {...PAGE_SEO.careers} />
      <style>{`
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
      `}</style>
      <CustomLayout>
        <Hero />
        <WhyWorkWithUs />
        <OpenPositions positions={positions} onApply={handleApply} />
        <CompanyCulture />
        <EmployeeBenefits />
        <ApplicationSection positions={positions} prefillPosition={prefillPosition} />
      </CustomLayout>
    </>
  );
};

export default CareersPage;
