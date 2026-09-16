// CloudInfraProjectPage.tsx
// Purpose: /v2/project/cloud-infrastructure — case study data for the
//          Zero-Trust Cloud Infrastructure project, rendered through
//          <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /v2/project/cloud-infrastructure)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { ShieldCheck, ClipboardCheck, Globe2, Eye, Layers, Cloud, Boxes, Lock } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "Zero-Trust Cloud Infrastructure | Case Study | XERXEZ",
  seoDesc: "How XERXEZ rebuilt an enterprise client's cloud infrastructure on zero-trust principles — 99.9% uptime, full compliance automation, SOC 2 Type II certified.",
  canonical: "/v2/project/cloud-infrastructure",

  category: "DevSecOps",
  industry: "Enterprise Technology",
  duration: "10 weeks",
  team: "6 engineers",
  keyMetricValue: "99.9%",
  keyMetricLabel: "Uptime achieved",
  title: "Zero-Trust Cloud Infrastructure",
  techStack: [
    { icon: Layers, name: "Terraform" },
    { icon: Cloud, name: "AWS" },
    { icon: Boxes, name: "Kubernetes" },
    { icon: Lock, name: "Vault" },
  ],

  challenge: "The client's infrastructure had grown up around perimeter-based security that no longer matched how the business actually operated. Internal traffic was implicitly trusted, compliance checks were run manually and couldn't keep pace with changing regulations, and outages were frequent enough that reliability had become a recurring concern for leadership. None of it was built for zero trust, and it showed.",

  solutionPoints: [
    { icon: ShieldCheck, title: "Zero-Trust Architecture", desc: "Identity-based access controls with no implicit trust." },
    { icon: ClipboardCheck, title: "Automated Compliance", desc: "Compliance monitoring built into every deployment." },
    { icon: Globe2, title: "Multi-Region Deployment", desc: "Infrastructure deployed and replicated across regions for resilience." },
    { icon: Eye, title: "24/7 Monitoring", desc: "Continuous visibility across all environments and workloads." },
  ],

  results: [
    { value: "99.9%", label: "Uptime" },
    { value: "Full", label: "Compliance Automated" },
    { value: "Zero", label: "Security Incidents" },
    { value: "SOC 2", label: "Type II Certified" },
  ],

  steps: [
    { title: "Security Audit", desc: "Conducted a full infrastructure security audit, identifying 47 critical vulnerabilities across 3 environments." },
    { title: "Zero-Trust Architecture", desc: "Implemented zero-trust network architecture with identity-based access controls and micro-segmentation." },
    { title: "Infrastructure as Code", desc: "Rebuilt the entire infrastructure using Terraform with automated compliance checks in the CI/CD pipeline." },
    { title: "Monitoring & Compliance", desc: "Deployed 24/7 security monitoring, automated compliance reporting and incident response playbooks." },
  ],

  sidebar: [
    { label: "Category", value: "DevSecOps" },
    { label: "Industry", value: "Enterprise Technology" },
    { label: "Duration", value: "10 weeks" },
    { label: "Team Size", value: "6 engineers" },
  ],

  prev: { title: "MLOps Pipeline Automation", href: "/v2/project/mlops-pipeline" },
  next: { title: "Enterprise SaaS Platform", href: "/v2/project/enterprise-saas" },
};

const CloudInfraProjectPage = () => <ProjectCaseStudyTemplate data={data} />;

export default CloudInfraProjectPage;
