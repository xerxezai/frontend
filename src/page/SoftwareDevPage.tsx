import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";
import SEO from "../components/seo/SEO";

const heroStats = [
  { val: "Full-Stack", label: "Web, API & Mobile" },
  { val: "Agile",      label: "2-Week Sprints"    },
  { val: "Full IP",    label: "Ownership Transfer" },
];

const config: ServicePageConfig = {
  seoTitle: "Custom Software Development Company India, Dubai & Abu Dhabi — XERXEZ",
  seoDesc:  "Custom enterprise software development by XERXEZ. Web apps, APIs, integrations built for scale. Serving businesses across India, Dubai & Abu Dhabi UAE.",
  serviceName: "Software Development",
  badgeText: "Software Development · Custom Enterprise",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Enterprise Software Built<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        Precisely to Your Spec
      </em>
    </h1>
  ),
  description: "XERXEZ builds custom enterprise software across web, API, and mobile — engineered to solve real business problems, not software that forces your business to adapt to someone else's idea of how things should work.",

  heroStats: [
    { val: "Full-Stack", label: "Web, API & Mobile" },
    { val: "Agile",      label: "2-Week Sprints"    },
    { val: "Full IP",    label: "Ownership Transfer" },
  ],
  cascadeA: ["Custom Web Apps","REST & GraphQL API","Microservices","Event-Driven Architecture","UI/UX Design","Quality Assurance","DevOps Integration","Data Engineering","AI Features"],
  cascadeB: ["React · Vue · Next.js","Node.js · FastAPI · Django","PostgreSQL · MongoDB","Redis · Elasticsearch","Docker · Kubernetes","TypeScript · Python · Go","WebSockets · gRPC","Kafka · RabbitMQ","Jest · Playwright · Cypress"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-code"
      title="Software Development"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fas fa-layer-group", label: "React & Node.js" },
    { icon: "fas fa-python",      label: "Python & FastAPI" },
    { icon: "fas fa-cloud",       label: "AWS & Azure"      },
    { icon: "fas fa-mobile-alt",  label: "iOS & Android"    },
    { icon: "fas fa-code-branch", label: "Full IP Transfer" },
  ],

  featureLabel: "What We Build",
  featureTitle: (
    <>Full-Stack Software <span style={{ color: "#C9883A" }}>Engineered to Last</span></>
  ),
  features: [
    { icon: "fas fa-globe",         title: "Custom Web Applications",  desc: "Complex, data-intensive web platforms built with React, Vue, or Next.js frontends and Node.js, FastAPI, or Django backends. Designed to handle millions of users." },
    { icon: "fas fa-mobile-alt",    title: "Mobile Development",       desc: "Native iOS (Swift) and Android (Kotlin) applications, and cross-platform React Native or Flutter apps with offline support and push notification infrastructure." },
    { icon: "fas fa-plug",          title: "API Integration & Design", desc: "RESTful and GraphQL API design, third-party integration (Stripe, Salesforce, SAP, Oracle), and event-driven microservice communication with Kafka or RabbitMQ." },
    { icon: "fas fa-paint-brush",   title: "UI/UX Design",             desc: "Research-driven design that converts. Wireframing, prototyping, usability testing, and design system implementation — then handed to our own engineers to build." },
    { icon: "fas fa-vials",         title: "Quality Assurance",        desc: "Automated test suites with Jest, Playwright, and Cypress covering unit, integration, and end-to-end flows before every release ships." },
    { icon: "fas fa-code-branch",   title: "DevOps Integration",       desc: "CI/CD pipelines, containerised deployments, infrastructure as code, and observability wired in from day one — not bolted on at the end of the project." },
  ],

  processLabel: "How We Build",
  processTitle: (
    <>Discovery to <span style={{ color: "#C9883A" }}>Production in Sprints</span></>
  ),
  steps: [
    { no: "01", title: "Discovery & Scoping",    dur: "Week 1 – 2",  desc: "Requirements workshops, stakeholder interviews, competitive analysis, and technical feasibility study. Output: functional spec, architecture blueprint, and fixed-scope estimate." },
    { no: "02", title: "Design & Architecture",  dur: "Week 3 – 4",  desc: "UX wireframes and hi-fi designs reviewed with your team. Data model, API contracts, and system architecture documented and signed off before code starts." },
    { no: "03", title: "Agile Build Sprints",    dur: "Week 5 – 20", desc: "2-week sprint cycles with working, tested software at every milestone. You see real progress, not slide decks. Stakeholder demos at every sprint review." },
    { no: "04", title: "QA & Security Review",   dur: "Week 21 – 23", desc: "Full automated test suite, manual exploratory testing, penetration testing, and performance load testing under 3× expected peak traffic." },
    { no: "05", title: "Launch & Deployment",    dur: "Week 24",     desc: "Zero-downtime production deployment with feature flags, rollback capability, and real-user monitoring from minute one. We stay on-call for 30 days post-launch." },
    { no: "06", title: "Ongoing Support",        dur: "Ongoing",     desc: "SLA-backed support, security patching, performance tuning, and iterative feature releases long after initial delivery." },
  ],

  useCaseLabel: "Industries & Applications",
  useCaseTitle: (
    <>Software for <span style={{ color: "#C9883A" }}>Every Enterprise Domain</span></>
  ),
  useCases: [
    { icon: "fas fa-chart-bar",     label: "Business Intelligence",    desc: "Custom analytics dashboards, data warehouses, and executive reporting platforms that turn raw operational data into actionable business intelligence." },
    { icon: "fas fa-handshake",     label: "CRM & Sales Platforms",  desc: "Purpose-built CRM systems, sales automation tools, and pipeline management platforms designed around your specific sales process — not Salesforce's." },
    { icon: "fas fa-shipping-fast", label: "Logistics & Supply Chain", desc: "Route optimisation platforms, warehouse management systems, driver apps, and real-time tracking portals for logistics operations at any scale." },
    { icon: "fas fa-heartbeat",     label: "HealthTech & MedTech",     desc: "HIPAA-compliant patient portals, electronic health record integrations, medical device data platforms, and clinical trial management systems." },
    { icon: "fas fa-university",    label: "FinTech & Banking",        desc: "Payment platforms, lending systems, open banking integrations, regulatory reporting engines, and fraud detection applications." },
    { icon: "fas fa-graduation-cap",label: "EdTech & Learning",        desc: "LMS platforms, virtual classroom infrastructure, progress tracking dashboards, and adaptive learning systems for educational institutions and corporates." },
  ],

  faqTitle: "Common Software Development Questions",
  faqs: [
    { q: "Do you build with our existing tech stack or recommend a new one?", a: "We start by understanding your team's expertise, existing infrastructure, and long-term roadmap. If your stack is sound, we build with it. If there are strong reasons to change — performance, scalability, talent availability — we'll make that case with data, not preference. You always make the final call." },
    { q: "How do you handle changing requirements mid-project?", a: "We build with agile methodology precisely because requirements evolve. New requirements are added to the backlog, prioritised with your product owner, and scoped into upcoming sprints. We use a change request process that keeps budget and timeline transparent — nothing gets hidden in scope creep." },
    { q: "How do you keep a fixed-scope project on schedule?", a: "Accurate discovery, conservative buffer inclusion, and a weekly escalation process that surfaces blockers early rather than at the deadline. When we commit a date at kickoff, that estimate already accounts for the risks we can see." },
    { q: "Do you offer IP ownership transfer?", a: "All source code, design assets, documentation, and test suites are transferred to you at project completion. We retain no licence rights. Our contracts are explicit: full IP transfer is a standard clause, not an upgrade." },
    { q: "Can you augment our existing development team rather than take over?", a: "Yes. Team augmentation is one of our most popular engagement models. We embed senior engineers alongside your team, working in your sprints, using your tools, under your technical direction. Minimum engagement: 3 months, scaling up or down on 30 days' notice." },
  ],

  ctaTitle: (
    <>Ready to Build <span style={{ color: "#C9883A" }}>Software That Actually Ships?</span></>
  ),
  ctaDesc: "Tell us what you're trying to build. XERXEZ will scope it honestly, build it to spec, and deliver it on time — with the test coverage and documentation to prove it works.",
  ctaTags: ["Full IP Ownership", "Fixed-Scope Transparency", "Agile & Transparent"],

  painPoints: [
    "Watching a fixed-price project blow past its deadline with no clear reason why?",
    "Getting handed a codebase you don't fully own the rights to?",
    "Off-the-shelf software forcing your team to change how you actually work?",
    "A dev agency that disappears the moment the invoice is paid?",
  ],
};

const SoftwareDevPage = () => (
  <>
    <SEO
      title="Custom Software Development Company India, Dubai & Abu Dhabi — XERXEZ"
      description="Custom enterprise software development by XERXEZ. Web apps, APIs, integrations built for scale. Serving businesses across India, Dubai & Abu Dhabi UAE."
      canonical="/service/software-development"
      keywords="software development company India, custom software development company india, custom software UAE, software development Dubai, software development Abu Dhabi, enterprise software development, Xerxez Solutions"
    />
    <ServicePageTemplate config={config} />
  </>
);
export default SoftwareDevPage;
