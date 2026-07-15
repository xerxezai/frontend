import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";
import SEO from "../components/seo/SEO";

const heroStats = [
  { val: "99.9%",       label: "Uptime SLA"     },
  { val: "Low-Latency", label: "Global CDN"     },
  { val: "24/7",        label: "Managed Support" },
];

const config: ServicePageConfig = {
  seoTitle: "Web & Mobile Hosting India, Dubai & Abu Dhabi UAE — XERXEZ",
  seoDesc:  "Reliable, secure web and mobile hosting by XERXEZ. 99.9% uptime guaranteed for enterprises in India, Dubai & Abu Dhabi UAE.",
  serviceName: "Web & Mobile Hosting",
  badgeText: "Web & Mobile Hosting · Managed Infrastructure",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Hosting That Never<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        Lets Your Users Down
      </em>
    </h1>
  ),
  description: "99.9% uptime SLA backed by financial credits. Low-latency delivery via our global CDN network. Auto-scaling that handles sudden traffic spikes without a pager alert. Managed hosting so your team focuses on product, not infrastructure.",

  heroStats: [
    { val: "99.9%",       label: "Uptime SLA"      },
    { val: "Low-Latency", label: "Global CDN"      },
    { val: "24/7",        label: "Managed Support" },
  ],
  cascadeA: ["Managed Hosting","CDN Integration","SSL & TLS","Auto-Scaling","DDoS Protection","Load Balancing","Edge Computing","Serverless Functions","Database Hosting"],
  cascadeB: ["AWS · Azure · GCP","Cloudflare · Fastly","Nginx · Caddy","Let's Encrypt · DigiCert","Kubernetes · EKS","Redis · PostgreSQL","Terraform · Ansible","Prometheus · Grafana","PagerDuty · OpsGenie"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-server"
      title="Web & Mobile Hosting"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fas fa-cloud",       label: "Multi-Cloud Hosting"        },
    { icon: "fas fa-globe",       label: "Global CDN"                 },
    { icon: "fas fa-lock",        label: "Let's Encrypt"              },
    { icon: "fas fa-file-invoice-dollar", label: "Financial-Credit Backed SLA" },
    { icon: "fas fa-headset",     label: "24/7 Monitoring"            },
  ],

  featureLabel: "Platform Features",
  featureTitle: (
    <>Infrastructure That <span style={{ color: "#C9883A" }}>Runs Without Babysitting</span></>
  ),
  features: [
    { icon: "fas fa-server",        title: "Managed Hosting",          desc: "Fully managed cloud hosting on AWS, Azure, or GCP. We handle OS patching, security updates, database maintenance, and capacity planning — you ship code." },
    { icon: "fas fa-globe",         title: "Global CDN Integration",   desc: "Cloudflare or Fastly CDN integration serving your assets from edge locations worldwide, for consistently low-latency delivery wherever your users are." },
    { icon: "fas fa-lock",          title: "SSL & Security",           desc: "Automatic SSL certificate issuance and renewal via Let's Encrypt. HTTPS enforced on all endpoints. DDoS protection, WAF rules, and rate limiting included." },
    { icon: "fas fa-expand-arrows-alt", title: "Auto-Scaling",         desc: "Kubernetes-based horizontal pod autoscaling that responds to real traffic within 30 seconds. Handle flash sales, marketing campaigns, and viral moments without pre-warming." },
    { icon: "fas fa-redo",          title: "Backup & Recovery",        desc: "Automated daily backups with 30-day retention. Point-in-time recovery for databases. One-click restore tested monthly. RTO under 15 minutes guaranteed." },
    { icon: "fas fa-chart-line",    title: "Performance Monitoring",   desc: "Real-user monitoring, synthetic uptime checks from 20 global locations, Core Web Vitals tracking, and anomaly-based alerting before users notice an issue." },
  ],

  processLabel: "Onboarding Process",
  processTitle: (
    <>From Legacy Hosting to <span style={{ color: "#C9883A" }}>Zero-Worry Infrastructure</span></>
  ),
  steps: [
    { no: "01", title: "Infrastructure Audit",      dur: "Week 1",      desc: "Review your current hosting setup, traffic patterns, performance bottlenecks, and costs. Output: hosting strategy and migration plan with zero-downtime cutover approach." },
    { no: "02", title: "Environment Provisioning",  dur: "Week 2",      desc: "Deploy staging and production environments with Infrastructure as Code. Configure CDN, SSL, auto-scaling policies, monitoring, and alerting before a single request is served." },
    { no: "03", title: "Application Migration",     dur: "Week 3 – 4",  desc: "Containerise your applications, configure CI/CD deployment pipelines, and run parallel load tests against the new environment to validate performance targets." },
    { no: "04", title: "DNS Cutover",               dur: "Week 5",      desc: "Zero-downtime DNS cutover using traffic shifting: route 5% → 25% → 100% over 4 hours while monitoring error rates. Instant rollback if anything deviates." },
    { no: "05", title: "Optimisation Sprint",       dur: "Week 6",      desc: "Cache tuning, image optimisation, database query optimisation, and CDN configuration refinement to achieve sub-100ms response time targets." },
    { no: "06", title: "Ongoing Managed Ops",       dur: "Ongoing",     desc: "24/7 monitoring, monthly security patching, quarterly performance reviews, proactive capacity planning, and financial-credit-backed SLA reporting." },
  ],

  useCaseLabel: "What We Host",
  useCaseTitle: (
    <>Reliable Hosting for <span style={{ color: "#C9883A" }}>Every Workload Type</span></>
  ),
  useCases: [
    { icon: "fas fa-shopping-cart", label: "E-Commerce Platforms",    desc: "High-availability commerce infrastructure that handles flash sales and seasonal peaks without rate-limiting or degraded checkout performance." },
    { icon: "fas fa-building",      label: "Enterprise Web Apps",     desc: "Multi-tenant SaaS platforms, internal enterprise tools, and customer-facing applications with enterprise SLAs and SOC 2-compliant infrastructure." },
    { icon: "fas fa-mobile-alt",    label: "Mobile App Backends",     desc: "API gateways, real-time WebSocket servers, push notification infrastructure, and CDN-cached static assets for mobile applications at scale." },
    { icon: "fas fa-database",      label: "Database Hosting",        desc: "Managed PostgreSQL, MySQL, MongoDB, and Redis hosting with automated backups, read replicas, failover, and performance monitoring." },
    { icon: "fas fa-video",         label: "Media & Streaming",       desc: "Video encoding pipelines, adaptive bitrate streaming, and global CDN delivery for media platforms serving audiences across multiple continents." },
    { icon: "fas fa-landmark",      label: "Government & Regulated",  desc: "Data-residency-compliant hosting in UAE, UK, India, and other jurisdictions. On-premise colocation management for air-gapped government requirements." },
  ],

  faqTitle: "Common Hosting Questions",
  faqs: [
    { q: "What does your 99.9% uptime SLA actually mean in practice?", a: "99.9% uptime allows for approximately 8.7 hours of downtime per year. The SLA is backed by financial credits: if we miss it, you receive service credits on your next invoice." },
    { q: "Can you migrate us from our current hosting provider without downtime?", a: "Yes. We use a proven zero-downtime migration process: replicate your data to the new environment, run traffic in parallel using DNS traffic splitting, validate performance and error rates, then complete the cutover. The entire migration is reversible until the final DNS change — typically a 4-hour window at off-peak hours." },
    { q: "How do you handle unexpected traffic spikes (e.g., a viral moment or marketing campaign)?", a: "Our Kubernetes-based auto-scaling responds to traffic within 30 seconds and can scale horizontally across multiple availability zones within 2 minutes. For predictable high-traffic events (product launches, sales), we pre-warm capacity in advance and set up manual override controls so your team can scale with a button click." },
    { q: "Is my data physically located in a specific country or region?", a: "Yes, and we make this configurable. For UAE-based clients, all data resides in UAE North or UAE Central Azure regions, or ap-southeast-2 / me-south-1 AWS regions by default. UK GDPR and EU GDPR data residency is also available. We never store regulated data in jurisdictions that create compliance risk without explicit client approval." },
    { q: "What's included in 24/7 support?", a: "Our managed support includes: monitoring with automated alerting (we often know about an issue before you do), incident response with a 15-minute SLA for P1 incidents, security patching scheduled monthly, on-demand access to our engineers via Slack or ticketing system, and a monthly infrastructure health report with performance trends and cost analysis." },
  ],

  ctaTitle: (
    <>Ready for Hosting That <span style={{ color: "#C9883A" }}>You Never Think About?</span></>
  ),
  ctaDesc: "Move your application to XERXEZ managed hosting and spend your engineering time on product, not infrastructure. 99.9% uptime SLA. Low-latency global delivery. 24/7 support included.",
  ctaTags: ["99.9% Uptime SLA", "Financial Credits Backed", "24/7 Managed Support"],

  painPoints: [
    "Getting paged at 2am because a traffic spike nobody planned for took the site down?",
    "An uptime SLA on paper that nobody actually enforces with credits?",
    "Slow page loads for users outside your primary hosting region?",
    "A single engineer who's the only one who knows how production infrastructure actually works?",
  ],
};

const HostingPage = () => (
  <>
    <SEO
      title="Web & Mobile Hosting India, Dubai & Abu Dhabi UAE — XERXEZ"
      description="Reliable, secure web and mobile hosting by XERXEZ. 99.9% uptime guaranteed for enterprises in India, Dubai & Abu Dhabi UAE."
      canonical="/service/web-mobile-hosting"
      keywords="web hosting India, mobile hosting UAE, web hosting Dubai, hosting Abu Dhabi, enterprise hosting solutions, secure hosting UAE, cloud hosting India UAE, Xerxez Solutions"
    />
    <ServicePageTemplate config={config} />
  </>
);
export default HostingPage;
