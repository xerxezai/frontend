import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, useFmtCurrency, Card3D } from './salesShared';

const PIE_COLORS = [OG, '#0D9488', '#1d4ed8', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#64748b'];

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

interface DashboardData {
  total_sales_this_month: number;
  total_quotations_this_month: number;
  top_5_customers: { customer_id: number; customer_name: string; revenue: number }[];
  revenue_last_6_months: { month: string; revenue: number }[];
  sales_by_product: { product_id: number; product_name: string; revenue: number }[];
}

const KpiCard = ({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) => (
  <Card3D accent={accent} p="18px 20px">
    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
      <i className={icon} style={{ color: accent, fontSize: 15 }} />
    </div>
    <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 22, color: '#1A1A1A' }}>{value}</div>
    <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{label}</div>
  </Card3D>
);

export default function SalesDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const fmtINR = useFmtCurrency();
  const [expiring, setExpiring] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, exp] = await Promise.all([
        erpFetch('sales/dashboard/'),
        erpFetch('sales/quotations/expiring/'),
      ]);
      setData(dash);
      setExpiring(exp);
    } catch {
      // surfaced via empty state below
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  }
  if (!data) {
    return <div className="alert alert-danger">Could not load the sales dashboard.</div>;
  }

  return (
    <div>
      {expiring.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.30)',
          borderRadius: 12, padding: '13px 18px',
        }}>
          <i className="fas fa-triangle-exclamation" style={{ color: '#b45309', fontSize: 16 }} />
          <div style={{ fontFamily: FF, fontSize: 13, color: '#7c4a03' }}>
            <strong>{expiring.length} quotation{expiring.length > 1 ? 's' : ''}</strong> expiring within 3 days:{' '}
            {expiring.map((q: any) => q.number).join(', ')}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
        <KpiCard icon="fas fa-sack-dollar" label="Total Sales This Month" value={fmtINR(data.total_sales_this_month)} accent={OG} />
        <KpiCard icon="fas fa-file-invoice" label="Total Quotations This Month" value={String(data.total_quotations_this_month)} accent="#1d4ed8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 24 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Revenue — Last 6 Months</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Confirmed/delivered sales orders by order date</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.revenue_last_6_months} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill={OG} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Sales by Product</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Quoted line-item revenue</div>
          {data.sales_by_product.length === 0 ? (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No product revenue yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.sales_by_product} dataKey="revenue" nameKey="product_name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} isAnimationActive animationDuration={700}>
                  {data.sales_by_product.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Top 5 Customers by Revenue</span>
        </div>
        {data.top_5_customers.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No sales orders yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
            <thead>
              <tr style={{ background: '#fafaf9' }}>
                <th style={{ padding: '11px 18px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '11px 18px', textAlign: 'right', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.top_5_customers.map(c => (
                <tr key={c.customer_id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '11px 18px', fontWeight: 600, color: '#1A1A1A' }}>{c.customer_name}</td>
                  <td style={{ padding: '11px 18px', textAlign: 'right', fontWeight: 800, color: OG }}>{fmtINR(c.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
