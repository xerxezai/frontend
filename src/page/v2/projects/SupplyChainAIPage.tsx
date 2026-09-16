// SupplyChainAIPage.tsx
// Purpose: /v2/project/supply-chain-ai — case study data for the Supply
//          Chain AI Optimization project, rendered through
//          <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /v2/project/supply-chain-ai)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { TrendingUp, Warehouse, Zap, LayoutDashboard, Database, Cloud, Code2, BarChart3 } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "Supply Chain AI Optimization | Case Study | XERXEZ",
  seoDesc: "How XERXEZ built AI-driven inventory optimization for a large manufacturer — 28% inventory cost reduction, 40% fewer stockouts, $14M working capital freed.",
  canonical: "/v2/project/supply-chain-ai",

  category: "AI & ERP",
  industry: "Manufacturing & Logistics",
  duration: "10 weeks",
  team: "5 engineers",
  keyMetricValue: "28%",
  keyMetricLabel: "Inventory savings",
  title: "Supply Chain AI Optimization",
  techStack: [
    { icon: BarChart3, name: "PySpark" },
    { icon: Database, name: "Snowflake" },
    { icon: Code2, name: "Python" },
    { icon: Cloud, name: "Azure" },
  ],

  challenge: "A large manufacturer with $50M+ in annual inventory spend had no real demand forecasting — procurement decisions were made on gut feel. That led to 28% excess inventory sitting in warehouses, frequent stockouts on the SKUs that actually mattered, and $14M tied up in slow-moving stock that could have been deployed elsewhere in the business.",

  solutionPoints: [
    { icon: TrendingUp, title: "AI Demand Forecasting", desc: "Trained on 4 years of sales and supply chain data for SKU-level accuracy." },
    { icon: Warehouse, title: "Real-Time Inventory Optimization", desc: "An optimization engine running live across 12 warehouses." },
    { icon: Zap, title: "Automated Procurement Triggers", desc: "Reorders fire automatically based on AI predictions, not gut feel." },
    { icon: LayoutDashboard, title: "Supply Chain Analytics", desc: "A shared dashboard for procurement and finance teams to work from." },
  ],

  results: [
    { value: "28%", label: "Inventory Cost Reduction" },
    { value: "40%", label: "Fewer Stockouts" },
    { value: "$14M", label: "Working Capital Freed" },
    { value: "80%", label: "SKUs Automated" },
  ],

  steps: [
    { title: "Data Foundation", desc: "Consolidated 4 years of sales, inventory and supplier data from 6 disconnected systems into Snowflake." },
    { title: "AI Model Development", desc: "Built demand forecasting models using PySpark with SKU-level accuracy across 12 warehouses." },
    { title: "Optimization Engine", desc: "Built real-time inventory optimization with automated reorder triggers and safety stock calculations." },
    { title: "Dashboard & Rollout", desc: "Deployed procurement dashboards and trained 30+ users across supply chain teams." },
  ],

  sidebar: [
    { label: "Category", value: "AI & ERP" },
    { label: "Industry", value: "Manufacturing & Logistics" },
    { label: "Duration", value: "10 weeks" },
    { label: "Team Size", value: "5 engineers" },
  ],

  prev: { title: "Digital Transformation Roadmap", href: "/v2/project/digital-transformation" },
  next: { title: "Kubernetes Security Hardening", href: "/v2/project/kubernetes-security" },
};

const SupplyChainAIPage = () => <ProjectCaseStudyTemplate data={data} />;

export default SupplyChainAIPage;
