import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";

const heroStats = [
  { val: "50+", label: "Clients Served"     },
  { val: "$10M+",label: "Cost Saved"         },
  { val: "5+",   label: "Industries"         },
  { val: "80%",  label: "Client Retention"   },
];

const config: ServicePageConfig = {
  seoTitle: "Software Consulting | XERXEZ Enterprise Solutions",
  seoDesc:  "XERXEZ provides enterprise software consulting — technology audits, architecture review, digital transformation, and team augmentation for 50+ organisations globally.",
  badgeText: "Software Consulting · Strategic Advisory",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Honest Technology Advice<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        From Engineers, Not Salespeople
      </em>
    </h1>
  ),
  description: "$10M+ in client cost savings identified and delivered. 50+ organisations advised on technology strategy, architecture, vendor selection, and digital transformation. XERXEZ consulting tells you what you need to hear — not what you want to hear.",

  heroStats: [
    { val: "50+", label: "Clients Served"  },
    { val: "$10M+",label: "Cost Saved"      },
    { val: "80%",  label: "Client Retention"},
  ],
  cascadeA: ["Technology Audit","Architecture Review","Digital Transformation","Vendor Selection","Team Augmentation","Roadmap Planning","Technical Due Diligence","CTO Advisory","Operating Model Design"],
  cascadeB: ["Agile · SAFe · Scrum","Cloud-Native · Serverless","Microservices · DDD","Event-Driven Architecture","API Strategy · OpenAPI","SRE · DevOps · Platform Eng","Data Architecture · Lakehouse","AI/ML Strategy · MLOps","FinOps · Cost Governance"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-comments"
      title="Software Consulting"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fas fa-certificate",     label: "ISO 27001"       },
    { icon: "fas fa-cogs",            label: "Agile & SAFe"    },
    { icon: "fas fa-code-branch",     label: "DevOps Certified" },
    { icon: "fas fa-cloud",           label: "Cloud-Native"    },
    { icon: "fas fa-shield-alt",      label: "SOC 2 Aligned"   },
  ],

  featureLabel: "Consulting Services",
  featureTitle: (
    <>Strategic Advice Backed by <span style={{ color: "#C9883A" }}>Engineers Who Build It</span></>
  ),
  features: [
    { icon: "fas fa-search",          title: "Technology Audit",          desc: "Comprehensive review of your technology stack, architecture, engineering practices, and team capabilities. Output: prioritised remediation plan with effort and impact estimates." },
    { icon: "fas fa-sitemap",         title: "Architecture Review",       desc: "Independent assessment of your system architecture against scalability, reliability, security, and cost-efficiency targets. We identify hidden risk before it becomes an incident." },
    { icon: "fas fa-digital-tachograph", title: "Digital Transformation", desc: "End-to-end transformation advisory: legacy modernisation roadmaps, cloud migration strategy, process automation prioritisation, and change management planning." },
    { icon: "fas fa-users",           title: "Team Augmentation",         desc: "Senior engineers embedded in your team — working in your sprints, using your tools, under your technical leadership. Available within 2 weeks. Scale up or down on 30 days' notice." },
    { icon: "fas fa-balance-scale",   title: "Vendor Selection",          desc: "Objective vendor and technology selection using structured evaluation frameworks. We have no commercial relationships with vendors — our recommendation is based solely on your requirements." },
    { icon: "fas fa-road",            title: "Technology Roadmap",        desc: "12–36 month technology roadmap aligned to your business goals, budget constraints, and team capacity. Reviewed and updated quarterly with your leadership team." },
  ],

  processLabel: "Engagement Model",
  processTitle: (
    <>From First Conversation to <span style={{ color: "#C9883A" }}>Measurable Change</span></>
  ),
  steps: [
    { no: "01", title: "Initial Briefing",         dur: "Week 1",      desc: "Structured discovery session to understand your business context, technology environment, current challenges, and goals. No templates — every engagement starts fresh." },
    { no: "02", title: "Deep Assessment",          dur: "Week 2 – 3",  desc: "Code review, architecture interviews with your technical team, infrastructure review, and data analysis. We go as deep as necessary to give you an accurate picture." },
    { no: "03", title: "Findings Synthesis",       dur: "Week 4",      desc: "Pattern identification, root cause analysis, and prioritisation of findings by business impact and implementation effort. We draft our recommendations and stress-test them internally." },
    { no: "04", title: "Recommendations Delivery", dur: "Week 5",      desc: "Board or senior leadership presentation of findings and recommendations, followed by a detailed working session with your technical team to explore implementation options." },
    { no: "05", title: "Implementation Support",   dur: "Week 6 – 12", desc: "Optional hands-on support implementing the highest-priority recommendations: architecture changes, team process improvements, tooling selection, and skills development." },
    { no: "06", title: "Ongoing Advisory",         dur: "Ongoing",     desc: "Retained CTO-advisory service: monthly architecture reviews, vendor evaluation support, technical recruitment assessment, and as-needed escalation for major technology decisions." },
  ],

  useCaseLabel: "When Clients Call Us",
  useCaseTitle: (
    <>The Moments That <span style={{ color: "#C9883A" }}>Demand Independent Advice</span></>
  ),
  useCases: [
    { icon: "fas fa-exclamation-triangle", label: "System Is Falling Over", desc: "Your platform is struggling under load, experiencing regular incidents, or costing more than it should. We diagnose root causes, not symptoms, and fix the architecture — not just the alerts." },
    { icon: "fas fa-dollar-sign",          label: "Cloud Bill Is Too High",  desc: "Engineering teams are often shocked when we show them what's consuming cloud budget. We identify and eliminate waste, right-size infrastructure, and implement FinOps governance." },
    { icon: "fas fa-code",                 label: "Legacy Modernisation",    desc: "A monolith that blocks deployment velocity, a database migration you've been avoiding, or a codebase no-one understands. We map the risk and define a safe migration path." },
    { icon: "fas fa-handshake",            label: "M&A Technical Due Diligence", desc: "Technical assessment of acquisition targets — code quality, architecture risk, team capability, and technical debt quantification before you sign the term sheet." },
    { icon: "fas fa-search",               label: "Vendor Evaluation",       desc: "Choosing between Salesforce and HubSpot, SAP and Oracle, or AWS and Azure. We run structured evaluations with objective scoring frameworks and no vendor relationships to protect." },
    { icon: "fas fa-rocket",               label: "Scaling for Growth",      desc: "Moving from 10K to 1M users, entering a new market, or preparing for a funding round that requires your platform to handle 10× the current load. We build the technical case." },
  ],

  faqTitle: "Common Consulting Questions",
  faqs: [
    { q: "How is XERXEZ consulting different from a large consultancy?", a: "Three differences: (1) Our consultants are practising engineers who still write code — our advice is grounded in what actually works in production. (2) We have no vendor affiliations, so our technology recommendations are independent. (3) We are small enough to put senior people on your engagement throughout — not partners on day one, juniors thereafter." },
    { q: "What does a technology audit typically cover?", a: "A full audit covers: codebase quality (complexity, test coverage, dependency health), architecture (scalability, resilience, security posture), engineering practices (deployment frequency, change failure rate, incident response), team capability, and tooling. We assess against industry benchmarks and your specific growth trajectory." },
    { q: "Can you provide an interim CTO or technical director?", a: "Yes. We provide experienced interim CTOs and VPs of Engineering for organisations between permanent hires, during a period of rapid growth, or while building out the leadership team. Minimum engagement: 3 months. They operate as a full member of your senior leadership team." },
    { q: "How do you ensure your recommendations are actually implemented?", a: "We offer implementation support alongside all advisory engagements — embedding engineers or working alongside your team to execute the highest-priority recommendations. We also build implementation roadmaps that are realistic about your team's capacity, so the plan doesn't sit on a shelf." },
    { q: "What does 80% client retention actually mean for consulting?", a: "It means 80% of clients who engage us for a defined scope return for a follow-on engagement within 12 months. For us, this is the primary quality metric — client satisfaction surveys are easy to game; repeat business is not." },
  ],

  ctaTitle: (
    <>Ready for Technology Advice <span style={{ color: "#C9883A" }}>You Can Actually Trust?</span></>
  ),
  ctaDesc: "Whether you need a full technology audit, an architecture review, interim engineering leadership, or a vendor evaluation, XERXEZ gives you honest advice from engineers with no commercial agenda.",
  ctaTags: ["No Vendor Affiliations", "Engineers Who Build", "80% Client Retention"],
};

const ConsultingPage = () => <ServicePageTemplate config={config} />;
export default ConsultingPage;
