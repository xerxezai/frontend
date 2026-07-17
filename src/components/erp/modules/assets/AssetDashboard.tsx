import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { FF, OG, WHITE, BORDER, KpiCard, useFmtCurrency, ASSET_CATEGORY } from './assetsShared';

interface DashboardData {
  total_assets: number;
  active_assets: number;
  under_maintenance: number;
  due_for_maintenance: number;
  total_asset_value: number;
  maintenance_cost_this_month: number;
}

const PIE_COLORS = ['#C9883A', '#1d4ed8', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

export default function AssetDashboard() {
  const navigate = useNavigate();
  const fmtINR = useFmtCurrency();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const assets = useERPList<any>('asset-management/assets/');

  useEffect(() => {
    erpFetch('asset-management/assets/dashboard/').then(setData).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const dueSoon = assets.data.filter((a: any) => a.next_maintenance && a.next_maintenance >= today && a.next_maintenance <= in30);
  const overdue = assets.data.filter((a: any) => a.maintenance_overdue);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.data.forEach((a: any) => { counts[a.category] = (counts[a.category] || 0) + 1; });
    return Object.entries(counts).map(([k, v]) => ({ name: ASSET_CATEGORY[k]?.label ?? k, value: v }));
  }, [assets.data]);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} role="status"></div></div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-toolbox" label="Total Assets" value={String(data?.total_assets ?? 0)} accent={OG} />
        <KpiCard icon="fas fa-check-circle" label="Active" value={String(data?.active_assets ?? 0)} accent="#10b981" />
        <KpiCard icon="fas fa-wrench" label="Under Maintenance" value={String(data?.under_maintenance ?? 0)} accent="#f59e0b" />
        <KpiCard icon="fas fa-exclamation-triangle" label="Due for Maintenance" value={String(data?.due_for_maintenance ?? 0)} accent="#ef4444" />
        <KpiCard icon="fas fa-coins" label="Total Value" value={fmtINR(data?.total_asset_value ?? 0)} accent="#1d4ed8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Due for Maintenance (next 30 days)</div>
            <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B' }}>Maintenance cost this month: <strong style={{ color: '#1A1A1A' }}>{fmtINR(data?.maintenance_cost_this_month ?? 0)}</strong></div>
          </div>
          {dueSoon.length === 0 && overdue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>Nothing due soon.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...overdue, ...dueSoon.filter((a: any) => !overdue.includes(a))].map((a: any) => {
                const isOverdue = a.maintenance_overdue;
                return (
                  <div key={a.id} onClick={() => navigate(`/erp/assets/${a.id}`)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                    background: isOverdue ? '#fef2f2' : '#fffbeb', border: `1px solid ${isOverdue ? '#fecaca' : '#fde68a'}`,
                    borderRadius: 10, padding: '9px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className={`fas fa-circle`} style={{ fontSize: 7, color: isOverdue ? '#ef4444' : '#f59e0b' }} />
                      <span style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: '#1A1A1A' }}>{a.asset_code} — {a.name}</span>
                    </div>
                    <span style={{ fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: isOverdue ? '#991b1b' : '#92400e' }}>
                      {isOverdue ? 'Overdue' : `Due ${a.next_maintenance}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 10 }}>By Category</div>
          {categoryData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No assets yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={{ fontSize: 11, fontFamily: FF }}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontFamily: FF, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
