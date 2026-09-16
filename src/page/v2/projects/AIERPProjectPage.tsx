// AIERPProjectPage.tsx
// Purpose: /v2/project/ai-erp-platform — case study data for the AI-Powered
//          ERP Platform project, rendered through <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /v2/project/ai-erp-platform)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { TrendingUp, Workflow, LayoutDashboard, Layers, Code2, Brain, Database, Cloud } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "AI-Powered ERP Platform | Case Study | XERXEZ",
  seoDesc: "How XERXEZ deployed an AI-native ERP platform for an engineering and industrial client — 40% cost reduction, 60% faster approvals, deployed in under 6 months.",
  canonical: "/v2/project/ai-erp-platform",

  category: "AI & ERP",
  industry: "Engineering & Industrial",
  duration: "6 months",
  team: "8 engineers",
  keyMetricValue: "40%",
  keyMetricLabel: "Cost reduction",
  title: "AI-Powered ERP Platform",
  techStack: [
    { icon: Code2, name: "Python" },
    { icon: Brain, name: "TensorFlow" },
    { icon: Database, name: "SAP" },
    { icon: Cloud, name: "Azure" },
  ],

  challenge: "The client was running on a legacy ERP that could no longer keep pace with the business. Purchase approvals moved through manual, multi-step chains, and large parts of daily operations still depended on Excel spreadsheets disconnected from any system of record. Finance, procurement, inventory and operations each worked in their own silo, so leadership had no real-time view of performance across departments — every decision waited on someone manually pulling numbers together.",

  solutionPoints: [
    { icon: TrendingUp, title: "AI Demand Forecasting", desc: "Machine learning models trained on historical and market data to guide planning." },
    { icon: Workflow, title: "Automated Procurement", desc: "Procurement workflows that remove manual approval bottlenecks." },
    { icon: LayoutDashboard, title: "Real-Time Dashboards", desc: "Live dashboards giving every department instant operational visibility." },
    { icon: Layers, title: "Multi-Module Integration", desc: "HR, CRM, Procurement, Sales and Finance unified on one platform." },
  ],

  results: [
    { value: "40%", label: "Cost Reduction" },
    { value: "60%", label: "Faster Approvals" },
    { value: "99.9%", label: "Uptime" },
    { value: "<6mo", label: "Deployed In" },
  ],

  steps: [
    { title: "Discovery & Mapping", desc: "Mapped all business processes and identified automation opportunities across 12 departments." },
    { title: "AI Model Development", desc: "Built demand forecasting and anomaly detection models trained on 3 years of operational data." },
    { title: "ERP Deployment", desc: "Deployed a modular ERP with HR, CRM, Procurement, Sales and Finance modules in parallel sprints." },
    { title: "Training & Handover", desc: "Trained 50+ staff, established SOPs, and handed over with full documentation and 6-month support." },
  ],

  sidebar: [
    { label: "Category", value: "AI & ERP" },
    { label: "Industry", value: "Engineering & Industrial" },
    { label: "Duration", value: "6 months" },
    { label: "Team Size", value: "8 engineers" },
  ],

  next: { title: "MLOps Pipeline Automation", href: "/v2/project/mlops-pipeline" },
};

const AIERPProjectPage = () => <ProjectCaseStudyTemplate data={data} />;

export default AIERPProjectPage;
