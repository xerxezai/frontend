import { useState } from 'react';
import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const tabs = ['Invoices', 'Payments'];

const InvoicingModule = () => {
  const [tab, setTab] = useState('Invoices');
  const invoices = useERPList<any>('invoicing/invoices/');
  const payments = useERPList<any>('invoicing/payments/');

  const invCols = [
    { key: 'number', label: 'Number' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'issue_date', label: 'Issue Date' },
    { key: 'due_date', label: 'Due Date' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
    { key: 'total', label: 'Total', render: (r: any) => `$${parseFloat(r.total || 0).toFixed(2)}` },
    { key: 'balance', label: 'Balance', render: (r: any) => `$${parseFloat(r.balance || 0).toFixed(2)}` },
  ];

  const paymentCols = [
    { key: 'invoice_number', label: 'Invoice' },
    { key: 'amount', label: 'Amount', render: (r: any) => `$${parseFloat(r.amount).toFixed(2)}` },
    { key: 'method', label: 'Method' },
    { key: 'reference', label: 'Reference' },
    { key: 'paid_at', label: 'Date', render: (r: any) => new Date(r.paid_at).toLocaleDateString() },
  ];

  return (
    <div>
      <ul className="nav nav-pills mb-3 flex-wrap gap-1">
        {tabs.map(t => (
          <li key={t} className="nav-item">
            <button className={`nav-link${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}
              style={tab === t ? { background: '#C9883A', border: 'none' } : { border: 'none', color: '#555' }}>{t}</button>
          </li>
        ))}
      </ul>
      {tab === 'Invoices' && <ERPTable title="Invoices" columns={invCols} {...invoices} />}
      {tab === 'Payments' && <ERPTable title="Payments" columns={paymentCols} {...payments} />}
    </div>
  );
};

export default InvoicingModule;


