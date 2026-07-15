import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";
import SEO from "../components/seo/SEO";

const heroStats = [
  { val: "Multi-Cloud",  label: "Architecture"     },
  { val: "FinOps",       label: "Cost Governance"  },
  { val: "<15 min",      label: "DR Failover"      },
];

const config: ServicePageConfig = {
  seoTitle: "Cloud Services & Storage Solutions India, Dubai & Abu Dhabi — XERXEZ",
  seoDesc:  "Enterprise cloud infrastructure, storage and migration by XERXEZ. Scalable, secure cloud solutions for businesses in India, Dubai & Abu Dhabi UAE.",
  serviceName: "Cloud Infrastructure",
  badgeText: "Cloud Infrastructure · Multi-Cloud",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Enterprise Cloud Built for<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        Resilience & Scale
      </em>
    </h1>
  ),
  description: "Architecture, migration, and managed operations across AWS, Azure, and Google Cloud. XERXEZ engineers for cost governance, high availability, and fast disaster recovery from the first design review.",

  heroStats: [
    { val: "Multi-Cloud",  label: "Architecture"     },
    { val: "FinOps",       label: "Cost Governance"  },
    { val: "<15 min",      label: "DR Failover"      },
  ],
  cascadeA: ["Multi-Cloud Architecture","Auto-Scaling","Cost Optimisation","Disaster Recovery","FinOps","Infrastructure as Code","Edge Computing","Serverless","Data Residency"],
  cascadeB: ["AWS · Azure · GCP","Terraform · Pulumi","Kubernetes · EKS","CloudFront · Akamai","Istio · Linkerd","Prometheus · Grafana","Vault · AWS KMS","Snowflake · BigQuery","CloudFormation · Bicep"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-cloud"
      title="Cloud Infrastructure"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fas fa-cloud",         label: "Multi-Cloud Architecture" },
    { icon: "fas fa-dollar-sign",   label: "FinOps Practice"          },
    { icon: "fas fa-code",          label: "Infrastructure as Code"   },
    { icon: "fas fa-redo",          label: "Zero-Downtime Migrations" },
    { icon: "fas fa-headset",       label: "24/7 Cloud Operations"    },
  ],

  featureLabel: "Platform Capabilities",
  featureTitle: (
    <>Infrastructure That <span style={{ color: "#C9883A" }}>Scales Without Limits</span></>
  ),
  features: [
    { icon: "fas fa-cloud",         title: "Multi-Cloud Architecture",  desc: "Architect resilient, vendor-agnostic infrastructure across AWS, Azure, and GCP. Avoid lock-in while leveraging best-of-breed services from each provider." },
    { icon: "fas fa-expand-arrows-alt", title: "Auto-Scaling & Elasticity", desc: "Intelligent horizontal and vertical scaling that responds to real traffic patterns. Handle 10× traffic spikes without pre-provisioning idle capacity." },
    { icon: "fas fa-dollar-sign",   title: "Cost Optimisation",         desc: "FinOps practice with reserved instance planning, spot instance automation, right-sizing, and tagging governance so every dollar of cloud spend is visible and accountable." },
    { icon: "fas fa-redo",          title: "Disaster Recovery",         desc: "Multi-region active-active and active-passive DR configurations. Automated failover, tested quarterly, with RTO under 15 minutes and RPO under 60 seconds." },
    { icon: "fas fa-shield-alt",    title: "Security & Compliance",     desc: "Cloud security posture management, encryption at rest and in transit, IAM least-privilege enforcement, and continuous compliance scanning against CIS benchmarks." },
    { icon: "fas fa-chart-line",    title: "Performance Monitoring",    desc: "Full-stack observability with Prometheus, Grafana, CloudWatch, and OpenTelemetry. AI-driven anomaly detection flags issues before they impact users." },
  ],

  processLabel: "Delivery Process",
  processTitle: (
    <>From Assessment to <span style={{ color: "#C9883A" }}>Optimised Cloud Operations</span></>
  ),
  steps: [
    { no: "01", title: "Cloud Assessment",       dur: "Week 1 – 2",  desc: "Comprehensive audit of your current infrastructure, spend, security posture, and workload characteristics. Output: cloud strategy and migration roadmap." },
    { no: "02", title: "Architecture Design",    dur: "Week 3 – 4",  desc: "Design target-state multi-cloud architecture with network topology, security controls, DR strategy, and cost model. Sign-off before build begins." },
    { no: "03", title: "Foundation Build",       dur: "Week 5 – 8",  desc: "Deploy landing zone, identity foundation, network architecture, and security baseline with Infrastructure as Code. All resources version-controlled." },
    { no: "04", title: "Workload Migration",     dur: "Week 9 – 16", desc: "Lift-and-shift, re-platform, or refactor workloads based on the 6-Rs framework. Zero-downtime migrations with automated rollback capability." },
    { no: "05", title: "Optimisation & Tuning",  dur: "Week 17 – 20", desc: "Performance testing, cost optimisation sprint, auto-scaling validation, and DR testing. Achieve target uptime and cost benchmarks before handover." },
    { no: "06", title: "Managed Operations",     dur: "Ongoing",     desc: "24/7 cloud operations — monitoring, patching, capacity planning, cost reporting, and quarterly architecture reviews. Your cloud improves continuously." },
  ],

  useCaseLabel: "Industries Served",
  useCaseTitle: (
    <>Cloud Infrastructure for <span style={{ color: "#C9883A" }}>Every Enterprise Sector</span></>
  ),
  useCases: [
    { icon: "fas fa-landmark",        label: "Government & Public Sector",  desc: "Sovereign cloud deployments with data residency guarantees, FedRAMP/GovCloud architecture, and full audit trail for regulatory compliance." },
    { icon: "fas fa-heartbeat",       label: "Healthcare & Life Sciences",  desc: "HIPAA-compliant cloud environments with PHI encryption, access controls, and automated compliance evidence for healthcare workloads." },
    { icon: "fas fa-university",      label: "Financial Services & FinTech", desc: "PCI-DSS, DORA, and Basel III-aligned cloud infrastructure with real-time transaction processing and sub-millisecond latency guarantees." },
    { icon: "fas fa-shopping-cart",   label: "Retail & E-Commerce",         desc: "Elastic infrastructure that handles seasonal and flash-sale traffic spikes without pre-warming — pay for what you use, only when you use it." },
    { icon: "fas fa-film",            label: "Media & Entertainment",        desc: "Global CDN architecture for low-latency content delivery worldwide, with adaptive bitrate streaming support." },
    { icon: "fas fa-industry",        label: "Manufacturing & IoT",         desc: "Edge computing deployments that process sensor data locally, reducing cloud bandwidth costs and latency for real-time OT workloads." },
  ],

  faqTitle: "Common Cloud Infrastructure Questions",
  faqs: [
    { q: "Can you migrate our on-premise workloads without downtime?", a: "Yes. We use a proven zero-downtime migration methodology: replicate data to the cloud while the source system stays live, validate in parallel, then cut over during a low-traffic window with automated rollback if anything deviates from expected performance." },
    { q: "How do you typically reduce cloud costs?", a: "The biggest gains come from right-sizing over-provisioned instances, moving stable workloads to reserved or savings plan pricing, replacing always-on test environments with on-demand automation, and eliminating orphaned resources. We implement FinOps tagging governance so costs are visible and accountable at the team level." },
    { q: "Are you vendor-agnostic or do you prefer a specific cloud?", a: "We are genuinely vendor-agnostic. We have hands-on operational experience across AWS, Azure, and GCP and select the right provider — or mix of providers — based on your workload characteristics, compliance requirements, existing vendor relationships, and data residency requirements. We have no commercial incentive to prefer one over another." },
    { q: "What's your disaster recovery approach for high-availability workloads?", a: "We design active-active multi-region architectures for workloads that can't tolerate extended outages. Read replicas and asynchronous replication handle data consistency, while Route 53 or Azure Traffic Manager routes traffic automatically on health check failure. DR tests are run quarterly and results reported to your team." },
    { q: "Do you manage ongoing operations or just design and hand over?", a: "We offer both. Some clients want a hand-off after build, and we provide full documentation, runbooks, and training. Others prefer our 24/7 managed cloud operations service, which includes monitoring, patching, incident response, and proactive capacity planning with a dedicated cloud engineer team." },
  ],

  ctaTitle: (
    <>Ready to <span style={{ color: "#C9883A" }}>Optimise Your Cloud Estate?</span></>
  ),
  ctaDesc: "Whether you're migrating from on-premise, consolidating multi-cloud spend, or architecting for your next phase of growth, XERXEZ delivers cloud infrastructure that performs, scales, and costs less than you expect.",
  ctaTags: ["Multi-Cloud Expertise", "Zero Vendor Lock-In", "FinOps Practice"],

  painPoints: [
    "Opening the monthly cloud bill and not recognising half the line items?",
    "Over-provisioned instances running 24/7 for traffic that only spikes twice a year?",
    "No real disaster recovery plan beyond \"we have backups somewhere\"?",
    "Locked into one provider's pricing with no leverage to negotiate or migrate?",
  ],
};

const CloudPage = () => (
  <>
    <SEO
      title="Cloud Services & Storage Solutions India, Dubai & Abu Dhabi — XERXEZ"
      description="Enterprise cloud infrastructure, storage and migration by XERXEZ. Scalable, secure cloud solutions for businesses in India, Dubai & Abu Dhabi UAE."
      canonical="/service/cloud-service-storage"
      keywords="cloud services India, cloud storage UAE, cloud services Abu Dhabi, enterprise cloud solutions, cloud migration India, cloud infrastructure Dubai, Xerxez Solutions"
    />
    <ServicePageTemplate config={config} />
  </>
);
export default CloudPage;
