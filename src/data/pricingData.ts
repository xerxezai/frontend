export interface PricingPlan {
  name: string;
  badge?: string;
  audience: string;
  /** Monthly price in INR/AED. null means "custom / contact us". */
  inrMonthly: number | null;
  aedMonthly: number | null;
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

export type Currency = "INR" | "AED";
export type Billing = "monthly" | "yearly";

/** Yearly billing = 2 months free, i.e. 10x the monthly rate. */
const YEARLY_MONTHS = 10;

export function formatPrice(plan: PricingPlan, currency: Currency, billing: Billing) {
  const base = currency === "INR" ? plan.inrMonthly : plan.aedMonthly;
  if (base == null) {
    return { price: "Custom", suffix: "", strike: null as string | null };
  }
  const symbol = currency === "INR" ? "₹" : "AED ";
  const locale = currency === "INR" ? "en-IN" : "en-US";
  if (billing === "monthly") {
    return { price: `${symbol}${base.toLocaleString(locale)}`, suffix: "/month", strike: null as string | null };
  }
  const yearly = base * YEARLY_MONTHS;
  const fullYear = base * 12;
  return {
    price: `${symbol}${yearly.toLocaleString(locale)}`,
    suffix: "/year",
    strike: `${symbol}${fullYear.toLocaleString(locale)}`,
  };
}
