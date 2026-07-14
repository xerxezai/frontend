import { useState } from 'react';
import MLMDashboard from './mlm/MLMDashboard';
import DistributorsPanel from './mlm/DistributorsPanel';
import NetworkTreePanel from './mlm/NetworkTreePanel';
import CommissionsPanel from './mlm/CommissionsPanel';
import PayoutsPanel from './mlm/PayoutsPanel';
import MLMReportsPanel from './mlm/MLMReportsPanel';

type Tab = 'Dashboard' | 'Distributors' | 'Network Tree' | 'Commissions' | 'Payouts' | 'Reports';

const TAB_LABEL: Record<Tab, string> = {
  Dashboard: 'Dashboard', Distributors: 'Distributors', 'Network Tree': 'Network Tree',
  Commissions: 'Commissions', Payouts: 'Payouts', Reports: 'Reports',
};

const MLMModule = ({ initialTab = 'Dashboard' }: { initialTab?: Tab }) => {
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

      {tab === 'Dashboard' && <MLMDashboard />}
      {tab === 'Distributors' && <DistributorsPanel />}
      {tab === 'Network Tree' && <NetworkTreePanel />}
      {tab === 'Commissions' && <CommissionsPanel />}
      {tab === 'Payouts' && <PayoutsPanel />}
      {tab === 'Reports' && <MLMReportsPanel />}
    </div>
  );
};

export default MLMModule;
