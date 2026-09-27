import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import {
  OG, DARK, BORDER, GREEN, AMBER, RED, BLUE, KpiCard, SectionCard, SectionHead,
  Skeleton, ErrorRetry, EmptyState, ActionBtn, FF, TH, TD,
} from './executiveShared';
import { fmtShortDate, todayISO } from './executiveData';

export default function WorkforceTab() {
  const employees = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const leaves = useERPList<any>('hr/leave-requests/');

  const [attendance, setAttendance] = useState<any[]>([]);
  const [attState, setAttState] = useState<'loading' | 'ok' | 'error' | 'forbidden'>('loading');
  const loadAttendance = () => {
    setAttState('loading');
    erpFetch(`hr/attendance/report/?date_from=${todayISO()}&date_to=${todayISO()}`)
      .then((res: any) => { setAttendance(Array.isArray(res) ? res : []); setAttState('ok'); })
      .catch((e: any) => setAttState(String(e.message || '').includes('Admin only') ? 'forbidden' : 'error'));
  };
  useEffect(loadAttendance, []);

  const [onboarding, setOnboarding] = useState<{ total: number; in_progress: number; completed: number; not_started: number } | null>(null);
  const [obState, setObState] = useState<'loading' | 'ok' | 'error'>('loading');
  const loadOnboarding = () => {
    setObState('loading');
    erpFetch('hr/onboarding/stats/').then(d => { setOnboarding(d); setObState('ok'); }).catch(() => setObState('error'));
  };
  useEffect(loadOnboarding, []);

  const [holidays, setHolidays] = useState<any[]>([]);
  const [holState, setHolState] = useState<'loading' | 'ok' | 'error'>('loading');
  const loadHolidays = () => {
    setHolState('loading');
    erpFetch('hr/holidays/upcoming/?limit=5').then(d => { setHolidays(Array.isArray(d) ? d : []); setHolState('ok'); }).catch(() => setHolState('error'));
  };
  useEffect(loadHolidays, []);

  const [actioningId, setActioningId] = useState<number | null>(null);
  const decideLeave = async (id: number, action: 'approved' | 'rejected') => {
    setActioningId(id);
    try {
      await erpFetch(`hr/leave-requests/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action }) });
      toast.success(`Leave request ${action}`);
      leaves.reload();
    } catch (e: any) { toast.error(e.message || 'Could not update this leave request'); }
    finally { setActioningId(null); }
  };

  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');
  const presentToday = attState === 'ok' ? attendance.filter((a: any) => ['present', 'late', 'half_day'].includes(a.status)).length : 0;
  const onLeaveToday = leaves.data.filter((l: any) => l.status === 'approved' && l.from_date <= todayISO() && l.to_date >= todayISO()).length;
  const absentToday = Math.max(activeEmployees.length - presentToday - onLeaveToday, 0);

  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending');

  const deptChart = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.data.forEach((e: any) => { const name = e.department_name || 'Unassigned'; counts[name] = (counts[name] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [employees.data]);

  const attendanceDonut = [
    { name: 'Present', value: presentToday, color: GREEN },
    { name: 'On Leave', value: onLeaveToday, color: AMBER },
    { name: 'Absent', value: absentToday, color: RED },
  ];
  const attendanceTotal = presentToday + onLeaveToday + absentToday;

  const events = useMemo(() => {
    const now = new Date();
    const anniversaries = employees.data.filter((e: any) => e.joined_on).map((e: any) => {
      const joined = new Date(e.joined_on);
      return { type: 'anniversary' as const, name: e.full_name, day: joined.getDate(), month: joined.getMonth(), years: now.getFullYear() - joined.getFullYear() };
    }).filter((e: any) => e.month === now.getMonth() && e.years >= 1);
    const birthdays = employees.data.filter((e: any) => e.date_of_birth).map((e: any) => {
      const dob = new Date(e.date_of_birth);
      return { type: 'birthday' as const, name: e.full_name, day: dob.getDate(), month: dob.getMonth(), years: 0 };
    }).filter((e: any) => e.month === now.getMonth());
    return [...birthdays, ...anniversaries].sort((a, b) => a.day - b.day);
  }, [employees.data]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 22 }} className="exec-kpi-grid">
        <style>{`
          @media (max-width:1200px){ .exec-kpi-grid{grid-template-columns:repeat(3,1fr)!important} }
          @media (max-width:640px){ .exec-kpi-grid{grid-template-columns:repeat(2,1fr)!important} }
        `}</style>
        <KpiCard icon={<UsersIcon />} label="Total Employees" value={employees.data.length} accent={BLUE} loading={employees.loading} sub={`${activeEmployees.length} active`} />
        <KpiCard icon={<CheckIcon />} label="Present Today" value={presentToday} accent={GREEN} loading={attState === 'loading'} />
        <KpiCard icon={<UmbrellaIcon />} label="On Leave Today" value={onLeaveToday} accent={AMBER} loading={leaves.loading} />
        <KpiCard icon={<ClipboardIcon />} label="Pending Leave Requests" value={pendingLeaves.length} accent={OG} loading={leaves.loading} />
        <KpiCard icon={<UserPlusIcon />} label="Onboarding In Progress" value={onboarding?.in_progress ?? 0} accent="#8b5cf6" loading={obState === 'loading'} sub={onboarding ? `${onboarding.total} total` : undefined} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, marginBottom: 18 }} className="exec-2col">
        <style>{`@media (max-width:1000px){ .exec-2col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard>
          <SectionHead title="Department Headcount" />
          {employees.loading || departments.loading ? <Skeleton h={Math.max(240, deptChart.length * 38)} /> : employees.error ? <ErrorRetry onRetry={employees.reload} /> : deptChart.length === 0 ? (
            <EmptyState message="No departments set up yet." />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(240, deptChart.length * 38)}>
              <BarChart data={deptChart} layout="vertical" margin={{ top: 6, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="count" name="Employees" fill={OG} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Attendance Today" subtitle="Present / on leave / absent" />
          {attState === 'loading' ? <Skeleton h={240} /> : attState === 'forbidden' ? (
            <EmptyState message="Admin access is required to view company-wide attendance." />
          ) : attState === 'error' ? <ErrorRetry onRetry={loadAttendance} /> : attendanceTotal === 0 ? (
            <EmptyState message="No active employees to track." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={attendanceDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={80} paddingAngle={2}>
                    {attendanceDonut.map(d => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any, n: any) => [`${v} employee${v === 1 ? '' : 's'}`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {attendanceDonut.map(d => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FF, fontSize: 12.5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: DARK, fontWeight: 600 }}>
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.color }} />{d.name}
                    </span>
                    <span style={{ fontWeight: 800, color: DARK }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 18 }} className="exec-3col">
        <style>{`@media (max-width:1150px){ .exec-3col{grid-template-columns:1fr 1fr!important} } @media (max-width:760px){ .exec-3col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Pending Leave Requests" /></div>
          {leaves.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : leaves.error ? <ErrorRetry onRetry={leaves.reload} /> : pendingLeaves.length === 0 ? (
            <div style={{ padding: '0 22px 22px' }}><EmptyState message="No pending leave requests — all caught up." /></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafbfc' }}>
                    {['Employee', 'Type', 'From', 'To', 'Days', ''].map(h => <th key={h} style={TH}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((l: any) => (
                    <tr key={l.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD, fontWeight: 700 }}>{l.employee_name}</td>
                      <td style={{ ...TD, textTransform: 'capitalize' }}>{l.type}</td>
                      <td style={TD}>{fmtShortDate(l.from_date)}</td>
                      <td style={TD}>{fmtShortDate(l.to_date)}</td>
                      <td style={{ ...TD, fontWeight: 700 }}>{l.days}</td>
                      <td style={TD}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <ActionBtn tone="approve" disabled={actioningId === l.id} onClick={() => decideLeave(l.id, 'approved')}>Approve</ActionBtn>
                          <ActionBtn tone="reject" disabled={actioningId === l.id} onClick={() => decideLeave(l.id, 'rejected')}>Reject</ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Upcoming Holidays" />
          {holState === 'loading' ? <Skeleton h={140} /> : holState === 'error' ? <ErrorRetry onRetry={loadHolidays} /> : holidays.length === 0 ? (
            <EmptyState message="No upcoming holidays." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {holidays.map((h: any) => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 9, borderTop: `1px solid ${BORDER}` }}>
                  <div>
                    <div style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: DARK }}>{h.name}</div>
                    <div style={{ fontFamily: FF, fontSize: 11, color: '#9CA3AF', textTransform: 'capitalize' }}>{h.holiday_type} holiday</div>
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, flexShrink: 0 }}>{fmtShortDate(h.next_occurrence || h.date)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="This Month" subtitle="Birthdays & anniversaries" />
          {employees.loading ? <Skeleton h={140} /> : events.length === 0 ? (
            <EmptyState message="No events this month." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {events.map((ev, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 9, borderTop: `1px solid ${BORDER}` }}>
                  <div>
                    <div style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: DARK }}>{ev.name}</div>
                    <div style={{ fontFamily: FF, fontSize: 11, color: '#9CA3AF' }}>{ev.type === 'birthday' ? 'Birthday' : `${ev.years} year${ev.years === 1 ? '' : 's'} with XERXEZ`}</div>
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, flexShrink: 0 }}>{new Date(2000, ev.month, ev.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

const UsersIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.3 3-6 6.5-6s6.5 2.7 6.5 6" /><circle cx="17" cy="9" r="2.6" /><path d="M15.7 14.2c2.6.3 4.8 2.6 4.8 5.8" /></svg>);
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const UmbrellaIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z" /><path d="M12 11v8a2 2 0 0 1-4 0M12 2v2" /></svg>);
const ClipboardIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h4" /></svg>);
const UserPlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5S15.5 16.4 15.5 20M18 8v6M21 11h-6" /></svg>);
