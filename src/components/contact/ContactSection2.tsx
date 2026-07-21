import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from '../../services/api';
import PhoneInput, { isValidPhone } from '../common/PhoneInput';
import PartnerApplicationForm from './PartnerApplicationForm';


// ── services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  "AI-Powered ERP", "DevSecOps Pipelines", "Cloud Infrastructure",
  "Software Development", "AI Training & Consulting",
  "Quantum Computing", "Mobile Application",
  "Web & Mobile Hosting", "Software Consulting",
];
const COUNTRIES = ["India", "UAE", "Other"];
const HEAR_ABOUT_US = ["Google Search", "Social Media", "LinkedIn", "Referral", "Existing Customer", "Event/Conference", "Other"];
const INDUSTRIES_OPTS = ["Engineering & EPC", "Oil & Gas", "Construction", "Facilities Management", "Manufacturing", "Other"];
const ERP_MODULES = [
  "Dashboard & Analytics", "CRM", "Sales", "Procurement", "Logistics",
  "Accounting", "MLM / Network", "HR & Payroll",
  "Document Management", "Project Management", "Asset Management", "QHSE",
];
const CURRENT_CHALLENGES = ["Manual approvals & workflows", "Document management", "Procurement bottlenecks", "HR & payroll management", "No visibility on project costs", "Other"];

// ── per-service dynamic field option lists ─────────────────────────────────────
// Actual pricing plans (matches src/data/pricingData.ts tiers — the pricing page CTAs
// deep-link here with ?plan=<tier>). Module choices live in the ERP_MODULES chips instead.
const PLAN_INTEREST = [
  "Starter", "Professional", "Enterprise", "Custom Requirements",
];
const TEAM_SIZES = ["1-10", "11-50", "51-200", "200+"];
const TIMELINE_OPTIONS = [
  "Immediate (within 1 month)", "Short term (1-3 months)",
  "Medium term (3-6 months)", "Just exploring for now",
];
const DEPLOYMENT_ENVS = ["Cloud", "On-premise", "Hybrid"];
const NUM_DEVELOPERS = ["1-5", "6-20", "20+"];
const CLOUD_PROVIDERS = ["AWS", "Azure", "GCP", "No preference"];
const YES_NO = ["Yes", "No"];
const PROJECT_TYPES = ["Web", "Mobile", "Both"];
const PROJECT_TIMELINES = ["1-3 months", "3-6 months", "6+ months"];
const TRAINING_MODES = ["Online (Live Sessions)", "Offline (In-person)", "Hybrid (Online + In-person)", "Self-paced (Recorded)"];
const TRAINING_TEAM_SIZES = ["1-5 people", "6-15 people", "16-30 people", "30+ people"];
const TRAINING_DURATIONS = ["1 Day Workshop", "1 Week Bootcamp", "1 Month Program", "3 Month Program", "Custom Duration"];
const TRAINING_TOPICS = [
  "Large Language Models (LLMs)", "MLOps & Model Deployment", "Full Stack AI Development",
  "Prompt Engineering", "Machine Learning Fundamentals", "Computer Vision",
  "Natural Language Processing (NLP)", "AI for Business Leaders", "Data Engineering & Pipelines",
  "Generative AI & ChatGPT", "Python for AI/ML", "Cloud AI (AWS/Azure/GCP)",
];

interface F {
  // common — shown for every service
  fullName: string; email: string; phone: string; company: string;
  service: string; country: string; hearAboutUs: string; message: string;
  industry: string; currentChallenge: string;
  // AI-Powered ERP
  planInterest: string; teamSize: string; timeline: string; erpModules: string;
  // DevSecOps Pipelines
  techStack: string; deploymentEnv: string; numDevelopers: string;
  // Cloud Infrastructure
  cloudProvider: string; currentInfra: string; migrationNeeded: string;
  // Software Development
  projectType: string; projectTimeline: string; approxBudget: string;
  // AI Training & Consulting
  trainingTeamSize: string; trainingMode: string; topicsOfInterest: string; trainingDuration: string;
  // legacy fields still sent to the backend for context, no longer user-editable
  urgency: string; subject: string;
}
const EMPTY: F = {
  fullName:"", email:"", phone:"", company:"",
  service:"", country:"", hearAboutUs:"", message:"",
  industry:"", currentChallenge:"",
  planInterest:"", teamSize:"", timeline:"", erpModules:"",
  techStack:"", deploymentEnv:"", numDevelopers:"",
  cloudProvider:"", currentInfra:"", migrationNeeded:"",
  projectType:"", projectTimeline:"", approxBudget:"",
  trainingTeamSize:"", trainingMode:"", topicsOfInterest:"", trainingDuration:"",
  urgency:"", subject:"",
};
const COMMON_TRACKED: (keyof F)[] = ["fullName","email","phone","company","service","country","hearAboutUs","message"];

// ── field descriptors for the dynamic per-service section ─────────────────────
type FieldDef = { key: keyof F; label: string; icon: string; placeholder: string } &
  ({ type: "text" } | { type: "select"; options: string[] } | { type: "multiselect"; options: string[] });

const SERVICE_SECTIONS: Record<string, { label: string; fields: FieldDef[] }> = {
  "AI-Powered ERP": {
    label: "ERP Requirements",
    fields: [
      { key:"planInterest", label:"Plan Interest", icon:"fas fa-layer-group", type:"select", options:PLAN_INTEREST, placeholder:"Select a plan…" },
      { key:"teamSize", label:"Team Size", icon:"fas fa-users", type:"select", options:TEAM_SIZES, placeholder:"Select team size…" },
      { key:"erpModules", label:"ERP Modules of Interest", icon:"fas fa-th-large", type:"multiselect", options:ERP_MODULES, placeholder:"Select modules…" },
    ],
  },
  "DevSecOps Pipelines": {
    label: "DevSecOps Requirements",
    fields: [
      { key:"techStack", label:"Current Tech Stack", icon:"fas fa-code", type:"text", placeholder:"e.g. Node.js, Docker, Jenkins" },
      { key:"deploymentEnv", label:"Deployment Environment", icon:"fas fa-server", type:"select", options:DEPLOYMENT_ENVS, placeholder:"Select environment…" },
      { key:"numDevelopers", label:"Number of Developers", icon:"fas fa-user-friends", type:"select", options:NUM_DEVELOPERS, placeholder:"Select team size…" },
    ],
  },
  "Cloud Infrastructure": {
    label: "Cloud Requirements",
    fields: [
      { key:"cloudProvider", label:"Cloud Provider Preference", icon:"fas fa-cloud", type:"select", options:CLOUD_PROVIDERS, placeholder:"Select provider…" },
      { key:"currentInfra", label:"Current Infrastructure", icon:"fas fa-network-wired", type:"text", placeholder:"e.g. On-prem VMware, bare metal" },
      { key:"migrationNeeded", label:"Migration Needed?", icon:"fas fa-exchange-alt", type:"select", options:YES_NO, placeholder:"Select an option…" },
    ],
  },
  "Software Development": {
    label: "Project Requirements",
    fields: [
      { key:"projectType", label:"Project Type", icon:"fas fa-laptop-code", type:"select", options:PROJECT_TYPES, placeholder:"Select project type…" },
      { key:"projectTimeline", label:"Project Timeline", icon:"fas fa-calendar-alt", type:"select", options:PROJECT_TIMELINES, placeholder:"Select timeline…" },
      { key:"approxBudget", label:"Approximate Budget", icon:"fas fa-wallet", type:"text", placeholder:"e.g. $10,000 – $25,000" },
    ],
  },
  "AI Training & Consulting": {
    label: "Training Requirements",
    fields: [
      { key:"trainingTeamSize", label:"Team Size for Training", icon:"fas fa-users", type:"select", options:TRAINING_TEAM_SIZES, placeholder:"Select team size…" },
      { key:"trainingMode", label:"Training Mode", icon:"fas fa-chalkboard-teacher", type:"select", options:TRAINING_MODES, placeholder:"Select mode…" },
      { key:"trainingDuration", label:"Training Duration", icon:"fas fa-hourglass-half", type:"select", options:TRAINING_DURATIONS, placeholder:"Select duration…" },
      { key:"topicsOfInterest", label:"Topics of Interest", icon:"fas fa-book", type:"multiselect", options:TRAINING_TOPICS, placeholder:"Select topics…" },
    ],
  },
};

// ── count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, trigger = false) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!trigger) { setVal(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(e * target);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, trigger]);
  return val;
}

// ── hero stat with count-up ───────────────────────────────────────────────────
const HeroStat = ({ raw, suffix, label, trigger, delay, decimals = 0 }: {
  raw: number; suffix: string; label: string; trigger: boolean; delay: number; decimals?: number;
}) => {
  const n = useCountUp(raw, 1400, trigger);
  return (
    <div style={{
      textAlign: "center", padding: "0 28px",
      animation: `xzCtFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond',Garamond,serif",
        fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 700,
        color: "#C9883A", lineHeight: 1,
      }}>{decimals ? n.toFixed(decimals) : Math.round(n)}{suffix}</div>
      <div style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.38)", marginTop: 6,
      }}>{label}</div>
    </div>
  );
};

// ── 3D icon badge ─────────────────────────────────────────────────────────────
const IconBadge = ({ icon, size = 42 }: { icon: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0,
    background: "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)",
    boxShadow: "0 4px 0 rgba(130,80,20,0.55), 0 8px 20px rgba(201,136,58,0.28)",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: Math.round(size * 0.36) }} />
  </div>
);

// ── input icon badge ──────────────────────────────────────────────────────────
const InputBadge = ({ icon, active }: { icon: string; active: boolean }) => (
  <div style={{
    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
    background: active
      ? "linear-gradient(145deg,#e8a84e,#C9883A)"
      : "linear-gradient(145deg,#e2ddd8,#ccc8c2)",
    boxShadow: active ? "0 3px 0 rgba(130,80,20,0.48)" : "0 2px 0 rgba(0,0,0,0.12)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 200ms, box-shadow 200ms",
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: 11 }} />
  </div>
);

// ── info row (dark panel) ─────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, href, delay }: {
  icon: string; label: string; value: string; href?: string; delay: number;
}) => (
  <div
    data-aos="fade-up" data-aos-delay={delay} data-aos-duration="600" data-aos-once="true"
    style={{ display:"flex", alignItems:"center", gap:16 }}
  >
    <IconBadge icon={icon} size={42} />
    <div>
      <div style={{
        fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase",
        color:"rgba(255,255,255,0.30)", fontFamily:"'DM Sans',sans-serif", marginBottom:3,
      }}>{label}</div>
      {href ? (
        <a href={href} style={{
          color:"rgba(255,255,255,0.82)", fontSize:14,
          fontFamily:"'DM Sans',sans-serif", textDecoration:"none",
          transition:"color 150ms",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#C9883A")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.82)")}
        >{value}</a>
      ) : (
        <span style={{ color:"rgba(255,255,255,0.82)", fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
          {value}
        </span>
      )}
    </div>
  </div>
);

// ── main ─────────────────────────────────────────────────────────────────────
const ContactSection2 = () => {
  const [searchParams] = useSearchParams();
  const urlService = searchParams.get("service");
  const preselectedService = urlService && SERVICES.includes(urlService) ? urlService : null;
  const [showServiceBanner, setShowServiceBanner] = useState(!!preselectedService && !searchParams.get("plan"));
  const [activeTab, setActiveTab] = useState<"contact" | "partner">("contact");
  const [form, setForm]   = useState<F>(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      return {
        ...EMPTY,
        service: "AI-Powered ERP",
        planInterest: PLAN_INTEREST.includes(plan) ? plan : "",
        message: `I am interested in the ${plan} plan for XERXEZ ERP. Please contact me with more details.`,
      };
    }
    if (preselectedService) return { ...EMPTY, service: preselectedService };
    return EMPTY;
  });
  const [foc, setFoc]     = useState<string|null>(null);
  const [sending, setSend] = useState(false);
  const [sent, setSent]   = useState(false);
  const [btnHov, setBtnH] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [, setCardHL] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Pre-warm Railway on mount using health endpoint — keeps /contact/ clean in network tab
  useEffect(() => {
    const base = (import.meta.env.VITE_API_BASE_URL ?? 'https://backend-production-b9f2.up.railway.app/api/v1').replace(/\/api\/v1\/?$/, '');
    fetch(`${base}/health/`).catch(() => {});
  }, []);

  // count-up trigger
  useEffect(() => {
    const el = heroRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeroVis(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 3D tilt on form card
  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = formRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -5;
    el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
  };
  const onTiltOut = () => {
    const el = formRef.current; if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const set = useCallback((k: keyof F, v: string) => {
    setForm(p => ({...p,[k]:v}));
    if (k === "service") setShowServiceBanner(false);
  }, []);
  // Generic chip-toggle for any multiselect field (training topics, ERP modules, …) —
  // values are stored as a ", "-joined string to match the backend CharFields.
  const toggleMulti = useCallback((key: keyof F, value: string) => {
    setForm(p => {
      const cur = p[key].split(", ").filter(Boolean);
      const next = cur.includes(value) ? cur.filter(t => t !== value) : [...cur, value];
      return { ...p, [key]: next.join(", ") };
    });
  }, []);

  const activeSection = SERVICE_SECTIONS[form.service];
  const tracked = useMemo(() => {
    const keys = [...COMMON_TRACKED];
    if (activeSection) keys.push(...activeSection.fields.map(f => f.key));
    if (form.service === "AI-Powered ERP") keys.push("timeline");
    return keys;
  }, [activeSection, form.service]);

  const filled   = tracked.filter(k => form[k].trim() !== "").length;
  const progress = Math.round((filled / tracked.length) * 100);
  const chars    = form.message.length;

  const handleSubmit = useCallback(async () => {
    if (!form.fullName.trim())  { toast.error("Full name is required."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address."); return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      toast.error("Message must be at least 10 characters."); return;
    }
    if (form.phone.trim() && !isValidPhone(form.phone)) {
      toast.error("Please enter a valid phone number with country code"); return;
    }
    setSend(true);
    try {
      const result = await apiService.post('/contact/', {
        full_name: form.fullName, email: form.email, phone: form.phone,
        company: form.company, service: form.service || 'General Inquiry',
        subject: form.service ? `${form.service} Enquiry` : 'General Enquiry',
        message: form.message, country: form.country, hear_about_us: form.hearAboutUs,
        industry: form.industry, current_challenge: form.currentChallenge,
        plan_interest: form.planInterest, team_size: form.teamSize,
        timeline: form.timeline, erp_modules: form.erpModules,
        tech_stack: form.techStack, deployment_env: form.deploymentEnv, num_developers: form.numDevelopers,
        cloud_provider: form.cloudProvider, current_infra: form.currentInfra, migration_needed: form.migrationNeeded,
        project_type: form.projectType, project_timeline: form.projectTimeline, approx_budget: form.approxBudget,
        training_team_size: form.trainingTeamSize, training_mode: form.trainingMode, topics_of_interest: form.topicsOfInterest,
        training_duration: form.trainingDuration,
      });
      if (result.success) {
        setSent(true); setForm(EMPTY);
        toast.success("Message sent! We'll get back to you within 24 hours.");
      } else {
        const details = (result as any).details;
        const firstErr = details && typeof details === 'object'
          ? Object.values(details).flat().find((v): v is string => typeof v === 'string')
          : null;
        toast.error(firstErr || (result as any).message || 'Failed to send. Please try again.');
      }
    } catch {
      toast.error('Network error — please check your connection and try again.');
    } finally { setSend(false); }
  }, [form]);

  const fldBase = (name: string): React.CSSProperties => ({
    width:"100%", boxSizing:"border-box" as const,
    border:`1.5px solid ${foc===name ? "#C9883A" : "#E4DFD8"}`,
    borderRadius:10, padding:"9px 14px 9px 44px",
    fontFamily:"'DM Sans',sans-serif", fontSize:13.5, color:"#141413",
    background: foc===name ? "#FFFDF9" : "#fafaf8",
    outline:"none", display:"block",
    transition:"border-color 0.18s, box-shadow 0.18s, background 0.18s",
    boxShadow: foc===name ? "0 0 0 3px rgba(201,136,58,0.12)" : "none",
  });
  const selBase = (name: string): React.CSSProperties => ({ ...fldBase(name), cursor:"pointer" });
  const lbl: React.CSSProperties = {
    display:"block", fontFamily:"'DM Sans',sans-serif",
    fontSize:11, fontWeight:700, color:"#5a5650",
    letterSpacing:"0.07em", textTransform:"uppercase" as const, marginBottom:5,
  };

  const fw = (name: string, icon: string, el: React.ReactNode) => (
    <div style={{ position:"relative" }}>
      <span style={{
        position:"absolute", left:10, top:"50%",
        transform:"translateY(-50%)", pointerEvents:"none", zIndex:1,
      }}>
        <InputBadge icon={icon} active={foc===name} />
      </span>
      {el}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes xzCtFadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes xzCtOrb1 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(-30px,40px) scale(1.10); }
        }
        @keyframes xzCtOrb2 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%     { transform:translate(36px,-22px) scale(0.92); }
          66%     { transform:translate(-18px,18px) scale(1.06); }
        }
        @keyframes xzCtOrb3 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(20px,28px) scale(0.96); }
        }
        @keyframes xzCtOrb4 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(-22px,-30px) scale(1.08); }
        }
        @keyframes xzCtPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(74,222,128,0.7); }
          50%     { box-shadow:0 0 0 7px rgba(74,222,128,0); }
        }
        @keyframes xzCtPulseOrg {
          0%,100% { box-shadow:0 0 0 0 rgba(201,136,58,0.7); }
          50%     { box-shadow:0 0 0 7px rgba(201,136,58,0); }
        }
        @keyframes xzCtFloat {
          0%,100% { transform:translateY(0px); }
          50%     { transform:translateY(-8px); }
        }
        @keyframes xzCtSuccessIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes xzCtCheckPop  { from{transform:scale(0.3);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes xzCtCheckDraw { from{stroke-dashoffset:30} to{stroke-dashoffset:0} }
        @keyframes xzCtSpin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes xzCtShimmer   { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .xz-ct2-wrap {
          display:grid;
          grid-template-columns:420px 1fr;
          gap:0;
          align-items:stretch;
          border-radius:24px;
          overflow:hidden;
          box-shadow:
            0 40px 100px rgba(0,0,0,0.18),
            0 8px 32px rgba(0,0,0,0.10),
            0 2px 0 rgba(201,136,58,0.20);
        }
        @media (max-width:1199px) { .xz-ct2-wrap { grid-template-columns:360px 1fr; } }
        @media (max-width:991px)  { .xz-ct2-wrap { grid-template-columns:1fr; } }
        @media (max-width:575px)  { .xz-ct2-form-pad { padding:32px 22px !important; } }
        @media (prefers-reduced-motion:reduce) {
          .xz-ct2-wrap * { animation:none!important; transition:none!important; }
        }
      `}</style>

      {/* ══ DARK HERO STRIP ══════════════════════════════════════════════════ */}
      <div ref={heroRef} style={{
        background:"linear-gradient(170deg,#1a1208 0%,#0f0a05 100%)",
        padding:"130px 0 80px", position:"relative", overflow:"hidden",
      }}>
        {/* hero orbs */}
        {[
          { w:520, h:520, t:"-20%", l:"-8%",  c:"rgba(201,136,58,0.18)", anim:"xzCtOrb1 22s ease-in-out infinite" },
          { w:360, h:360, t:"auto", l:"auto", r:"-5%", b:"-18%", c:"rgba(204,120,92,0.13)", anim:"xzCtOrb2 28s ease-in-out infinite" },
          { w:220, h:220, t:"30%",  l:"50%",  c:"rgba(201,136,58,0.07)", anim:"xzCtOrb3 18s ease-in-out infinite" },
          { w:180, h:180, t:"10%",  l:"70%",  c:"rgba(160,100,200,0.06)", anim:"xzCtOrb4 24s ease-in-out infinite" },
        ].map((o,i) => (
          <div key={i} aria-hidden="true" style={{
            position:"absolute", width:o.w, height:o.h, borderRadius:"50%",
            top:o.t, left:o.l, right:(o as {r?:string}).r, bottom:(o as {b?:string}).b,
            background:`radial-gradient(circle,${o.c} 0%,transparent 65%)`,
            animation:o.anim, pointerEvents:"none",
          }} />
        ))}
        {/* dot grid */}
        <div aria-hidden="true" style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize:"28px 28px",
        }} />
        {/* diagonal lines accent */}
        <div aria-hidden="true" style={{
          position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden",
          background:"repeating-linear-gradient(125deg,transparent,transparent 60px,rgba(201,136,58,0.025) 60px,rgba(201,136,58,0.025) 61px)",
        }} />

        <div className="container" style={{ position:"relative", zIndex:1, textAlign:"center" }}>
          {/* eyebrow */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:10,
            background:"rgba(201,136,58,0.12)", border:"1px solid rgba(201,136,58,0.30)",
            borderRadius:100, padding:"7px 20px", marginBottom:28,
            animation:"xzCtFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 100ms both",
          }}>
            <span style={{
              width:7, height:7, borderRadius:"50%", background:"#C9883A", display:"inline-block",
              animation:"xzCtPulseOrg 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700,
              letterSpacing:"0.18em", textTransform:"uppercase", color:"#C9883A",
            }}>Contact Us</span>
          </div>

          {/* heading */}
          <h1 style={{
            fontFamily:"'Cormorant Garamond',Garamond,serif",
            fontSize:"clamp(36px,5vw,72px)", fontWeight:700, lineHeight:1.06,
            letterSpacing:"-0.025em", color:"#fff", marginBottom:18, margin:"0 0 18px",
            animation:"xzCtFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 180ms both",
          }}>
            Start Your Enterprise<br />
            <em style={{ color:"#C9883A", fontStyle:"italic" }}>Digital Transformation</em>
          </h1>

          <p style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:16, lineHeight:1.72,
            color:"rgba(255,255,255,0.45)", maxWidth:520, margin:"0 auto 52px",
            animation:"xzCtFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 240ms both",
          }}>
            Tell us about your vision and our experts will craft a tailored solution — delivered with speed, security, and scale.
          </p>

          {/* hero stats */}
          <div style={{
            display:"flex", justifyContent:"center", flexWrap:"wrap",
            borderTop:"1px solid rgba(255,255,255,0.06)",
            paddingTop:40, gap:"12px 0",
          }}>
            {[
              { raw:20,  suffix:"+", label:"Enterprise Clients",  delay:300 },
              { raw:2,   suffix:"+", label:"Countries Served",    delay:380 },
              { raw:99.8,suffix:"%", label:"Platform Uptime",     delay:460, decimals:1 },
              { raw:5,   suffix:"+ yrs", label:"In Operation",    delay:540 },
            ].map((s,i) => (
              <div key={s.label} style={{
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                <HeroStat {...s} trigger={heroVis} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN BODY ════════════════════════════════════════════════════════ */}
      <div style={{
        background:"#F2EFE9", padding:"56px 0 96px",
        position:"relative",
      }}>
        {/* bg dot grid */}
        <div aria-hidden="true" style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"radial-gradient(circle,#dddad4 1px,transparent 1px)",
          backgroundSize:"38px 38px", opacity:0.38,
        }} />

        <div className="container" style={{ position:"relative", zIndex:1 }}>

          {/* main card */}
          <div
            data-aos="fade-up" data-aos-duration="800" data-aos-once="true"
            ref={formRef}
            onMouseMove={onTilt}
            onMouseLeave={onTiltOut}
            className="xz-ct2-wrap"
            style={{
              transformStyle:"preserve-3d",
              transition:"transform 0.12s linear",
              willChange:"transform",
            }}
          >

            {/* ── LEFT — dark info panel ───────────────────────────────── */}
            <div
              onMouseEnter={() => setCardHL(true)}
              onMouseLeave={() => setCardHL(false)}
              style={{
                background:"linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
                padding:"28px 32px 24px",
                position:"relative", overflow:"hidden",
                display:"flex", flexDirection:"column", justifyContent:"space-between",
                minHeight:0,
              }}
            >
              {/* panel orbs */}
              <div aria-hidden="true" style={{
                position:"absolute", top:"-15%", left:"-10%",
                width:320, height:320, borderRadius:"50%",
                background:"radial-gradient(circle,rgba(201,136,58,0.20) 0%,transparent 65%)",
                animation:"xzCtOrb1 20s ease-in-out infinite", pointerEvents:"none",
              }} />
              <div aria-hidden="true" style={{
                position:"absolute", bottom:"-12%", right:"-8%",
                width:240, height:240, borderRadius:"50%",
                background:"radial-gradient(circle,rgba(204,120,92,0.14) 0%,transparent 65%)",
                animation:"xzCtOrb2 26s ease-in-out infinite", pointerEvents:"none",
              }} />
              <div aria-hidden="true" style={{
                position:"absolute", inset:0, pointerEvents:"none",
                backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)",
                backgroundSize:"24px 24px",
              }} />

              <div style={{ position:"relative", zIndex:1 }}>
                {/* eyebrow pill */}
                <div data-aos="fade-up" data-aos-once="true" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(201,136,58,0.12)", border:"1px solid rgba(201,136,58,0.28)",
                  borderRadius:100, padding:"5px 14px", marginBottom:14,
                }}>
                  <span style={{
                    width:6, height:6, borderRadius:"50%", background:"#C9883A", display:"inline-block",
                    animation:"xzCtPulseOrg 2.2s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700,
                    letterSpacing:"0.16em", textTransform:"uppercase", color:"#C9883A",
                  }}>We're ready to help</span>
                </div>

                <h2 data-aos="fade-up" data-aos-delay="60" data-aos-once="true" style={{
                  fontFamily:"'Cormorant Garamond',Garamond,serif",
                  fontSize:"clamp(26px,2.5vw,40px)", fontWeight:700,
                  color:"#fff", lineHeight:1.1, letterSpacing:"-0.018em",
                  margin:"0 0 8px",
                }}>
                  Let's build something<br />
                  <em style={{ color:"#C9883A", fontStyle:"italic" }}>remarkable together</em>
                </h2>

                <p data-aos="fade-up" data-aos-delay="100" data-aos-once="true" style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.65,
                  color:"rgba(255,255,255,0.44)", marginBottom:22, maxWidth:280,
                }}>
                  Fill in the form and our team will contact you within one business day with a tailored proposal.
                </p>

                {/* contact rows */}
                <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:18 }}>
                  <InfoRow icon="fas fa-envelope"       label="Email"    value="info@xerxez.com"          href="mailto:info@xerxez.com" delay={120} />
                  <InfoRow icon="fas fa-phone-alt"      label="Phone"    value="+971 56 786 7451"          href="tel:+971567867451"      delay={160} />
                  <InfoRow icon="fas fa-map-marker-alt" label="Location" value="India & UAE — Remote-first"                              delay={200} />
                </div>

                {/* response chip */}
                <div data-aos="fade-up" data-aos-delay="220" data-aos-once="true" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(74,222,128,0.09)", border:"1px solid rgba(74,222,128,0.20)",
                  borderRadius:100, padding:"7px 16px",
                }}>
                  <span style={{
                    width:7, height:7, borderRadius:"50%", background:"#4ade80",
                    display:"inline-block", flexShrink:0, animation:"xzCtPulse 1.8s ease-in-out infinite",
                  }} />
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.60)" }}>
                    Typically responds within <strong style={{ color:"#4ade80" }}>24 hours</strong>
                  </span>
                </div>
              </div>

              {/* bottom stat row */}
              <div data-aos="fade-up" data-aos-delay="260" data-aos-once="true"
                style={{
                  display:"flex", gap:0, marginTop:20,
                  borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:18,
                  position:"relative", zIndex:1,
                }}>
                {[
                  { val:"4+",    label:"Projects"  },
                  { val:"UAE",   label:"Based"     },
                  { val:"99.9%", label:"Uptime"    },
                ].map((s,i) => (
                  <div key={s.label} style={{
                    flex:1, textAlign:"center",
                    borderLeft: i>0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    padding:"0 8px",
                    animation:`xzCtFloat ${3.5 + i * 0.8}s ease-in-out infinite`,
                  }}>
                    <div style={{
                      fontFamily:"'Cormorant Garamond',Garamond,serif",
                      fontSize:26, fontWeight:700, color:"#C9883A", lineHeight:1,
                    }}>{s.val}</div>
                    <div style={{
                      fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600,
                      letterSpacing:"0.12em", textTransform:"uppercase",
                      color:"rgba(255,255,255,0.32)", marginTop:5,
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT — form panel ───────────────────────────────────── */}
            <div
              className="xz-ct2-form-pad"
              style={{
                background:"#ffffff", borderTop:"3px solid #C9883A",
                padding:"28px 36px 32px",
              }}
            >
              {/* tab bar */}
              <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #F0EBE4" }}>
                {([
                  { key: "contact" as const, label: "Get in Touch" },
                  { key: "partner" as const, label: "Become a Partner" },
                ]).map(t => (
                  <button
                    key={t.key} type="button"
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: "0 4px 12px", marginRight: 24,
                      fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700,
                      color: activeTab === t.key ? "#C9883A" : "#9b9690",
                      borderBottom: activeTab === t.key ? "2.5px solid #C9883A" : "2.5px solid transparent",
                      transition: "color 180ms ease, border-color 180ms ease",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === "partner" ? (
                <div style={{ animation: "xzCtFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }}>
                  <PartnerApplicationForm />
                </div>
              ) : (
              <>
              {/* SUCCESS */}
              {sent && (
                <div style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  justifyContent:"center", height:"100%", textAlign:"center",
                  padding:"60px 20px",
                  animation:"xzCtSuccessIn 0.55s cubic-bezier(0.22,1,0.36,1) both",
                }}>
                  <div style={{
                    width:80, height:80, borderRadius:"50%",
                    background:"linear-gradient(135deg,#22c55e,#4ade80)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    margin:"0 auto 28px",
                    boxShadow:"0 8px 32px rgba(34,197,94,0.30)",
                    animation:"xzCtCheckPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
                  }}>
                    <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
                      <path d="M7 16.5l6.5 6.5L25 10" stroke="#fff" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{ strokeDasharray:30, strokeDashoffset:30, animation:"xzCtCheckDraw 0.45s ease 0.55s forwards" }} />
                    </svg>
                  </div>
                  <h3 style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:38, fontWeight:700, color:"#141413", marginBottom:14,
                  }}>Message Sent!</h3>
                  <p style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#6B6B6B",
                    lineHeight:1.7, maxWidth:360, marginBottom:32,
                  }}>
                    We&apos;ll contact you within 24 hours.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:300 }}>
                    <a
                      href="https://wa.me/971567867451"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                        background:"#25D366", color:"#fff", textDecoration:"none",
                        fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14,
                        padding:"13px 20px", borderRadius:10,
                        boxShadow:"0 4px 0 rgba(0,0,0,0.12),0 6px 18px rgba(37,211,102,0.30)",
                        transition:"opacity 150ms ease",
                      }}
                      onMouseOver={e=>(e.currentTarget.style.opacity="0.88")}
                      onMouseOut={e=>(e.currentTarget.style.opacity="1")}
                    >
                      <i className="fab fa-whatsapp" style={{ fontSize:18 }} />
                      Chat on WhatsApp
                    </a>
                    <Link
                      to="/"
                      style={{
                        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                        background:"none", color:"#6B6B6B", textDecoration:"none",
                        fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14,
                        padding:"12px 20px", borderRadius:10, border:"1px solid rgba(0,0,0,0.12)",
                        transition:"color 150ms ease, border-color 150ms ease",
                      }}
                      onMouseOver={e=>{ e.currentTarget.style.color="#C9883A"; e.currentTarget.style.borderColor="rgba(201,136,58,0.35)"; }}
                      onMouseOut={e=>{ e.currentTarget.style.color="#6B6B6B"; e.currentTarget.style.borderColor="rgba(0,0,0,0.12)"; }}
                    >
                      <i className="fas fa-arrow-left" style={{ fontSize:12 }} />
                      Back to Home
                    </Link>
                  </div>
                </div>
              )}

              {!sent && (
                <>
                  {/* pre-selected service banner */}
                  {showServiceBanner && preselectedService && (
                    <div style={{
                      display:"flex", alignItems:"center", gap:10,
                      background:"rgba(201,136,58,0.12)", border:"1px solid rgba(201,136,58,0.30)",
                      borderRadius:10, padding:"11px 16px", marginBottom:18,
                    }}>
                      <i className="fas fa-check-circle" style={{ color:"#C9883A", fontSize:14, flexShrink:0 }} />
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#5a5650" }}>
                        You are enquiring about: <strong style={{ color:"#141413" }}>{preselectedService}</strong>
                      </span>
                    </div>
                  )}

                  {/* progress bar */}
                  <div style={{ marginBottom:18 }}>
                    <div style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      fontFamily:"'DM Sans',sans-serif", marginBottom:8,
                    }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#5a5650", letterSpacing:"0.07em", textTransform:"uppercase" }}>
                        Form Completion
                      </span>
                      <span style={{
                        fontSize:12, fontWeight:700,
                        color: progress===100 ? "#22c55e" : "#C9883A",
                      }}>{progress}%</span>
                    </div>
                    <div style={{ height:5, background:"#F0EBE4", borderRadius:3, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", width:`${progress}%`,
                        background: progress===100
                          ? "linear-gradient(90deg,#22c55e,#4ade80)"
                          : "linear-gradient(90deg,#e8a84e,#C9883A)",
                        borderRadius:3,
                        transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)",
                      }} />
                    </div>
                  </div>

                  <form method="POST" noValidate>
                    {/* ① Personal Info */}
                    <div style={{ marginBottom:18 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                        <div style={{
                          width:26, height:26, borderRadius:"50%",
                          background:"linear-gradient(145deg,#e8a84e,#C9883A)",
                          boxShadow:"0 3px 0 rgba(130,80,20,0.50)",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                        }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, color:"#fff" }}>1</span>
                        </div>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:"#141413" }}>
                          Personal Information
                        </span>
                        <div style={{ flex:1, height:1, background:"#F0EBE4" }} />
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={lbl}>Full Name <span style={{ color:"#ef4444" }}>*</span></label>
                          {fw("fullName","fas fa-user",
                            <input type="text" placeholder="John Smith"
                              value={form.fullName} style={fldBase("fullName")} disabled={sending}
                              onChange={e=>set("fullName",e.target.value)}
                              onFocus={()=>setFoc("fullName")} onBlur={()=>setFoc(null)} />
                          )}
                        </div>
                        <div className="col-md-6">
                          <label style={lbl}>Email Address <span style={{ color:"#ef4444" }}>*</span></label>
                          {fw("email","fas fa-envelope",
                            <input type="email" placeholder="john@company.com"
                              value={form.email} style={fldBase("email")} disabled={sending}
                              onChange={e=>set("email",e.target.value)}
                              onFocus={()=>setFoc("email")} onBlur={()=>setFoc(null)} />
                          )}
                        </div>
                        <div className="col-md-6">
                          <label style={lbl}>Phone Number</label>
                          <PhoneInput value={form.phone} disabled={sending} onChange={v=>set("phone",v)} />
                        </div>
                        <div className="col-md-6">
                          <label style={lbl}>Company Name</label>
                          {fw("company","fas fa-building",
                            <input type="text" placeholder="Acme Corp"
                              value={form.company} style={fldBase("company")} disabled={sending}
                              onChange={e=>set("company",e.target.value)}
                              onFocus={()=>setFoc("company")} onBlur={()=>setFoc(null)} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ② Enquiry Details */}
                    <div style={{ marginBottom:18 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                        <div style={{
                          width:26, height:26, borderRadius:"50%",
                          background:"linear-gradient(145deg,#e8a84e,#C9883A)",
                          boxShadow:"0 3px 0 rgba(130,80,20,0.50)",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                        }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, color:"#fff" }}>2</span>
                        </div>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:"#141413" }}>
                          Enquiry Details
                        </span>
                        <div style={{ flex:1, height:1, background:"#F0EBE4" }} />
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={lbl}>Industry</label>
                          {fw("industry","fas fa-industry",
                            <select value={form.industry} style={selBase("industry")} disabled={sending}
                              onChange={e=>set("industry",e.target.value)}
                              onFocus={()=>setFoc("industry")} onBlur={()=>setFoc(null)}>
                              <option value="">Select your industry…</option>
                              {INDUSTRIES_OPTS.map(i=><option key={i} value={i}>{i}</option>)}
                            </select>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label style={lbl}>Current Challenge</label>
                          {fw("currentChallenge","fas fa-exclamation-triangle",
                            <select value={form.currentChallenge} style={selBase("currentChallenge")} disabled={sending}
                              onChange={e=>set("currentChallenge",e.target.value)}
                              onFocus={()=>setFoc("currentChallenge")} onBlur={()=>setFoc(null)}>
                              <option value="">Select your biggest challenge…</option>
                              {CURRENT_CHALLENGES.map(c=><option key={c} value={c}>{c}</option>)}
                            </select>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label style={lbl}>Service of Interest</label>
                          {fw("service","fas fa-cog",
                            <select value={form.service} style={selBase("service")} disabled={sending}
                              onChange={e=>set("service",e.target.value)}
                              onFocus={()=>setFoc("service")} onBlur={()=>setFoc(null)}>
                              <option value="">Select a service…</option>
                              {SERVICES.map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label style={lbl}>Country</label>
                          {fw("country","fas fa-globe",
                            <select value={form.country} style={selBase("country")} disabled={sending}
                              onChange={e=>set("country",e.target.value)}
                              onFocus={()=>setFoc("country")} onBlur={()=>setFoc(null)}>
                              <option value="">Select country…</option>
                              {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                            </select>
                          )}
                        </div>
                        <div className="col-12">
                          <label style={lbl}>How did you hear about us?</label>
                          {fw("hearAboutUs","fas fa-bullhorn",
                            <select value={form.hearAboutUs} style={selBase("hearAboutUs")} disabled={sending}
                              onChange={e=>set("hearAboutUs",e.target.value)}
                              onFocus={()=>setFoc("hearAboutUs")} onBlur={()=>setFoc(null)}>
                              <option value="">Select an option…</option>
                              {HEAR_ABOUT_US.map(h=><option key={h} value={h}>{h}</option>)}
                            </select>
                          )}
                        </div>
                        <div className="col-12">
                          <label style={lbl}>Message <span style={{ color:"#ef4444" }}>*</span></label>
                          <div style={{ position:"relative" }}>
                            <span style={{ position:"absolute", left:10, top:13, pointerEvents:"none", zIndex:1 }}>
                              <InputBadge icon="fas fa-comment-alt" active={foc==="message"} />
                            </span>
                            <textarea rows={5} maxLength={1000}
                              placeholder="Tell us about your project, timeline, and goals…"
                              value={form.message}
                              style={{ ...fldBase("message"), padding:"9px 14px 9px 44px", resize:"vertical" as const, minHeight:90 }}
                              disabled={sending}
                              onChange={e=>set("message",e.target.value)}
                              onFocus={()=>setFoc("message")} onBlur={()=>setFoc(null)} />
                          </div>
                          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:5 }}>
                            <span style={{
                              fontFamily:"'DM Sans',sans-serif", fontSize:11,
                              color: chars>900 ? "#ef4444" : "#b8b2ab",
                              fontVariantNumeric:"tabular-nums",
                            }}>{chars} / 1000</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ③ Dynamic per-service requirements */}
                    {activeSection && (
                      <div style={{ marginBottom:18 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                          <div style={{
                            width:26, height:26, borderRadius:"50%",
                            background:"linear-gradient(145deg,#e8a84e,#C9883A)",
                            boxShadow:"0 3px 0 rgba(130,80,20,0.50)",
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                          }}>
                            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, color:"#fff" }}>3</span>
                          </div>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:"#141413" }}>
                            {activeSection.label}
                          </span>
                          <div style={{ flex:1, height:1, background:"#F0EBE4" }} />
                        </div>
                        <div className="row g-3">
                          {activeSection.fields.map(f => (
                            <div className={f.type === "multiselect" ? "col-12" : "col-md-6"} key={f.key}>
                              <label style={lbl}>{f.label}</label>
                              {f.type === "multiselect" ? (
                                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                                  {f.options.map(topic => {
                                    const selected = form[f.key].split(", ").filter(Boolean).includes(topic);
                                    return (
                                      <button type="button" key={topic} disabled={sending}
                                        onClick={() => toggleMulti(f.key, topic)}
                                        style={{
                                          display:"flex", alignItems:"center", gap:6,
                                          padding:"7px 14px", borderRadius:20,
                                          border:`1.5px solid ${selected ? "#C9883A" : "#E4DFD8"}`,
                                          background: selected ? "rgba(201,136,58,0.10)" : "#fafaf8",
                                          color: selected ? "#C9883A" : "#5a5650",
                                          fontFamily:"'DM Sans',sans-serif", fontSize:12.5, fontWeight:600,
                                          cursor: sending ? "not-allowed" : "pointer",
                                          transition:"border-color 0.15s, background 0.15s, color 0.15s",
                                        }}
                                      >
                                        <i className={selected ? "fas fa-check-circle" : "far fa-circle"} style={{ fontSize:11 }} />
                                        {topic}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : fw(f.key, f.icon,
                                f.type === "text" ? (
                                  <input type="text" placeholder={f.placeholder}
                                    value={form[f.key]} style={fldBase(f.key)} disabled={sending}
                                    onChange={e=>set(f.key,e.target.value)}
                                    onFocus={()=>setFoc(f.key)} onBlur={()=>setFoc(null)} />
                                ) : (
                                  <select value={form[f.key]} style={selBase(f.key)} disabled={sending}
                                    onChange={e=>set(f.key,e.target.value)}
                                    onFocus={()=>setFoc(f.key)} onBlur={()=>setFoc(null)}>
                                    <option value="">{f.placeholder}</option>
                                    {f.options.map(o=><option key={o} value={o}>{o}</option>)}
                                  </select>
                                )
                              )}
                            </div>
                          ))}
                          {form.service === "AI-Powered ERP" && (
                            <div className="col-md-6">
                              <label style={lbl}>Timeline</label>
                              {fw("timeline","fas fa-hourglass-half",
                                <select value={form.timeline} style={selBase("timeline")} disabled={sending}
                                  onChange={e=>set("timeline",e.target.value)}
                                  onFocus={()=>setFoc("timeline")} onBlur={()=>setFoc(null)}>
                                  <option value="">Select timeline…</option>
                                  {TIMELINE_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
                                </select>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* submit */}
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:4 }}>
                      {/* primary 3D button */}
                      <button type="button" onClick={handleSubmit} disabled={sending}
                        onMouseEnter={() => setBtnH(true)}
                        onMouseLeave={() => setBtnH(false)}
                        style={{
                          flex:"1 1 200px", height:52,
                          display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                          background: sending
                            ? "rgba(201,136,58,0.55)"
                            : "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)",
                          color:"#fff", fontFamily:"'DM Sans',sans-serif",
                          fontSize:14.5, fontWeight:700, letterSpacing:"0.02em",
                          border:"none", borderRadius:12,
                          cursor: sending ? "not-allowed" : "pointer",
                          opacity: sending ? 0.88 : 1,
                          boxShadow: btnHov && !sending
                            ? "0 7px 0 rgba(120,70,15,0.55), 0 14px 36px rgba(201,136,58,0.35)"
                            : "0 4px 0 rgba(120,70,15,0.50), 0 8px 24px rgba(201,136,58,0.25)",
                          transform: btnHov && !sending ? "translateY(-3px)" : "translateY(0)",
                          transition:"transform 200ms cubic-bezier(0.22,1,0.36,1), box-shadow 200ms ease, background 180ms",
                        }}
                      >
                        {sending ? (
                          <>
                            <svg width="15" height="15" viewBox="0 0 18 18" style={{ animation:"xzCtSpin 1s linear infinite", flexShrink:0 }}>
                              <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                              <path d="M9 2a7 7 0 0 1 7 7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane" style={{ fontSize:13 }} />
                            Send Enquiry
                          </>
                        )}
                      </button>

                      {/* secondary clear button */}
                      <button type="button" onClick={() => { setForm(EMPTY); setShowServiceBanner(false); }} disabled={sending}
                        style={{
                          height:52, padding:"0 22px",
                          background:"#fafaf8", color:"#7a746e",
                          fontFamily:"'DM Sans',sans-serif", fontSize:13.5, fontWeight:600,
                          border:"1.5px solid #E4DFD8", borderRadius:12,
                          cursor: sending ? "not-allowed" : "pointer",
                          boxShadow:"0 2px 0 rgba(0,0,0,0.06)",
                          transition:"border-color 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s",
                          whiteSpace:"nowrap" as const,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor="#C9883A";
                          e.currentTarget.style.color="#5a5650";
                          e.currentTarget.style.boxShadow="0 3px 0 rgba(201,136,58,0.22)";
                          e.currentTarget.style.transform="translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor="#E4DFD8";
                          e.currentTarget.style.color="#7a746e";
                          e.currentTarget.style.boxShadow="0 2px 0 rgba(0,0,0,0.06)";
                          e.currentTarget.style.transform="translateY(0)";
                        }}
                      >
                        <i className="fas fa-times" style={{ fontSize:11, marginRight:6 }} />
                        Clear
                      </button>
                    </div>

                    {/* social proof */}
                    <div style={{
                      display:"flex", alignItems:"center", justifyContent:"center",
                      margin:"18px 0 0",
                    }}>
                      <span style={{
                        display:"inline-flex", alignItems:"center", gap:7,
                        background:"rgba(201,136,58,0.08)", border:"1px solid rgba(201,136,58,0.20)",
                        borderRadius:999, padding:"6px 16px",
                        fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#8B7A6A",
                      }}>
                        <i className="fas fa-building" style={{ fontSize:10, color:"#C9883A" }} />
                        Join 20+ enterprises that chose XERXEZ
                      </span>
                    </div>

                    {/* privacy row */}
                    <div style={{
                      display:"flex", alignItems:"center", justifyContent:"center",
                      gap:16, margin:"14px 0 0", flexWrap:"wrap",
                    }}>
                      <span style={{
                        display:"inline-flex", alignItems:"center", gap:5,
                        fontFamily:"'DM Sans',sans-serif", fontSize:11.5, color:"#b8b2ab",
                      }}>
                        <i className="fas fa-lock" style={{ fontSize:9, color:"#C9883A" }} />
                        Your data is encrypted &amp; never shared
                      </span>
                      <span style={{ width:1, height:12, background:"#E4DFD8", display:"inline-block" }} />
                      <a href="tel:+971567867451" style={{
                        display:"inline-flex", alignItems:"center", gap:5,
                        fontFamily:"'DM Sans',sans-serif", fontSize:11.5,
                        color:"#C9883A", textDecoration:"none", fontWeight:600,
                      }}>
                        <i className="fas fa-phone-alt" style={{ fontSize:9 }} />
                        +971 56 786 7451
                      </a>
                    </div>

                  </form>
                </>
              )}
              </>
              )}
            </div>

          </div>{/* /.xz-ct2-wrap */}
        </div>
      </div>
    </>
  );
};

export default ContactSection2;
