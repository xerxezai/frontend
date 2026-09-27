import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { NAVY, GOLD, PAGE_BG, FF, MUTED, BORDER, CARD_SHADOW, injectExecutiveKeyframes } from './dashboard/dashboardShared';
import OverviewTab from './dashboard/OverviewTab';
import CRMTab from './dashboard/CRMTab';
import SalesTab from './dashboard/SalesTab';
import ProcurementTab from './dashboard/ProcurementTab';
import AccountingTab from './dashboard/AccountingTab';
import HRTab from './dashboard/HRTab';

type TabKey = 'overview' | 'crm' | 'sales' | 'procurement' | 'accounting' | 'hr';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'crm', label: 'CRM' },
  { key: 'sales', label: 'Sales' },
  { key: 'procurement', label: 'Procurement' },
  { key: 'accounting', label: 'Accounting' },
  { key: 'hr', label: 'HR Overview' },
];

const ERPDashboard = () => {
  const [tab, setTab] = useState<TabKey>('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ background: PAGE_BG, fontFamily: FF }}>
      {injectExecutiveKeyframes()}
      <style>{`@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                padding: '10px 16px', fontFamily: FF, fontWeight: 700, fontSize: 13.5,
                color: tab === t.key ? NAVY : MUTED,
                borderBottom: tab === t.key ? `2.5px solid ${NAVY}` : '2.5px solid transparent',
                transition: 'color 180ms, border-color 180ms',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: `1px solid ${BORDER}`,
            borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: NAVY, fontSize: 12.5, fontWeight: 700,
            fontFamily: FF, boxShadow: CARD_SHADOW, flexShrink: 0,
          }}
        >
          <RefreshCw size={13} color={GOLD} />Refresh
        </button>
      </div>

      <div key={`${tab}-${refreshKey}`} style={{ animation: 'execTabIn 220ms ease both' }}>
        {tab === 'overview' && <OverviewTab refreshKey={refreshKey} onNavigateTab={(t) => setTab(t as TabKey)} />}
        {tab === 'crm' && <CRMTab refreshKey={refreshKey} />}
        {tab === 'sales' && <SalesTab refreshKey={refreshKey} />}
        {tab === 'procurement' && <ProcurementTab refreshKey={refreshKey} />}
        {tab === 'accounting' && <AccountingTab refreshKey={refreshKey} />}
        {tab === 'hr' && <HRTab refreshKey={refreshKey} />}
      </div>
    </div>
  );
};

export default ERPDashboard;
