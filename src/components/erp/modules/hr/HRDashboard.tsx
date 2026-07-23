import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  CalendarCheck, ClipboardList, Building2, UserPlus, PartyPopper, Gift, Wallet,
  ArrowRight, Check, X as XIcon, AlertTriangle,
} from 'lucide-react';
import { useERPList, erpFetch } from '../../../../hooks/useERPApi';
import { Card3D, FF, DARK, OG, WHITE, Skeleton, EmptyState, useFmtCurrency } from './hrShared';

const BORDER = 'rgba(0,0,0,0.07)';
const MUTED  = '#6B6B6B';
const GREEN  = '#10b981';
const RED    = '#ef4444';

const EMP_STATUS_COLORS: Record<string, string> = {
  active: GREEN, on_leave: '#f59e0b', resigned: MUTED, terminated: RED,
};

const SectionCard = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const SectionHead = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
    <div>
      <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: DARK }}>{title}</div>
      {subtitle && <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, marginTop: 2 }}>{subtitle}</div>}
    </div>
    {action}
  </div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FF, fontSize: 11.5, color: MUTED, fontWeight: 600 }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
    {label}
  </span>
);

const fmtDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const HRDashboard = () => {
  const employees   = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const leaves      = useERPList<any>('hr/leave-requests/');
  const fmtCurrency = useFmtCurrency();

  const activeCount  = employees.data.filter((e: any) => e.status === 'active').length;
  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending');
  const stats = [
    { label: 'Total Employees', value: employees.data.length,   accent: '#3b82f6', color: '#3b82f6' },
    { label: 'Departments',     value: departments.data.length, accent: '#8b5cf6', color: '#8b5cf6' },
    { label: 'Active',          value: activeCount,             accent: GREEN,      color: GREEN },
    { label: 'Pending Leaves',  value: pendingLeaves.length,    accent: OG,         color: OG },
  ];

  // ── Section 1: last-7-days attendance ──────────────────────────────────────
  const [attendanceRaw, setAttendanceRaw] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceForbidden, setAttendanceForbidden] = useState(false);

  useEffect(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - 6);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    setAttendanceLoading(true);
    erpFetch(`hr/attendance/report/?date_from=${iso(from)}&date_to=${iso(today)}`)
      .then((res: any) => setAttendanceRaw(Array.isArray(res) ? res : []))
      .catch((e: any) => { if (String(e.message).includes('Admin only')) setAttendanceForbidden(true); })
      .finally(() => setAttendanceLoading(false));
  }, []);

  const attendanceChart = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    return days.map(d => {
      const iso = d.toISOString().slice(0, 10);
      const records = attendanceRaw.filter((a: any) => a.date === iso);
      const present = records.filter((a: any) => ['present', 'late', 'half_day'].includes(a.status)).length;
      const explicitAbsent = records.filter((a: any) => a.status === 'absent').length;
      const noRecord = Math.max(activeCount - records.length, 0);
      return {
        date: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        present,
        absent: explicitAbsent + noRecord,
      };
    });
  }, [attendanceRaw, activeCount]);

  // ── Section 3: department-wise headcount ───────────────────────────────────
  const deptChart = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.data.forEach((e: any) => {
      const name = e.department_name || 'Unassigned';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [employees.data]);

  // ── Section 4: 5 most recently added employees ─────────────────────────────
  const recentEmployees = useMemo(
    () => [...employees.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5),
    [employees.data],
  );

  // ── Section 5: birthdays + work anniversaries this month ───────────────────
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const anniversaries = employees.data
      .filter((e: any) => e.joined_on)
      .map((e: any) => {
        const joined = new Date(e.joined_on);
        return { type: 'anniversary' as const, name: e.full_name, day: joined.getDate(), month: joined.getMonth(), years: now.getFullYear() - joined.getFullYear() };
      })
      .filter(e => e.month === now.getMonth() && e.years >= 1);

    const birthdays = employees.data
      .filter((e: any) => e.date_of_birth)
      .map((e: any) => {
        const dob = new Date(e.date_of_birth);
        return { type: 'birthday' as const, name: e.full_name, day: dob.getDate(), month: dob.getMonth(), years: 0 };
      })
      .filter(e => e.month === now.getMonth());

    return [...birthdays, ...anniversaries].sort((a, b) => a.day - b.day);
  }, [employees.data]);

  // ── Section 6: this month's payroll ─────────────────────────────────────────
  const [payrollRaw, setPayrollRaw] = useState<any[]>([]);
  const [payrollLoading, setPayrollLoading] = useState(true);
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();

  useEffect(() => {
    setPayrollLoading(true);
    erpFetch(`hr/payroll/?month=${curMonth}&year=${curYear}`)
      .then((res: any) => setPayrollRaw(Array.isArray(res) ? res : res.results ?? []))
      .catch(() => setPayrollRaw([]))
      .finally(() => setPayrollLoading(false));
  }, [curMonth, curYear]);

  // ── Upcoming holidays widget ────────────────────────────────────────────────
  const [upcomingHolidays, setUpcomingHolidays] = useState<any[]>([]);
  const [holidaysLoading, setHolidaysLoading] = useState(true);

  useEffect(() => {
    setHolidaysLoading(true);
    erpFetch('hr/holidays/upcoming/?limit=5')
      .then((res: any) => setUpcomingHolidays(Array.isArray(res) ? res : []))
      .catch(() => setUpcomingHolidays([]))
      .finally(() => setHolidaysLoading(false));
  }, []);

  // ── Expiring documents widget — Admin/HR Manager only; a Regular User hitting this
  // 403s (the endpoint is admin-only), so just show nothing rather than an error banner.
  const [expiringDocs, setExpiringDocs] = useState<any[]>([]);
  const [expiringDocsForbidden, setExpiringDocsForbidden] = useState(false);

  useEffect(() => {
    erpFetch('hr/documents/expiring/')
      .then((res: any) => setExpiringDocs(Array.isArray(res) ? res : []))
      .catch(() => setExpiringDocsForbidden(true));
  }, []);

  // ── Overdue onboarding tasks widget — Admin/HR Manager only, same 403-is-fine pattern.
  const [overdueOnboarding, setOverdueOnboarding] = useState<any[]>([]);

  useEffect(() => {
    erpFetch('hr/onboarding/overdue/')
      .then((res: any) => setOverdueOnboarding(Array.isArray(res) ? res : []))
      .catch(() => setOverdueOnboarding([]));
  }, []);

  const totalPayroll = payrollRaw.reduce((sum: number, p: any) => sum + Number(p.net_salary || 0), 0);
  const paidCount    = payrollRaw.filter((p: any) => p.status === 'paid').length;
  const pendingPayrollCount = Math.max(activeCount - paidCount, 0);

  // ── leave approve/reject ────────────────────────────────────────────────────
  const [actioning, setActioning] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');
  const decideLeave = async (id: number, action: 'approved' | 'rejected') => {
    setActioning(id);
    setActionError('');
    try {
      await erpFetch(`hr/leave-requests/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action }) });
      await leaves.reload();
    } catch (e: any) {
      setActionError(e.message || 'Could not update this leave request.');
    } finally {
      setActioning(null);
    }
  };

  return (
    <div>
      <style>{`
        @keyframes hrStatUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .hr-stat-grid{grid-template-columns:repeat(4,1fr)}
        .hr-charts-grid{grid-template-columns:1.3fr 1fr}
        .hr-lists-grid{grid-template-columns:1fr 1fr 1fr}
        @media (max-width:1150px){
          .hr-lists-grid{grid-template-columns:1fr 1fr}
        }
        @media (max-width:900px){
          .hr-charts-grid{grid-template-columns:1fr}
          .hr-lists-grid{grid-template-columns:1fr}
        }
        @media (max-width:640px){
          .hr-stat-grid{grid-template-columns:1fr 1fr}
        }
        .hr-payroll-stats{grid-template-columns:repeat(3,1fr)}
        @media (max-width:560px){
          .hr-payroll-stats{grid-template-columns:1fr}
        }
      `}</style>

      <div style={{ display: 'grid', gap: 14 }} className="hr-stat-grid">
        {stats.map((s, i) => (
          <div key={s.label} style={{ animation: `hrStatUp 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both` }}>
            <Card3D accent={s.accent} p="18px 20px">
              <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FF, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: FF, lineHeight: 1 }}>{s.value}</div>
            </Card3D>
          </div>
        ))}
      </div>

      {/* Expiring documents alert — Admin/HR Manager only (see expiringDocsForbidden) */}
      {!expiringDocsForbidden && expiringDocs.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.09), rgba(249,115,22,0.03))',
          border: '1px solid rgba(249,115,22,0.25)', borderRadius: 14, padding: '16px 20px', marginTop: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={15} color="#c2410c" />
              <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 13.5, color: DARK }}>
                Documents Expiring Soon ({expiringDocs.length})
              </span>
            </div>
            <Link to="/erp/hr/documents" style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all<ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {expiringDocs.slice(0, 5).map((d: any) => (
              <div key={d.id} style={{ background: WHITE, borderRadius: 10, padding: '10px 16px', border: `1px solid ${BORDER}`, minWidth: 200 }}>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK }}>{d.employee_name}</div>
                <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, margin: '3px 0 6px' }}>{d.doc_type_label} · {fmtDate(d.expiry_date)}</div>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 800, color: '#c2410c' }}>
                  {d.days_until_expiry === 0 ? 'Today' : d.days_until_expiry === 1 ? 'Tomorrow' : `${d.days_until_expiry} days remaining`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue onboarding tasks alert */}
      {overdueOnboarding.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))',
          border: '1px solid rgba(239,68,68,0.22)', borderRadius: 14, padding: '16px 20px', marginTop: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={15} color="#991b1b" />
              <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 13.5, color: DARK }}>
                Overdue Onboarding Tasks ({overdueOnboarding.length})
              </span>
            </div>
            <Link to="/erp/hr/onboarding" style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all<ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {overdueOnboarding.slice(0, 5).map((t: any) => (
              <div key={t.id} style={{ background: WHITE, borderRadius: 10, padding: '10px 16px', border: `1px solid ${BORDER}`, minWidth: 200 }}>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK }}>{t.employee_name}</div>
                <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, margin: '3px 0 6px' }}>{t.task}</div>
                <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 800, color: '#991b1b' }}>Due {fmtDate(t.due_date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 1 + 3: Attendance overview & department headcount */}
      <div style={{ display: 'grid', gap: 18, marginTop: 22 }} className="hr-charts-grid">
        <SectionCard>
          <SectionHead
            title="Attendance Overview"
            subtitle="Last 7 days"
            action={<div style={{ display: 'flex', gap: 12 }}><LegendDot color={GREEN} label="Present" /><LegendDot color={RED} label="Absent" /></div>}
          />
          <div style={{ padding: '18px 20px' }}>
            {attendanceLoading ? (
              <Skeleton h={240} />
            ) : attendanceForbidden ? (
              <EmptyState icon={CalendarCheck} message="Admin access is required to view the attendance overview." />
            ) : employees.data.length === 0 ? (
              <EmptyState icon={CalendarCheck} message="Add employees to start tracking attendance." />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={attendanceChart} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="present" name="Present" fill={GREEN} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
                  <Bar dataKey="absent" name="Absent" fill={RED} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHead title="Employees by Department" />
          <div style={{ padding: '18px 20px' }}>
            {departments.loading || employees.loading ? (
              <Skeleton h={240} />
            ) : deptChart.length === 0 ? (
              <EmptyState icon={Building2} message="No departments set up yet." />
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(240, deptChart.length * 38)}>
                <BarChart data={deptChart} layout="vertical" margin={{ top: 6, right: 24, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name="Employees" fill={OG} radius={[0, 6, 6, 0]} isAnimationActive animationDuration={700} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Section 2: Pending leave requests */}
      <div style={{ marginTop: 18 }}>
        <SectionCard>
          <SectionHead
            title={`Pending Leave Requests${pendingLeaves.length ? ` (${pendingLeaves.length})` : ''}`}
            subtitle="Review and action requests awaiting a decision"
            action={<Link to="/erp/hr/leave" style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>View all<ArrowRight size={13} /></Link>}
          />
          {actionError && (
            <div style={{ margin: '14px 20px 0', padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#991b1b', fontFamily: FF, fontSize: 12.5 }}>
              {actionError}
            </div>
          )}
          {leaves.loading ? (
            <div style={{ padding: 20 }}><Skeleton h={160} /></div>
          ) : pendingLeaves.length === 0 ? (
            <EmptyState icon={ClipboardList} message="No pending leave requests." />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
                <thead>
                  <tr style={{ background: '#fafaf9' }}>
                    {['Employee', 'Type', 'From', 'To', 'Days', ''].map(h => (
                      <th key={h} style={{ padding: '11px 20px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '11px 20px', fontWeight: 600, color: DARK }}>{r.employee_name}</td>
                      <td style={{ padding: '11px 20px', color: MUTED, textTransform: 'capitalize' }}>{r.type}</td>
                      <td style={{ padding: '11px 20px', color: MUTED }}>{r.from_date}</td>
                      <td style={{ padding: '11px 20px', color: MUTED }}>{r.to_date}</td>
                      <td style={{ padding: '11px 20px', fontWeight: 700, color: DARK }}>{r.days}</td>
                      <td style={{ padding: '11px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => decideLeave(r.id, 'approved')}
                            disabled={actioning === r.id}
                            style={{
                              background: 'rgba(16,185,129,0.10)', color: GREEN, border: '1px solid rgba(16,185,129,0.25)',
                              borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 700, fontFamily: FF,
                              cursor: actioning === r.id ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                            }}
                          >
                            <Check size={13} />Approve
                          </button>
                          <button
                            onClick={() => decideLeave(r.id, 'rejected')}
                            disabled={actioning === r.id}
                            style={{
                              background: 'rgba(239,68,68,0.08)', color: RED, border: '1px solid rgba(239,68,68,0.22)',
                              borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 700, fontFamily: FF,
                              cursor: actioning === r.id ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                            }}
                          >
                            <XIcon size={13} />Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Section 4 + 5: Recent employees & upcoming events */}
      <div style={{ display: 'grid', gap: 18, marginTop: 18 }} className="hr-lists-grid">
        <SectionCard>
          <SectionHead title="Recent Employees" subtitle="Last 5 added" action={<Link to="/erp/hr/employees" style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>View all<ArrowRight size={13} /></Link>} />
          {employees.loading ? (
            <div style={{ padding: 20 }}><Skeleton h={180} /></div>
          ) : recentEmployees.length === 0 ? (
            <EmptyState icon={UserPlus} message="No employees added yet." />
          ) : (
            <div>
              {recentEmployees.map((e: any) => (
                <Link
                  key={e.id}
                  to="/erp/hr/employees"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.full_name}</div>
                    <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, marginTop: 2 }}>{e.department_name || 'Unassigned'} · Joined {fmtDate(e.joined_on)}</div>
                  </div>
                  <span style={{
                    fontFamily: FF, fontSize: 10.5, fontWeight: 700, textTransform: 'capitalize', flexShrink: 0,
                    padding: '3px 9px', borderRadius: 20,
                    background: `${EMP_STATUS_COLORS[e.status] ?? MUTED}18`, color: EMP_STATUS_COLORS[e.status] ?? MUTED,
                  }}>
                    {(e.status || 'active').replace('_', ' ')}
                  </span>
                  <ArrowRight size={14} color={MUTED} style={{ flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Upcoming Events This Month" subtitle="Birthdays & work anniversaries" />
          {employees.loading ? (
            <div style={{ padding: 20 }}><Skeleton h={180} /></div>
          ) : upcomingEvents.length === 0 ? (
            <EmptyState icon={PartyPopper} message="No upcoming events this month." />
          ) : (
            <div>
              {upcomingEvents.map((ev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: `${OG}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {ev.type === 'birthday' ? <Gift size={14} color={OG} /> : <PartyPopper size={14} color={OG} />}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.name}</div>
                    <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, marginTop: 2 }}>
                      {ev.type === 'birthday' ? 'Birthday' : `${ev.years} year${ev.years === 1 ? '' : 's'} with XERXEZ`}
                    </div>
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, flexShrink: 0 }}>
                    {new Date(2000, ev.month, ev.day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Upcoming Holidays" action={<Link to="/erp/hr/holidays" style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>View all<ArrowRight size={13} /></Link>} />
          {holidaysLoading ? (
            <div style={{ padding: 20 }}><Skeleton h={180} /></div>
          ) : upcomingHolidays.length === 0 ? (
            <EmptyState icon={CalendarCheck} message="No upcoming holidays." />
          ) : (
            <div>
              {upcomingHolidays.map((h: any) => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: `${OG}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CalendarCheck size={14} color={OG} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</div>
                    <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, marginTop: 2, textTransform: 'capitalize' }}>{h.holiday_type} holiday</div>
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, flexShrink: 0 }}>
                    {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Section 6: Payroll summary */}
      <div style={{ marginTop: 18 }}>
        <SectionCard style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: `${OG}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={16} color={OG} />
              </span>
              <div>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: DARK }}>Payroll Summary</div>
                <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, marginTop: 2 }}>
                  {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <Link
              to="/erp/payroll-reports"
              style={{
                fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', borderRadius: 9, padding: '9px 16px',
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}
            >
              Generate Payroll<ArrowRight size={13} />
            </Link>
          </div>
          {payrollLoading ? (
            <Skeleton h={70} />
          ) : (
            <div style={{ display: 'grid', gap: 14 }} className="hr-payroll-stats">
              <div>
                <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Total Payroll</div>
                <div style={{ fontFamily: FF, fontSize: 22, fontWeight: 900, color: DARK }}>{fmtCurrency(totalPayroll)}</div>
              </div>
              <div>
                <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Employees Paid</div>
                <div style={{ fontFamily: FF, fontSize: 22, fontWeight: 900, color: GREEN }}>{paidCount}</div>
              </div>
              <div>
                <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Pending Payroll</div>
                <div style={{ fontFamily: FF, fontSize: 22, fontWeight: 900, color: pendingPayrollCount > 0 ? OG : GREEN }}>{pendingPayrollCount}</div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default HRDashboard;
