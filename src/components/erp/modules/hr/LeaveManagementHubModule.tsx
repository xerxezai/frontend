import { useState } from 'react';
import { isSuperUser } from '../../../../hooks/useERPApi';
import LeaveRequestsPanel from './LeaveRequestsPanel';
import LeaveApprovalsModule from '../attendance/LeaveApprovalsModule';
import LeaveBalanceTab from './LeaveBalanceTab';

const C = { orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B', border: 'rgba(0,0,0,0.07)' };

type Tab = 'requests' | 'approvals' | 'balance';

export default function LeaveManagementHubModule() {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<Tab>('requests');

  const tabs: { key: Tab; label: string; adminOnly?: boolean }[] = [
    { key: 'requests', label: 'Leave Requests' },
    { key: 'approvals', label: 'Leave Approvals', adminOnly: true },
    { key: 'balance', label: 'Leave Balance' },
  ];
  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Leave Management</h4>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: C.white, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, width: 'fit-content' }}>
        {visibleTabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            border: 'none', borderRadius: 7, padding: '9px 20px',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
            cursor: 'pointer', transition: 'background 0.18s, color 0.18s',
            background: tab === t.key ? C.orangeGrad : 'transparent',
            color: tab === t.key ? '#fff' : C.muted,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'requests' && <LeaveRequestsPanel />}
      {tab === 'approvals' && isAdmin && <LeaveApprovalsModule />}
      {tab === 'balance' && <LeaveBalanceTab />}
    </div>
  );
}
