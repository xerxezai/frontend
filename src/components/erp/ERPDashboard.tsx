import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAccess } from '../../context/AccessContext';
import { NAVY, GOLD, PAGE_BG, FF, MUTED, BORDER, CARD_SHADOW, injectExecutiveKeyframes } from './dashboard/dashboardShared';
import OverviewTab from './dashboard/OverviewTab';
import CRMTab from './dashboard/CRMTab';
import SalesTab from './dashboard/SalesTab';
import ProcurementTab from './dashboard/ProcurementTab';
import AccountingTab from './dashboard/AccountingTab';
import HRTab from './dashboard/HRTab';

type TabKey = 'overview' | 'crm' | 'sales' | 'procurement' | 'accounting' | 'hr';
// `module` is the AccessContext module name a Module Admin needs in `accessibleModules` to see
// that tab — 'overview' has none, so it's always shown to anyone who reaches this dashboard.
const TABS: { key: TabKey; label: string; module?: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'crm', label: 'CRM', module: 'crm' },
  { key: 'sales', label: 'Sales', module: 'sales' },
  { key: 'procurement', label: 'Procurement', module: 'procurement' },
  { key: 'accounting', label: 'Accounting', module: 'accounting' },
  { key: 'hr', label: 'HR Overview', module: 'hr' },
];

const ERPDashboard = () => {
  const { isSuperAdmin, isCompanyAdmin, accessibleModules } = useAccess();
  const [tab, setTab] = useState<TabKey>('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  // Super Admin / Company Admin see every tab (they have all 8 core modules, per
  // AccessContext.tsx). A Module Admin — the only other role that ever reaches this
  // component, since DashboardRoute sends Regular User/Read Only to MyDashboard instead —
  // only sees Overview plus the tab(s) matching modules actually in accessibleModules.
  const visibleTabs = useMemo(() => {
    if (isSuperAdmin || isCompanyAdmin) return TABS;
    const granted = new Set(accessibleModules.map(m => m.name));
    return TABS.filter(t => !t.module || granted.has(t.module));
  }, [isSuperAdmin, isCompanyAdmin, accessibleModules]);

  // If the previously-selected tab just got filtered out (e.g. access was narrowed), fall
  // back to Overview rather than rendering a blank pane for a tab with no button to reach it.
  const activeTab = visibleTabs.some(t => t.key === tab) ? tab : 'overview';

  return (
    <div style={{ background: PAGE_BG, fontFamily: FF }}>
      {injectExecutiveKeyframes()}
      <style>{`@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {visibleTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                padding: '10px 16px', fontFamily: FF, fontWeight: 700, fontSize: 13.5,
                color: activeTab === t.key ? NAVY : MUTED,
                borderBottom: activeTab === t.key ? `2.5px solid ${NAVY}` : '2.5px solid transparent',
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

      <div key={`${activeTab}-${refreshKey}`} style={{ animation: 'execTabIn 220ms ease both' }}>
        {activeTab === 'overview' && <OverviewTab refreshKey={refreshKey} onNavigateTab={(t) => setTab(t as TabKey)} />}
        {activeTab === 'crm' && <CRMTab refreshKey={refreshKey} />}
        {activeTab === 'sales' && <SalesTab refreshKey={refreshKey} />}
        {activeTab === 'procurement' && <ProcurementTab refreshKey={refreshKey} />}
        {activeTab === 'accounting' && <AccountingTab refreshKey={refreshKey} />}
        {activeTab === 'hr' && <HRTab refreshKey={refreshKey} />}
      </div>
    </div>
  );
};

export default ERPDashboard;
