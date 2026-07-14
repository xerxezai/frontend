import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ERPLogin from '../components/erp/ERPLogin';
import ERPLayout from '../components/erp/ERPLayout';
import ERPDashboard from '../components/erp/ERPDashboard';
import CRMModule from '../components/erp/modules/CRMModule';
import HRModule from '../components/erp/modules/HRModule';
import InventoryModule from '../components/erp/modules/InventoryModule';
import SalesModule from '../components/erp/modules/SalesModule';
import InvoicingModule from '../components/erp/modules/InvoicingModule';
import PurchasesModule from '../components/erp/modules/PurchasesModule';
import ProcurementModule from '../components/erp/modules/ProcurementModule';
import LogisticsModule from '../components/erp/modules/LogisticsModule';
import AccountingModule from '../components/erp/modules/AccountingModule';
import MLMModule from '../components/erp/modules/MLMModule';

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
    <ERPLayout>
      <Suspense fallback={<ModuleLoader />}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"          element={<ERPDashboard />} />
          <Route path="crm"                element={<CRMModule />} />
          <Route path="hr"                 element={<HRModule />} />
          <Route path="hr/employees"       element={<HRModule initialTab="Employees" />} />
          <Route path="hr/departments"     element={<HRModule initialTab="Departments" />} />
          <Route path="hr/leave"           element={<HRModule initialTab="Leave Requests" />} />
          <Route path="hr/performance"     element={<HRPerformancePage />} />
          <Route path="hr/documents"       element={<HRDocumentsPage />} />
          <Route path="hr/org-chart"       element={<HROrgChartPage />} />
          <Route path="hr/onboarding"      element={<HROnboardingPage />} />
          <Route path="hr/exit"            element={<HRExitPage />} />
          <Route path="inventory"          element={<InventoryModule />} />
          <Route path="sales"              element={<SalesModule />} />
          <Route path="sales/quotations"   element={<SalesModule initialTab="Quotations" />} />
          <Route path="sales/orders"       element={<SalesModule initialTab="Orders" />} />
          <Route path="invoicing"          element={<InvoicingModule />} />
          <Route path="purchases"          element={<PurchasesModule />} />
          <Route path="procurement"                    element={<ProcurementModule />} />
          <Route path="procurement/purchase-orders"    element={<ProcurementModule initialTab="Purchase Orders" />} />
          <Route path="procurement/suppliers"          element={<ProcurementModule initialTab="Suppliers" />} />
          <Route path="procurement/goods-receipt"      element={<ProcurementModule initialTab="Goods Receipt" />} />
          <Route path="procurement/bills"              element={<ProcurementModule initialTab="Bills" />} />
          <Route path="logistics"                    element={<LogisticsModule />} />
          <Route path="logistics/shipments"          element={<LogisticsModule initialTab="Shipments" />} />
          <Route path="logistics/deliveries"         element={<LogisticsModule initialTab="Deliveries" />} />
          <Route path="logistics/tracking"           element={<LogisticsModule initialTab="Tracking" />} />
          <Route path="logistics/warehouses"         element={<LogisticsModule initialTab="Warehouses" />} />
          <Route path="accounting"                  element={<AccountingModule />} />
          <Route path="accounting/invoices"         element={<AccountingModule initialTab="Invoices" />} />
          <Route path="accounting/payments"         element={<AccountingModule initialTab="Payments" />} />
          <Route path="accounting/expenses"         element={<AccountingModule initialTab="Expenses" />} />
          <Route path="accounting/tax-reports"      element={<AccountingModule initialTab="Tax Reports" />} />
          <Route path="accounting/balance-sheet"    element={<AccountingModule initialTab="Balance Sheet" />} />
          <Route path="mlm"                  element={<MLMModule />} />
          <Route path="mlm/distributors"     element={<MLMModule initialTab="Distributors" />} />
          <Route path="mlm/network-tree"     element={<MLMModule initialTab="Network Tree" />} />
          <Route path="mlm/commissions"      element={<MLMModule initialTab="Commissions" />} />
          <Route path="mlm/payouts"          element={<MLMModule initialTab="Payouts" />} />
          <Route path="mlm/reports"          element={<MLMModule initialTab="Reports" />} />

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

          {/* Profile & Settings */}
          <Route path="profile"             element={<MyProfilePage />} />
          <Route path="profile/edit"        element={<EditProfilePage />} />
          <Route path="settings/account"    element={<AccountSettingsPage />} />
          <Route path="settings/privacy"    element={<PrivacySettingsPage />} />
        </Routes>
      </Suspense>
    </ERPLayout>
  );
};

export default ERPPage;
