import type { LucideIcon } from "lucide-react";
import { HardHat, Fuel, Building, Factory, Building2, Heart, Truck, ShoppingBag } from "lucide-react";

export interface IndustryDef {
  slug: string;
  name: string;
  shortName: string;
  shelf: string;
  icon: LucideIcon;
  features: string[];
  tagline: string;
}

export const INDUSTRIES: IndustryDef[] = [
  {
    slug: "epc",
    name: "EPC (Engineering, Procurement & Construction)",
    shortName: "EPC",
    shelf: "#F59E0B",
    icon: HardHat,
    tagline: "Run multi-site EPC contracts on one system — cost control, procurement and vendors, unified.",
    features: [
      "Project cost control & procurement tracking",
      "Multi-site operations management",
      "Contractor & vendor management",
    ],
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    shortName: "Oil & Gas",
    shelf: "#EF4444",
    icon: Fuel,
    tagline: "Field operations, safety compliance and supply chain — built for upstream and downstream teams.",
    features: [
      "Field operations & asset management",
      "Compliance & safety tracking",
      "Supply chain optimization",
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    shortName: "Construction",
    shelf: "#F97316",
    icon: Building,
    tagline: "Budgets, materials and subcontractors tracked from groundbreaking to handover.",
    features: [
      "Project management & budgeting",
      "Material & equipment tracking",
      "Subcontractor management",
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    shortName: "Manufacturing",
    shelf: "#3B82F6",
    icon: Factory,
    tagline: "Plan production, hold quality, and keep machines running — all from one operations layer.",
    features: [
      "Production planning & scheduling",
      "Quality control & inventory",
      "Machine & maintenance tracking",
    ],
  },
  {
    slug: "facility-management",
    name: "Facility Management",
    shortName: "Facility Mgmt",
    shelf: "#8B5CF6",
    icon: Building2,
    tagline: "Assets, work orders and energy costs managed across every site you operate.",
    features: [
      "Asset & maintenance management",
      "Work order management",
      "Energy & cost tracking",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    shortName: "Healthcare",
    shelf: "#10B981",
    icon: Heart,
    tagline: "Patient billing, medical supply chain and staff scheduling — compliant by default.",
    features: [
      "Patient management & billing",
      "Medical inventory & supplies",
      "Staff scheduling & payroll",
    ],
  },
  {
    slug: "logistics",
    name: "Logistics",
    shortName: "Logistics",
    shelf: "#06B6D4",
    icon: Truck,
    tagline: "Fleet, routes and warehouses on one live operational picture.",
    features: [
      "Fleet & route management",
      "Shipment & delivery tracking",
      "Warehouse management",
    ],
  },
  {
    slug: "retail",
    name: "Retail",
    shortName: "Retail",
    shelf: "#EC4899",
    icon: ShoppingBag,
    tagline: "POS, multi-store operations and loyalty — unified across every location.",
    features: [
      "POS & inventory management",
      "Multi-store operations",
      "Customer loyalty & CRM",
    ],
  },
];

export const getIndustryBySlug = (slug: string | undefined) =>
  INDUSTRIES.find((i) => i.slug === slug);
