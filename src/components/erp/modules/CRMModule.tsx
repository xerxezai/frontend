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
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  const leadCols = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
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
      <div className="erp-tabs">
        {tabs.map(t => (
          <button key={t} className={`erp-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'Customers' && <ERPTable title="Customers" columns={customerCols} {...customers} onDelete={customers.remove} />}
      {tab === 'Leads' && <ERPTable title="Leads" columns={leadCols} {...leads} onDelete={leads.remove} />}
      {tab === 'Activities' && <ERPTable title="Activities" columns={activityCols} {...activities} onDelete={activities.remove} />}
    </div>
  );
};

export default CRMModule;
