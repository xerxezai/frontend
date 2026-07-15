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

export interface IndustryPageContent {
  painPoints: string[];
  modules: string[];
}

const GENERIC_CONTENT: IndustryPageContent = {
  painPoints: [
    "Operations managed across disconnected systems",
    "Manual approval workflows causing delays",
    "No real-time visibility into costs and resources",
    "Reporting done manually in Excel",
  ],
  modules: [
    "HR & Payroll Management",
    "Procurement & Vendor Management",
    "Document Management",
    "Finance & Cost Control",
    "Operations Dashboard",
    "AI Assistant — natural language queries",
  ],
};

export const INDUSTRY_PAGE_CONTENT: Record<string, IndustryPageContent> = {
  epc: {
    painPoints: [
      "Manual procurement approvals taking 3-5 days",
      "Engineering document version control chaos",
      "No real-time project cost vs budget visibility",
      "Vendor communication scattered over email",
    ],
    modules: [
      "AI Procurement — multi-level PO approvals",
      "Document Control — version-controlled drawings",
      "Project Cost Control — budget vs actual tracking",
      "Vendor Management — supplier performance scoring",
      "HR & Payroll — site staff management",
      "AI Assistant — natural language reporting",
    ],
  },
  "oil-gas": {
    painPoints: [
      "Compliance documents scattered across systems",
      "Asset maintenance tracked in spreadsheets",
      "Safety incident reporting delayed",
      "Field operations disconnected from HQ",
    ],
    modules: [
      "Asset & Maintenance Management",
      "QHSE — safety and compliance tracking",
      "Field Operations Dashboard",
      "Procurement — approved vendor management",
      "Document Management — compliance control",
      "AI Assistant — instant compliance queries",
    ],
  },
  construction: {
    painPoints: [
      "Subcontractor management over WhatsApp",
      "Material wastage not monitored",
      "Project delays not flagged early",
      "Budget overruns found too late",
    ],
    modules: [
      "Project Management — milestones and tasks",
      "Material & Equipment tracking",
      "Subcontractor Management — work orders",
      "Budget Control — real-time cost monitoring",
      "HR — labour attendance and payroll",
      "AI Assistant — project status queries",
    ],
  },
  manufacturing: {
    painPoints: [
      "Production planning done in Excel",
      "Quality defects found after delivery",
      "Machine downtime not tracked",
      "Raw material shortages cause stoppages",
    ],
    modules: [
      "Production Planning — work order scheduling",
      "Quality Control — inspection and defect tracking",
      "Inventory Management — raw material tracking",
      "Machine Maintenance — predictive alerts",
      "Procurement — supplier and PO management",
      "AI Assistant — production insights",
    ],
  },
  "facility-management": {
    painPoints: [
      "Work orders managed over phone and email",
      "Preventive maintenance schedules missed",
      "Asset lifecycle not tracked",
      "Energy costs not monitored",
    ],
    modules: [
      "Work Order Management — digital with mobile access",
      "Asset Management — full register with history",
      "Preventive Maintenance — auto-scheduled PMs",
      "Energy Monitoring — utility cost tracking",
      "Vendor Management — service contractor management",
      "AI Assistant — asset and maintenance queries",
    ],
  },
  healthcare: GENERIC_CONTENT,
  logistics: GENERIC_CONTENT,
  retail: GENERIC_CONTENT,
};

export const getIndustryPageContent = (slug: string | undefined): IndustryPageContent =>
  (slug && INDUSTRY_PAGE_CONTENT[slug]) || GENERIC_CONTENT;
