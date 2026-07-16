import { useState } from 'react';
import { useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

// ── SVG bar chart ─────────────────────────────────────────────────────────────
interface BarChartProps { data: { label: string; gross: number; net: number }[] }
function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map(d => d.gross), 1);
  const W = 560; const H = 180; const BAR_W = 28; const GAP = 12;
  const totalW = data.length * (BAR_W * 2 + GAP + 8);

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <svg width={Math.max(W, totalW)} height={H + 40} style={{ display: 'block', fontFamily: "'DM Sans', sans-serif" }}>
        {data.map((d, i) => {
          const x = i * (BAR_W * 2 + GAP + 8) + 8;
          const grossH = (d.gross / max) * H;
          const netH   = (d.net / max) * H;
          return (
            <g key={d.label}>
              {/* gross bar */}
              <rect x={x} y={H - grossH} width={BAR_W} height={grossH} rx={4} fill="#3b82f6" opacity={0.75} />
              {/* net bar */}
              <rect x={x + BAR_W + 4} y={H - netH} width={BAR_W} height={netH} rx={4} fill={C.orange} opacity={0.85} />
              <text x={x + BAR_W} y={H + 16} textAnchor="middle" fill={C.muted} fontSize={10} fontWeight={600}>{d.label}</text>
            </g>
          );
        })}
        {/* y axis line */}
        <line x1={0} y1={0} x2={0} y2={H} stroke={C.border} strokeWidth={1} />
        <line x1={0} y1={H} x2={Math.max(W, totalW)} y2={H} stroke={C.border} strokeWidth={1} />
      </svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: C.muted }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} />Gross
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: C.muted }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: C.orange, display: 'inline-block' }} />Net
        </div>
      </div>
    </div>
  );
}

// ── Line mini-chart ────────────────────────────────────────────────────────────
function LineChart({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const W = 200; const H = 48;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * H}`).join(' ');
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={C.orange} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * W} cy={H - (v / max) * H} r={3} fill={C.orange} />
      ))}
    </svg>
  );
}

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

export default function PayrollReportsModule() {
  const { formatAmount } = useCurrency();
  const now  = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState('');

  const payrolls = useERPList<any>(`hr/payroll/report/?year=${year}${month ? `&month=${month}` : ''}`);
  const rows = payrolls.data;

  const totalGross = rows.reduce((a: number, r: any) => a + parseFloat(r.gross || 0), 0);
  const totalNet   = rows.reduce((a: number, r: any) => a + parseFloat(r.net_salary || 0), 0);
  const totalDeductions = rows.reduce((a: number, r: any) => a + parseFloat(r.deductions || 0), 0);
  const paidCount = rows.filter((r: any) => r.status === 'paid').length;

  // group by month for chart
  const byMonth: Record<number, { gross: number; net: number }> = {};
  rows.forEach((r: any) => {
    if (!byMonth[r.month]) byMonth[r.month] = { gross: 0, net: 0 };
    byMonth[r.month].gross += parseFloat(r.gross || 0);
    byMonth[r.month].net   += parseFloat(r.net_salary || 0);
  });
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const chartData = Object.entries(byMonth).sort(([a],[b]) => +a - +b).map(([m, v]) => ({ label: MONTH_LABELS[+m-1], ...v }));
  const netTrend = chartData.map(d => d.net);

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
        <button onClick={() => payrolls.reload()}
          style={{ background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 9, padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          <i className="fas fa-sync-alt" style={{ marginRight: 6 }} />Refresh
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Records', val: String(rows.length), icon: 'fas fa-file-alt', color: '#3b82f6' },
          { label: 'Gross Payroll', val: formatAmount(totalGross), icon: 'fas fa-coins', color: '#10b981' },
          { label: 'Total Deductions', val: formatAmount(totalDeductions), icon: 'fas fa-minus-circle', color: '#ef4444' },
          { label: 'Paid Out', val: String(paidCount), icon: 'fas fa-check-circle', color: '#6366f1' },
        ].map((s, i) => (
          <KpiStatCard key={i} label={s.label} val={s.val} icon={s.icon} color={s.color} index={i} />
        ))}
      </div>

      {/* Charts row */}
      {chartData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 24 }}>
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: C.dark, marginBottom: 14 }}>Gross vs Net — Monthly Breakdown</div>
            <BarChart data={chartData} />
          </div>
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: C.dark, marginBottom: 6 }}>Net Salary Trend</div>
            <div style={{ color: C.muted, fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>{year}</div>
            <LineChart data={netTrend} />
            <div style={{ marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20, color: C.orange }}>
              {formatAmount(totalNet)}
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted }}>Total Net Salary</div>
          </div>
        </div>
      )}

      {/* Detailed table */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.dark }}>Detailed Records</span>
        </div>
        {payrolls.loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>No payroll records for this period.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Employee', 'Month', 'Year', 'Present', 'Basic', 'Gross', 'Net Salary', 'Status', 'Paid At'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td style={{ padding: '11px 14px', fontWeight: 600, color: C.dark, whiteSpace: 'nowrap' }}>{r.employee_name}</td>
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
