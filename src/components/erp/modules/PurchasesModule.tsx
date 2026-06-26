import { useState } from 'react';
import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const tabs = ['Purchase Orders', 'Vendors'];

const PurchasesModule = () => {
  const [tab, setTab] = useState('Purchase Orders');
  const orders = useERPList<any>('purchases/orders/');
  const vendors = useERPList<any>('purchases/vendors/');

  const orderCols = [
    { key: 'number', label: 'Number' },
    { key: 'vendor_name', label: 'Vendor' },
    { key: 'order_date', label: 'Order Date' },
    { key: 'expected_date', label: 'Expected' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
    { key: 'total', label: 'Total', render: (r: any) => `$${parseFloat(r.total || 0).toFixed(2)}` },
  ];

  const vendorCols = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'contact_person', label: 'Contact' },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? 'âœ…' : 'âŒ' },
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
      {tab === 'Purchase Orders' && <ERPTable title="Purchase Orders" columns={orderCols} {...orders} />}
      {tab === 'Vendors' && <ERPTable title="Vendors" columns={vendorCols} {...vendors} onDelete={vendors.remove} />}
    </div>
  );
};

export default PurchasesModule;


