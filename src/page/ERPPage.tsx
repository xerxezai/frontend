import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ERPLogin from '../components/erp/ERPLogin';
import ERPLayout from '../components/erp/ERPLayout';
import ERPDashboard from '../components/erp/ERPDashboard';
import CRMModule from '../components/erp/modules/CRMModule';
import HRModule from '../components/erp/modules/HRModule';
import InventoryModule from '../components/erp/modules/InventoryModule';
import SalesModule from '../components/erp/modules/SalesModule';
import InvoicingModule from '../components/erp/modules/InvoicingModule';
import PurchasesModule from '../components/erp/modules/PurchasesModule';
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

const ModuleLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
    <div className="spinner-border" style={{ color: '#C9883A' }} role="status"></div>
  </div>
);

const ERPPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('xerxez_token')
  );

  if (!isAuthenticated) {
    return <ERPLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <ERPLayout>
      <Suspense fallback={<ModuleLoader />}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"          element={<ERPDashboard />} />
          <Route path="crm"                element={<CRMModule />} />
          <Route path="hr"                 element={<HRModule />} />
          <Route path="inventory"          element={<InventoryModule />} />
          <Route path="sales"              element={<SalesModule />} />
          <Route path="invoicing"          element={<InvoicingModule />} />
          <Route path="purchases"          element={<PurchasesModule />} />
          <Route path="logistics"          element={<LogisticsModule />} />
          <Route path="accounting"         element={<AccountingModule />} />
          <Route path="mlm"                element={<MLMModule />} />

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
        </Routes>
      </Suspense>
    </ERPLayout>
  );
};

export default ERPPage;
