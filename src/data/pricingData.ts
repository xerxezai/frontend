export interface PricingPlan {
  name: string;
  badge?: string;
  audience: string;
  features: string[];
  cta: string;
  ctaLink: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Basic",
    audience: "Small businesses (up to 10 users)",
    features: [
      "CRM Module",
      "HR & Attendance (8hr/day tracking)",
      "Basic Inventory",
      "Email Support",
      "5GB Storage",
    ],
    cta: "Get a Quote",
    ctaLink: "/contact?plan=Basic",
  },
  {
    name: "Professional",
    badge: "Most Popular",
    audience: "Growing businesses (up to 50 users)",
    features: [
      "Everything in Basic",
      "Sales & Invoicing",
      "Purchases & Logistics",
      "Advanced Analytics",
      "Priority Support",
      "50GB Storage",
      "Custom Reports",
    ],
    cta: "Get a Quote",
    ctaLink: "/contact?plan=Professional",
  },
  {
    name: "Enterprise",
    audience: "Large enterprises (unlimited users)",
    features: [
      "Everything in Professional",
      "AI-Powered Insights",
      "DevSecOps Integration",
      "Dedicated Account Manager",
      "24/7 Support",
      "Unlimited Storage",
      "Custom Integrations",
      "On-premise deployment option",
    ],
    cta: "Contact Us",
    ctaLink: "/contact?plan=Enterprise",
  },
];

export interface ComparisonRow {
  label: string;
  /** true/false = checkmark row; string = tiered value shown as text (e.g. storage size). */
  basic: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

/** Cumulative per-tier feature matrix — each tier includes everything the one before it has. */
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Users",                        basic: "Up to 10", professional: "Up to 50", enterprise: "Unlimited" },
  { label: "CRM Module",                   basic: true,  professional: true,  enterprise: true },
  { label: "HR & Attendance",              basic: true,  professional: true,  enterprise: true },
  { label: "Basic Inventory",              basic: true,  professional: true,  enterprise: true },
  { label: "Sales & Invoicing",            basic: false, professional: true,  enterprise: true },
  { label: "Purchases & Logistics",        basic: false, professional: true,  enterprise: true },
  { label: "Advanced Analytics",           basic: false, professional: true,  enterprise: true },
  { label: "Custom Reports",               basic: false, professional: true,  enterprise: true },
  { label: "AI-Powered Insights",          basic: false, professional: false, enterprise: true },
  { label: "DevSecOps Integration",        basic: false, professional: false, enterprise: true },
  { label: "Dedicated Account Manager",    basic: false, professional: false, enterprise: true },
  { label: "Custom Integrations",          basic: false, professional: false, enterprise: true },
  { label: "On-premise Deployment",        basic: false, professional: false, enterprise: true },
  { label: "Storage",                      basic: "5GB", professional: "50GB", enterprise: "Unlimited" },
  { label: "Support",                      basic: "Email", professional: "Priority", enterprise: "24/7" },
];
