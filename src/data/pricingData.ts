export interface PricingPlan {
  name: string;
  badge?: string;
  audience: string;
  /** Monthly price in INR/AED/USD. null means "custom / contact us". */
  inrMonthly: number | null;
  aedMonthly: number | null;
  usdMonthly: number | null;
  features: string[];
  cta: string;
  ctaLink: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    audience: "Small businesses (up to 10 users)",
    inrMonthly: 15000,
    aedMonthly: 3000,
    usdMonthly: 180,
    features: [
      "CRM Module",
      "HR & Attendance (8hr/day tracking)",
      "Basic Inventory",
      "Email Support",
      "5GB Storage",
    ],
    cta: "Get Started",
    ctaLink: "/contact",
  },
  {
    name: "Professional",
    badge: "Most Popular",
    audience: "Growing businesses (up to 50 users)",
    inrMonthly: 35000,
    aedMonthly: 7000,
    usdMonthly: 420,
    features: [
      "Everything in Starter",
      "Sales & Invoicing",
      "Purchases & Logistics",
      "Advanced Analytics",
      "Priority Support",
      "50GB Storage",
      "Custom Reports",
    ],
    cta: "Get Started",
    ctaLink: "/contact",
  },
  {
    name: "Enterprise",
    audience: "Large enterprises (unlimited users)",
    inrMonthly: null,
    aedMonthly: null,
    usdMonthly: null,
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
    ctaLink: "/contact",
  },
];

export interface ComparisonRow {
  label: string;
  /** true/false = checkmark row; string = tiered value shown as text (e.g. storage size). */
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

/** Cumulative per-tier feature matrix — each tier includes everything the one before it has. */
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Users",                        starter: "Up to 10", professional: "Up to 50", enterprise: "Unlimited" },
  { label: "CRM Module",                   starter: true,  professional: true,  enterprise: true },
  { label: "HR & Attendance",              starter: true,  professional: true,  enterprise: true },
  { label: "Basic Inventory",              starter: true,  professional: true,  enterprise: true },
  { label: "Sales & Invoicing",            starter: false, professional: true,  enterprise: true },
  { label: "Purchases & Logistics",        starter: false, professional: true,  enterprise: true },
  { label: "Advanced Analytics",           starter: false, professional: true,  enterprise: true },
  { label: "Custom Reports",               starter: false, professional: true,  enterprise: true },
  { label: "AI-Powered Insights",          starter: false, professional: false, enterprise: true },
  { label: "DevSecOps Integration",        starter: false, professional: false, enterprise: true },
  { label: "Dedicated Account Manager",    starter: false, professional: false, enterprise: true },
  { label: "Custom Integrations",          starter: false, professional: false, enterprise: true },
  { label: "On-premise Deployment",        starter: false, professional: false, enterprise: true },
  { label: "Storage",                      starter: "5GB", professional: "50GB", enterprise: "Unlimited" },
  { label: "Support",                      starter: "Email", professional: "Priority", enterprise: "24/7" },
];

export type Currency = "INR" | "AED" | "USD";
export type Billing = "monthly" | "yearly";

const CURRENCY_META: Record<Currency, { symbol: string; locale: string }> = {
  INR: { symbol: "₹", locale: "en-IN" },
  AED: { symbol: "AED ", locale: "en-US" },
  USD: { symbol: "$", locale: "en-US" },
};

/** Yearly billing = 2 months free, i.e. 10x the monthly rate. */
const YEARLY_MONTHS = 10;

export interface FormattedPrice {
  /** Currency symbol/code — render in a font with full glyph coverage (not a decorative serif). */
  symbol: string;
  /** Numeric amount, or "Custom" when the plan has no price for this currency. */
  amount: string;
  suffix: string;
  /** Full-price strikethrough (symbol + amount) shown next to a yearly discount, if any. */
  strike: string | null;
}

function planPrice(plan: PricingPlan, currency: Currency): number | null {
  if (currency === "INR") return plan.inrMonthly;
  if (currency === "AED") return plan.aedMonthly;
  return plan.usdMonthly;
}

export function formatPrice(plan: PricingPlan, currency: Currency, billing: Billing): FormattedPrice {
  const base = planPrice(plan, currency);
  const { symbol, locale } = CURRENCY_META[currency];
  if (base == null) {
    return { symbol: "", amount: "Custom", suffix: "", strike: null };
  }
  if (billing === "monthly") {
    return { symbol, amount: base.toLocaleString(locale), suffix: "/month", strike: null };
  }
  const yearly = base * YEARLY_MONTHS;
  const fullYear = base * 12;
  return {
    symbol,
    amount: yearly.toLocaleString(locale),
    suffix: "/year",
    strike: `${symbol}${fullYear.toLocaleString(locale)}`,
  };
}
