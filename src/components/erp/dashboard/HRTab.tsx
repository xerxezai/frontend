import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch, useERPList } from '../../../hooks/useERPApi';
import {
  NAVY, GOLD, FF, MUTED, GREEN, AMBER, RED, BLUE, PURPLE, BORDER, TrendKpiCard, SectionCard,
  SectionHead, SkeletonBlock2 as Skeleton, EmptyState, TH, TD, fmtShortDate, todayISO,
} from './dashboardShared';

const LEAVE_STATUS_META: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: AMBER }, approved: { label: 'Approved', color: GREEN },
  rejected: { label: 'Rejected', color: RED }, cancelled: { label: 'Cancelled', color: '#9CA3AF' },
};

export default function HRTab({ refreshKey }: { refreshKey: number }) {
  const employees = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const leaves = useERPList<any>('hr/leave-requests/');
  const overtime = useERPList<any>('hr/overtime/');
  const reviews = useERPList<any>('hr/reviews/');

  const [attendance, setAttendance] = useState<any[]>([]);
  const [attState, setAttState] = useState<'loading' | 'ok' | 'error' | 'forbidden'>('loading');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [onboardingRows, setOnboardingRows] = useState<any[]>([]);
  const [exitRows, setExitRows] = useState<any[]>([]);
  const [expiringDocs, setExpiringDocs] = useState<any[]>([]);
  const [docsForbidden, setDocsForbidden] = useState(false);

  useEffect(() => {
    setAttState('loading');
    erpFetch(`hr/attendance/report/?date_from=${todayISO()}&date_to=${todayISO()}`)
      .then((d: any) => { setAttendance(Array.isArray(d) ? d : []); setAttState('ok'); })
      .catch((e: any) => setAttState(String(e.message || '').includes('Admin only') ? 'forbidden' : 'error'));
    erpFetch('hr/holidays/upcoming/?limit=6').then((d: any) => setHolidays(Array.isArray(d) ? d : [])).catch(() => setHolidays([]));
    erpFetch('hr/onboarding/dashboard/').then((d: any) => setOnboardingRows(Array.isArray(d) ? d : [])).catch(() => setOnboardingRows([]));
    erpFetch('hr/exit/').then((d: any) => setExitRows(Array.isArray(d) ? d : d.results ?? [])).catch(() => setExitRows([]));
    erpFetch('hr/documents/expiring/').then((d: any) => setExpiringDocs(Array.isArray(d) ? d : [])).catch(() => setDocsForbidden(true));
  }, [refreshKey]);

  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');
  const onLeaveToday = leaves.data.filter((l: any) => l.status === 'approved' && l.from_date <= todayISO() && l.to_date >= todayISO()).length;
  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending');
  const pendingOvertime = overtime.data.filter((o: any) => o.status === 'pending');
  const totalApprovals = pendingLeaves.length + pendingOvertime.length;

  const presentToday = attState === 'ok' ? attendance.filter((a: any) => ['present', 'late', 'half_day'].includes(a.status)).length : 0;
  const attendanceRate = activeEmployees.length > 0 && attState === 'ok' ? (presentToday / activeEmployees.length) * 100 : 0;

  const deptChart = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.data.forEach((e: any) => { const name = e.department_name || 'Unassigned'; counts[name] = (counts[name] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [employees.data]);

  const leaveStatusDonut = useMemo(() => {
    const counts: Record<string, number> = {};
    leaves.data.forEach((l: any) => { counts[l.status] = (counts[l.status] || 0) + 1; });
    return Object.entries(counts).map(([status, value]) => ({ status, value, ...LEAVE_STATUS_META[status] ?? { label: status, color: '#9CA3AF' } }));
  }, [leaves.data]);

  const onboardingInProgress = onboardingRows.filter((r: any) => r.status === 'in_progress');
  const exitPending = exitRows.filter((r: any) => !r.completed_at);
  const thisMonthReviews = reviews.data.filter((r: any) => r.review_date && new Date(r.review_date).getMonth() === new Date().getMonth());

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="dash-kpi-grid">
        <style>{`@media (max-width:1150px){.dash-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
        <TrendKpiCard icon={<span>◆</span>} label="Total Employees" value={employees.data.length} accent={BLUE} loading={employees.loading} sub={`${activeEmployees.length} active`} />
        <TrendKpiCard icon={<span>◆</span>} label="On Leave Today" value={onLeaveToday} accent={AMBER} loading={leaves.loading} />
        <TrendKpiCard icon={<span>◆</span>} label="Pending Approvals" value={totalApprovals} accent={GOLD} loading={leaves.loading || overtime.loading} />
        <TrendKpiCard icon={<span>◆</span>} label="Attendance Rate" value={attendanceRate} format="percent" accent={GREEN} loading={attState === 'loading'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Department Headcount" />
          {employees.loading || departments.loading ? <Skeleton h={Math.max(220, deptChart.length * 36)} /> : deptChart.length === 0 ? <EmptyState message="No departments yet." /> : (
            <ResponsiveContainer width="100%" height={Math.max(220, deptChart.length * 36)}>
              <BarChart data={deptChart} layout="vertical" margin={{ top: 6, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="count" name="Employees" fill={GOLD} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Leave Requests by Status" />
          {leaves.loading ? <Skeleton h={220} /> : leaveStatusDonut.length === 0 ? <EmptyState message="No leave requests yet." /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={leaveStatusDonut} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {leaveStatusDonut.map(d => <Cell key={d.status} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: any, n: any) => [`${v} request${v === 1 ? '' : 's'}`, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Pending Leave Approvals" /></div>
          {leaves.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : pendingLeaves.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No pending leave requests." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Employee', 'Type', 'From', 'To', 'Days'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{pendingLeaves.map((l: any) => (
                <tr key={l.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{l.employee_name}</td>
                  <td style={{ ...TD, textTransform: 'capitalize' }}>{l.type}</td>
                  <td style={TD}>{fmtShortDate(l.from_date)}</td>
                  <td style={TD}>{fmtShortDate(l.to_date)}</td>
                  <td style={{ ...TD, fontWeight: 700 }}>{l.days}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Upcoming Holidays" subtitle="This month" />
          {holidays.length === 0 ? <EmptyState message="No upcoming holidays." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {holidays.map((h: any) => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: NAVY, fontWeight: 700 }}>{h.name}</span>
                  <span style={{ color: GOLD, fontWeight: 700 }}>{fmtShortDate(h.next_occurrence || h.date)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Onboarding In Progress" /></div>
          {onboardingInProgress.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No onboarding currently in progress." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Employee', 'Joined', 'Progress'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{onboardingInProgress.slice(0, 6).map((r: any) => {
                const pct = r.total_tasks ? Math.round((r.completed_tasks / r.total_tasks) * 100) : 0;
                return (
                  <tr key={r.employee_id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, fontWeight: 700 }}>{r.employee_name}</td>
                    <td style={TD}>{fmtShortDate(r.joined_on)}</td>
                    <td style={{ ...TD, fontWeight: 700, color: PURPLE }}>{pct}%</td>
                  </tr>
                );
              })}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Exit / Offboarding Pending" /></div>
          {exitPending.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No exits in progress." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Employee', 'Type', 'Last Day'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{exitPending.slice(0, 6).map((r: any) => (
                <tr key={r.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{r.employee_name}</td>
                  <td style={TD}>{r.reason_label}</td>
                  <td style={{ ...TD, color: RED, fontWeight: 700 }}>{fmtShortDate(r.last_working_day)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 18 }} className="dash-3col">
        <style>{`@media (max-width:1150px){.dash-3col{grid-template-columns:1fr 1fr!important}} @media (max-width:760px){.dash-3col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Expiring Documents" /></div>
          {docsForbidden ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="Admin access is required." /></div> : expiringDocs.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No documents expiring soon." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Employee', 'Document', 'Expiry'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{expiringDocs.slice(0, 6).map((d: any) => (
                <tr key={d.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{d.employee_name}</td>
                  <td style={TD}>{d.doc_type_label}</td>
                  <td style={{ ...TD, fontWeight: 700, color: d.days_until_expiry < 30 ? RED : AMBER }}>{fmtShortDate(d.expiry_date)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Performance Reviews" subtitle="This month — no approval workflow exists, showing submitted reviews" />
          {reviews.loading ? <Skeleton h={80} /> : <div style={{ fontSize: 24, fontWeight: 900, color: BLUE }}>{thisMonthReviews.length}</div>}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Overtime Pending Approvals" />
          {overtime.loading ? <Skeleton h={80} /> : pendingOvertime.length === 0 ? <EmptyState message="No pending overtime." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingOvertime.slice(0, 5).map((o: any) => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: NAVY, fontWeight: 700 }}>{o.employee_name}</span>
                  <span style={{ color: GOLD, fontWeight: 700 }}>{Number(o.extra_hours).toFixed(1)}h</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
