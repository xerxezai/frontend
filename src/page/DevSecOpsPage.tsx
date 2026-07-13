import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";
import SEO from "../components/seo/SEO";

const heroStats = [
  { val: "60%",   label: "Faster Deployments"  },
  { val: "0",     label: "Security Incidents"   },
  { val: "99.9%", label: "Pipeline Uptime"      },
  { val: "<2 hr", label: "Incident Response"    },
];

const config: ServicePageConfig = {
  seoTitle: "DevSecOps & MLOps Solutions India, Dubai & Abu Dhabi — XERXEZ",
  seoDesc:  "XERXEZ DevSecOps and MLOps solutions for enterprises in India, Dubai & Abu Dhabi UAE. Automate pipelines, secure deployments and scale ML models.",
  badgeText: "DevSecOps · Secure by Design",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Secure, Fast, Automated<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        DevSecOps Pipelines
      </em>
    </h1>
  ),
  description: "Ship faster without compromising security. XERXEZ integrates security at every stage of your CI/CD pipeline — from code commit to production — with automated scanning, zero-trust architecture, and compliance-ready audit trails.",

  heroStats: [
    { val: "60%",   label: "Faster Deployments"  },
    { val: "99.9%", label: "Pipeline Uptime"      },
    { val: "<2 hr", label: "Incident Response"    },
  ],
  cascadeA: ["CI/CD Automation","Zero-Trust","Security Scanning","GitOps Workflow","Container Orchestration","Compliance Automation","Infrastructure as Code","Secret Management","Policy Enforcement"],
  cascadeB: ["Jenkins · GitLab CI","SonarQube · Trivy","Falco · Prometheus","HashiCorp Vault","Kubernetes · Helm","Terraform · Ansible","OPA · Conftest","ArgoCD · Flux","SAST · DAST · SCA"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-shield-alt"
      title="DevSecOps Pipelines"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fas fa-certificate",     label: "ISO 27001"      },
    { icon: "fas fa-clipboard-check", label: "SOC 2 Type II"  },
    { icon: "fas fa-gavel",           label: "GDPR Compliant" },
    { icon: "fas fa-network-wired",   label: "Zero-Trust"     },
    { icon: "fas fa-shield-alt",      label: "NIST CSF"       },
  ],

  featureLabel: "Platform Capabilities",
  featureTitle: (
    <>Enterprise DevSecOps <span style={{ color: "#C9883A" }}>That Ships at Speed</span></>
  ),
  features: [
    { icon: "fas fa-code-branch",      title: "CI/CD Automation",         desc: "End-to-end pipeline automation from code push to production. Multi-branch workflows, parallel stages, canary and blue-green deployments built in from day one." },
    { icon: "fas fa-bug",              title: "Security Scanning",         desc: "Automated SAST, DAST, SCA, container image scanning, and secret detection at every commit. Block vulnerabilities before they reach production." },
    { icon: "fas fa-cubes",            title: "Container Orchestration",   desc: "Kubernetes-native delivery with Helm charts, namespace isolation, RBAC policies, network policies, and pod security standards enforced automatically." },
    { icon: "fas fa-bell",             title: "Monitoring & Alerting",     desc: "Full-stack observability with Prometheus, Grafana, and OpenTelemetry. Real-time anomaly detection with sub-2-minute alert response SLAs." },
    { icon: "fas fa-clipboard-list",   title: "Compliance Automation",     desc: "Policy-as-code with OPA and Conftest. Automated evidence collection for SOC 2, ISO 27001, and GDPR audits — zero manual effort at audit time." },
    { icon: "fas fa-code",             title: "GitOps Workflow",           desc: "Git as the single source of truth for infrastructure and application state. ArgoCD and Flux ensure your clusters always match your declared intent." },
  ],

  processLabel: "Delivery Process",
  processTitle: (
    <>From Audit to <span style={{ color: "#C9883A" }}>Production-Ready Pipeline</span></>
  ),
  steps: [
    { no: "01", title: "Pipeline Audit",           dur: "Week 1",      desc: "Map your current CI/CD toolchain, deployment frequency, lead time, change failure rate, and security posture. Output: gap analysis and roadmap." },
    { no: "02", title: "Security Architecture",    dur: "Week 2 – 3",  desc: "Design zero-trust network architecture, secret management strategy, RBAC model, and compliance control mapping against your target frameworks." },
    { no: "03", title: "Pipeline Build",           dur: "Week 4 – 8",  desc: "Implement CI/CD stages, security gates, container orchestration, and GitOps workflows. Parallel delivery in 2-week sprints with live demos." },
    { no: "04", title: "Security Hardening",       dur: "Week 9 – 10", desc: "Penetration testing, threat modelling, policy enforcement validation, and red-team exercise on the complete pipeline and infrastructure." },
    { no: "05", title: "Go-Live & Runbooks",       dur: "Week 11",     desc: "Production rollout with runbooks, incident response playbooks, and on-call rotation setup. 24/7 hypercare for the first 30 days." },
    { no: "06", title: "Continuous Improvement",   dur: "Ongoing",     desc: "Monthly pipeline performance reviews, CVE patching within 24 hours, and automatic policy updates as compliance frameworks evolve." },
  ],

  useCaseLabel: "Industries Served",
  useCaseTitle: (
    <>Built for <span style={{ color: "#C9883A" }}>Regulated & High-Velocity</span> Environments</>
  ),
  useCases: [
    { icon: "fas fa-landmark",      label: "Government & Defence",     desc: "Air-gapped pipeline deployments, security accreditation support, and classified workload isolation for public sector organisations." },
    { icon: "fas fa-heartbeat",     label: "Healthcare & Pharma",      desc: "HIPAA-compliant CI/CD pipelines with automated audit trails, access controls, and data residency enforcement." },
    { icon: "fas fa-university",    label: "Financial Services",       desc: "PCI-DSS and SOX-aligned pipelines with change management controls, four-eyes approval gates, and immutable audit logs." },
    { icon: "fas fa-shopping-cart", label: "E-Commerce & Retail",      desc: "High-frequency deployment pipelines that handle flash-sale traffic spikes with automated rollback on error rate breach." },
    { icon: "fas fa-industry",      label: "Manufacturing & OT",       desc: "Secure OT/IT convergence pipelines with network segmentation and firmware update automation for industrial control systems." },
    { icon: "fas fa-rocket",        label: "SaaS & Startups",          desc: "Rapid iteration pipelines with feature flags, A/B testing automation, and cost-optimised infrastructure that scales with growth." },
  ],

  faqTitle: "Common DevSecOps Questions",
  faqs: [
    { q: "Which CI/CD tools do you support?", a: "We are tool-agnostic and work with GitHub Actions, GitLab CI, Jenkins, CircleCI, Bitbucket Pipelines, Azure DevOps, and TeamCity. We recommend the right toolchain based on your team's existing skills and compliance requirements — not our commercial preferences." },
    { q: "Can you integrate into our existing monorepo without a full rewrite?", a: "Yes. Our standard engagement starts with an audit of your current repository structure, then incrementally adds security gates, build caching, and deployment stages. We never require a big-bang migration — every change ships alongside your live codebase." },
    { q: "How do you handle zero-day vulnerabilities?", a: "Our 24-hour CVE patching SLA covers base images, dependencies, and runtime environments. We maintain a software bill of materials (SBOM) for every build and trigger automated patching workflows the moment a new CVE is published that affects your stack." },
    { q: "What's the typical time to deploy a production-grade pipeline?", a: "For a greenfield environment, 8–11 weeks covers full CI/CD, security scanning, container orchestration, observability, and compliance automation. For teams augmenting an existing pipeline, the first security gates can be live within 2 weeks." },
    { q: "Do you offer managed DevSecOps as a service?", a: "Yes. After initial build, we offer a fully managed DevSecOps service with dedicated SRE support, 24/7 monitoring, incident response, CVE patching, and monthly reliability reports — so your engineering team can focus on product, not plumbing." },
  ],

  ctaTitle: (
    <>Ready to Ship <span style={{ color: "#C9883A" }}>Faster and More Securely?</span></>
  ),
  ctaDesc: "Whether you're starting from scratch or hardening an existing pipeline, XERXEZ delivers DevSecOps infrastructure that your security and compliance teams will sign off on — and your engineering team will actually enjoy using.",
  ctaTags: ["ISO 27001 Ready", "Zero-Trust Architecture", "24hr CVE Patching"],
};

const DevSecOpsPage = () => (
  <>
    <SEO
      title="DevSecOps & MLOps Solutions India, Dubai & Abu Dhabi — XERXEZ"
      description="XERXEZ DevSecOps and MLOps solutions for enterprises in India, Dubai & Abu Dhabi UAE. Automate pipelines, secure deployments and scale ML models."
      canonical="/service/devsecops-mlops-solutions"
      keywords="DevSecOps India, MLOps UAE, CI CD pipeline India, DevOps services Dubai, DevOps Abu Dhabi, DevSecOps company India, Xerxez Solutions"
    />
    <ServicePageTemplate config={config} />
  </>
);
export default DevSecOpsPage;
