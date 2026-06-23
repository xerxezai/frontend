import { useState } from 'react';
import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const tabs = ['Customers', 'Leads', 'Activities'];

const CRMModule = () => {
  const [tab, setTab] = useState('Customers');
  const customers = useERPList<any>('crm/customers/');
  const leads = useERPList<any>('crm/leads/');
  const activities = useERPList<any>('crm/activities/');

  const customerCols = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? 'âœ…' : 'âŒ' },
  ];

  const leadCols = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status', render: (r: any) => <span className="badge rounded-pill" style={{ background: ['won','active'].includes(r.status) ? '#d1fae5' : ['lost','cancelled'].includes(r.status) ? '#fee2e2' : '#fef3c7', color: ['won','active'].includes(r.status) ? '#065f46' : ['lost','cancelled'].includes(r.status) ? '#991b1b' : '#92400e', fontSize: 11 }}>{r.status}</span> },
    { key: 'estimated_value', label: 'Value', render: (r: any) => `$${parseFloat(r.estimated_value || 0).toFixed(2)}` },
  ];

  const activityCols = [
    { key: 'type', label: 'Type' },
    { key: 'summary', label: 'Summary' },
    { key: 'user_username', label: 'By' },
    { key: 'occurred_at', label: 'Date', render: (r: any) => new Date(r.occurred_at).toLocaleDateString() },
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
      {tab === 'Customers' && <ERPTable title="Customers" columns={customerCols} {...customers} onDelete={customers.remove} />}
      {tab === 'Leads' && <ERPTable title="Leads" columns={leadCols} {...leads} onDelete={leads.remove} />}
      {tab === 'Activities' && <ERPTable title="Activities" columns={activityCols} {...activities} onDelete={activities.remove} />}
    </div>
  );
};

export default CRMModule;

