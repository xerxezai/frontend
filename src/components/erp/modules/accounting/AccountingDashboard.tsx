import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, useFmtCurrency, KpiCard } from './accountingShared';

const PIE_COLORS = [OG, '#0D9488', '#1d4ed8', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#64748b'];

interface DashboardData {
  total_revenue_this_month: number;
  total_expenses_this_month: number;
  net_profit_this_month: number;
  tax_collected_this_month: number;
  overdue_invoices_count: number;
  revenue_vs_expenses: { month: string; revenue: number; expenses: number }[];
  expense_breakdown: { category: string; total: number }[];
}

const ChartTooltip = ({ active, payload, label }: any) => {
  const fmtINR = useFmtCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color ?? p.payload?.fill, fontWeight: 600 }}>
          {p.name}: {fmtINR(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function AccountingDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const fmtINR = useFmtCurrency();

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await erpFetch('accounting/dashboard/')); }
    catch { /* handled by empty state below */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load the accounting dashboard.</div>;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={load} title="Refresh dashboard" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fas fa-sync-alt" style={{ fontSize: 11 }} />Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-sack-dollar" label="Total Revenue" value={fmtINR(data.total_revenue_this_month)} accent={OG} />
        <KpiCard icon="fas fa-receipt" label="Total Expenses" value={fmtINR(data.total_expenses_this_month)} accent="#7c3aed" />
        <KpiCard icon="fas fa-chart-line" label="Net Profit" value={fmtINR(data.net_profit_this_month)} accent="#10b981" />
        <KpiCard icon="fas fa-percent" label="Tax Collected" value={fmtINR(data.tax_collected_this_month)} accent="#1d4ed8" />
        <KpiCard icon="fas fa-triangle-exclamation" label="Overdue Invoices" value={String(data.overdue_invoices_count)} accent="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 22 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Revenue vs Expenses — Last 6 Months</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Paid invoice revenue vs approved expenses per month</div>
          {data.revenue_vs_expenses.every(m => m.revenue === 0 && m.expenses === 0) ? (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No revenue or expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.revenue_vs_expenses} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(201,136,58,0.06)' }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FF }} iconType="circle" />
                <Bar dataKey="revenue" name="Revenue" fill={OG} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
                <Bar dataKey="expenses" name="Expenses" fill="#7c3aed" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Expense Breakdown</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Approved expenses by category (all-time)</div>
          {data.expense_breakdown.length === 0 ? (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No approved expenses yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.expense_breakdown} dataKey="total" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} isAnimationActive animationDuration={700}>
                  {data.expense_breakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FF }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
