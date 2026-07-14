import { useState } from 'react';
import LogisticsDashboard from './logistics/LogisticsDashboard';
import ShipmentsPanel from './logistics/ShipmentsPanel';
import DeliveriesPanel from './logistics/DeliveriesPanel';
import TrackingPanel from './logistics/TrackingPanel';
import WarehousesPanel from './logistics/WarehousesPanel';

type Tab = 'Dashboard' | 'Shipments' | 'Deliveries' | 'Tracking' | 'Warehouses';

const TAB_LABEL: Record<Tab, string> = {
  Dashboard: 'Dashboard', Shipments: 'Shipments', Deliveries: 'Deliveries',
  Tracking: 'Tracking', Warehouses: 'Warehouses',
};

const LogisticsModule = ({ initialTab = 'Dashboard' }: { initialTab?: Tab }) => {
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

      {tab === 'Dashboard' && <LogisticsDashboard />}
      {tab === 'Shipments' && <ShipmentsPanel />}
      {tab === 'Deliveries' && <DeliveriesPanel />}
      {tab === 'Tracking' && <TrackingPanel />}
      {tab === 'Warehouses' && <WarehousesPanel />}
    </div>
  );
};

export default LogisticsModule;
