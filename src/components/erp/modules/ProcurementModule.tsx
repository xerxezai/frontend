import { useState } from 'react';
import ProcurementDashboard from './procurement/ProcurementDashboard';
import PurchaseOrdersPanel from './procurement/PurchaseOrdersPanel';
import SuppliersPanel from './procurement/SuppliersPanel';
import GoodsReceiptPanel from './procurement/GoodsReceiptPanel';
import BillsPanel from './procurement/BillsPanel';

type Tab = 'Dashboard' | 'Purchase Orders' | 'Suppliers' | 'Goods Receipt' | 'Bills';

const TAB_LABEL: Record<Tab, string> = {
  Dashboard: 'Dashboard', 'Purchase Orders': 'Purchase Orders', Suppliers: 'Suppliers',
  'Goods Receipt': 'Goods Receipt', Bills: 'Bills',
};

const ProcurementModule = ({ initialTab = 'Dashboard' }: { initialTab?: Tab }) => {
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

      {tab === 'Dashboard' && <ProcurementDashboard />}
      {tab === 'Purchase Orders' && <PurchaseOrdersPanel />}
      {tab === 'Suppliers' && <SuppliersPanel />}
      {tab === 'Goods Receipt' && <GoodsReceiptPanel />}
      {tab === 'Bills' && <BillsPanel />}
    </div>
  );
};

export default ProcurementModule;
