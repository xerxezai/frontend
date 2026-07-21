import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ERPLogin from '../components/erp/ERPLogin';
import ERPLayout from '../components/erp/ERPLayout';
import { CurrencyProvider } from '../context/CurrencyContext';
import { AccessProvider, useAccess } from '../context/AccessContext';
import { CompanyProvider } from '../context/CompanyContext';
import ERPDashboard from '../components/erp/ERPDashboard';
import InventoryModule from '../components/erp/modules/InventoryModule';
import InvoicingModule from '../components/erp/modules/InvoicingModule';
import PurchasesModule from '../components/erp/modules/PurchasesModule';

// CRM — each sidebar item is its own dedicated page, no shared tab bar
import CustomersPanel from '../components/erp/modules/crm/CustomersPanel';
import LeadsPanel from '../components/erp/modules/crm/LeadsPanel';
import ActivitiesPanel from '../components/erp/modules/crm/ActivitiesPanel';
import CRMPipeline from '../components/erp/modules/crm/CRMPipeline';

// Sales
import SalesDashboard from '../components/erp/modules/sales/SalesDashboard';
import QuotationsPanel from '../components/erp/modules/sales/QuotationsPanel';
import OrdersPanel from '../components/erp/modules/sales/OrdersPanel';
import SalesInvoicesPanel from '../components/erp/modules/sales/SalesInvoicesPanel';
import SalesPaymentsPanel from '../components/erp/modules/sales/SalesPaymentsPanel';

// Procurement
import ProcurementDashboard from '../components/erp/modules/procurement/ProcurementDashboard';
import PurchaseOrdersPanel from '../components/erp/modules/procurement/PurchaseOrdersPanel';
import SuppliersPanel from '../components/erp/modules/procurement/SuppliersPanel';
import GoodsReceiptPanel from '../components/erp/modules/procurement/GoodsReceiptPanel';
import BillsPanel from '../components/erp/modules/procurement/BillsPanel';

// Document Management
import DocumentManagement from '../components/erp/modules/documents/DocumentManagement';

// Logistics
import LogisticsDashboard from '../components/erp/modules/logistics/LogisticsDashboard';
import ShipmentsPanel from '../components/erp/modules/logistics/ShipmentsPanel';
import DeliveriesPanel from '../components/erp/modules/logistics/DeliveriesPanel';
import TrackingPanel from '../components/erp/modules/logistics/TrackingPanel';
// Reuses the Inventory Warehouses panel directly — Logistics no longer manages its own
// separate warehouse list, so WH001 etc. are visible/editable in exactly one place.
import WarehousesPanel from '../components/erp/modules/inventory/WarehousesPanel';

// Accounting (Invoices/Payments reuse the standalone invoicing panels directly — no inner tabs)
import AccountingDashboard from '../components/erp/modules/accounting/AccountingDashboard';
import InvoicesPanel from '../components/erp/modules/invoicing/InvoicesPanel';
import PaymentsPanel from '../components/erp/modules/invoicing/PaymentsPanel';
import ExpensesPanel from '../components/erp/modules/accounting/ExpensesPanel';
import TaxReportsPanel from '../components/erp/modules/accounting/TaxReportsPanel';
import BalanceSheetPanel from '../components/erp/modules/accounting/BalanceSheetPanel';

// MLM
import MLMDashboard from '../components/erp/modules/mlm/MLMDashboard';
import DistributorsPanel from '../components/erp/modules/mlm/DistributorsPanel';
import NetworkTreePanel from '../components/erp/modules/mlm/NetworkTreePanel';
import CommissionsPanel from '../components/erp/modules/mlm/CommissionsPanel';
import PayoutsPanel from '../components/erp/modules/mlm/PayoutsPanel';
import MLMReportsPanel from '../components/erp/modules/mlm/MLMReportsPanel';

// HR Overview core pages
import HRDashboard from '../components/erp/modules/hr/HRDashboard';
import EmployeesPanel from '../components/erp/modules/hr/EmployeesPanel';
import DepartmentsPanel from '../components/erp/modules/hr/DepartmentsPanel';
import LeaveRequestsPanel from '../components/erp/modules/hr/LeaveRequestsPanel';

// HR & Payroll modules — lazy loaded
const AttendanceDashboard  = lazy(() => import('../components/erp/modules/attendance/AttendanceDashboardModule'));
const MyAttendance         = lazy(() => import('../components/erp/modules/attendance/MyAttendanceModule'));
const LeaveManagement      = lazy(() => import('../components/erp/modules/attendance/LeaveManagementModule'));
const AllAttendance        = lazy(() => import('../components/erp/modules/attendance/AllAttendanceModule'));
const LeaveApprovals       = lazy(() => import('../components/erp/modules/attendance/LeaveApprovalsModule'));
const ShiftManagement      = lazy(() => import('../components/erp/modules/attendance/ShiftManagementModule'));
const SalaryStructures     = lazy(() => import('../components/erp/modules/payroll/SalaryStructuresModule'));
const GeneratePayroll      = lazy(() => import('../components/erp/modules/payroll/GeneratePayrollModule'));
const PayrollReports       = lazy(() => import('../components/erp/modules/payroll/PayrollReportsModule'));
const MyPayslips           = lazy(() => import('../components/erp/modules/payroll/MyPayslipsModule'));

// Added HR feature pages — lazy loaded
const HRPerformancePage = lazy(() => import('../components/erp/modules/hr/HRPerformancePage'));
const HRDocumentsPage   = lazy(() => import('../components/erp/modules/hr/HRDocumentsPage'));
const HROrgChartPage    = lazy(() => import('../components/erp/modules/hr/HROrgChartPage'));
const HROnboardingPage  = lazy(() => import('../components/erp/modules/hr/HROnboardingPage'));
const HRExitPage        = lazy(() => import('../components/erp/modules/hr/HRExitPage'));

// EPC modules — lazy loaded
const ProjectDashboard  = lazy(() => import('../components/erp/modules/projects/ProjectDashboard'));
const ProjectList       = lazy(() => import('../components/erp/modules/projects/ProjectList'));
const ProjectDetail     = lazy(() => import('../components/erp/modules/projects/ProjectDetail'));
const AssetDashboard    = lazy(() => import('../components/erp/modules/assets/AssetDashboard'));
const AssetList         = lazy(() => import('../components/erp/modules/assets/AssetList'));
const AssetDetail       = lazy(() => import('../components/erp/modules/assets/AssetDetail'));
const QHSEDashboard     = lazy(() => import('../components/erp/modules/qhse/QHSEDashboard'));
const IncidentList      = lazy(() => import('../components/erp/modules/qhse/IncidentList'));
const InspectionList    = lazy(() => import('../components/erp/modules/qhse/InspectionList'));
const RiskRegister      = lazy(() => import('../components/erp/modules/qhse/RiskRegister'));
const SafetyChecklist   = lazy(() => import('../components/erp/modules/qhse/SafetyChecklist'));
const ComplianceTracker = lazy(() => import('../components/erp/modules/qhse/ComplianceTracker'));

// RBAC — lazy loaded
const UserManagement = lazy(() => import('../components/erp/rbac/UserManagement'));
const AccessDenied   = lazy(() => import('../components/erp/rbac/AccessDenied'));

// Multi-tenant company management — lazy loaded, platform admin only
const CompanyManagement = lazy(() => import('../components/erp/company/CompanyManagement'));
const CompanyDetail     = lazy(() => import('../components/erp/company/CompanyDetail'));

// Partner applications — lazy loaded, super admin only
const Partners = lazy(() => import('../components/erp/partners/Partners'));

// Profile & Settings pages
const MyProfilePage       = lazy(() => import('../components/erp/profile/MyProfilePage'));
const EditProfilePage     = lazy(() => import('../components/erp/profile/EditProfilePage'));
const AccountSettingsPage = lazy(() => import('../components/erp/profile/AccountSettingsPage'));
const PrivacySettingsPage = lazy(() => import('../components/erp/profile/PrivacySettingsPage'));

const ModuleLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
    <div className="spinner-border" style={{ color: '#C9883A' }} role="status"></div>
  </div>
);

/** Gates one of the 8 RBAC-controlled modules (never the EPC modules — hasAccess() already
 * always returns true for those). Renders the module's own loading/access-denied state while
 * AccessContext's initial my-access/ fetch is in flight, so a slow network never flashes
 * "Access Denied" before the real answer comes back. */
const ProtectedModuleRoute = ({ module, children }: { module: string; children: React.ReactNode }) => {
  const { hasAccess, isLoading } = useAccess();
  if (isLoading) return <ModuleLoader />;
  if (!hasAccess(module)) return <AccessDenied module={module} />;
  return <>{children}</>;
};

const ERPPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('xerxez_token')
  );

  if (!isAuthenticated) {
    return (
      <ERPLogin
        onSuccess={() => {
          setIsAuthenticated(true);
          const role = localStorage.getItem('xerxez_role') || '';
          let isStaff = false;
          try {
            const tokens = localStorage.getItem('auth_tokens');
            if (tokens) {
              const payload = JSON.parse(atob(JSON.parse(tokens).access.split('.')[1]));
              isStaff = payload.is_staff === true || payload.is_superuser === true;
            }
          } catch { /* malformed token — treat as non-admin */ }
          const isAdmin = isStaff || role === 'admin' || role === 'super_admin' || role === 'superuser' || role === 'manager';
          navigate(isAdmin ? '/home' : '/erp/dashboard', { replace: true });
        }}
      />
    );
  }

  return (
    <CompanyProvider>
    <AccessProvider>
    <CurrencyProvider>
    <ERPLayout>
      <Suspense fallback={<ModuleLoader />}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"          element={<ERPDashboard />} />

          {/* CRM — one of the 8 RBAC-controlled modules; every route below requires 'crm' access. */}
          <Route path="crm"                element={<ProtectedModuleRoute module="crm"><CustomersPanel /></ProtectedModuleRoute>} />
          <Route path="crm/leads"          element={<ProtectedModuleRoute module="crm"><LeadsPanel /></ProtectedModuleRoute>} />
          <Route path="crm/activities"     element={<ProtectedModuleRoute module="crm"><ActivitiesPanel /></ProtectedModuleRoute>} />
          <Route path="crm/pipeline"       element={<ProtectedModuleRoute module="crm"><CRMPipeline /></ProtectedModuleRoute>} />

          {/* Sales — RBAC-controlled. */}
          <Route path="sales"              element={<ProtectedModuleRoute module="sales"><SalesDashboard /></ProtectedModuleRoute>} />
          <Route path="sales/quotations"   element={<ProtectedModuleRoute module="sales"><QuotationsPanel /></ProtectedModuleRoute>} />
          <Route path="sales/orders"       element={<ProtectedModuleRoute module="sales"><OrdersPanel /></ProtectedModuleRoute>} />
          <Route path="sales/invoices"     element={<ProtectedModuleRoute module="sales"><SalesInvoicesPanel /></ProtectedModuleRoute>} />
          <Route path="sales/payments"     element={<ProtectedModuleRoute module="sales"><SalesPaymentsPanel /></ProtectedModuleRoute>} />

          {/* Procurement — RBAC-controlled (Inventory lives under the Procurement submenu). */}
          <Route path="procurement"                    element={<ProtectedModuleRoute module="procurement"><ProcurementDashboard /></ProtectedModuleRoute>} />
          <Route path="procurement/purchase-orders"    element={<ProtectedModuleRoute module="procurement"><PurchaseOrdersPanel /></ProtectedModuleRoute>} />
          <Route path="procurement/suppliers"          element={<ProtectedModuleRoute module="procurement"><SuppliersPanel /></ProtectedModuleRoute>} />
          <Route path="procurement/goods-receipt"      element={<ProtectedModuleRoute module="procurement"><GoodsReceiptPanel /></ProtectedModuleRoute>} />
          <Route path="procurement/bills"              element={<ProtectedModuleRoute module="procurement"><BillsPanel /></ProtectedModuleRoute>} />
          <Route path="inventory"                      element={<ProtectedModuleRoute module="procurement"><InventoryModule /></ProtectedModuleRoute>} />

          {/* Document Management — EPC module, never gated (Rule 2). */}
          <Route path="documents" element={<ProtectedModuleRoute module="document_management"><DocumentManagement /></ProtectedModuleRoute>} />

          {/* Logistics — RBAC-controlled. */}
          <Route path="logistics"                    element={<ProtectedModuleRoute module="logistics"><LogisticsDashboard /></ProtectedModuleRoute>} />
          <Route path="logistics/shipments"          element={<ProtectedModuleRoute module="logistics"><ShipmentsPanel /></ProtectedModuleRoute>} />
          <Route path="logistics/deliveries"         element={<ProtectedModuleRoute module="logistics"><DeliveriesPanel /></ProtectedModuleRoute>} />
          <Route path="logistics/tracking"           element={<ProtectedModuleRoute module="logistics"><TrackingPanel /></ProtectedModuleRoute>} />
          <Route path="logistics/warehouses"         element={<ProtectedModuleRoute module="logistics"><WarehousesPanel /></ProtectedModuleRoute>} />

          {/* Accounting — RBAC-controlled. */}
          <Route path="accounting"                  element={<ProtectedModuleRoute module="accounting"><AccountingDashboard /></ProtectedModuleRoute>} />
          <Route path="accounting/invoices"         element={<ProtectedModuleRoute module="accounting"><InvoicesPanel /></ProtectedModuleRoute>} />
          <Route path="accounting/payments"         element={<ProtectedModuleRoute module="accounting"><PaymentsPanel /></ProtectedModuleRoute>} />
          <Route path="accounting/expenses"         element={<ProtectedModuleRoute module="accounting"><ExpensesPanel /></ProtectedModuleRoute>} />
          <Route path="accounting/tax-reports"      element={<ProtectedModuleRoute module="accounting"><TaxReportsPanel /></ProtectedModuleRoute>} />
          <Route path="accounting/balance-sheet"    element={<ProtectedModuleRoute module="accounting"><BalanceSheetPanel /></ProtectedModuleRoute>} />

          {/* MLM — RBAC-controlled. */}
          <Route path="mlm"                  element={<ProtectedModuleRoute module="mlm"><MLMDashboard /></ProtectedModuleRoute>} />
          <Route path="mlm/distributors"     element={<ProtectedModuleRoute module="mlm"><DistributorsPanel /></ProtectedModuleRoute>} />
          <Route path="mlm/network-tree"     element={<ProtectedModuleRoute module="mlm"><NetworkTreePanel /></ProtectedModuleRoute>} />
          <Route path="mlm/commissions"      element={<ProtectedModuleRoute module="mlm"><CommissionsPanel /></ProtectedModuleRoute>} />
          <Route path="mlm/payouts"          element={<ProtectedModuleRoute module="mlm"><PayoutsPanel /></ProtectedModuleRoute>} />
          <Route path="mlm/reports"          element={<ProtectedModuleRoute module="mlm"><MLMReportsPanel /></ProtectedModuleRoute>} />

          {/* HR Overview — RBAC-controlled. The separate "HR & Payroll" routes below
              (attendance/leave/payslips) are NOT wrapped here: several are self-service pages
              any employee must be able to reach regardless of HR module access, and the
              admin-only ones already have their own isAdminUser() gate in the sidebar —
              layering RBAC on top risked locking staff out of their own attendance/payslips. */}
          <Route path="hr"                 element={<ProtectedModuleRoute module="hr"><HRDashboard /></ProtectedModuleRoute>} />
          <Route path="hr/employees"       element={<ProtectedModuleRoute module="hr"><EmployeesPanel /></ProtectedModuleRoute>} />
          <Route path="hr/departments"     element={<ProtectedModuleRoute module="hr"><DepartmentsPanel /></ProtectedModuleRoute>} />
          <Route path="hr/leave"           element={<ProtectedModuleRoute module="hr"><LeaveRequestsPanel /></ProtectedModuleRoute>} />
          <Route path="hr/performance"     element={<ProtectedModuleRoute module="hr"><HRPerformancePage /></ProtectedModuleRoute>} />
          <Route path="hr/documents"       element={<ProtectedModuleRoute module="hr"><HRDocumentsPage /></ProtectedModuleRoute>} />
          <Route path="hr/org-chart"       element={<ProtectedModuleRoute module="hr"><HROrgChartPage /></ProtectedModuleRoute>} />
          <Route path="hr/onboarding"      element={<ProtectedModuleRoute module="hr"><HROnboardingPage /></ProtectedModuleRoute>} />
          <Route path="hr/exit"            element={<ProtectedModuleRoute module="hr"><HRExitPage /></ProtectedModuleRoute>} />

          {/* RBAC — User Management (super admin only, enforced by the backend; the sidebar
              also only shows this link to super admins). */}
          <Route path="users"              element={<UserManagement />} />

          {/* Multi-tenant company management (platform admin only, enforced by the backend
              and — for the sidebar link's visibility — by isPlatformAdmin client-side). */}
          <Route path="companies"          element={<CompanyManagement />} />
          <Route path="companies/:id"      element={<CompanyDetail />} />
          <Route path="partners"           element={<Partners />} />

          {/* EPC Modules */}
          <Route path="projects"           element={<ProtectedModuleRoute module="project_management"><ProjectDashboard /></ProtectedModuleRoute>} />
          <Route path="projects/list"      element={<ProtectedModuleRoute module="project_management"><ProjectList /></ProtectedModuleRoute>} />
          <Route path="projects/:id"       element={<ProtectedModuleRoute module="project_management"><ProjectDetail /></ProtectedModuleRoute>} />
          <Route path="projects/:id/tasks" element={<ProtectedModuleRoute module="project_management"><ProjectDetail /></ProtectedModuleRoute>} />
          <Route path="projects/:id/gantt" element={<ProtectedModuleRoute module="project_management"><ProjectDetail /></ProtectedModuleRoute>} />
          <Route path="assets"             element={<ProtectedModuleRoute module="asset_management"><AssetDashboard /></ProtectedModuleRoute>} />
          <Route path="assets/list"        element={<ProtectedModuleRoute module="asset_management"><AssetList /></ProtectedModuleRoute>} />
          <Route path="assets/:id"         element={<ProtectedModuleRoute module="asset_management"><AssetDetail /></ProtectedModuleRoute>} />
          <Route path="qhse"               element={<ProtectedModuleRoute module="qhse"><QHSEDashboard /></ProtectedModuleRoute>} />
          <Route path="qhse/incidents"     element={<ProtectedModuleRoute module="qhse"><IncidentList /></ProtectedModuleRoute>} />
          <Route path="qhse/inspections"   element={<ProtectedModuleRoute module="qhse"><InspectionList /></ProtectedModuleRoute>} />
          <Route path="qhse/risks"         element={<ProtectedModuleRoute module="qhse"><RiskRegister /></ProtectedModuleRoute>} />
          <Route path="qhse/checklists"    element={<ProtectedModuleRoute module="qhse"><SafetyChecklist /></ProtectedModuleRoute>} />
          <Route path="qhse/compliance"    element={<ProtectedModuleRoute module="qhse"><ComplianceTracker /></ProtectedModuleRoute>} />

          {/* HR & Payroll */}
          <Route path="attendance"         element={<AttendanceDashboard />} />
          <Route path="my-attendance"      element={<MyAttendance />} />
          <Route path="leave"              element={<LeaveManagement />} />
          <Route path="all-attendance"     element={<AllAttendance />} />
          <Route path="leave-approvals"    element={<LeaveApprovals />} />
          <Route path="shifts"             element={<ShiftManagement />} />
          <Route path="salary-structures"  element={<SalaryStructures />} />
          <Route path="payroll-generate"   element={<GeneratePayroll />} />
          <Route path="payroll-reports"    element={<PayrollReports />} />
          <Route path="my-payslips"        element={<MyPayslips />} />

          {/* Legacy routes — unlinked from the sidebar, kept for direct-URL access */}
          <Route path="invoicing"          element={<InvoicingModule />} />
          <Route path="purchases"          element={<PurchasesModule />} />

          {/* Profile & Settings */}
          <Route path="profile"             element={<MyProfilePage />} />
          <Route path="profile/edit"        element={<EditProfilePage />} />
          <Route path="settings/account"    element={<AccountSettingsPage />} />
          <Route path="settings/privacy"    element={<PrivacySettingsPage />} />
        </Routes>
      </Suspense>
    </ERPLayout>
    </CurrencyProvider>
    </AccessProvider>
    </CompanyProvider>
  );
};

export default ERPPage;
