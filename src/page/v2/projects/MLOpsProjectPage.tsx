// MLOpsProjectPage.tsx
// Purpose: /v2/project/mlops-pipeline — case study data for the MLOps
//          Pipeline Automation project, rendered through
//          <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /v2/project/mlops-pipeline)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { Workflow, GitBranch, Activity, RefreshCw, Boxes, Code2, Cloud } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "MLOps Pipeline Automation | Case Study | XERXEZ",
  seoDesc: "How XERXEZ automated model deployment for a financial services client — 95% faster deployments, zero manual steps, models in production in hours.",
  canonical: "/v2/project/mlops-pipeline",

  category: "MLOps",
  industry: "Financial Services",
  duration: "8 weeks",
  team: "5 engineers",
  keyMetricValue: "95%",
  keyMetricLabel: "Faster deployments",
  title: "MLOps Pipeline Automation",
  techStack: [
    { icon: Boxes, name: "Kubernetes" },
    { icon: GitBranch, name: "MLflow" },
    { icon: Code2, name: "Python" },
    { icon: Cloud, name: "AWS" },
  ],

  challenge: "The client's data science team was building models faster than their infrastructure could ship them. Every deployment was a manual process — no consistent versioning, no monitoring once a model reached production, and no way to know it was degrading until something downstream broke. That combination made failures frequent, and each one took engineering time away from building the next model.",

  solutionPoints: [
    { icon: Workflow, title: "CI/CD for ML", desc: "Pipeline that builds, tests and deploys models on every change." },
    { icon: GitBranch, title: "Model Versioning", desc: "Every model version tracked, tagged and fully reproducible." },
    { icon: Activity, title: "Drift Detection", desc: "Real-time monitoring flags degrading model performance early." },
    { icon: RefreshCw, title: "Auto-Retraining", desc: "Models retrain automatically when performance drops below threshold." },
  ],

  results: [
    { value: "95%", label: "Faster Deployments" },
    { value: "Zero", label: "Manual Deployment Steps" },
    { value: "Automated", label: "Model Monitoring" },
    { value: "Hours", label: "Time to Production" },
  ],

  steps: [
    { title: "Pipeline Audit", desc: "Reviewed the existing model deployment process and identified 14 manual steps causing delays and failures." },
    { title: "CI/CD Setup", desc: "Built an automated training, testing and deployment pipeline with full model versioning using MLflow." },
    { title: "Monitoring & Drift Detection", desc: "Implemented real-time model performance monitoring with automated drift alerts." },
    { title: "Auto-Retraining", desc: "Built automated retraining triggers that fire when model performance drops below defined thresholds." },
  ],

  sidebar: [
    { label: "Category", value: "MLOps" },
    { label: "Industry", value: "Financial Services" },
    { label: "Duration", value: "8 weeks" },
    { label: "Team Size", value: "5 engineers" },
  ],

  prev: { title: "AI-Powered ERP Platform", href: "/v2/project/ai-erp-platform" },
  next: { title: "Zero-Trust Cloud Infrastructure", href: "/v2/project/cloud-infrastructure" },
};

const MLOpsProjectPage = () => <ProjectCaseStudyTemplate data={data} />;

export default MLOpsProjectPage;
