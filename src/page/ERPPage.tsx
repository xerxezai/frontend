import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ERPLogin from '../components/erp/ERPLogin';
import ERPLayout from '../components/erp/ERPLayout';
import { CurrencyProvider } from '../context/CurrencyContext';
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
    <CurrencyProvider>
    <ERPLayout>
      <Suspense fallback={<ModuleLoader />}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"          element={<ERPDashboard />} />

          {/* CRM */}
          <Route path="crm"                element={<CustomersPanel />} />
          <Route path="crm/leads"          element={<LeadsPanel />} />
          <Route path="crm/activities"     element={<ActivitiesPanel />} />
          <Route path="crm/pipeline"       element={<CRMPipeline />} />

          {/* Sales */}
          <Route path="sales"              element={<SalesDashboard />} />
          <Route path="sales/quotations"   element={<QuotationsPanel />} />
          <Route path="sales/orders"       element={<OrdersPanel />} />
          <Route path="sales/invoices"     element={<SalesInvoicesPanel />} />
          <Route path="sales/payments"     element={<SalesPaymentsPanel />} />

          {/* Procurement */}
          <Route path="procurement"                    element={<ProcurementDashboard />} />
          <Route path="procurement/purchase-orders"    element={<PurchaseOrdersPanel />} />
          <Route path="procurement/suppliers"          element={<SuppliersPanel />} />
          <Route path="procurement/goods-receipt"      element={<GoodsReceiptPanel />} />
          <Route path="procurement/bills"              element={<BillsPanel />} />
          <Route path="inventory"                      element={<InventoryModule />} />

          {/* Logistics */}
          <Route path="logistics"                    element={<LogisticsDashboard />} />
          <Route path="logistics/shipments"          element={<ShipmentsPanel />} />
          <Route path="logistics/deliveries"         element={<DeliveriesPanel />} />
          <Route path="logistics/tracking"           element={<TrackingPanel />} />
          <Route path="logistics/warehouses"         element={<WarehousesPanel />} />

          {/* Accounting */}
          <Route path="accounting"                  element={<AccountingDashboard />} />
          <Route path="accounting/invoices"         element={<InvoicesPanel />} />
          <Route path="accounting/payments"         element={<PaymentsPanel />} />
          <Route path="accounting/expenses"         element={<ExpensesPanel />} />
          <Route path="accounting/tax-reports"      element={<TaxReportsPanel />} />
          <Route path="accounting/balance-sheet"    element={<BalanceSheetPanel />} />

          {/* MLM */}
          <Route path="mlm"                  element={<MLMDashboard />} />
          <Route path="mlm/distributors"     element={<DistributorsPanel />} />
          <Route path="mlm/network-tree"     element={<NetworkTreePanel />} />
          <Route path="mlm/commissions"      element={<CommissionsPanel />} />
          <Route path="mlm/payouts"          element={<PayoutsPanel />} />
          <Route path="mlm/reports"          element={<MLMReportsPanel />} />

          {/* HR Overview */}
          <Route path="hr"                 element={<HRDashboard />} />
          <Route path="hr/employees"       element={<EmployeesPanel />} />
          <Route path="hr/departments"     element={<DepartmentsPanel />} />
          <Route path="hr/leave"           element={<LeaveRequestsPanel />} />
          <Route path="hr/performance"     element={<HRPerformancePage />} />
          <Route path="hr/documents"       element={<HRDocumentsPage />} />
          <Route path="hr/org-chart"       element={<HROrgChartPage />} />
          <Route path="hr/onboarding"      element={<HROnboardingPage />} />
          <Route path="hr/exit"            element={<HRExitPage />} />

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
  );
};

export default ERPPage;
