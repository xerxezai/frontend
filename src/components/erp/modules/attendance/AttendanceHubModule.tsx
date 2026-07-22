import { useState } from 'react';
import { isSuperUser } from '../../../../hooks/useERPApi';
import AttendanceDashboardModule from './AttendanceDashboardModule';
import AllAttendanceModule from './AllAttendanceModule';
import AttendanceReportTab from './AttendanceReportTab';

const C = { orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B', border: 'rgba(0,0,0,0.07)' };

type Tab = 'my' | 'all' | 'report';

export default function AttendanceHubModule() {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<Tab>('my');

  const tabs: { key: Tab; label: string; adminOnly?: boolean }[] = [
    { key: 'my', label: 'My Attendance' },
    { key: 'all', label: 'All Attendance', adminOnly: true },
    { key: 'report', label: 'Report' },
  ];
  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <div>
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

      {tab === 'my' && <AttendanceDashboardModule />}
      {tab === 'all' && isAdmin && <AllAttendanceModule />}
      {tab === 'report' && <AttendanceReportTab />}
    </div>
  );
}
