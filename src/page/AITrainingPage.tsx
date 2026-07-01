import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";

const heroStats = [
  { val: "500+", label: "Professionals Trained" },
  { val: "95%",  label: "Satisfaction Rate"     },
  { val: "12+",  label: "Training Programs"     },
  { val: "F500", label: "Clients"               },
];

const config: ServicePageConfig = {
  seoTitle: "AI Training & Consulting | XERXEZ Enterprise Solutions",
  seoDesc:  "XERXEZ delivers enterprise AI training programs and strategic consulting — LLMs, MLOps, AI strategy, and hands-on labs for teams from 5 to 500.",
  badgeText: "AI Training & Consulting · Enterprise Programs",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Build Your Team's<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        AI Capability, Fast
      </em>
    </h1>
  ),
  description: "500+ enterprise professionals trained. From executives who need AI literacy to engineers deploying production LLM systems — XERXEZ designs and delivers training programs that create lasting capability, not just awareness.",

  heroStats: [
    { val: "500+", label: "Professionals Trained" },
    { val: "95%",  label: "Satisfaction Rate"     },
    { val: "12+",  label: "Training Programs"     },
  ],
  cascadeA: ["LLM Fundamentals","MLOps Pipelines","AI Strategy","RAG Architecture","Fine-Tuning","AI Ethics & Governance","Prompt Engineering","AI Product Management","Model Evaluation"],
  cascadeB: ["OpenAI · Anthropic · Gemini","HuggingFace · LangChain","PyTorch · TensorFlow","AWS SageMaker · Vertex AI","MLflow · DVC · W&B","Pinecone · Weaviate · FAISS","Kubernetes · Ray","FastAPI · Gradio","LlamaIndex · Haystack"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-chalkboard-teacher"
      title="AI Training & Consulting"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fas fa-brain",           label: "OpenAI Partner"         },
    { icon: "fas fa-award",           label: "AWS Certified"          },
    { icon: "fas fa-certificate",     label: "TensorFlow Certified"   },
    { icon: "fas fa-graduation-cap",  label: "CPD Accredited"         },
    { icon: "fas fa-shield-alt",      label: "ISO 27001"              },
  ],

  featureLabel: "Program Portfolio",
  featureTitle: (
    <>AI Training That <span style={{ color: "#C9883A" }}>Creates Real Capability</span></>
  ),
  features: [
    { icon: "fas fa-brain",           title: "LLM Fundamentals",      desc: "From transformer architecture to prompt engineering and RAG systems. Practical labs with real models from day one — no fluff, no slide-only sessions." },
    { icon: "fas fa-cogs",            title: "MLOps & Production AI",  desc: "Training, fine-tuning, deployment, monitoring, and retraining pipelines. Participants leave with a working MLOps stack they built during the program." },
    { icon: "fas fa-chess",           title: "AI Strategy for Leaders", desc: "Structured 2-day program for C-suite and senior leaders. AI opportunity mapping, build-vs-buy frameworks, governance, and board-level communication." },
    { icon: "fas fa-flask",           title: "Hands-On Labs",          desc: "Every program includes lab sessions in production-equivalent environments. Participants solve real problems — not synthetic toy datasets — with your own data where possible." },
    { icon: "fas fa-certificate",     title: "XERXEZ AI Certification", desc: "Role-specific certifications (AI Engineer, MLOps Practitioner, AI Leader) with 12-month validity. Recognised by 40+ enterprise organisations in our network." },
    { icon: "fas fa-sliders-h",       title: "Custom Programs",        desc: "Bespoke curriculum built around your team's existing knowledge, your organisation's AI priorities, and the specific tools and models you're using or evaluating." },
  ],

  processLabel: "How We Deliver",
  processTitle: (
    <>From Needs Analysis to <span style={{ color: "#C9883A" }}>Certified AI Teams</span></>
  ),
  steps: [
    { no: "01", title: "Capability Assessment",   dur: "Week 1",      desc: "Individual skills assessments across your team to map current AI knowledge, identify gaps, and personalise learning paths. No one sits through content they already know." },
    { no: "02", title: "Program Design",          dur: "Week 2",      desc: "Curriculum built around your assessment results, your organisation's AI roadmap, and the specific technologies you're prioritising. Signed off before delivery starts." },
    { no: "03", title: "Cohort Delivery",         dur: "Week 3 – 6",  desc: "Live instructor-led sessions (in-person or virtual) in cohorts of 8–25. Mix of concept delivery, worked examples, and hands-on lab exercises. Recorded for on-demand review." },
    { no: "04", title: "Applied Projects",        dur: "Week 5 – 7",  desc: "Participants apply their learning to a real internal use case under instructor guidance. Output: a working AI solution relevant to your business — not a demo project." },
    { no: "05", title: "Assessment & Certification", dur: "Week 8",   desc: "Online assessment, practical project review, and one-to-one feedback session. Certificates issued within 5 working days for participants who meet the standard." },
    { no: "06", title: "Ongoing Enablement",      dur: "Ongoing",     desc: "Monthly AI digest, quarterly advanced workshops, and access to our AI practitioner community. Your team stays current as the technology moves — and it moves fast." },
  ],

  useCaseLabel: "Who We Train",
  useCaseTitle: (
    <>Programs for <span style={{ color: "#C9883A" }}>Every Role & Seniority</span></>
  ),
  useCases: [
    { icon: "fas fa-user-tie",        label: "Executive Leadership",    desc: "AI literacy, strategic opportunity assessment, governance frameworks, and the questions every board member should be asking about AI investment." },
    { icon: "fas fa-code",            label: "Engineering Teams",       desc: "LLM integration, fine-tuning, RAG systems, MLOps pipelines, and AI security — turning software engineers into AI engineers." },
    { icon: "fas fa-chart-pie",       label: "Data Science Teams",      desc: "Production ML, modern LLM tooling, evaluation frameworks, and responsible AI practices for teams already working with machine learning." },
    { icon: "fas fa-briefcase",       label: "Product Managers",        desc: "AI product strategy, feature scoping, evaluation metrics, and how to work effectively with AI engineering teams to ship AI-powered products." },
    { icon: "fas fa-headset",         label: "Customer Operations",     desc: "AI-augmented customer service, copilot tools, quality assurance automation, and how to supervise AI without becoming dependent on it." },
    { icon: "fas fa-university",      label: "Regulated Industries",    desc: "AI governance, explainability, bias testing, and audit trail requirements for teams operating in financial services, healthcare, and public sector." },
  ],

  faqTitle: "Common AI Training Questions",
  faqs: [
    { q: "Do participants need prior machine learning experience?", a: "It depends on the program. Our executive and AI strategy programs require no technical background. Our LLM Fundamentals program requires basic Python. Our MLOps and AI Engineering programs require active software development experience. We'll recommend the right program — or custom progression — after a skills assessment." },
    { q: "Can training be delivered in-person at our offices?", a: "Yes. We deliver in-person programs across the UAE, India, and UK, and can travel globally for cohorts of 10 or more. Virtual delivery is equally effective for technical programs — our labs run entirely in cloud-based environments that require only a browser." },
    { q: "How do you customise a program for our specific AI stack?", a: "We start with a discovery session to understand the tools you use or are evaluating (OpenAI, AWS Bedrock, Azure OpenAI, Vertex AI, open-source models), your use cases, and your team's current workflow. The curriculum is then built around those specifics. Lab exercises use your actual tooling, not generic substitutes." },
    { q: "What ROI should we expect from AI training?", a: "Our clients typically measure ROI through reduction in time-to-deploy first AI features (average: 60% faster), reduction in external AI consulting spend (average: 45% in year 1), and internally-initiated AI projects that reach production (average: 3× higher 12 months after training vs. before)." },
    { q: "Can XERXEZ also help us implement what the team learns?", a: "Yes — and this is where the combination is most powerful. Many clients run our AI training program alongside an active XERXEZ development engagement, so participants are learning and immediately applying with support from our engineers. The knowledge sticks faster and the implementation quality is higher." },
  ],

  ctaTitle: (
    <>Ready to Make Your Team <span style={{ color: "#C9883A" }}>AI-Capable?</span></>
  ),
  ctaDesc: "Whether you're introducing AI to a non-technical leadership team or upskilling engineers to build production LLM systems, XERXEZ designs programs that create lasting capability — not checkbox compliance.",
  ctaTags: ["CPD Accredited", "Custom Curriculum", "Hands-On Labs"],
};

const AITrainingPage = () => <ServicePageTemplate config={config} />;
export default AITrainingPage;
