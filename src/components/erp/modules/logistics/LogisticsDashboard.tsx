import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, KpiCard, SHIPMENT_STATUS, StatusBadge } from './logisticsShared';

interface DashboardData {
  total_shipments: number;
  in_transit: number;
  delivered_today: number;
  pending: number;
  on_time_rate: number;
  recent_shipments: any[];
  shipments_by_status: { status: string; count: number }[];
}

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const label = SHIPMENT_STATUS[p.payload.status]?.label ?? p.payload.status;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11.5, color: p.fill, fontWeight: 600 }}>{p.value} shipment{p.value === 1 ? '' : 's'}</div>
    </div>
  );
};

export default function LogisticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await erpFetch('logistics/dashboard/')); }
    catch { /* handled by empty state below */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load the logistics dashboard.</div>;

  const chartData = data.shipments_by_status.map(s => ({ ...s, label: SHIPMENT_STATUS[s.status]?.label ?? s.status, fill: SHIPMENT_STATUS[s.status]?.color ?? '#64748b' }));

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={load} title="Refresh dashboard" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fas fa-sync-alt" style={{ fontSize: 11 }} />Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-truck" label="Total Shipments" value={String(data.total_shipments)} accent={OG} />
        <KpiCard icon="fas fa-route" label="In Transit" value={String(data.in_transit)} accent="#1d4ed8" />
        <KpiCard icon="fas fa-box-open" label="Delivered Today" value={String(data.delivered_today)} accent="#10b981" />
        <KpiCard icon="fas fa-hourglass-half" label="Pending" value={String(data.pending)} accent="#64748b" />
        <KpiCard icon="fas fa-stopwatch" label="On Time Rate" value={`${data.on_time_rate}%`} accent="#6d28d9" />
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 22 }}>
        <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Shipments by Status</div>
        <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Current distribution across all statuses</div>
        {chartData.every(c => c.count === 0) ? (
          <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No shipments yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(201,136,58,0.06)' }} />
              <Bar dataKey="count" name="Shipments" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700}>
                {chartData.map(c => <Cell key={c.status} fill={c.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Recent Shipments</span>
        </div>
        {data.recent_shipments.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No shipments yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: FF }}>
            <thead>
              <tr style={{ background: '#fafaf9' }}>
                <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Shipment #</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Carrier</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '11px 16px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Est. Delivery</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_shipments.map(s => (
                <tr key={s.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '11px 16px', fontWeight: 700, color: '#1A1A1A' }}>{s.shipment_number}</td>
                  <td style={{ padding: '11px 16px', color: '#6B6B6B' }}>{s.customer_name}</td>
                  <td style={{ padding: '11px 16px', color: '#6B6B6B' }}>{s.carrier || '—'}</td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={s.status} map={SHIPMENT_STATUS} /></td>
                  <td style={{ padding: '11px 16px', color: '#6B6B6B' }}>{s.estimated_delivery || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
