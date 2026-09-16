// EnterpriseSaaSPage.tsx
// Purpose: /v2/project/enterprise-saas — case study data for the Enterprise
//          SaaS Platform project, rendered through <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /v2/project/enterprise-saas)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { Shield, Gauge, Rocket, KeyRound, Code2, Server, Database, Cloud } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "Enterprise SaaS Platform | Case Study | XERXEZ",
  seoDesc: "How XERXEZ built a multi-tenant enterprise SaaS platform — 99.9% uptime, 15+ enterprise clients, auto-scaling infrastructure, 24-hour onboarding.",
  canonical: "/v2/project/enterprise-saas",

  category: "Software",
  industry: "Enterprise Technology",
  duration: "12 weeks",
  team: "7 engineers",
  keyMetricValue: "99.9%",
  keyMetricLabel: "Uptime",
  title: "Enterprise SaaS Platform",
  techStack: [
    { icon: Code2, name: "React" },
    { icon: Server, name: "Node.js" },
    { icon: Database, name: "PostgreSQL" },
    { icon: Cloud, name: "GCP" },
  ],

  challenge: "A growing enterprise needed a scalable, multi-tenant SaaS platform to serve its expanding client base. Its existing monolithic architecture couldn't handle multiple clients on shared infrastructure — every new client added risk, downtime was frequent, and there was no real tenant isolation between customer data. Growth had outpaced what the platform was ever built to handle.",

  solutionPoints: [
    { icon: Shield, title: "Multi-Tenant Architecture", desc: "Complete data isolation between tenants on shared infrastructure." },
    { icon: Gauge, title: "Auto-Scaling Infrastructure", desc: "GCP auto-scaling with load balancing to absorb traffic spikes." },
    { icon: Rocket, title: "Self-Service Onboarding", desc: "New enterprise clients go live in under 24 hours." },
    { icon: KeyRound, title: "Role-Based Access Control", desc: "Granular access control paired with built-in billing management." },
  ],

  results: [
    { value: "99.9%", label: "Uptime" },
    { value: "15+", label: "Enterprise Clients" },
    { value: "Auto", label: "Scaling" },
    { value: "24hr", label: "Onboarding" },
  ],

  steps: [
    { title: "Architecture Design", desc: "Designed multi-tenant architecture with complete data isolation and shared infrastructure." },
    { title: "Core Platform Build", desc: "Built tenant management, billing, authentication and role-based access control." },
    { title: "Auto-Scaling Infrastructure", desc: "Implemented GCP auto-scaling with load balancing for traffic spikes." },
    { title: "Enterprise Onboarding", desc: "Built self-service onboarding allowing new clients to go live in under 24 hours." },
  ],

  sidebar: [
    { label: "Category", value: "Software" },
    { label: "Industry", value: "Enterprise Technology" },
    { label: "Duration", value: "12 weeks" },
    { label: "Team Size", value: "7 engineers" },
  ],

  prev: { title: "Zero-Trust Cloud Infrastructure", href: "/v2/project/cloud-infrastructure" },
  next: { title: "Corporate AI Upskilling Program", href: "/v2/project/ai-training-program" },
};

const EnterpriseSaaSPage = () => <ProjectCaseStudyTemplate data={data} />;

export default EnterpriseSaaSPage;
