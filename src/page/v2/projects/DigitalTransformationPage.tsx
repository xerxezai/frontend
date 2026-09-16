// DigitalTransformationPage.tsx
// Purpose: /v2/project/digital-transformation — case study data for the
//          Digital Transformation Roadmap project, rendered through
//          <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /v2/project/digital-transformation)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { Map, ListChecks, Route, FileBarChart, Workflow, Layers, Cloud, BarChart3 } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "Digital Transformation Roadmap | Case Study | XERXEZ",
  seoDesc: "How XERXEZ built a 3-year digital transformation roadmap for a large enterprise — 38% cost reduction, 23 systems consolidated to 8, $2.4M in identified savings.",
  canonical: "/v2/project/digital-transformation",

  category: "Consulting",
  industry: "Enterprise",
  duration: "8 weeks",
  team: "3 consultants",
  keyMetricValue: "38%",
  keyMetricLabel: "Cost reduction",
  title: "Digital Transformation Roadmap",
  techStack: [
    { icon: Workflow, name: "Agile" },
    { icon: Layers, name: "TOGAF" },
    { icon: Cloud, name: "AWS" },
    { icon: BarChart3, name: "Power BI" },
  ],

  challenge: "A large enterprise was running 23 disconnected systems with manual processes spread across every department, and no unified digital strategy tying any of it together. Leadership knew the organization needed to modernize, but had no clear picture of where the biggest problems were, what to fix first, or how to justify the investment required to fix it.",

  solutionPoints: [
    { icon: Map, title: "Current State Mapping", desc: "Mapped all 23 systems and processes to see exactly where things stood." },
    { icon: ListChecks, title: "47 Improvement Opportunities", desc: "Ranked by business impact and implementation complexity." },
    { icon: Route, title: "Phased 3-Year Roadmap", desc: "A digital transformation roadmap sequenced into realistic phases." },
    { icon: FileBarChart, title: "Business Cases & ROI", desc: "Detailed business cases with ROI projections for each initiative." },
  ],

  results: [
    { value: "38%", label: "Cost Reduction" },
    { value: "23→8", label: "Systems Consolidated" },
    { value: "$2.4M", label: "Savings Identified" },
    { value: "3-Year", label: "Roadmap" },
  ],

  steps: [
    { title: "Current State Assessment", desc: "Mapped all 23 systems, processes and data flows across every department." },
    { title: "Opportunity Identification", desc: "Identified 47 improvements ranked by business impact and implementation complexity." },
    { title: "Roadmap Design", desc: "Designed a phased 3-year roadmap with quick wins, consolidations and AI adoption phases." },
    { title: "Business Case", desc: "Built detailed ROI projections, risk assessments and resource requirements for each initiative." },
  ],

  sidebar: [
    { label: "Category", value: "Consulting" },
    { label: "Industry", value: "Enterprise" },
    { label: "Duration", value: "8 weeks" },
    { label: "Team Size", value: "3 consultants" },
  ],

  prev: { title: "Corporate AI Upskilling Program", href: "/v2/project/ai-training-program" },
  next: { title: "Supply Chain AI Optimization", href: "/v2/project/supply-chain-ai" },
};

const DigitalTransformationPage = () => <ProjectCaseStudyTemplate data={data} />;

export default DigitalTransformationPage;
