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
      <ul className="nav nav-pills mb-3 flex-wrap gap-1">
        {tabs.map(t => (
          <li key={t} className="nav-item">
            <button className={`nav-link${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}
              style={tab === t ? { background: '#6c57d2', border: 'none' } : { border: 'none', color: '#555' }}>{t}</button>
          </li>
        ))}
      </ul>
      {tab === 'Sales Orders' && <ERPTable title="Sales Orders" columns={orderCols} {...orders} />}
      {tab === 'Quotations' && <ERPTable title="Quotations" columns={quotCols} {...quotations} />}
    </div>
  );
};

export default SalesModule;

