# XERXEZ Frontend

A single Vite + React + TypeScript app serving three products for enterprises in the **UAE (Abu Dhabi focus) and India**:

1. **Marketing site** (`xerxez.com`) — public pages: home, services, industries, portfolio, pricing, contact, careers, blog.
2. **ERP** (`xerxez.com/erp`) — the XERXEZ AI-powered ERP application.
3. **XERXEZ Academy / LMA** (`xerxez.com/lma`) — the online learning platform (courses, instructors, certificates).

XERXEZ replaces fragmented legacy systems with one AI-native ERP spanning CRM, Sales, Procurement, Logistics, Accounting, Inventory, HR, and a full MLM distributor/commission engine, purpose-built for **EPC, Oil & Gas, Construction, Manufacturing, Facility Management, Healthcare, Logistics, and Retail** businesses.

## Features

- ✅ **CRM** — Customers, Leads, Pipeline (drag-and-drop Kanban), Activities, Notes
- ✅ **Sales** — Orders, Quotations, quotation→order conversion, dashboard
- ✅ **Procurement** — Purchase Orders, Suppliers, Goods Receipts
- ✅ **Logistics** — Shipments, Tracking, Deliveries, Warehouses
- ✅ **Accounting** — Invoices, Payments, Journal Entries, Expenses
- ✅ **MLM** — Distributors, Commissions, Payouts, Network Tree
- ✅ **HR** — Employees, Attendance, Leave, Shifts, Salary Structures, Payroll, PaySlips, Performance Reviews, Documents, Onboarding, Exit Management, and more
- ✅ **Inventory** — Products, Warehouses, Stock Movements
- ✅ **Document Management** — Upload, versioning, approval workflow, category search
- ✅ **Marketing site** — Services, ERP industry pages, portfolio, pricing, careers, blog, currency selector (AED/INR/USD)
- ✅ **XERXEZ Academy** — Course browsing, enrollment, student/instructor dashboards, certificates

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (dev server + production build)
- Inline-styled components (no CSS framework) for the ERP/LMA; Bootstrap utility classes on the marketing site
- **react-router-dom** for routing across all three products
- **recharts** for dashboard charts, **@dnd-kit/core** for Kanban drag-and-drop
- **framer-motion** for animation, **lucide-react** + FontAwesome for icons
- **react-helmet-async** for per-page SEO (meta tags, Open Graph, JSON-LD)
- Deployed on **Vercel**, auto-deploying from GitHub `main`

## API Documentation

The frontend talks to the Django backend at `VITE_API_BASE_URL` (defaults to the Railway production URL). Key endpoints it consumes:

| Module | Endpoint |
|---|---|
| CRM | `/api/v1/crm/customers/`, `/api/v1/crm/leads/` |
| Sales | `/api/v1/sales/orders/`, `/api/v1/sales/quotations/` |
| Procurement | `/api/v1/procurement/purchase-orders/` |
| Logistics | `/api/v1/logistics/shipments/` |
| MLM | `/api/v1/mlm/distributors/`, `/api/v1/mlm/commissions/`, `/api/v1/mlm/payouts/` |
| HR | `/api/v1/hr/employees/` |
| Inventory | `/api/v1/inventory/products/` |
| Careers | `/api/v1/careers/apply/` |

## Setup

```bash
git clone <repo-url>
cd frontend
npm install
npm run dev
```

Other commands:
- `npm run build` — production build (`tsc -b && vite build`, then copies `public/docs` into `dist/docs`). TypeScript is strict, so this is also the reliable way to catch type errors.
- `npm run lint` — ESLint

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (defaults to the Railway production URL if unset) |

## Deployment

- **Frontend**: Vercel, auto-deploys from GitHub `main`.
- **Backend it talks to**: Railway (see `backend/README.md`).

## Target Markets

- **UAE** (Abu Dhabi focus)
- **India**

## Industries Served

- EPC
- Oil & Gas
- Construction
- Manufacturing
- Facility Management
- Healthcare
- Logistics
- Retail

## Contact

- Website: [xerxez.com](https://www.xerxez.com)
- Email: xerxez.in@gmail.com
- ERP Portal: [xerxez.com/erp](https://www.xerxez.com/erp)
