import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch, useERPList } from '../../../hooks/useERPApi';
import { useCurrency } from '../../../context/CurrencyContext';
import { STAGES } from '../modules/crm/crmShared';
import {
  NAVY, GOLD, FF, MUTED, GREEN, RED, BORDER, TrendKpiCard, SectionCard, SectionHead,
  SkeletonBlock2 as Skeleton, EmptyState, Pill, TH, TD, fmtShortDate, todayISO,
} from './dashboardShared';

interface PipelineStats {
  by_stage: Record<string, { count: number; value: number }>;
  total_pipeline_value: number;
  deals_won: { count: number; value: number };
  deals_lost: { count: number; value: number };
  win_rate: number;
}

const SCORE_META: Record<string, { label: string; bg: string; color: string }> = {
  hot: { label: 'Hot', bg: '#fee2e2', color: '#991b1b' },
  warm: { label: 'Warm', bg: '#ffedd5', color: '#c2410c' },
  cold: { label: 'Cold', bg: '#dbeafe', color: '#1d4ed8' },
};

export default function CRMTab({ refreshKey }: { refreshKey: number }) {
  const { formatAmount, convertAmount } = useCurrency();
  const deals = useERPList<any>('crm/deals/');
  const leads = useERPList<any>('crm/leads/');
  const activities = useERPList<any>('crm/activities/');

  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [statsState, setStatsState] = useState<'loading' | 'ok' | 'error'>('loading');
  useEffect(() => {
    setStatsState('loading');
    erpFetch('crm/deals/pipeline-stats/').then(d => { setStats(d); setStatsState('ok'); }).catch(() => setStatsState('error'));
  }, [refreshKey]);

  const now = new Date();
  const wonThisMonth = deals.data.filter((d: any) => d.stage === 'won' && d.updated_at && new Date(d.updated_at).getMonth() === now.getMonth() && new Date(d.updated_at).getFullYear() === now.getFullYear());

  const stageChart = STAGES.map(s => ({ stage: s.label, value: stats?.by_stage?.[s.key]?.count ?? 0, color: s.color }));
  const wonLostDonut = [
    { name: 'Won', value: stats?.deals_won.count ?? 0, color: GREEN },
    { name: 'Lost', value: stats?.deals_lost.count ?? 0, color: RED },
  ];

  const topCustomers = useMemo(() => {
    const map = new Map<string, { company: string; deals: number; value: number }>();
    deals.data.forEach((d: any) => {
      const name = d.customer_name || d.lead_name;
      if (!name) return;
      const cur = map.get(name) || { company: '—', deals: 0, value: 0 };
      cur.deals += 1; cur.value += Number(d.value || 0);
      map.set(name, cur);
    });
    return Array.from(map.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [deals.data]);

  const recentLeads = [...leads.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5);

  const dueToday = activities.data.filter((a: any) => a.due_date === todayISO() && !a.completed);

  const closingWeek = useMemo(() => {
    const weekOut = new Date(); weekOut.setDate(weekOut.getDate() + 7);
    return deals.data.filter((d: any) => !['won', 'lost'].includes(d.stage) && d.expected_close && d.expected_close <= weekOut.toISOString().slice(0, 10) && d.expected_close >= todayISO());
  }, [deals.data]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="dash-kpi-grid">
        <style>{`@media (max-width:1150px){.dash-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
        <TrendKpiCard icon={<span>◆</span>} label="Total Pipeline Value" value={convertAmount(stats?.total_pipeline_value ?? 0)} accent={GOLD} loading={statsState === 'loading'} sub={formatAmount(convertAmount(stats?.total_pipeline_value ?? 0))} />
        <TrendKpiCard icon={<span>◆</span>} label="Active Deals" value={deals.data.filter((d: any) => !['won', 'lost'].includes(d.stage)).length} accent="#3b82f6" loading={deals.loading} />
        <TrendKpiCard icon={<span>◆</span>} label="Won This Month" value={wonThisMonth.length} accent={GREEN} loading={deals.loading} />
        <TrendKpiCard icon={<span>◆</span>} label="Win Rate" value={stats?.win_rate ?? 0} format="percent" accent="#8b5cf6" loading={statsState === 'loading'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Pipeline by Stage" />
          {statsState === 'loading' ? <Skeleton h={260} /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stageChart} layout="vertical" margin={{ top: 6, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" width={90} tick={{ fontSize: 11, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [`${v} deals`, 'Count']} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>{stageChart.map((s, i) => <Cell key={i} fill={s.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Won vs. Lost" />
          {statsState === 'loading' ? <Skeleton h={260} /> : (stats?.deals_won.count ?? 0) + (stats?.deals_lost.count ?? 0) === 0 ? <EmptyState message="No closed deals yet." /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={wonLostDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {wonLostDonut.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: any, n: any) => [`${v} deals`, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Top 5 Customers" subtitle="By revenue" /></div>
          {deals.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : topCustomers.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No deals yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Customer', 'Deals', 'Value'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{topCustomers.map(c => (
                <tr key={c.name} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{c.name}</td>
                  <td style={TD}>{c.deals}</td>
                  <td style={{ ...TD, fontWeight: 700, color: GOLD }}>{formatAmount(c.value)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Recent Leads" /></div>
          {leads.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : recentLeads.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No leads yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Lead', 'Source', 'Score', 'Status', 'Follow-up'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{recentLeads.map((l: any) => {
                const s = SCORE_META[l.score] ?? SCORE_META.warm;
                return (
                  <tr key={l.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, fontWeight: 700 }}>{l.name}</td>
                    <td style={TD}>{l.source || '—'}</td>
                    <td style={TD}><Pill label={s.label} bg={s.bg} color={s.color} /></td>
                    <td style={{ ...TD, textTransform: 'capitalize' }}>{l.status}</td>
                    <td style={TD}>{fmtShortDate(l.follow_up_date)}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Activities Due Today" />
          {activities.loading ? <Skeleton h={100} /> : dueToday.length === 0 ? <EmptyState message="No activities due today." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dueToday.map((a: any) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: FF }}>
                  <span style={{ color: NAVY, fontWeight: 600, textTransform: 'capitalize' }}>{a.type}: {a.summary}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Deals Closing This Week" />
          {deals.loading ? <Skeleton h={100} /> : closingWeek.length === 0 ? <EmptyState message="No deals closing this week." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {closingWeek.map((d: any) => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: FF }}>
                  <span style={{ color: NAVY, fontWeight: 700 }}>{d.title}</span>
                  <span style={{ color: '#c2410c', fontWeight: 800 }}>{fmtShortDate(d.expected_close)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
