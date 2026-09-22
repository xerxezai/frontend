// XerxezContactForm.tsx
// Purpose: The main enquiry form on /v2/contact. Two-panel layout (navy info
//          panel + white form). The form has 3 sections: personal info, enquiry
//          details, and a dynamic per-service requirements section that appears
//          when a service is chosen. Also hosts a "Become a Partner" tab.
// Used in: page/v2/ContactV2.tsx
// Data source: every option list, the field set, the `SERVICE_SECTIONS` map, the
//              URL-param behaviour, the validation rules and the exact snake_case
//              POST body sent to /contact/ are copied verbatim from the existing
//              src/components/contact/ContactSection2.tsx — this is a faithful
//              restyle, not a redesign. The Partner tab reuses the existing
//              PartnerApplicationForm unchanged.

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../../../../services/api";
import PhoneInput, { isValidPhone } from "../../../common/PhoneInput";
import PartnerApplicationForm from "../../../contact/PartnerApplicationForm";
import { INDUSTRIES, industryLabel } from "../../../../data/erpIndustriesData";
import { T, V2_API_BASE } from "../../01-core/v2theme";
import { v2Label, v2Control, validateEmail, V2Field, V2Chips, V2SubmitBtn, V2FormSuccess } from "../../01-core/v2form";

// ── Option lists (verbatim from ContactSection2) ─────────────────────────────
const SERVICES = [
  "AI-Powered ERP", "DevSecOps Pipelines", "Cloud Infrastructure",
  "Software Development", "AI Training & Consulting", "AI Training & Upskilling",
  "Quantum Computing", "Mobile Application",
  "Web & Mobile Hosting", "Software Consulting", "Partner Course Listing",
];
// Short slugs used by deep-links that don't want to URL-encode the full label
// (e.g. TrainingV2's "Enterprise training" CTA → /contact?service=ai-training;
// PartnerWithUsPage's "List Your Courses" CTA → /contact?service=partner-courses).
const SERVICE_SLUGS: Record<string, string> = {
  "ai-training": "AI Training & Upskilling",
  "partner-courses": "Partner Course Listing",
};
const COUNTRIES = ["India", "UAE", "Other"];
const HEAR_ABOUT_US = ["Google Search", "Social Media", "LinkedIn", "Referral", "Existing Customer", "Event/Conference", "Other"];
// Diverges from ContactSection2's own (out-of-sync, 6-item) industry list —
// this one is the real 8-sector list from erpIndustriesData.tsx, the same
// data the header's Industry We Serve dropdown and the homepage's
// XerxezIndustries picker use, so the enquiry form doesn't offer sectors
// that don't otherwise exist on the site (and is missing ones that do).
const INDUSTRIES_OPTS = INDUSTRIES.map(industryLabel);
const ERP_MODULES = [
  "Dashboard & Analytics", "CRM", "Sales", "Procurement", "Logistics",
  "Accounting", "HR & Payroll", "Document Management", "Project Management",
  "Asset Management", "QHSE", "MLM / Network",
];
const CURRENT_CHALLENGES = ["Manual approvals & workflows", "Document management", "Procurement bottlenecks", "HR & payroll management", "No visibility on project costs", "Other"];
const PLAN_INTEREST = ["Basic", "Professional", "Enterprise"];
// Shown under the "Plan Interest" select once a plan is chosen.
const PLAN_INCLUDES: Record<string, string> = {
  Basic: "Includes: Dashboard & Analytics, HR & Payroll, CRM, Sales, Accounting",
  Professional: "Includes: Everything in Basic + Procurement, Logistics, Document Management",
  Enterprise: "Includes: Everything in Professional + Project Management, Asset Management, QHSE, MLM / Network",
};
const TEAM_SIZES = ["1-10 employees", "10-50 employees", "50-200 employees", "200+ employees"];
const TIMELINE_OPTIONS = ["Immediate (within 1 month)", "Short term (1-3 months)", "Medium term (3-6 months)", "Just exploring for now"];
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

// Every field the form tracks. Service-specific fields are only shown for the
// matching service but always exist on the object (sent blank otherwise).
interface F {
  fullName: string; email: string; phone: string; company: string;
  service: string; country: string; hearAboutUs: string; message: string;
  industry: string; currentChallenge: string;
  planInterest: string; teamSize: string; timeline: string; erpModules: string;
  techStack: string; deploymentEnv: string; numDevelopers: string;
  cloudProvider: string; currentInfra: string; migrationNeeded: string;
  projectType: string; projectTimeline: string; approxBudget: string;
  trainingTeamSize: string; trainingMode: string; topicsOfInterest: string; trainingDuration: string;
  courseNames: string; platformUrl: string; courseUrl: string;
}
const EMPTY: F = {
  fullName: "", email: "", phone: "", company: "",
  service: "", country: "", hearAboutUs: "", message: "",
  industry: "", currentChallenge: "",
  planInterest: "", teamSize: "", timeline: "", erpModules: "",
  techStack: "", deploymentEnv: "", numDevelopers: "",
  cloudProvider: "", currentInfra: "", migrationNeeded: "",
  projectType: "", projectTimeline: "", approxBudget: "",
  trainingTeamSize: "", trainingMode: "", topicsOfInterest: "", trainingDuration: "",
  courseNames: "", platformUrl: "", courseUrl: "",
};
// Fields that count toward the "form completion" progress bar (plus any active
// service-section fields, added at runtime).
const COMMON_TRACKED: (keyof F)[] = ["fullName", "email", "phone", "company", "service", "country", "hearAboutUs", "message"];

// A field descriptor for the dynamic per-service section. `required` only
// drives the label asterisk + handleSubmit's validation (see the Partner
// Course Listing section below) — every other service's fields are all
// optional today, same as before this flag existed.
type FieldDef = { key: keyof F; label: string; placeholder: string; required?: boolean } &
  ({ type: "text" } | { type: "select"; options: string[] } | { type: "multiselect"; options: string[] });

// Validated field → the DOM id of its control, in the order focus should be
// attempted after a failed submit (top-to-bottom through the form).
const ERROR_FIELD_IDS: { key: keyof F; id: string }[] = [
  { key: "fullName", id: "v2c-name" },
  { key: "email",    id: "v2c-email" },
  { key: "phone",    id: "v2c-phone" },
  { key: "message",  id: "v2c-message" },
  { key: "courseNames", id: "v2c-courseNames" },
  { key: "platformUrl", id: "v2c-platformUrl" },
  { key: "courseUrl",   id: "v2c-courseUrl" },
];

// service name → the extra fields to show when it's selected.
const SERVICE_SECTIONS: Record<string, { label: string; fields: FieldDef[] }> = {
  "AI-Powered ERP": {
    label: "ERP Requirements",
    fields: [
      { key: "planInterest", label: "Plan Interest", type: "select", options: PLAN_INTEREST, placeholder: "Select a plan…" },
      { key: "teamSize", label: "Team Size", type: "select", options: TEAM_SIZES, placeholder: "Select team size…" },
      { key: "erpModules", label: "ERP Modules of Interest", type: "multiselect", options: ERP_MODULES, placeholder: "Select modules…" },
    ],
  },
  "DevSecOps Pipelines": {
    label: "DevSecOps Requirements",
    fields: [
      { key: "techStack", label: "Current Tech Stack", type: "text", placeholder: "e.g. Node.js, Docker, Jenkins" },
      { key: "deploymentEnv", label: "Deployment Environment", type: "select", options: DEPLOYMENT_ENVS, placeholder: "Select environment…" },
      { key: "numDevelopers", label: "Number of Developers", type: "select", options: NUM_DEVELOPERS, placeholder: "Select team size…" },
    ],
  },
  "Cloud Infrastructure": {
    label: "Cloud Requirements",
    fields: [
      { key: "cloudProvider", label: "Cloud Provider Preference", type: "select", options: CLOUD_PROVIDERS, placeholder: "Select provider…" },
      { key: "currentInfra", label: "Current Infrastructure", type: "text", placeholder: "e.g. On-prem VMware, bare metal" },
      { key: "migrationNeeded", label: "Migration Needed?", type: "select", options: YES_NO, placeholder: "Select an option…" },
    ],
  },
  "Software Development": {
    label: "Project Requirements",
    fields: [
      { key: "projectType", label: "Project Type", type: "select", options: PROJECT_TYPES, placeholder: "Select project type…" },
      { key: "projectTimeline", label: "Project Timeline", type: "select", options: PROJECT_TIMELINES, placeholder: "Select timeline…" },
      { key: "approxBudget", label: "Approximate Budget", type: "text", placeholder: "e.g. $10,000 – $25,000" },
    ],
  },
  "AI Training & Consulting": {
    label: "Training Requirements",
    fields: [
      { key: "trainingTeamSize", label: "Team Size for Training", type: "select", options: TRAINING_TEAM_SIZES, placeholder: "Select team size…" },
      { key: "trainingMode", label: "Training Mode", type: "select", options: TRAINING_MODES, placeholder: "Select mode…" },
      { key: "trainingDuration", label: "Training Duration", type: "select", options: TRAINING_DURATIONS, placeholder: "Select duration…" },
      { key: "topicsOfInterest", label: "Topics of Interest", type: "multiselect", options: TRAINING_TOPICS, placeholder: "Select topics…" },
    ],
  },
  "Partner Course Listing": {
    label: "Course Listing Details",
    fields: [
      { key: "courseNames", label: "Course Name(s)", type: "text", placeholder: "e.g. Intro to Kubernetes, Advanced Docker", required: true },
      { key: "platformUrl", label: "Your Platform URL", type: "text", placeholder: "https://yourplatform.com", required: true },
      { key: "courseUrl", label: "Course URL(s)", type: "text", placeholder: "https://yourplatform.com/course/…", required: true },
    ],
  },
};

// ── Partner-tab reskin ────────────────────────────────────────────────────────
// PartnerApplicationForm (src/components/contact/PartnerApplicationForm.tsx) is
// a v1 component also used unchanged by v1's ContactSection2.tsx, so its source
// can't be edited without touching v1. Every color/font choice in that form is
// an inline style (not a CSS class), so this scoped stylesheet recolors it via
// `[style*="…"]` attribute selectors matching on the literal inline-style text
// — the only way to reskin inline styles short of forking the component.
// Two things that broke the first pass of this, fixed here:
//  1. `font-family` was applied to `*`, which also hit the `<i className="fas
//     fa-…">` icon glyphs — those render via FontAwesome's own icon font
//     ("Font Awesome 5 Pro"/"…Brands", see src/styles/fontawesome/font-awesome.css),
//     so overriding their font-family broke every icon into an empty glyph
//     box. Scoped to `*:not(i)` instead.
//  2. The color selectors matched literal hex text (`[style*="C9883A"]`), but
//     the browser re-serializes an inline `style` attribute's colors as
//     `rgb(r, g, b)`, not hex — so hex-text selectors never matched anything.
//     Matched on the decimal RGB text instead (in both "r, g, b" and "r,g,b"
//     forms, since React's literal `rgba(a,b,c,d)` strings you'll see in
//     box-shadow values keep the no-space form, while shorthand colors like
//     `border`/`background` get browser-serialized with a space).
// Swaps v1's amber/DM-Sans palette for v2's red/Poppins one; fields,
// validation and submit logic are untouched.
const PARTNER_FORM_RESKIN_CSS = `
  .v2PartnerFormScope *:not(i) { font-family: 'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif !important; }
  /* The browser re-serializes every hex/rgb color in a React inline style
     back into the DOM's style attribute as "rgb(R, G, B)" — so #C9883A shows
     up as "201, 136, 58" whether it was used as a background gradient stop,
     a border color, or a plain text color. Matching on that substring alone
     (as an earlier version of this override did) can't tell those apart, so
     it force-painted a solid red gradient onto plain text (e.g. "Commission:
     10%") and subtle tint boxes that only ever referenced the color as text/
     border, not background. Fixed by requiring BOTH gradient stops together
     before touching background — that combination only ever appears on the
     real solid-fill elements (badges, step-number circles, the submit
     button) — and leaving every other match to just recolor text/border. */
  .v2PartnerFormScope [style*="232, 168, 78"][style*="201, 136, 58"],
  .v2PartnerFormScope [style*="232,168,78"][style*="201,136,58"] {
    background-image: linear-gradient(145deg, #ff6a55 0%, #D93522 100%) !important;
  }
  .v2PartnerFormScope [style*="201, 136, 58"]:not([style*="232, 168, 78"]),
  .v2PartnerFormScope [style*="201,136,58"]:not([style*="232,168,78"]) {
    border-color: #D93522 !important; color: #D93522 !important; accent-color: #D93522 !important;
  }
  /* focus-glow rgba(201,136,58,X) -> red tint. Excludes gradient elements
     (the submit button's drop-shadow also happens to reference this color)
     so this never overwrites their white text back to red — see note above. */
  .v2PartnerFormScope [style*="rgba(201,136,58"]:not([style*="232, 168, 78"]):not([style*="232,168,78"]),
  .v2PartnerFormScope [style*="rgba(201, 136, 58"]:not([style*="232, 168, 78"]):not([style*="232,168,78"]) {
    border-color: #D93522 !important; color: #D93522 !important;
    background-color: rgba(217,53,34,0.08) !important;
    box-shadow: 0 0 0 3px rgba(217,53,34,0.12) !important;
  }
  /* button/badge 3D-edge shadows: rgba(130,80,20,*) and rgba(120,70,15,*) -> dark red */
  .v2PartnerFormScope [style*="rgba(130,80,20"], .v2PartnerFormScope [style*="rgba(130, 80, 20"] { box-shadow: 0 3px 0 rgba(120,20,10,0.5) !important; }
  .v2PartnerFormScope [style*="rgba(120,70,15"], .v2PartnerFormScope [style*="rgba(120, 70, 15"] { box-shadow: 0 4px 0 rgba(120,20,10,0.5), 0 8px 24px rgba(217,53,34,0.25) !important; }
  /* neutral borders/backgrounds -> v2 tokens: #E4DFD8=rgb(228,223,216), #fafaf8=rgb(250,250,248), #F0EBE4=rgb(240,235,228) */
  .v2PartnerFormScope [style*="228, 223, 216"], .v2PartnerFormScope [style*="228,223,216"] { border-color: #e6ecf2 !important; }
  .v2PartnerFormScope [style*="250, 250, 248"], .v2PartnerFormScope [style*="250,250,248"] { background: #fff !important; }
  .v2PartnerFormScope [style*="240, 235, 228"], .v2PartnerFormScope [style*="240,235,228"] { background: #e6ecf2 !important; border-color: #e6ecf2 !important; }
  /* text colors -> v2 navy/muted: #141413=rgb(20,20,19), #5a5650=rgb(90,86,80), #6B6B6B=rgb(107,107,107), #9b9690=rgb(155,150,144) */
  .v2PartnerFormScope [style*="20, 20, 19"], .v2PartnerFormScope [style*="20,20,19"] { color: #0f2c4d !important; }
  .v2PartnerFormScope [style*="90, 86, 80"], .v2PartnerFormScope [style*="90,86,80"] { color: rgba(10,10,10,0.62) !important; }
  .v2PartnerFormScope [style*="107, 107, 107"], .v2PartnerFormScope [style*="107,107,107"] { color: rgba(10,10,10,0.62) !important; }
  .v2PartnerFormScope [style*="155, 150, 144"], .v2PartnerFormScope [style*="155,150,144"] { color: rgba(15,44,77,0.45) !important; }
`;

// ── Component ───────────────────────────────────────────────────────────────
const XerxezContactForm = () => {
  const [searchParams] = useSearchParams();
  const urlService = searchParams.get("service");   // ?service=… deep-link — either the
  // full label (e.g. "AI-Powered ERP", URL-encoded) or a short slug in SERVICE_SLUGS
  // (e.g. "ai-training"). Only honoured if it resolves to a real service name.
  const preselectedService = urlService
    ? (SERVICE_SLUGS[urlService] ?? (SERVICES.includes(urlService) ? urlService : null))
    : null;
  // Show the "Enquiring about: X" banner only when a service (but not a plan) was deep-linked.
  const [showServiceBanner, setShowServiceBanner] = useState(!!preselectedService && !searchParams.get("plan"));
  // Which tab is active. Open the Partner tab if the URL hash is #partner.
  const [tab, setTab] = useState<"contact" | "partner">(
    typeof window !== "undefined" && window.location.hash === "#partner" ? "partner" : "contact"
  );
  // Initial form state — pre-fill from ?plan=… or ?service=… if present.
  const [form, setForm] = useState<F>(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      const matched = PLAN_INTEREST.find((p) => p.startsWith(plan)) || "";
      return { ...EMPTY, service: "AI-Powered ERP", planInterest: matched, message: `I am interested in the ${plan} plan for XERXEZ ERP. Please contact me with more details.` };
    }
    if (preselectedService) return { ...EMPTY, service: preselectedService };
    return EMPTY;
  });
  const [foc, setFoc] = useState<string | null>(null);   // focused field name (for the ring)
  const [sending, setSending] = useState(false);         // request in flight
  const [sent, setSent] = useState(false);               // show the success panel
  const [errors, setErrors] = useState<Partial<Record<keyof F, string>>>({});   // field → message

  // Warm the Railway backend on mount so the first real POST isn't slow.
  useEffect(() => {
    const base = V2_API_BASE.replace(/\/api\/v1\/?$/, "");   // /health/ sits outside the versioned prefix
    fetch(`${base}/health/`).catch(() => {});   // fire-and-forget; ignore failures
  }, []);

  // Update one field, clear its error, and hide the deep-link banner if the service changed.
  const set = useCallback((k: keyof F, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
    if (k === "service") setShowServiceBanner(false);
  }, []);

  // Toggle one value in a multiselect field. Stored as a ", "-joined string
  // (the backend field is a CharField) — same encoding as the original form.
  const toggleMulti = useCallback((key: keyof F, value: string) => {
    setForm((p) => {
      const cur = p[key].split(", ").filter(Boolean);
      const next = cur.includes(value) ? cur.filter((t) => t !== value) : [...cur, value];
      return { ...p, [key]: next.join(", ") };
    });
  }, []);

  const activeSection = SERVICE_SECTIONS[form.service];   // extra fields for the chosen service, or undefined

  // Which fields count toward the progress bar: the common ones + the active
  // service section's fields + "timeline" (ERP only).
  const tracked = useMemo(() => {
    const keys = [...COMMON_TRACKED];
    if (activeSection) keys.push(...activeSection.fields.map((f) => f.key));
    if (form.service === "AI-Powered ERP") keys.push("timeline");
    return keys;
  }, [activeSection, form.service]);

  const filled = tracked.filter((k) => form[k].trim() !== "").length;   // how many tracked fields have a value
  const progress = Math.round((filled / tracked.length) * 100);         // 0–100 for the bar
  const chars = form.message.length;                                    // message character count

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation — required: name, valid email, message ≥ 10 chars;
    // phone optional but must be valid if present.
    const errs: Partial<Record<keyof F, string>> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email.trim() || !validateEmail(form.email)) errs.email = "Please enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = "Message must be at least 10 characters.";
    if (form.phone.trim() && !isValidPhone(form.phone)) errs.phone = "Please enter a valid phone number with country code.";
    // Required per-service fields (currently: Partner Course Listing's
    // Course URL + Coupon Code) — same "required" flag drives the label
    // asterisk above.
    if (activeSection) {
      for (const f of activeSection.fields) {
        if (f.required && !form[f.key].trim()) errs[f.key] = `${f.label} is required.`;
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error(Object.values(errs)[0]);                    // announce the first error
      // Move focus to the first invalid field.
      const first = ERROR_FIELD_IDS.find(({ key }) => errs[key]);
      if (first) document.getElementById(first.id)?.focus();
      return;
    }
    setErrors({});
    setSending(true);
    try {
      // POST body — snake_case keys must match the backend serializer exactly.
      const result = await apiService.post("/contact/", {
        full_name: form.fullName, email: form.email, phone: form.phone,
        company: form.company, service: form.service || "General Inquiry",
        subject: form.service ? `${form.service} Enquiry` : "General Enquiry",
        message: form.message, country: form.country, hear_about_us: form.hearAboutUs,
        industry: form.industry, current_challenge: form.currentChallenge,
        plan_interest: form.planInterest, team_size: form.teamSize,
        timeline: form.timeline, erp_modules: form.erpModules,
        tech_stack: form.techStack, deployment_env: form.deploymentEnv, num_developers: form.numDevelopers,
        cloud_provider: form.cloudProvider, current_infra: form.currentInfra, migration_needed: form.migrationNeeded,
        project_type: form.projectType, project_timeline: form.projectTimeline, approx_budget: form.approxBudget,
        training_team_size: form.trainingTeamSize, training_mode: form.trainingMode, topics_of_interest: form.topicsOfInterest,
        training_duration: form.trainingDuration,
        course_names: form.courseNames, platform_url: form.platformUrl,
        course_url: form.courseUrl,
      });
      if (result.success) {
        setSent(true); setForm(EMPTY);
        toast.success("Message sent! We'll get back to you within 24 hours.");
      } else {
        // Surface the first string the API returned in `details`, else its message.
        const details = (result as { details?: unknown }).details;
        const firstErr = details && typeof details === "object"
          ? Object.values(details as Record<string, unknown>).flat().find((v): v is string => typeof v === "string")
          : null;
        toast.error(firstErr || (result as { message?: string }).message || "Failed to send. Please try again.");
      }
    } catch {
      toast.error("Network error — please check your connection and try again.");
    } finally { setSending(false); }
  }, [form]);

  // Control style for a field: focus ring + error border + disabled-while-sending.
  const ctrl = (name: keyof F, extra?: React.CSSProperties): React.CSSProperties => ({
    ...v2Control({ focused: foc === name, disabled: sending, error: !!errors[name] }), ...extra,
  });
  // onFocus/onBlur handlers that track which field is focused.
  const focusProps = (name: keyof F) => ({
    onFocus: () => setFoc(name),
    onBlur: () => setFoc(null),
  });

  // Renders the control for one dynamic per-service field. `f.type` is a
  // discriminated union, so each branch has `f.options` narrowed correctly.
  const renderServiceField = (f: FieldDef): ReactNode => {
    switch (f.type) {
      case "multiselect":
        return (
          <V2Chips options={f.options} value={form[f.key]} disabled={sending}
            onToggle={(v) => toggleMulti(f.key, v)} />
        );
      case "text":
        return (
          <input id={`v2c-${f.key}`} type="text" placeholder={f.placeholder} value={form[f.key]} disabled={sending}
            aria-invalid={!!errors[f.key]}
            style={ctrl(f.key)} {...focusProps(f.key)} onChange={(e) => set(f.key, e.target.value)} />
        );
      case "select":
        return (
          <select value={form[f.key]} disabled={sending} style={{ ...ctrl(f.key), cursor: "pointer" }}
            {...focusProps(f.key)} onChange={(e) => set(f.key, e.target.value)}>
            <option value="">{f.placeholder}</option>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        );
    }
  };

  // A numbered section divider ("① Personal Information", …).
  const stepHead = (n: number, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        background: T.red, color: "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.fontHead, fontSize: 12, fontWeight: 700,
      }}>{n}</span>
      <span style={{ fontFamily: T.fontHead, fontSize: 14, fontWeight: 700, color: T.headNavy }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: T.border }} />   {/* rule filling the rest of the row */}
    </div>
  );

  return (
    // Two-column card: 380px navy info panel + fluid form. Collapses to 1 column
    // below 992px via the scoped media query below.
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 380px) minmax(0, 1fr)",   // minmax(0,…) stops the columns overflowing the grid
      background: "#fff",
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 24px 60px rgba(16,42,77,0.10)",
    }}
      className="v2-contact-wrap"
    >
      <style>{`
        @media (max-width: 991px) { .v2-contact-wrap { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Left: navy info panel (contact details + response-time badge) ── */}
      <div style={{ background: T.navyGrad, color: "#fff", padding: "40px 34px" }}>
        <div style={{
          fontFamily: T.fontBody, fontSize: 12, fontWeight: 600,
          letterSpacing: "0.22em", textTransform: "uppercase", color: T.redLight, marginBottom: 14,
        }}>
          We're ready to help
        </div>
        <h3 style={{
          fontFamily: T.fontHead, fontSize: 26, fontWeight: 800,
          color: "#fff", margin: "0 0 12px", lineHeight: 1.2,
        }}>
          Let's build something remarkable together
        </h3>
        <p style={{
          fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.7,
          color: "rgba(255,255,255,0.72)", margin: "0 0 28px",
        }}>
          Fill in the form and our team will contact you within one business day with a tailored proposal.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
          {[
            { label: "Email", value: "info@xerxez.com", href: "mailto:info@xerxez.com" },
            { label: "Phone", value: "+971 56 786 7451", href: "tel:+971567867451" },
            { label: "Location", value: "India & UAE — Remote-first" },   // no href → plain text
          ].map((r) => (
            <li key={r.label}>
              <div style={{
                fontFamily: T.fontBody, fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)", marginBottom: 3,
              }}>{r.label}</div>
              {r.href ? (
                <a href={r.href} style={{ color: "#fff", fontFamily: T.fontBody, fontSize: 14, textDecoration: "none" }}>{r.value}</a>
              ) : (
                <span style={{ color: "#fff", fontFamily: T.fontBody, fontSize: 14 }}>{r.value}</span>
              )}
            </li>
          ))}
        </ul>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginTop: 26,
          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 999, padding: "7px 14px",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontFamily: T.fontBody, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
            Typically responds within <strong style={{ color: "#4ade80" }}>24 hours</strong>
          </span>
        </div>
      </div>

      {/* ── Right: the form (or Partner form / success panel) ── */}
      <div style={{ padding: "34px 36px", borderTop: `3px solid ${T.red}` }}>
        {/* tab bar: Get in Touch / Become a Partner */}
        <div style={{ display: "flex", gap: 24, marginBottom: 24, borderBottom: `1px solid ${T.border}` }}>
          {([
            { key: "contact" as const, label: "Get in Touch" },
            { key: "partner" as const, label: "Become a Partner" },
          ]).map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 2px 12px",                      // vertical padding gives a ~44px hit area
                fontFamily: T.fontHead, fontSize: 14, fontWeight: 700,
                color: tab === t.key ? T.red : "#5b6b7c",
                borderBottom: `2.5px solid ${tab === t.key ? T.red : "transparent"}`,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "partner" ? (
          // Partner tab — reuses the existing v1 site component's fields/logic
          // unchanged (it's also used by v1's ContactSection2.tsx, so it can't
          // be edited directly), reskinned to v2's navy/red/Poppins palette via
          // a scoped CSS override instead — see PARTNER_FORM_RESKIN_CSS below.
          <div className="v2PartnerFormScope">
            <style>{PARTNER_FORM_RESKIN_CSS}</style>
            <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.muted, marginBottom: 20 }}>
              Want to learn more first?{" "}
              <Link to="/partners" style={{ color: T.red, fontWeight: 600, textDecoration: "none" }}>
                Read about our Partner Program →
              </Link>
            </p>
            <PartnerApplicationForm />
          </div>
        ) : sent ? (
          // Success panel — shared <V2FormSuccess> icon/heading/message, plus
          // this form's own quick-action buttons (WhatsApp, back-home).
          <V2FormSuccess title="Message sent!">
            We'll contact you within 24 hours.
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300, margin: "28px auto 0" }}>
              <a href="https://wa.me/971567867451" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                  background: "#25D366", color: "#fff", textDecoration: "none",
                  fontFamily: T.fontHead, fontWeight: 700, fontSize: 14,
                  padding: "13px 20px", borderRadius: T.rx,
                }}>
                Chat on WhatsApp
              </a>
              <Link to="/" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                color: T.muted, textDecoration: "none",
                fontFamily: T.fontHead, fontWeight: 600, fontSize: 14,
                padding: "12px 20px", borderRadius: T.rx, border: `1px solid ${T.border}`,
              }}>
                Back to home
              </Link>
            </div>
          </V2FormSuccess>
        ) : (
          // The actual form
          <form onSubmit={handleSubmit} noValidate>{/* noValidate → our handleSubmit validation runs */}
            {/* deep-link banner: "Enquiring about: <service>" */}
            {showServiceBanner && preselectedService && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(217,53,34,0.08)", border: "1px solid rgba(217,53,34,0.24)",
                borderRadius: T.rx, padding: "11px 16px", marginBottom: 18,
                fontFamily: T.fontBody, fontSize: 13, color: "#42566b",
              }}>
                Enquiring about: <strong style={{ color: T.headNavy }}>{preselectedService}</strong>
              </div>
            )}

            {/* completion progress bar */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontFamily: T.fontBody, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#5b6b7c" }}>
                  Form completion
                </span>
                <span style={{ fontFamily: T.fontHead, fontSize: 12, fontWeight: 700, color: progress === 100 ? "#16a34a" : T.red }}>{progress}%</span>
              </div>
              <div style={{ height: 5, background: T.lightAlt, borderRadius: 3, overflow: "hidden" }}>
                {/* fill width = progress%; turns green at 100 */}
                <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#16a34a" : T.red, borderRadius: 3, transition: "width 0.4s ease" }} />
              </div>
            </div>

            {/* ① Personal information */}
            {stepHead(1, "Personal Information")}
            <div className="row g-3" style={{ marginBottom: 22 }}>
              <V2Field label="Full Name" required htmlFor="v2c-name" error={errors.fullName}>
                <input id="v2c-name" type="text" placeholder="John Smith" value={form.fullName} disabled={sending}
                  aria-invalid={!!errors.fullName}
                  style={ctrl("fullName")} {...focusProps("fullName")} onChange={(e) => set("fullName", e.target.value)} />
              </V2Field>
              <V2Field label="Email Address" required htmlFor="v2c-email" error={errors.email}>
                <input id="v2c-email" type="email" placeholder="john@company.com" value={form.email} disabled={sending}
                  aria-invalid={!!errors.email}
                  style={ctrl("email")} {...focusProps("email")} onChange={(e) => set("email", e.target.value)} />
              </V2Field>
              {/* Phone — existing site component; manual error line below it */}
              <div className="col-md-6">
                <label htmlFor="v2c-phone" style={v2Label}>Phone Number</label>
                <PhoneInput id="v2c-phone" value={form.phone} disabled={sending} hasError={!!errors.phone} onChange={(v) => set("phone", v)} />
                {errors.phone && (
                  <span role="alert" style={{ display: "block", marginTop: 6, fontFamily: T.fontBody, fontSize: 12, color: "#e11d2e" }}>
                    {errors.phone}
                  </span>
                )}
              </div>
              <V2Field label="Company Name" htmlFor="v2c-company">
                <input id="v2c-company" type="text" placeholder="Acme Corp" value={form.company} disabled={sending}
                  style={ctrl("company")} {...focusProps("company")} onChange={(e) => set("company", e.target.value)} />
              </V2Field>
            </div>

            {/* ② Enquiry details */}
            {stepHead(2, "Enquiry Details")}
            <div className="row g-3" style={{ marginBottom: 22 }}>
              <V2Field label="Industry" htmlFor="v2c-industry">
                <select id="v2c-industry" value={form.industry} disabled={sending} style={{ ...ctrl("industry"), cursor: "pointer" }}
                  {...focusProps("industry")} onChange={(e) => set("industry", e.target.value)}>
                  <option value="">Select your industry…</option>
                  {INDUSTRIES_OPTS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </V2Field>
              <V2Field label="Current Challenge" htmlFor="v2c-challenge">
                <select id="v2c-challenge" value={form.currentChallenge} disabled={sending} style={{ ...ctrl("currentChallenge"), cursor: "pointer" }}
                  {...focusProps("currentChallenge")} onChange={(e) => set("currentChallenge", e.target.value)}>
                  <option value="">Select your biggest challenge…</option>
                  {CURRENT_CHALLENGES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </V2Field>
              {/* Choosing a service here reveals section ③ below */}
              <V2Field label="Service of Interest" htmlFor="v2c-service">
                <select id="v2c-service" value={form.service} disabled={sending} style={{ ...ctrl("service"), cursor: "pointer" }}
                  {...focusProps("service")} onChange={(e) => set("service", e.target.value)}>
                  <option value="">Select a service…</option>
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </V2Field>
              <V2Field label="Country" htmlFor="v2c-country">
                <select id="v2c-country" value={form.country} disabled={sending} style={{ ...ctrl("country"), cursor: "pointer" }}
                  {...focusProps("country")} onChange={(e) => set("country", e.target.value)}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </V2Field>
              <V2Field label="How did you hear about us?" htmlFor="v2c-hear" full>
                <select id="v2c-hear" value={form.hearAboutUs} disabled={sending} style={{ ...ctrl("hearAboutUs"), cursor: "pointer" }}
                  {...focusProps("hearAboutUs")} onChange={(e) => set("hearAboutUs", e.target.value)}>
                  <option value="">Select an option…</option>
                  {HEAR_ABOUT_US.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </V2Field>
              <V2Field label="Message" required htmlFor="v2c-message" full>
                <textarea id="v2c-message" rows={5} maxLength={1000}
                  placeholder="Tell us about your project, timeline, and goals…"
                  value={form.message} disabled={sending}
                  style={ctrl("message", { resize: "vertical", minHeight: 110 })}
                  {...focusProps("message")} onChange={(e) => set("message", e.target.value)} />
                {/* live character count — turns red near the 1000 limit */}
                <div style={{ textAlign: "right", marginTop: 5 }}>
                  <span style={{ fontFamily: T.fontBody, fontSize: 11, color: chars > 900 ? "#e11d2e" : "#5b6b7c", fontVariantNumeric: "tabular-nums" }}>
                    {chars} / 1000
                  </span>
                </div>
              </V2Field>
            </div>

            {/* ③ Dynamic per-service requirements — only when a mapped service is chosen */}
            {activeSection && (
              <>
                {stepHead(3, activeSection.label)}
                <div className="row g-3" style={{ marginBottom: 22 }}>
                  {activeSection.fields.map((f) => (
                    // multiselect fields take a full row; others are half-width
                    <div key={f.key} className={f.type === "multiselect" ? "col-12" : "col-md-6"}>
                      <label style={v2Label}>{f.label}{f.required && <span style={{ color: "#e11d2e" }}> *</span>}</label>
                      {renderServiceField(f)}
                      {errors[f.key] && (
                        <span role="alert" style={{ display: "block", marginTop: 6, fontFamily: T.fontBody, fontSize: 12, color: "#e11d2e" }}>
                          {errors[f.key]}
                        </span>
                      )}
                      {/* helper text listing what the chosen plan includes */}
                      {f.key === "planInterest" && form.planInterest && (
                        <div style={{ fontFamily: T.fontBody, fontSize: 11.5, color: "#5b6b7c", marginTop: 6, lineHeight: 1.5 }}>
                          {PLAN_INCLUDES[form.planInterest]}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* ERP also asks for a timeline (part of `tracked`, so it counts toward progress) */}
                  {form.service === "AI-Powered ERP" && (
                    <V2Field label="Timeline" htmlFor="v2c-timeline">
                      <select id="v2c-timeline" value={form.timeline} disabled={sending} style={{ ...ctrl("timeline"), cursor: "pointer" }}
                        {...focusProps("timeline")} onChange={(e) => set("timeline", e.target.value)}>
                        <option value="">Select timeline…</option>
                        {TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </V2Field>
                  )}
                </div>
              </>
            )}

            {/* Partner Course Listing — coupon/commission terms note, shown
                only for this service since it's what the note refers to. */}
            {form.service === "Partner Course Listing" && (
              <p style={{ fontFamily: T.fontBody, fontSize: 13, fontStyle: "italic", color: "#8a94a3", margin: "0 0 16px" }}>
                💬 Coupon codes, commission and revenue terms will be discussed mutually after we review your submission.
              </p>
            )}

            {/* submit + clear */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <V2SubmitBtn loading={sending} loadingLabel="Sending…">Send enquiry</V2SubmitBtn>
              {/* Clear button — resets the form and hides the deep-link banner */}
              <button type="button" disabled={sending}
                onClick={() => { setForm(EMPTY); setShowServiceBanner(false); }}
                style={{
                  minHeight: 50, padding: "0 22px",
                  background: "#fff", color: "#5b6b7c",
                  fontFamily: T.fontHead, fontSize: 14, fontWeight: 600,
                  border: `1.5px solid ${T.border}`, borderRadius: T.rx,
                  cursor: sending ? "not-allowed" : "pointer",
                }}>
                Clear
              </button>
            </div>

            <p style={{ fontFamily: T.fontBody, fontSize: 11.5, color: T.muted, marginTop: 16 }}>
              Your data is encrypted &amp; never shared ·{" "}
              <a href="tel:+971567867451" style={{ color: T.red, textDecoration: "none", fontWeight: 600 }}>+971 56 786 7451</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default XerxezContactForm;
