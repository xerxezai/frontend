import { useState } from 'react';
import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const tabs = ['Accounts', 'Journal Entries'];

const AccountingModule = () => {
  const [tab, setTab] = useState('Accounts');
  const accounts = useERPList<any>('accounting/accounts/');
  const entries = useERPList<any>('accounting/journal-entries/');

  const accountCols = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'parent_name', label: 'Parent' },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  const entryCols = [
    { key: 'number', label: 'Number' },
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'reference', label: 'Reference' },
    { key: 'posted', label: 'Posted', render: (r: any) => r.posted ? '✅' : '⏳' },
    { key: 'is_balanced', label: 'Balanced', render: (r: any) => r.is_balanced ? '✅' : '❌' },
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
      {tab === 'Accounts' && <ERPTable title="Chart of Accounts" columns={accountCols} {...accounts} />}
      {tab === 'Journal Entries' && <ERPTable title="Journal Entries" columns={entryCols} {...entries} />}
    </div>
  );
};

export default AccountingModule;
