import { useState } from 'react';
import InvoicingModule from './InvoicingModule';
import AccountingDashboard from './accounting/AccountingDashboard';
import ExpensesPanel from './accounting/ExpensesPanel';
import TaxReportsPanel from './accounting/TaxReportsPanel';
import BalanceSheetPanel from './accounting/BalanceSheetPanel';

type Tab = 'Dashboard' | 'Invoices' | 'Payments' | 'Expenses' | 'Tax Reports' | 'Balance Sheet';

const TAB_LABEL: Record<Tab, string> = {
  Dashboard: 'Dashboard', Invoices: 'Invoices', Payments: 'Payments',
  Expenses: 'Expenses', 'Tax Reports': 'Tax Reports', 'Balance Sheet': 'Balance Sheet',
};

const AccountingModule = ({ initialTab = 'Dashboard' }: { initialTab?: Tab }) => {
  const [tab, setTab] = useState<Tab>(initialTab);

  const ts = (t: Tab): React.CSSProperties => ({
    borderRadius: 8, padding: '7px 18px', cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
    background: tab === t ? '#C9883A' : 'transparent', color: tab === t ? '#fff' : '#6B6B6B',
    border: tab === t ? 'none' : '1px solid rgba(0,0,0,0.10)',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(Object.keys(TAB_LABEL) as Tab[]).map(t => (
          <button key={t} style={ts(t)} onClick={() => setTab(t)}>{TAB_LABEL[t]}</button>
        ))}
      </div>

      {tab === 'Dashboard' && <AccountingDashboard />}
      {tab === 'Invoices' && <InvoicingModule initialTab="Invoices" />}
      {tab === 'Payments' && <InvoicingModule initialTab="Payments" />}
      {tab === 'Expenses' && <ExpensesPanel />}
      {tab === 'Tax Reports' && <TaxReportsPanel />}
      {tab === 'Balance Sheet' && <BalanceSheetPanel />}
    </div>
  );
};

export default AccountingModule;
