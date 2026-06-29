import { useState, useEffect } from 'react';
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

const ERPPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('xerxez_token'));
  }, []);

  if (!isAuthenticated) {
    return <ERPLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <ERPLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ERPDashboard />} />
        <Route path="crm" element={<CRMModule />} />
        <Route path="hr" element={<HRModule />} />
        <Route path="inventory" element={<InventoryModule />} />
        <Route path="sales" element={<SalesModule />} />
        <Route path="invoicing" element={<InvoicingModule />} />
        <Route path="purchases" element={<PurchasesModule />} />
        <Route path="logistics" element={<LogisticsModule />} />
        <Route path="accounting" element={<AccountingModule />} />
        <Route path="mlm" element={<MLMModule />} />
      </Routes>
    </ERPLayout>
  );
};

export default ERPPage;

