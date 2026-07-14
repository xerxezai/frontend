import { useState } from 'react';
import InvoicesPanel from './invoicing/InvoicesPanel';
import PaymentsPanel from './invoicing/PaymentsPanel';
import RecurringInvoicesPanel from './invoicing/RecurringInvoicesPanel';
import CreditNotesPanel from './invoicing/CreditNotesPanel';
import ReportsPanel from './invoicing/ReportsPanel';

type Tab = 'Invoices' | 'Payments' | 'Recurring' | 'CreditNotes' | 'Reports';

const TAB_LABEL: Record<Tab, string> = {
  Invoices: 'Invoices', Payments: 'Payments', Recurring: 'Recurring Invoices',
  CreditNotes: 'Credit Notes', Reports: 'Reports',
};

const InvoicingModule = ({ initialTab = 'Invoices' }: { initialTab?: Tab }) => {
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

      {tab === 'Invoices' && <InvoicesPanel />}
      {tab === 'Payments' && <PaymentsPanel />}
      {tab === 'Recurring' && <RecurringInvoicesPanel />}
      {tab === 'CreditNotes' && <CreditNotesPanel />}
      {tab === 'Reports' && <ReportsPanel />}
    </div>
  );
};

export default InvoicingModule;
