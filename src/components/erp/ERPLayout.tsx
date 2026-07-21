import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import { useAccess } from '../../context/AccessContext';
import { useCompany } from '../../context/CompanyContext';
import MyAccessRequest from './rbac/MyAccessRequest';
import CompanySwitcher from './company/CompanySwitcher';

const CURRENCY_FLAG: Record<string, string> = { AED: '🇦🇪', INR: '🇮🇳', USD: '🇺🇸' };

const C = {
  orange:     "#C9883A",
  orangeGrad: "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
  warmDark:   "#1a1208",
  warmDarker: "#0f0a05",
  dark:       "#1a1208",
  cream:      "#F8F7F4",
  white:      "#FFFFFF",
  muted:      "#6B6B6B",
  border:     "rgba(0,0,0,0.07)",
};

type NavItem = { to: string; icon: string; label: string; adminOnly?: boolean; rbacModule?: string };
type SubNavItem = { to: string; icon: string; label: string; adminOnly?: boolean };
type NavDivider = { divider: true; label: string };
type NavEntry = NavItem | NavDivider;

// rbacModule is used to hide a sidebar entry entirely when the logged-in user has no
// access to it. The 4 EPC modules are restricted to Super Admins only (their hasAccess
// check in AccessContext returns isSuperAdmin).
const NAV: NavEntry[] = [
  { to: '/erp/dashboard',   icon: 'fas fa-th-large',      label: 'Dashboard' },
  { to: '/erp/crm',         icon: 'fas fa-users',         label: 'CRM',         rbacModule: 'crm' },
  { to: '/erp/sales',       icon: 'fas fa-shopping-cart', label: 'Sales',       rbacModule: 'sales' },
  { to: '/erp/procurement', icon: 'fas fa-truck',         label: 'Procurement', rbacModule: 'procurement' },
  { to: '/erp/logistics',   icon: 'fas fa-shipping-fast', label: 'Logistics',   rbacModule: 'logistics' },
  { to: '/erp/accounting',  icon: 'fas fa-book',          label: 'Accounting',  rbacModule: 'accounting' },
  { to: '/erp/mlm',         icon: 'fas fa-sitemap',       label: 'MLM',         rbacModule: 'mlm' },
  { to: '/erp/hr',          icon: 'fas fa-user-tie',      label: 'HR Overview', rbacModule: 'hr' },
  { divider: true, label: 'EPC Modules' },
  { to: '/erp/documents',   icon: 'fas fa-folder-open',   label: 'Document Management', rbacModule: 'document_management' },
  { to: '/erp/projects',    icon: 'fas fa-project-diagram', label: 'Project Management', rbacModule: 'project_management' },
  { to: '/erp/assets',      icon: 'fas fa-toolbox',       label: 'Asset Management',    rbacModule: 'asset_management' },
  { to: '/erp/qhse',        icon: 'fas fa-hard-hat',      label: 'QHSE',                rbacModule: 'qhse' },
];

// Expandable CRM submenu — Customers/Leads/Activities/Pipeline are each their
// own dedicated route/page (no shared internal tab bar).
const CRM_SUBMENU: SubNavItem[] = [
  { to: '/erp/crm',            icon: 'fas fa-users',    label: 'Customers' },
  { to: '/erp/crm/leads',      icon: 'fas fa-bullseye', label: 'Leads' },
  { to: '/erp/crm/activities', icon: 'fas fa-stream',   label: 'Activities' },
  { to: '/erp/crm/pipeline',   icon: 'fas fa-columns',  label: 'Pipeline' },
];

// Expandable Sales submenu
const SALES_SUBMENU: SubNavItem[] = [
  { to: '/erp/sales',            icon: 'fas fa-th-large',       label: 'Dashboard' },
  { to: '/erp/sales/quotations', icon: 'fas fa-file-signature', label: 'Quotations' },
  { to: '/erp/sales/orders',     icon: 'fas fa-receipt',        label: 'Sales Orders' },
  { to: '/erp/sales/invoices',   icon: 'fas fa-file-invoice-dollar', label: 'Invoices' },
  { to: '/erp/sales/payments',   icon: 'fas fa-money-check-alt',     label: 'Payments' },
];

// Expandable Procurement submenu
const PROCUREMENT_SUBMENU: SubNavItem[] = [
  { to: '/erp/procurement',                 icon: 'fas fa-th-large',            label: 'Dashboard' },
  { to: '/erp/procurement/purchase-orders', icon: 'fas fa-file-invoice',        label: 'Purchase Orders' },
  { to: '/erp/procurement/suppliers',       icon: 'fas fa-industry',            label: 'Suppliers' },
  { to: '/erp/procurement/goods-receipt',   icon: 'fas fa-dolly',               label: 'Goods Receipt' },
  { to: '/erp/procurement/bills',           icon: 'fas fa-file-invoice-dollar', label: 'Bills' },
  { to: '/erp/inventory',                   icon: 'fas fa-boxes',               label: 'Inventory' },
];

// Expandable Logistics submenu
const LOGISTICS_SUBMENU: SubNavItem[] = [
  { to: '/erp/logistics',            icon: 'fas fa-th-large',       label: 'Dashboard' },
  { to: '/erp/logistics/shipments',  icon: 'fas fa-box',            label: 'Shipments' },
  { to: '/erp/logistics/deliveries', icon: 'fas fa-truck-loading',  label: 'Deliveries' },
  { to: '/erp/logistics/tracking',   icon: 'fas fa-map-marker-alt', label: 'Tracking' },
  { to: '/erp/logistics/warehouses', icon: 'fas fa-warehouse',      label: 'Warehouses' },
];

// Expandable Accounting submenu
const ACCOUNTING_SUBMENU: SubNavItem[] = [
  { to: '/erp/accounting',               icon: 'fas fa-th-large',            label: 'Dashboard' },
  { to: '/erp/accounting/invoices',      icon: 'fas fa-file-invoice-dollar', label: 'Invoices' },
  { to: '/erp/accounting/payments',      icon: 'fas fa-money-check-alt',     label: 'Payments' },
  { to: '/erp/accounting/expenses',      icon: 'fas fa-receipt',             label: 'Expenses' },
  { to: '/erp/accounting/tax-reports',   icon: 'fas fa-percent',             label: 'Tax Reports' },
  { to: '/erp/accounting/balance-sheet', icon: 'fas fa-balance-scale',       label: 'Balance Sheet' },
];

// Expandable MLM submenu
const MLM_SUBMENU: SubNavItem[] = [
  { to: '/erp/mlm',              icon: 'fas fa-th-large',         label: 'Dashboard' },
  { to: '/erp/mlm/distributors', icon: 'fas fa-user-tag',         label: 'Distributors' },
  { to: '/erp/mlm/network-tree', icon: 'fas fa-sitemap',          label: 'Network Tree' },
  { to: '/erp/mlm/commissions',  icon: 'fas fa-percentage',       label: 'Commissions' },
  { to: '/erp/mlm/payouts',      icon: 'fas fa-hand-holding-usd', label: 'Payouts' },
  { to: '/erp/mlm/reports',      icon: 'fas fa-chart-line',       label: 'Reports' },
];

// Expandable HR Overview submenu — also folds in Attendance/Payroll, which
// previously lived as a separate flat "HR & PAYROLL" group below HR Overview.
const HR_SUBMENU: SubNavItem[] = [
  { to: '/erp/hr',                icon: 'fas fa-th-large',        label: 'HR Dashboard' },
  { to: '/erp/hr/employees',      icon: 'fas fa-users',           label: 'Employees' },
  { to: '/erp/hr/departments',    icon: 'fas fa-building',        label: 'Departments' },
  { to: '/erp/hr/leave',          icon: 'fas fa-umbrella-beach',  label: 'Leave Requests' },
  { to: '/erp/attendance',        icon: 'fas fa-calendar-check',  label: 'Attendance' },
  { to: '/erp/my-attendance',     icon: 'fas fa-calendar-day',    label: 'My Attendance' },
  { to: '/erp/leave',             icon: 'fas fa-calendar-minus',  label: 'Leave' },
  { to: '/erp/all-attendance',    icon: 'fas fa-users-cog',       label: 'All Attendance',   adminOnly: true },
  { to: '/erp/leave-approvals',   icon: 'fas fa-check-circle',    label: 'Leave Approvals',  adminOnly: true },
  { to: '/erp/shifts',            icon: 'fas fa-exchange-alt',    label: 'Shifts',           adminOnly: true },
  { to: '/erp/salary-structures', icon: 'fas fa-money-bill-wave', label: 'Salary Setup',     adminOnly: true },
  { to: '/erp/payroll-generate',  icon: 'fas fa-cogs',            label: 'Generate Payroll', adminOnly: true },
  { to: '/erp/payroll-reports',   icon: 'fas fa-chart-bar',       label: 'Payroll Reports',  adminOnly: true },
  { to: '/erp/my-payslips',       icon: 'fas fa-file-alt',        label: 'My Payslips' },
  { to: '/erp/hr/performance',    icon: 'fas fa-star',            label: 'Performance' },
  { to: '/erp/hr/documents',      icon: 'fas fa-file-alt',        label: 'Documents' },
  { to: '/erp/hr/org-chart',      icon: 'fas fa-sitemap',         label: 'Org Chart' },
  { to: '/erp/hr/onboarding',     icon: 'fas fa-clipboard-check', label: 'Onboarding' },
  { to: '/erp/hr/exit',           icon: 'fas fa-door-open',       label: 'Exit Management' },
];

// Expandable Project Management submenu — Detail/Tasks/Gantt are per-project routes
// reached from the list, not their own sidebar entries.
const PROJECTS_SUBMENU: SubNavItem[] = [
  { to: '/erp/projects',      icon: 'fas fa-th-large',        label: 'Dashboard' },
  { to: '/erp/projects/list', icon: 'fas fa-list',            label: 'All Projects' },
];

// Expandable Asset Management submenu — Detail (incl. QR code) is a per-asset route
// reached from the list, not its own sidebar entry.
const ASSETS_SUBMENU: SubNavItem[] = [
  { to: '/erp/assets',      icon: 'fas fa-th-large', label: 'Dashboard' },
  { to: '/erp/assets/list', icon: 'fas fa-list',     label: 'All Assets' },
];

// Expandable QHSE submenu
const QHSE_SUBMENU: SubNavItem[] = [
  { to: '/erp/qhse',             icon: 'fas fa-th-large',        label: 'Dashboard' },
  { to: '/erp/qhse/incidents',   icon: 'fas fa-exclamation-circle', label: 'Incidents' },
  { to: '/erp/qhse/inspections', icon: 'fas fa-clipboard-list',  label: 'Inspections' },
  { to: '/erp/qhse/risks',       icon: 'fas fa-shield-alt',      label: 'Risk Register' },
  { to: '/erp/qhse/checklists',  icon: 'fas fa-tasks',           label: 'Safety Checklists' },
  { to: '/erp/qhse/compliance',  icon: 'fas fa-file-signature',  label: 'Compliance' },
];

const EXPANDABLE_SUBMENUS: Record<string, SubNavItem[]> = {
  '/erp/crm': CRM_SUBMENU,
  '/erp/sales': SALES_SUBMENU,
  '/erp/procurement': PROCUREMENT_SUBMENU,
  '/erp/logistics': LOGISTICS_SUBMENU,
  '/erp/accounting': ACCOUNTING_SUBMENU,
  '/erp/mlm': MLM_SUBMENU,
  '/erp/hr': HR_SUBMENU,
  '/erp/projects': PROJECTS_SUBMENU,
  '/erp/assets': ASSETS_SUBMENU,
  '/erp/qhse': QHSE_SUBMENU,
};

function isAdminUser(): boolean {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const payload = JSON.parse(atob(JSON.parse(stored).access.split('.')[1]));
      if (payload.is_staff === true || payload.is_superuser === true) return true;
    }
  } catch {}
  const role = localStorage.getItem('xerxez_role') || '';
  return role === 'admin' || role === 'super_admin' || role === 'superuser';
}

interface Props { children: React.ReactNode; }

const ERPLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const { selectedCurrency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  useEffect(() => {
    if (!currencyOpen) return;
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [currencyOpen]);

  const adminName = localStorage.getItem('xerxez_name') || 'Admin';
  const initial   = adminName.charAt(0).toUpperCase();
  const isAdmin   = isAdminUser();
  const { hasAccess, isSuperAdmin, userRole, isLoading: accessLoading } = useAccess();
  const { isPlatformAdmin, currentCompany } = useCompany();
  // Real RBAC role from my-access/ — the legacy xerxez_role localStorage value lies
  // (it derives from an old profile field that shows every admin-ish user as super_admin).
  const ROLE_LABELS: Record<string, string> = {
    super_admin: 'Super Admin', module_admin: 'Module Admin',
    regular_user: 'Regular User', read_only: 'Read Only', no_access: 'User',
  };
  const roleLabel = accessLoading ? '' : (ROLE_LABELS[userRole] ?? 'User');
  const [showAccessRequest, setShowAccessRequest] = useState(false);

  let currentSub: SubNavItem | undefined;
  for (const [parentTo, submenu] of Object.entries(EXPANDABLE_SUBMENUS)) {
    currentSub = submenu.find(
      s => s.to !== parentTo && (s.to === location.pathname || location.pathname.startsWith(s.to + '/'))
    );
    if (currentSub) break;
  }
  const currentNavItem = NAV.find(
    (item): item is NavItem => !('divider' in item) && (item.to === location.pathname || location.pathname.startsWith(item.to + '/'))
  );
  const pageTitle = currentSub ? currentSub.label
    : currentNavItem ? currentNavItem.label : 'Dashboard';

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const [parentTo, submenu] of Object.entries(EXPANDABLE_SUBMENUS)) {
      init[parentTo] = location.pathname.startsWith(parentTo)
        || submenu.some(s => location.pathname === s.to || location.pathname.startsWith(s.to + '/'));
    }
    return init;
  });

  const handleLogout = () => {
    ['auth_tokens', 'xerxez_token', 'xerxez_role', 'xerxez_name'].forEach(k =>
      localStorage.removeItem(k)
    );
    navigate('/');
  };

  const sidebarW = collapsed ? 68 : 240;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8F7F4',
        '--sidebar-w': `${sidebarW}px`,
      } as React.CSSProperties}
    >
      <style>{`
        .erp-sidebar {
          display: none;
        }
        .erp-sidebar.erp-sidebar-mobile-open {
          display: flex;
        }
        @media (min-width: 992px) {
          .erp-main {
            margin-left: var(--sidebar-w) !important;
            transition: margin-left 0.28s cubic-bezier(0.22,1,0.36,1);
          }
          .erp-sidebar {
            display: flex !important;
          }
        }

        .erp-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          margin: 3px 8px;
          border-left: 3px solid transparent;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.60);
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }
        .erp-nav-item:hover {
          color: rgba(255,255,255,0.92);
          background: rgba(201,136,58,0.15);
        }
        .erp-nav-active {
          color: #ffffff !important;
          background: #C9883A !important;
          border-left-color: #ffffff !important;
          font-weight: 700 !important;
        }
        .erp-nav-chevron {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .erp-nav-active .erp-nav-chevron {
          opacity: 1;
        }

        .erp-subnav-panel {
          background: #FFFFFF;
          border-radius: 10px;
          overflow: hidden;
        }
        .erp-subnav-item {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 16px 8px 40px;
          margin: 1px 0;
          border-left: 3px solid transparent;
          border-bottom: 1px solid #F3F4F6;
          text-decoration: none; color: #1a1208; background: #FFFFFF;
          font-size: 13px; font-weight: 400; line-height: 1.3; font-family: 'DM Sans', sans-serif;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          box-sizing: border-box;
        }
        .erp-subnav-item:last-child { border-bottom: none; }
        .erp-subnav-item:hover { color: #C9883A; background: rgba(201,136,58,0.15); }
        .erp-subnav-active {
          color: #ffffff !important; background: #C9883A !important;
          border-left-color: #C9883A !important; font-weight: 700 !important;
        }

        .erp-icon-badge {
          width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 13px;
          color: inherit;
        }

        .erp-nav-group-label {
          padding: 18px 16px 8px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .erp-nav-group-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(201,136,58,0.20), transparent);
        }

        .erp-nav-slide {
          animation: erpNavIn 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes erpNavIn {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .erp-search {
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 9px;
          padding: 7px 14px 7px 34px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          outline: none;
          width: 200px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .erp-search:focus {
          border-color: #C9883A;
          box-shadow: 0 0 0 3px rgba(201,136,58,0.15);
        }
        .erp-search::placeholder { color: rgba(255,255,255,0.28); }

        .erp-search-light {
          border: 1.5px solid rgba(0,0,0,0.10);
          background: #F8F7F4;
          color: #1a1208;
        }
        .erp-search-light:focus {
          border-color: #C9883A;
          box-shadow: 0 0 0 3px rgba(201,136,58,0.14);
        }
        .erp-search-light::placeholder { color: rgba(0,0,0,0.32); }

        .erp-bell {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.09);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative;
          transition: background 0.2s, border-color 0.2s;
        }
        .erp-bell:hover { background: rgba(201,136,58,0.14); border-color: rgba(201,136,58,0.36); }

        .erp-bell-light {
          background: #F8F7F4;
          border: 1.5px solid rgba(0,0,0,0.08);
        }
        .erp-bell-light:hover { background: rgba(201,136,58,0.12); border-color: rgba(201,136,58,0.30); }

        .erp-topbtn {
          height: 38px;
          border-radius: 10px;
          background: #F8F7F4;
          border: 1.5px solid rgba(0,0,0,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative;
          padding: 0 11px;
          transition: background 0.2s, border-color 0.2s;
        }
        .erp-topbtn:hover { background: rgba(201,136,58,0.12); border-color: rgba(201,136,58,0.30); }

        .erp-logout {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.16);
          border-radius: 10px;
          padding: 9px 13px;
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          cursor: pointer;
          color: rgba(248,113,113,0.85);
          font-size: 13.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, color 0.2s;
        }
        .erp-logout:hover { background: rgba(239,68,68,0.14); color: #f87171; }

        @media (prefers-reduced-motion: reduce) {
          .erp-nav-slide { animation: none !important; }
          .erp-nav-item  { transition: none !important; }
        }
      `}</style>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.52)',
            zIndex: 199,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* sidebar */}
      <aside
        className={`erp-sidebar${mobileOpen ? ' erp-sidebar-mobile-open' : ''}`}
        style={{
          width: sidebarW,
          background: `linear-gradient(180deg, ${C.warmDark} 0%, ${C.warmDarker} 100%)`,
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 200,
          transition: 'width 0.28s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: '4px 0 28px rgba(0,0,0,0.22)',
          overflow: 'hidden',
        }}
      >
        {/* brand */}
        <div style={{
          position: 'relative',
          padding: '22px 16px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            {!collapsed ? (
              <img src="/assets/img/logo/xerxez_logo.png" alt="Xerxez"
                style={{ height: 68, width: 'auto', display: 'block', objectFit: 'contain' }} />
            ) : (
              <img src="/assets/img/logo/icon-logo.svg" alt="Xerxez"
                style={{ height: 32, width: 32, display: 'block', objectFit: 'contain' }} />
            )}
          </div>
          {!collapsed && (
            <div style={{
              marginTop: 7, fontSize: 10, color: C.orange, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Enterprise · ERP
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '5px 6px', borderRadius: 6,
              color: 'rgba(255,255,255,0.28)',
              transition: 'color 0.2s',
              position: 'absolute', right: 10, top: 18,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
          >
            <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`} style={{ fontSize: 11 }}></i>
          </button>
        </div>

        {/* nav */}
        <nav style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 10, paddingBottom: 10 }}>
          {NAV.map((item, idx) => {
            if ('divider' in item) {
              // The EPC Modules divider only makes sense when the EPC items below it
              // render — which is Super Admins only.
              if (item.label === 'EPC Modules' && !accessLoading && !isSuperAdmin) return null;
              return (
                <div key={`divider-${item.label}`} style={{
                  margin: collapsed ? '14px 10px 6px' : '18px 16px 8px',
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                }}>
                  {!collapsed && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>
              );
            }
            if (item.adminOnly && !isAdmin) return null;
            if (item.rbacModule && !accessLoading && !hasAccess(item.rbacModule)) return null;

            // Every expandable section (CRM/Sales/Procurement/Logistics/Accounting/MLM/HR
            // Overview) shares this one toggle-button + submenu-panel pattern.
            const submenu = EXPANDABLE_SUBMENUS[item.to];
            if (submenu && !collapsed) {
              const visibleSubmenu = submenu.filter(s => !s.adminOnly || isAdmin);
              const isOpen = openGroups[item.to] ?? false;
              const anyChildActive = location.pathname.startsWith(item.to)
                || visibleSubmenu.some(s => location.pathname === s.to || location.pathname.startsWith(s.to + '/'));
              return (
                <div key={item.to}>
                  <button
                    onClick={() => setOpenGroups(g => ({ ...g, [item.to]: !g[item.to] }))}
                    className={`erp-nav-item erp-nav-slide${anyChildActive ? ' erp-nav-active' : ''}`}
                    style={{ width: '100%', background: 'none', textAlign: 'left', animationDelay: `${idx * 0.028}s` }}
                  >
                    <span className="erp-icon-badge">
                      <i className={item.icon} style={{ color: 'inherit', fontSize: 13 }}></i>
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <i className="fas fa-chevron-down" style={{ fontSize: 10, transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
                  </button>
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: isOpen ? visibleSubmenu.length * 44 + 8 : 0,
                    margin: isOpen ? '4px 8px 8px' : '0 8px',
                    transition: 'max-height 0.3s cubic-bezier(0.22,1,0.36,1), margin 0.3s ease',
                  }}>
                    <div className="erp-subnav-panel">
                      {visibleSubmenu.map(s => (
                        <NavLink
                          key={s.to}
                          to={s.to}
                          end={s.to === item.to}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) => `erp-subnav-item${isActive ? ' erp-subnav-active' : ''}`}
                        >
                          <i className={s.icon} style={{ fontSize: 11, width: 16, textAlign: 'center' }}></i>
                          <span>{s.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/erp/hr'}
                title={item.label}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `erp-nav-item erp-nav-slide${isActive ? ' erp-nav-active' : ''}`
                }
                style={{ animationDelay: `${idx * 0.028}s` }}
              >
                <span className="erp-icon-badge">
                  <i className={item.icon} style={{ color: 'inherit', fontSize: 13 }}></i>
                </span>
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && (
                  <i className="fas fa-chevron-right erp-nav-chevron" style={{ fontSize: 10 }}></i>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* RBAC: User Management (super admins only) / Request Module Access (everyone else) */}
        {!accessLoading && (
          isSuperAdmin ? (
            <div style={{ padding: '10px 10px 0', flexShrink: 0 }}>
              {!collapsed && (
                <div style={{
                  fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
                  padding: '6px 8px 8px', textTransform: 'uppercase', letterSpacing: '0.12em',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Admin
                </div>
              )}
              {isPlatformAdmin && (
                <NavLink
                  to="/erp/companies"
                  title="Companies"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `erp-nav-item erp-nav-slide${isActive ? ' erp-nav-active' : ''}`}
                >
                  <span className="erp-icon-badge">
                    <i className="fas fa-building" style={{ color: 'inherit', fontSize: 13 }}></i>
                  </span>
                  {!collapsed && <span style={{ flex: 1 }}>Companies</span>}
                </NavLink>
              )}
              {isSuperAdmin && (
                <NavLink
                  to="/erp/partners"
                  title="Partner Applications"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `erp-nav-item erp-nav-slide${isActive ? ' erp-nav-active' : ''}`}
                >
                  <span className="erp-icon-badge">
                    <i className="fas fa-handshake" style={{ color: 'inherit', fontSize: 13 }}></i>
                  </span>
                  {!collapsed && <span style={{ flex: 1 }}>Partner Applications</span>}
                </NavLink>
              )}
              <NavLink
                to="/erp/users"
                title="User Management"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `erp-nav-item erp-nav-slide${isActive ? ' erp-nav-active' : ''}`}
              >
                <span className="erp-icon-badge">
                  <i className="fas fa-users-cog" style={{ color: 'inherit', fontSize: 13 }}></i>
                </span>
                {!collapsed && <span style={{ flex: 1 }}>User Management</span>}
              </NavLink>
            </div>
          ) : (
            <div style={{ padding: '10px 10px 0', flexShrink: 0 }}>
              <button
                onClick={() => setShowAccessRequest(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', justifyContent: collapsed ? 'center' : 'flex-start',
                  background: 'none', border: 'none', cursor: 'pointer', color: C.orange,
                  padding: '9px 13px', fontSize: 13.5, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <i className="fas fa-key" style={{ fontSize: 13, flexShrink: 0 }}></i>
                {!collapsed && <span>Request Module Access</span>}
              </button>
            </div>
          )
        )}

        {/* switch to academy */}
        <div style={{ padding: '10px 10px 0', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => navigate('/home')}
            aria-label="Switch to Academy"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'rgba(201,136,58,0.07)',
              border: '1px solid rgba(201,136,58,0.16)',
              borderRadius: 10, padding: '9px 13px',
              cursor: 'pointer', color: C.orange,
              fontSize: 13.5, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,136,58,0.14)'; e.currentTarget.style.borderColor = 'rgba(201,136,58,0.32)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,136,58,0.07)'; e.currentTarget.style.borderColor = 'rgba(201,136,58,0.16)'; }}
          >
            <i className="fas fa-graduation-cap" style={{ fontSize: 13, flexShrink: 0 }}></i>
            {!collapsed && <span>Switch to Academy</span>}
          </button>
        </div>

        {/* logout */}
        <div style={{ padding: 10, flexShrink: 0 }}>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="erp-logout"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <i className="fas fa-sign-out-alt" style={{ fontSize: 13, flexShrink: 0 }}></i>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* main */}
      <div className="erp-main d-flex flex-column" style={{ minHeight: '100vh' }}>

        {/* header */}
        <header style={{
          background: C.white,
          boxShadow: '0 1px 0 rgba(0,0,0,0.06), 0 2px 16px rgba(0,0,0,0.05)',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            <button
              className="d-lg-none"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Open menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.dark, flexShrink: 0 }}
            >
              <i className="fas fa-bars" style={{ fontSize: 18 }}></i>
            </button>
            <h1 style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20,
              color: C.dark, margin: 0, letterSpacing: '-0.01em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {pageTitle}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div className="d-none d-lg-block" style={{ position: 'relative', marginRight: 4 }}>
              <i className="fas fa-search" style={{
                position: 'absolute', left: 11,
                top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(0,0,0,0.28)', fontSize: 12, pointerEvents: 'none',
              }}></i>
              <input
                className="erp-search erp-search-light"
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                aria-label="Search"
              />
            </div>

            {/* ── Company Switcher (platform admin only, no-op/hidden for everyone else) ── */}
            <CompanySwitcher />

            {/* ── Currency selector ── */}
            <div ref={currencyRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                className="erp-topbtn"
                onClick={() => setCurrencyOpen(o => !o)}
                aria-expanded={currencyOpen}
                aria-label="Select currency"
                style={{
                  gap: 6,
                  background: currencyOpen ? 'rgba(201,136,58,0.12)' : '#F8F7F4',
                  borderColor: currencyOpen ? 'rgba(201,136,58,0.36)' : 'rgba(0,0,0,0.08)',
                }}
              >
                <span style={{ fontSize: 13, lineHeight: 1 }}>{CURRENCY_FLAG[selectedCurrency]}</span>
                <span style={{ color: C.dark, fontWeight: 700, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif" }}>
                  {selectedCurrency}
                </span>
                <i
                  className={`fas fa-chevron-${currencyOpen ? 'up' : 'down'}`}
                  style={{ color: C.muted, fontSize: 8 }}
                />
              </button>

              {currencyOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 190,
                  background: C.white,
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderTop: `2px solid ${C.orange}`,
                  borderRadius: 12,
                  boxShadow: '0 6px 0 rgba(0,0,0,0.04), 0 20px 48px rgba(0,0,0,0.16)',
                  overflow: 'hidden',
                  zIndex: 400,
                }}>
                  {Object.values(CURRENCIES).map(cur => (
                    <button
                      key={cur.code}
                      onClick={() => { setCurrency(cur.code); setCurrencyOpen(false); }}
                      style={{
                        width: '100%', background: cur.code === selectedCurrency ? 'rgba(201,136,58,0.08)' : 'none',
                        border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)',
                        padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.16s',
                        minHeight: 44,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,136,58,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = cur.code === selectedCurrency ? 'rgba(201,136,58,0.08)' : 'none'; }}
                    >
                      <span style={{ fontSize: 15 }}>{CURRENCY_FLAG[cur.code]}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: C.dark, fontWeight: 700, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif" }}>
                          {cur.code}
                          {cur.symbol !== cur.code && <span style={{ color: C.muted, fontWeight: 500 }}> — {cur.symbol}</span>}
                        </div>
                        <div style={{ color: C.muted, fontSize: 10.5, fontFamily: "'DM Sans', sans-serif" }}>
                          {cur.taxLabel || 'No Tax'}
                        </div>
                      </div>
                      {cur.code === selectedCurrency && (
                        <i className="fas fa-check" style={{ color: C.orange, fontSize: 11 }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="erp-bell erp-bell-light" aria-label="Notifications">
              <i className="fas fa-bell" style={{ color: C.dark, fontSize: 14 }}></i>
              <span style={{
                position: 'absolute', top: 8, right: 8,
                width: 7, height: 7, borderRadius: '50%',
                background: C.orange, border: '1.5px solid #fff',
                display: 'block',
              }}></span>
            </button>

            {/* ── Profile button + dropdown ── */}
            <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                aria-expanded={profileOpen}
                aria-label="User menu"
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  background: profileOpen ? 'rgba(201,136,58,0.12)' : '#F8F7F4',
                  border: `1px solid ${profileOpen ? 'rgba(201,136,58,0.36)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 12, padding: '5px 11px 5px 5px',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {/* avatar ring */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: C.orangeGrad,
                  boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${C.orange}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{initial}</span>
                </div>
                {/* name + role — hidden on small screens */}
                <div className="d-none d-md-block" style={{ textAlign: 'left' }}>
                  <div style={{ color: C.dark, fontWeight: 700, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2, whiteSpace: 'nowrap' }}>{adminName}</div>
                  <div style={{ color: C.muted, fontSize: 10.5, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>{roleLabel}</div>
                </div>
                <i
                  className={`fas fa-chevron-${profileOpen ? 'up' : 'down'}`}
                  style={{ color: C.muted, fontSize: 9, transition: 'transform 0.2s' }}
                />
              </button>

              {/* ── Dropdown ── */}
              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 230,
                  background: 'linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: '2px solid #C9883A',
                  borderRadius: 14,
                  boxShadow: '0 6px 0 rgba(0,0,0,0.45),0 20px 48px rgba(0,0,0,0.60)',
                  overflow: 'hidden',
                  zIndex: 400,
                }}>

                  {/* user header — compact */}
                  <div style={{
                    padding: '14px 16px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(201,136,58,0.04)',
                    display: 'flex', alignItems: 'center', gap: 11,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: C.orangeGrad,
                      boxShadow: `0 0 0 2px #1a1208, 0 0 0 3px ${C.orange}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>{initial}</span>
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>{adminName}</div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4,
                        background: 'rgba(201,136,58,0.12)',
                        border: '1px solid rgba(201,136,58,0.28)',
                        color: C.orange, fontSize: 9, fontWeight: 700,
                        padding: '2px 7px', borderRadius: 20,
                        letterSpacing: '0.10em', textTransform: 'uppercase',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 5px rgba(74,222,128,0.75)', flexShrink: 0 }} />
                        {roleLabel || 'User'}
                      </span>
                    </div>
                  </div>

                  {/* menu items — no desc, single-line */}
                  {([
                    { icon: 'fas fa-user-circle', label: 'My Profile',       to: '/erp/profile' },
                    { icon: 'fas fa-edit',         label: 'Edit Profile',     to: '/erp/profile/edit' },
                    { icon: 'fas fa-cog',          label: 'Account Settings', to: '/erp/settings/account' },
                    { icon: 'fas fa-lock',         label: 'Privacy Settings', to: '/erp/settings/privacy' },
                  ] as const).map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setProfileOpen(false); navigate(item.to); }}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        padding: '10px 16px',
                        display: 'flex', alignItems: 'center', gap: 11,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.16s',
                        minHeight: 44,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,136,58,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                        background: 'rgba(201,136,58,0.08)',
                        border: '1px solid rgba(201,136,58,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className={item.icon} style={{ color: C.orange, fontSize: 12 }} />
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
                        {item.label}
                      </span>
                      <i className="fas fa-chevron-right" style={{ color: 'rgba(255,255,255,0.16)', fontSize: 9, flexShrink: 0 }} />
                    </button>
                  ))}

                  {/* sign out */}
                  <div style={{ padding: '9px 12px 12px' }}>
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        background: 'rgba(239,68,68,0.07)',
                        border: '1px solid rgba(239,68,68,0.16)',
                        borderRadius: 9, padding: '9px 14px',
                        cursor: 'pointer', color: '#f87171',
                        fontSize: 13, fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'background 0.18s, color 0.18s',
                        minHeight: 40,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; e.currentTarget.style.color = '#fca5a5'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#f87171'; }}
                    >
                      <i className="fas fa-sign-out-alt" style={{ fontSize: 12 }} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {isPlatformAdmin && currentCompany && (
          <div style={{
            background: 'rgba(201,136,58,0.10)', borderBottom: '1px solid rgba(201,136,58,0.25)',
            padding: '8px 28px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="fas fa-eye" style={{ color: C.orange, fontSize: 12 }} />
            <span style={{ color: '#8B5E1A', fontSize: 12.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              You are viewing <strong>{currentCompany.name}</strong>'s data
            </span>
          </div>
        )}

        {/* content */}
        <div style={{ flex: 1, padding: '24px 28px', background: '#F8F7F4' }}>
          {children}
        </div>

      </div>

      {showAccessRequest && <MyAccessRequest onClose={() => setShowAccessRequest(false)} />}
    </div>
  );
};

export default ERPLayout;
