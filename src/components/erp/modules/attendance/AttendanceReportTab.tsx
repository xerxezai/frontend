import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';

const C = {
  orange: '#C9883A', cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.white, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif" }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ fontSize: 11.5, color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function AttendanceReportTab() {
  const now = new Date();
  const [summary, setSummary] = useState<any>(null);
  const [calendarDays, setCalendarDays] = useState<{ date: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      erpFetch('hr/attendance/my-month-summary/'),
      erpFetch(`hr/attendance/my-calendar/?year=${now.getFullYear()}&month=${now.getMonth() + 1}`),
    ])
      .then(([s, cal]) => { setSummary(s); setCalendarDays(Array.isArray(cal) ? cal : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const m = summary || { working_days: 0, present: 0, absent: 0, half_day: 0, hours: 0, percentage: 0 };
  const chartData = ['present', 'half_day', 'late', 'absent'].map(status => ({
    status: status === 'half_day' ? 'Half Day' : status[0].toUpperCase() + status.slice(1),
    count: calendarDays.filter(d => d.status === status).length,
  }));

  if (loading) {
    return <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>;
  }

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{
        background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '20px 22px',
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 4 }}>Monthly Summary</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: C.muted, marginBottom: 18 }}>{MONTH_NAMES[now.getMonth()]} {now.getFullYear()}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 16, marginBottom: 20 }}>
          {[
            ['Working Days', m.working_days, C.dark],
            ['Present', m.present, '#10b981'],
            ['Absent', m.absent, '#ef4444'],
            ['Half Day', m.half_day, '#f97316'],
            ['Hours Worked', `${m.hours}h`, C.orange],
          ].map(([label, val, color]) => (
            <div key={label as string}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 800, color: color as string }}>{val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: C.dark }}>Attendance Percentage</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800, color: m.percentage >= 90 ? '#10b981' : m.percentage >= 75 ? '#f59e0b' : '#ef4444' }}>{m.percentage}%</span>
          </div>
          <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(m.percentage, 100)}%`, height: '100%', borderRadius: 4, transition: 'width 400ms ease',
              background: m.percentage >= 90 ? '#10b981' : m.percentage >= 75 ? '#f59e0b' : '#ef4444',
            }} />
          </div>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '20px 22px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 4 }}>Days by Status</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: C.muted, marginBottom: 14 }}>{MONTH_NAMES[now.getMonth()]} {now.getFullYear()}, this month so far</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="status" tick={{ fontSize: 11, fill: C.muted, fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.muted, fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" name="Days" fill={C.orange} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
