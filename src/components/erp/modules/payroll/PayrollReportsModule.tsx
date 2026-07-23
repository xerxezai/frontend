import { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useERPList, erpFetch } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_COLORS: Record<string, string> = { draft: '#f59e0b', approved: '#10b981', paid: '#6366f1' };
const Badge = ({ s }: { s: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: `${STATUS_COLORS[s] ?? C.muted}18`, color: STATUS_COLORS[s] ?? C.muted, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize' }}>
    {s}
  </span>
);

function KpiStatCard({ label, val, icon, color, index }: { label: string; val: string; icon: string; color: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, borderTop: `2px solid ${color}`,
        padding: '14px',
        boxShadow: hovered
          ? '0 6px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(201,136,58,0.18)'
          : '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms cubic-bezier(0.22,1,0.36,1)',
        animation: `prFadeUp 0.45s ease ${index * 0.08}s both`,
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <i className={icon} style={{ color, fontSize: 12 }} />
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 18, color: C.dark }}>{val}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function exportPayrollCSV(rows: any[], formatAmount: (v: number | string) => string) {
  const header = ['Employee', 'Department', 'Basic', 'Allowances', 'Deductions', 'Net Salary', 'Status'];
  const lines = [header.join(',')];
  rows.forEach((r: any) => {
    const cells = [
      r.employee_name, r.department_name || '', formatAmount(r.basic), formatAmount(r.allowances), formatAmount(r.deductions), formatAmount(r.net_salary), r.status,
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`);
    lines.push(cells.join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payroll-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const CHART_TOOLTIP_STYLE = { background: '#fff', border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: "'DM Sans', sans-serif", fontSize: 12 };

export default function PayrollReportsModule() {
  const { formatAmount } = useCurrency();
  const now  = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const payrolls = useERPList<any>(`hr/payroll/report/?year=${year}${month ? `&month=${month}` : ''}`);
  const departments = useERPList<any>('hr/departments/');
  const rows = payrolls.data;
  const filteredRows = deptFilter ? rows.filter((r: any) => r.department_name === deptFilter) : rows;

  const totalGross = rows.reduce((a: number, r: any) => a + parseFloat(r.gross || 0), 0);
  const totalNet   = rows.reduce((a: number, r: any) => a + parseFloat(r.net_salary || 0), 0);
  const totalDeductions = rows.reduce((a: number, r: any) => a + parseFloat(r.deductions || 0), 0);
  const paidCount = rows.filter((r: any) => r.status === 'paid').length;

  // ── Last 6 months total payroll cost trend — independent of the year/month filter above,
  // always a fixed trailing window that may span a year boundary.
  const [trend, setTrend] = useState<{ label: string; cost: number }[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTrendLoading(true);
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return { y: d.getFullYear(), m: d.getMonth() + 1 };
      });
      const years = Array.from(new Set(months.map(x => x.y)));
      try {
        const results = await Promise.all(years.map(y => erpFetch(`hr/payroll/report/?year=${y}`)));
        const all = results.flat();
        const byKey: Record<string, number> = {};
        all.forEach((r: any) => {
          const key = `${r.year}-${r.month}`;
          byKey[key] = (byKey[key] || 0) + parseFloat(r.net_salary || 0);
        });
        if (!cancelled) {
          setTrend(months.map(({ y, m }) => ({ label: `${MONTH_LABELS[m - 1]} '${String(y).slice(2)}`, cost: byKey[`${y}-${m}`] || 0 })));
        }
      } catch {
        if (!cancelled) setTrend([]);
      } finally {
        if (!cancelled) setTrendLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Department breakdown — always across the full year/month filter, regardless of the
  // department dropdown (which only narrows the detailed table below).
  const deptBreakdown = useMemo(() => {
    const byDept: Record<string, { employees: Set<number>; cost: number }> = {};
    rows.forEach((r: any) => {
      const key = r.department_name || 'Unassigned';
      if (!byDept[key]) byDept[key] = { employees: new Set(), cost: 0 };
      byDept[key].employees.add(r.employee);
      byDept[key].cost += parseFloat(r.net_salary || 0);
    });
    return Object.entries(byDept)
      .map(([department, v]) => ({ department, employees: v.employees.size, cost: Math.round(v.cost * 100) / 100 }))
      .sort((a, b) => b.cost - a.cost);
  }, [rows]);

  const departmentNames = departments.data.map((d: any) => d.name);

  return (
    <div style={{ animation: 'prFadeUp 0.45s ease both' }}>
      <style>{`@keyframes prFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ marginBottom: 22 }}>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Payroll Reports</h4>
        <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>Monthly summaries, trends, and department breakdowns</p>
      </div>

      {/* Filters */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 18px', marginBottom: 22, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Year</label>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} min="2020" max="2040"
            style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.cream, outline: 'none', width: 90 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Month</label>
          <select value={month} onChange={e => setMonth(e.target.value)}
            style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.cream, outline: 'none' }}>
            <option value="">All Months</option>
            {MONTH_LABELS.map((m, i) => <option key={i} value={String(i+1)}>{m}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Department</label>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: C.cream, outline: 'none' }}>
            <option value="">All Departments</option>
            {departmentNames.map((d: string) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <button onClick={() => payrolls.reload()}
          style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 9, padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          <i className="fas fa-sync-alt" style={{ marginRight: 6 }} />Refresh
        </button>
        <button onClick={() => exportPayrollCSV(filteredRows, formatAmount)} disabled={filteredRows.length === 0}
          style={{ background: C.white, color: C.dark, border: `1px solid ${C.border}`, borderRadius: 9, padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: filteredRows.length === 0 ? 'default' : 'pointer', opacity: filteredRows.length === 0 ? 0.5 : 1 }}>
          <i className="fas fa-file-excel" style={{ marginRight: 6, color: '#10b981' }} />Export to Excel
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Records', val: String(rows.length), icon: 'fas fa-file-alt', color: '#3b82f6' },
          { label: 'Gross Payroll', val: formatAmount(totalGross), icon: 'fas fa-coins', color: '#10b981' },
          { label: 'Total Deductions', val: formatAmount(totalDeductions), icon: 'fas fa-minus-circle', color: '#ef4444' },
          { label: 'Net Payroll', val: formatAmount(totalNet), icon: 'fas fa-hand-holding-usd', color: C.orange },
          { label: 'Paid Out', val: String(paidCount), icon: 'fas fa-check-circle', color: '#6366f1' },
        ].map((s, i) => (
          <KpiStatCard key={i} label={s.label} val={s.val} icon={s.icon} color={s.color} index={i} />
        ))}
      </div>

      {/* Trend + department breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, marginBottom: 24 }}>
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: C.dark, marginBottom: 2 }}>Monthly Payroll Cost Trend</div>
          <div style={{ color: C.muted, fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>Last 6 months</div>
          {trendLoading ? (
            <div style={{ padding: 32, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trend} margin={{ top: 5, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: C.muted }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={((v: number) => formatAmount(v)) as any} />
                <Line type="monotone" dataKey="cost" stroke={C.orange} strokeWidth={2.5} dot={{ r: 4, fill: C.orange }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: C.dark, marginBottom: 2 }}>Payroll Cost by Department</div>
          <div style={{ color: C.muted, fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>{year}{month ? ` — ${MONTH_LABELS[+month - 1]}` : ''}</div>
          {deptBreakdown.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5 }}>No records for this period.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptBreakdown} margin={{ top: 5, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 10.5, fontFamily: "'DM Sans', sans-serif", fill: C.muted }} axisLine={{ stroke: C.border }} tickLine={false} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={((v: number) => formatAmount(v)) as any} />
                <Bar dataKey="cost" fill={C.orange} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Detailed table */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.dark }}>Detailed Records</span>
        </div>
        {payrolls.loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
        ) : filteredRows.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>No payroll records for this period.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Employee', 'Department', 'Month', 'Year', 'Present', 'Basic', 'Gross', 'Net Salary', 'Status', 'Paid At'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td style={{ padding: '11px 14px', fontWeight: 600, color: C.dark, whiteSpace: 'nowrap' }}>{r.employee_name}</td>
                    <td style={{ padding: '11px 14px', color: C.muted }}>{r.department_name || '—'}</td>
                    <td style={{ padding: '11px 14px', color: C.muted }}>{MONTH_LABELS[r.month-1]}</td>
                    <td style={{ padding: '11px 14px', color: C.muted }}>{r.year}</td>
                    <td style={{ padding: '11px 14px' }}>{r.present_days}/{r.working_days}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 600 }}>{formatAmount(r.basic)}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 600 }}>{formatAmount(r.gross)}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 800, color: '#10b981' }}>{formatAmount(r.net_salary)}</td>
                    <td style={{ padding: '11px 14px' }}><Badge s={r.status} /></td>
                    <td style={{ padding: '11px 14px', color: C.muted, fontSize: 12 }}>{r.paid_at ? new Date(r.paid_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
