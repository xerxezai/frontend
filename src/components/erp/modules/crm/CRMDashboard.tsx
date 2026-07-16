import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch } from '../../../../hooks/useERPApi';
import { OG, FF, WHITE, BORDER, useFmtCurrency, Card3D, stageMeta, activityTypeMeta } from './crmShared';

interface DashboardData {
  total_customers: number;
  total_leads: number;
  total_deals_value: number;
  leads_conversion_rate: number;
  top_5_customers_by_deal_value: { customer_id: number; customer_name: string; value: number }[];
  monthly_deals_last_6_months: { month: string; count: number; value: number }[];
  pipeline_value_by_stage: { stage: string; value: number }[];
  activities_due_today: number;
  overdue_activities: number;
}

const ChartTooltip = ({ active, payload, label }: any) => {
  const fmtINR = useFmtCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color ?? p.payload?.fill, fontWeight: 600 }}>
          {p.name}: {p.name?.toLowerCase().includes('value') ? fmtINR(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

const KpiCard = ({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) => (
  <Card3D accent={accent} p="18px 20px">
    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
      <i className={icon} style={{ color: accent, fontSize: 15 }} />
    </div>
    <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 22, color: '#1A1A1A' }}>{value}</div>
    <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{label}</div>
  </Card3D>
);

export default function CRMDashboard() {
  const fmtINR = useFmtCurrency();
  const [data, setData] = useState<DashboardData | null>(null);
  const [todayActivities, setTodayActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, todayList] = await Promise.all([
        erpFetch('crm/dashboard/'),
        erpFetch('crm/activities/today/'),
      ]);
      setData(dash);
      setTodayActivities(todayList);
    } catch {
      // handled by empty state below
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!data) return <div className="alert alert-danger">Could not load the CRM dashboard.</div>;

  const stageChartData = data.pipeline_value_by_stage.map(s => ({ ...s, label: stageMeta(s.stage).label }));

  return (
    <div>
      <button onClick={load} title="Refresh dashboard" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', marginBottom: 8 }}>
        <i className="fas fa-sync-alt" style={{ fontSize: 11 }} />Refresh
      </button>

      {data.overdue_activities > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '13px 18px' }}>
          <i className="fas fa-triangle-exclamation" style={{ color: '#991b1b', fontSize: 16 }} />
          <div style={{ fontFamily: FF, fontSize: 13, color: '#7f1d1d' }}>
            <strong>{data.overdue_activities} overdue activit{data.overdue_activities > 1 ? 'ies' : 'y'}</strong> — check the Activities tab.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-users" label="Total Customers" value={String(data.total_customers)} accent={OG} />
        <KpiCard icon="fas fa-bullseye" label="Total Leads" value={String(data.total_leads)} accent="#3b82f6" />
        <KpiCard icon="fas fa-sack-dollar" label="Total Pipeline Value" value={fmtINR(data.total_deals_value)} accent="#10b981" />
        <KpiCard icon="fas fa-percent" label="Lead Conversion Rate" value={`${data.leads_conversion_rate}%`} accent="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Deals Created — Last 6 Months</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Count and value by month</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.monthly_deals_last_6_months} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Deal Value" fill={OG} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>Pipeline Value by Stage</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>Open + closed deals</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stageChartData} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Stage Value" fill="#8b5cf6" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Top 5 Customers by Deal Value</span>
          </div>
          {data.top_5_customers_by_deal_value.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>No deals yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
              <tbody>
                {data.top_5_customers_by_deal_value.map(c => (
                  <tr key={c.customer_id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '11px 18px', fontWeight: 600, color: '#1A1A1A' }}>{c.customer_name}</td>
                    <td style={{ padding: '11px 18px', textAlign: 'right', fontWeight: 800, color: OG }}>{fmtINR(c.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Activities Due Today ({data.activities_due_today})</span>
          </div>
          {todayActivities.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>Nothing due today.</div>
          ) : (
            <div style={{ padding: '10px 18px' }}>
              {todayActivities.map(a => {
                const m = activityTypeMeta(a.type);
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
                    <i className={m.icon} style={{ color: m.color, fontSize: 12 }} />
                    <span style={{ fontFamily: FF, fontSize: 12.5, color: '#1A1A1A', flex: 1 }}>{a.summary}</span>
                    {a.completed && <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: 12 }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
