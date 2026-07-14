import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, fmtINR, KpiCard } from './mlmShared';

const PIE_COLORS = [OG, '#0D9488', '#1d4ed8', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#64748b'];

interface TopPerformer { id: number; distributor_id: string; name: string; level: number; total_sales: number; total_earnings: number; }
interface DashboardData {
  total_distributors: number;
  active_distributors: number;
  total_commissions_this_month: number;
  pending_payouts: number;
  top_performers: TopPerformer[];
  monthly_commissions: { month: string; total: number }[];
  commission_by_level: { level: number; total: number }[];
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color ?? p.payload?.fill, fontWeight: 600 }}>
          {p.name ? `${p.name}: ` : ''}{fmtINR(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function MLMDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await erpFetch('mlm/dashboard/')); }
    catch { /* handled by empty state below */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load the MLM dashboard.</div>;

  const levelData = data.commission_by_level.map(l => ({ ...l, name: `Level ${l.level}` }));

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={load} title="Refresh dashboard" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fas fa-sync-alt" style={{ fontSize: 11 }} />Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-users" label="Total Distributors" value={String(data.total_distributors)} accent={OG} />
        <KpiCard icon="fas fa-user-check" label="Active Distributors" value={String(data.active_distributors)} accent="#10b981" />
        <KpiCard icon="fas fa-sack-dollar" label="Total Commissions This Month" value={fmtINR(data.total_commissions_this_month)} accent="#1d4ed8" />
        <KpiCard icon="fas fa-hourglass-half" label="Pending Payouts" value={String(data.pending_payouts)} accent="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 22 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Monthly Commissions — Last 6 Months</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Commission amounts created per month</div>
          {data.monthly_commissions.every(m => m.total === 0) ? (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No commissions yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.monthly_commissions} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(201,136,58,0.06)' }} />
                <Bar dataKey="total" name="Commissions" fill={OG} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Commission by Level</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Total commission amount per level</div>
          {levelData.every(l => l.total === 0) ? (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No commissions yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={levelData} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} isAnimationActive animationDuration={700}>
                  {levelData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FF }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Top 5 Performers</span>
        </div>
        {data.top_performers.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No distributor earnings yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: FF }}>
            <thead>
              <tr style={{ background: '#fafaf9' }}>
                <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Level</th>
                <th style={{ padding: '11px 16px', textAlign: 'right', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sales</th>
                <th style={{ padding: '11px 16px', textAlign: 'right', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {data.top_performers.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '11px 16px', fontWeight: 700, color: '#1A1A1A' }}>{p.name} <span style={{ color: '#9ca3af', fontWeight: 500 }}>({p.distributor_id})</span></td>
                  <td style={{ padding: '11px 16px', color: '#6B6B6B' }}>Level {p.level}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', color: '#6B6B6B' }}>{fmtINR(p.total_sales)}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontWeight: 800, color: OG }}>{fmtINR(p.total_earnings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
