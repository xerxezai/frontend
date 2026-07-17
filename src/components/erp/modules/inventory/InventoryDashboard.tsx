import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, useFmtCurrency, Card3D } from './inventoryShared';

const PIE_COLORS = [OG, '#0D9488', '#1d4ed8', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#64748b'];

interface DashboardData {
  total_value: number;
  low_stock_count: number;
  low_stock_items: { id: number; name: string; code: string; current_stock: number; min_stock_level: number }[];
  top_5_products_by_value: { id: number; name: string; code: string; value: number }[];
  category_wise_value: { category: string; value: number }[];
  stock_movement_last_30_days: { date: string; in: number; out: number }[];
}

const ChartTooltip = ({ active, payload, label }: any) => {
  const fmtINR = useFmtCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color ?? p.payload?.fill, fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' && p.name?.toLowerCase().includes('value') ? fmtINR(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

export default function InventoryDashboard({ refreshKey }: { refreshKey?: number | string } = {}) {
  const fmtINR = useFmtCurrency();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await erpFetch('inventory/dashboard/'));
    } catch {
      // handled by empty state below
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever the caller's refreshKey changes (e.g. on tab switch) — the underlying
  // numbers come from a backend aggregate, not the same live list state the tabs below edit,
  // so they don't update on their own after a create/edit/delete elsewhere on the page.
  useEffect(() => { load(); }, [load, refreshKey]);

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load the inventory dashboard.</div>;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={load} title="Refresh dashboard" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fas fa-sync-alt" style={{ fontSize: 11 }} />Refresh
        </button>
      </div>
      {data.low_stock_count > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '13px 18px',
        }}>
          <i className="fas fa-exclamation-triangle" style={{ color: '#991b1b', fontSize: 16 }} />
          <div style={{ fontFamily: FF, fontSize: 13, color: '#7f1d1d' }}>
            <strong>Reorder alert:</strong> {data.low_stock_count} product{data.low_stock_count > 1 ? 's are' : ' is'} below minimum stock level —{' '}
            {data.low_stock_items.slice(0, 6).map(p => p.name).join(', ')}{data.low_stock_items.length > 6 ? `, +${data.low_stock_items.length - 6} more` : ''}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 22 }}>
        <Card3D accent={OG} p="18px 20px">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FF, marginBottom: 8 }}>Total Inventory Value</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: OG, fontFamily: FF, lineHeight: 1 }}>{fmtINR(Math.round(data.total_value))}</div>
        </Card3D>
        <Card3D accent={data.low_stock_count > 0 ? '#ef4444' : '#10b981'} p="18px 20px">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FF, marginBottom: 8 }}>Low Stock Items</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: data.low_stock_count > 0 ? '#ef4444' : '#10b981', fontFamily: FF, lineHeight: 1, marginBottom: data.low_stock_items.length ? 10 : 0 }}>{data.low_stock_count}</div>
          {data.low_stock_items.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 90, overflowY: 'auto' }}>
              {data.low_stock_items.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: FF, color: '#6B6B6B' }}>
                  <span>{p.name}</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>{p.current_stock} / {p.min_stock_level}</span>
                </div>
              ))}
            </div>
          )}
        </Card3D>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 22 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Stock Movement — Last 30 Days</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Units in vs. out per day</div>
          {data.stock_movement_last_30_days.length === 0 ? (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No movements in the last 30 days.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.stock_movement_last_30_days} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(d: string) => d.slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FF }} iconType="circle" />
                <Bar dataKey="in" name="Stock In" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
                <Bar dataKey="out" name="Stock Out" fill="#ef4444" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Stock Value by Category</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Current stock × cost price</div>
          {data.category_wise_value.length === 0 ? (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No stock value yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.category_wise_value} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} isAnimationActive animationDuration={700}>
                  {data.category_wise_value.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Top 5 Products by Value</span>
        </div>
        {data.top_5_products_by_value.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No active products yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
            <thead>
              <tr style={{ background: '#fafaf9' }}>
                <th style={{ padding: '11px 18px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Product</th>
                <th style={{ padding: '11px 18px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SKU</th>
                <th style={{ padding: '11px 18px', textAlign: 'right', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Stock Value</th>
              </tr>
            </thead>
            <tbody>
              {data.top_5_products_by_value.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ padding: '11px 18px', fontWeight: 600, color: '#1A1A1A' }}>{p.name}</td>
                  <td style={{ padding: '11px 18px', color: '#6B6B6B' }}>{p.code}</td>
                  <td style={{ padding: '11px 18px', textAlign: 'right', fontWeight: 800, color: OG }}>{fmtINR(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
