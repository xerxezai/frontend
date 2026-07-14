import { useState } from 'react';
import QuotationsPanel from './sales/QuotationsPanel';
import OrdersPanel from './sales/OrdersPanel';
import SalesDashboard from './sales/SalesDashboard';

type Tab = 'Dashboard' | 'Quotations' | 'Orders';

const SalesModule = ({ initialTab = 'Dashboard' }: { initialTab?: Tab }) => {
  const [tab, setTab] = useState<Tab>(initialTab);

  const ts = (t: Tab): React.CSSProperties => ({
    borderRadius: 8, padding: '7px 18px', cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
    background: tab === t ? '#C9883A' : 'transparent', color: tab === t ? '#fff' : '#6B6B6B',
    border: tab === t ? 'none' : '1px solid rgba(0,0,0,0.10)',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button style={ts('Dashboard')}  onClick={() => setTab('Dashboard')}>Dashboard</button>
        <button style={ts('Quotations')} onClick={() => setTab('Quotations')}>Quotations</button>
        <button style={ts('Orders')}     onClick={() => setTab('Orders')}>Sales Orders</button>
      </div>

      {tab === 'Dashboard'  && <SalesDashboard />}
      {tab === 'Quotations' && <QuotationsPanel />}
      {tab === 'Orders'     && <OrdersPanel />}
    </div>
  );
};

export default SalesModule;
