import { useState } from 'react';
import { isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import AttendanceDashboardModule from './AttendanceDashboardModule';
import AllAttendanceModule from './AllAttendanceModule';
import AttendanceReportTab from './AttendanceReportTab';

const C = { orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B', border: 'rgba(0,0,0,0.07)' };

type Tab = 'my' | 'all' | 'report';

export default function AttendanceHubModule() {
  const { isCompanyAdmin, isHRManager, userRole } = useAccess();
  // Super Admin / Company Admin / HR Manager see every employee's attendance; everyone
  // else only ever sees their own — All Attendance is hidden for them entirely.
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;
  const isRegularUser = userRole === 'regular_user';
  const [tab, setTab] = useState<Tab>('my');

  const tabs: { key: Tab; label: string; adminOnly?: boolean; hideForRegular?: boolean }[] = [
    { key: 'my', label: 'My Attendance' },
    { key: 'all', label: 'All Attendance', adminOnly: true },
    { key: 'report', label: 'Report', hideForRegular: true },
  ];
  const visibleTabs = tabs.filter(t => (!t.adminOnly || isAdmin) && !(t.hideForRegular && isRegularUser));

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
      {tab === 'report' && !isRegularUser && <AttendanceReportTab />}
    </div>
  );
}
