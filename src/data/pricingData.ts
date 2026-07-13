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
