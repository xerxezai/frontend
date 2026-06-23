import { useState } from 'react';
import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const tabs = ['Sales Orders', 'Quotations'];

const SalesModule = () => {
  const [tab, setTab] = useState('Sales Orders');
  const orders = useERPList<any>('sales/orders/');
  const quotations = useERPList<any>('sales/quotations/');

  const orderCols = [
    { key: 'number', label: 'Number' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'order_date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
    { key: 'total', label: 'Total', render: (r: any) => `$${parseFloat(r.total || 0).toFixed(2)}` },
  ];

  const quotCols = [
    { key: 'number', label: 'Number' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'issue_date', label: 'Issue Date' },
    { key: 'valid_until', label: 'Valid Until' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
    { key: 'total', label: 'Total', render: (r: any) => `$${parseFloat(r.total || 0).toFixed(2)}` },
  ];

  return (
    <div>
      <div className="erp-tabs">
        {tabs.map(t => (
          <button key={t} className={`erp-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'Sales Orders' && <ERPTable title="Sales Orders" columns={orderCols} {...orders} />}
      {tab === 'Quotations' && <ERPTable title="Quotations" columns={quotCols} {...quotations} />}
    </div>
  );
};

export default SalesModule;
