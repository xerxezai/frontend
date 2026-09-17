// AITrainingPage.tsx
// Purpose: /project/ai-training-program — case study data for the
//          Corporate AI Upskilling Program, rendered through
//          <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /project/ai-training-program)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { BookOpen, Layers3, FlaskConical, Users2, Code2, Notebook, Link2, Sparkles } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "Corporate AI Upskilling Program | Case Study | XERXEZ",
  seoDesc: "How XERXEZ trained 75+ engineers in applied AI/ML — 90% completion rate, 12 internal AI projects launched, 3 engineers promoted to AI leads.",
  canonical: "/project/ai-training-program",

  category: "AI Training",
  industry: "Corporate Learning",
  duration: "16 weeks",
  team: "4 trainers",
  keyMetricValue: "75+",
  keyMetricLabel: "Engineers trained",
  title: "Corporate AI Upskilling Program",
  techStack: [
    { icon: Code2, name: "Python" },
    { icon: Notebook, name: "Jupyter" },
    { icon: Link2, name: "LangChain" },
    { icon: Sparkles, name: "OpenAI" },
  ],

  challenge: "A large enterprise had 75+ engineers with effectively zero AI/ML capability, while competitors were already shipping AI-powered features. Leadership had tried generic online courses before, but engineers finished them without being able to apply anything to real work. What the business needed wasn't more theory — it was practical, hands-on upskilling tied directly to the company's own systems and data.",

  solutionPoints: [
    { icon: BookOpen, title: "Custom Curriculum", desc: "Built on the company's own data and real use cases, not generic examples." },
    { icon: Layers3, title: "3 Learning Tracks", desc: "Beginner, intermediate and advanced tracks matched to existing skill levels." },
    { icon: FlaskConical, title: "Hands-On Labs", desc: "Real project delivery during training, not slides-only theory." },
    { icon: Users2, title: "Post-Training Mentorship", desc: "Ongoing mentorship across 12 internal AI projects after the program ended." },
  ],

  results: [
    { value: "75+", label: "Engineers Trained" },
    { value: "90%", label: "Completion Rate" },
    { value: "12", label: "AI Projects Launched" },
    { value: "3", label: "Promoted to AI Leads" },
  ],

  steps: [
    { title: "Skills Assessment", desc: "Assessed 75+ engineers and designed 3 learning tracks based on current skill levels." },
    { title: "Curriculum Design", desc: "Built a custom curriculum using the company's own data — immediately applicable, not theoretical." },
    { title: "Hands-On Delivery", desc: "16 weeks of live sessions, labs and real projects — no PowerPoint-only theory." },
    { title: "AI Project Launch", desc: "Supported 12 internal AI projects with technical mentorship during and after the program." },
  ],

  sidebar: [
    { label: "Category", value: "AI Training" },
    { label: "Industry", value: "Corporate Learning" },
    { label: "Duration", value: "16 weeks" },
    { label: "Team Size", value: "4 trainers" },
  ],

  prev: { title: "Enterprise SaaS Platform", href: "/project/enterprise-saas" },
  next: { title: "Digital Transformation Roadmap", href: "/project/digital-transformation" },
};

const AITrainingPage = () => <ProjectCaseStudyTemplate data={data} />;

export default AITrainingPage;
