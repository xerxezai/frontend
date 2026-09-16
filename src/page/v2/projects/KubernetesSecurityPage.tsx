// KubernetesSecurityPage.tsx
// Purpose: /v2/project/kubernetes-security — case study data for the
//          Kubernetes Security Hardening project, rendered through
//          <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /v2/project/kubernetes-security)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { ShieldAlert, ShieldCheck, FileCode2, Radar, Boxes, Flame, ScrollText, Cloud } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "Kubernetes Security Hardening | Case Study | XERXEZ",
  seoDesc: "How XERXEZ hardened Kubernetes clusters for a financial services firm and achieved SOC 2 Type II certification — 34 vulnerabilities resolved, zero incidents post-hardening.",
  canonical: "/v2/project/kubernetes-security",

  category: "DevSecOps",
  industry: "Financial Services",
  duration: "6 weeks",
  team: "4 engineers",
  keyMetricValue: "SOC 2",
  keyMetricLabel: "Type II certified",
  title: "Kubernetes Security Hardening",
  techStack: [
    { icon: Boxes, name: "Kubernetes" },
    { icon: Flame, name: "Falco" },
    { icon: ScrollText, name: "OPA" },
    { icon: Cloud, name: "AWS" },
  ],

  challenge: "A financial services firm running 200+ microservices across 3 cloud providers had critical Kubernetes security gaps. A third-party audit flagged 34 critical vulnerabilities, and SOC 2 Type II certification — required to close several enterprise contracts already on the table — was out of reach with the infrastructure as it stood.",

  solutionPoints: [
    { icon: ShieldAlert, title: "Full Kubernetes Security Audit", desc: "Across AWS, GCP and Azure clusters, leaving no environment unchecked." },
    { icon: ShieldCheck, title: "Zero-Trust Network Policies", desc: "Network policies and pod security standards enforced by default." },
    { icon: FileCode2, title: "Policy as Code", desc: "Open Policy Agent enforcing security standards automatically." },
    { icon: Radar, title: "Runtime Security Monitoring", desc: "Falco runtime monitoring with automated incident response." },
  ],

  results: [
    { value: "SOC 2", label: "Type II Certified" },
    { value: "34", label: "Vulnerabilities Resolved" },
    { value: "100%", label: "Policy-as-Code" },
    { value: "Zero", label: "Incidents Post-Hardening" },
  ],

  steps: [
    { title: "Security Audit", desc: "Full Kubernetes audit identifying 34 critical and 89 medium vulnerabilities across 3 cloud clusters." },
    { title: "Zero-Trust Implementation", desc: "Network policies, pod security standards and identity-based access controls across all clusters." },
    { title: "Policy as Code", desc: "OPA Gatekeeper with 47 custom policies enforcing security standards in the CI/CD pipeline." },
    { title: "Runtime Monitoring", desc: "Falco real-time threat detection with automated alerting and incident response playbooks." },
  ],

  sidebar: [
    { label: "Category", value: "DevSecOps" },
    { label: "Industry", value: "Financial Services" },
    { label: "Duration", value: "6 weeks" },
    { label: "Team Size", value: "4 engineers" },
  ],

  prev: { title: "Supply Chain AI Optimization", href: "/v2/project/supply-chain-ai" },
  next: { title: "Real-Time Fraud Detection System", href: "/v2/project/fraud-detection-mlops" },
};

const KubernetesSecurityPage = () => <ProjectCaseStudyTemplate data={data} />;

export default KubernetesSecurityPage;
