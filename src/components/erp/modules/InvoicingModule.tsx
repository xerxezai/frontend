import { useState } from 'react';
import InvoicesPanel from './invoicing/InvoicesPanel';
import PaymentsPanel from './invoicing/PaymentsPanel';

type Tab = 'Invoices' | 'Payments';

const InvoicingModule = () => {
  const [tab, setTab] = useState<Tab>('Invoices');

  const ts = (t: Tab): React.CSSProperties => ({
    borderRadius: 8, padding: '7px 18px', cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
    background: tab === t ? '#C9883A' : 'transparent', color: tab === t ? '#fff' : '#6B6B6B',
    border: tab === t ? 'none' : '1px solid rgba(0,0,0,0.10)',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button style={ts('Invoices')} onClick={() => setTab('Invoices')}>Invoices</button>
        <button style={ts('Payments')} onClick={() => setTab('Payments')}>Payments</button>
      </div>

      {tab === 'Invoices' && <InvoicesPanel />}
      {tab === 'Payments' && <PaymentsPanel />}
    </div>
  );
};

export default InvoicingModule;
