import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, fmtINR, KpiCard, PO_STATUS, StatusBadge } from './procurementShared';

interface DashboardData {
  total_orders: number;
  pending_orders: number;
  total_spent_this_month: number;
  overdue_bills: number;
  recent_orders: any[];
  top_suppliers: { id: number; name: string; spend: number }[];
  monthly_spending: { month: string; total: number }[];
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color ?? p.payload?.fill, fontWeight: 600 }}>
          {fmtINR(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function ProcurementDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await erpFetch('procurement/dashboard/')); }
    catch { /* handled by empty state below */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load the procurement dashboard.</div>;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={load} title="Refresh dashboard" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fas fa-sync-alt" style={{ fontSize: 11 }} />Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-file-invoice" label="Total Purchase Orders" value={String(data.total_orders)} accent={OG} />
        <KpiCard icon="fas fa-hourglass-half" label="Pending Orders" value={String(data.pending_orders)} accent="#1d4ed8" />
        <KpiCard icon="fas fa-sack-dollar" label="Total Spent This Month" value={fmtINR(data.total_spent_this_month)} accent="#10b981" />
        <KpiCard icon="fas fa-triangle-exclamation" label="Overdue Bills" value={String(data.overdue_bills)} accent="#ef4444" />
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 22 }}>
        <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Monthly Spending — Last 6 Months</div>
        <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Purchase order totals per month (excluding cancelled)</div>
        {data.monthly_spending.every(m => m.total === 0) ? (
          <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No purchase order spending yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthly_spending} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(201,136,58,0.06)' }} />
              <Bar dataKey="total" name="Spend" fill={OG} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Recent Purchase Orders</span>
          </div>
          {data.recent_orders.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No purchase orders yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>PO #</th>
                  <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Supplier</th>
                  <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '11px 16px', textAlign: 'right', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.map(po => (
                  <tr key={po.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: '#1A1A1A' }}>{po.po_number}</td>
                    <td style={{ padding: '11px 16px', color: '#6B6B6B' }}>{po.supplier_name}</td>
                    <td style={{ padding: '11px 16px' }}><StatusBadge status={po.status} map={PO_STATUS} /></td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontWeight: 800, color: OG }}>{fmtINR(po.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Top 5 Suppliers by Spending</span>
          </div>
          {data.top_suppliers.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No supplier spending yet.</div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {data.top_suppliers.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderTop: i ? `1px solid ${BORDER}` : 'none' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(201,136,58,0.10)', color: OG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ flex: 1, fontFamily: FF, fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{s.name}</span>
                  <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 800, color: OG }}>{fmtINR(s.spend)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
