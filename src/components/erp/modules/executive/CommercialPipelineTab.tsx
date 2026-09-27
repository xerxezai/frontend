import { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import { STAGES } from '../crm/crmShared';
import {
  OG, DARK, BORDER, GREEN, AMBER, KpiCard, SectionCard, SectionHead, Skeleton,
  ErrorRetry, EmptyState, FF, TH, TD, Pill,
} from './executiveShared';
import { fmtShortDate } from './executiveData';

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

export default function CommercialPipelineTab() {
  const { formatAmount, convertAmount } = useCurrency();
  const deals = useERPList<any>('crm/deals/');
  const quotations = useERPList<any>('sales/quotations/');
  const leads = useERPList<any>('crm/leads/');

  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [statsState, setStatsState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [expiring, setExpiring] = useState<any[]>([]);
  const [expiringState, setExpiringState] = useState<'loading' | 'ok' | 'error'>('loading');

  const loadStats = () => {
    setStatsState('loading');
    erpFetch('crm/deals/pipeline-stats/').then(d => { setStats(d); setStatsState('ok'); }).catch(() => setStatsState('error'));
  };
  const loadExpiring = () => {
    setExpiringState('loading');
    erpFetch('sales/quotations/expiring/').then(d => { setExpiring(Array.isArray(d) ? d : d.results ?? []); setExpiringState('ok'); }).catch(() => setExpiringState('error'));
  };
  useEffect(loadStats, []);
  useEffect(loadExpiring, []);

  const stageChart = STAGES.filter(s => s.key !== 'won' && s.key !== 'lost').map(s => ({
    stage: s.label, value: convertAmount(stats?.by_stage?.[s.key]?.value ?? 0), count: stats?.by_stage?.[s.key]?.count ?? 0, color: s.color,
  }));

  const recentDeals = [...deals.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5);
  const recentQuotations = [...quotations.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5);

  const topLeads = [...leads.data]
    .filter((l: any) => !['won', 'lost'].includes(l.status))
    .sort((a: any, b: any) => Number(b.estimated_value || 0) - Number(a.estimated_value || 0))
    .slice(0, 8);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="exec-kpi-grid">
        <style>{`@media (max-width:900px){ .exec-kpi-grid{grid-template-columns:repeat(2,1fr)!important} }`}</style>
        <KpiCard icon={<FunnelIcon />} label="Total Pipeline Value" value={convertAmount(stats?.total_pipeline_value ?? 0)} format="currency" accent={OG} loading={statsState === 'loading'} />
        <KpiCard icon={<TrophyIcon />} label="Deals Won" value={stats?.deals_won.count ?? 0} accent={GREEN} loading={statsState === 'loading'} sub={statsState === 'ok' ? formatAmount(stats!.deals_won.value) : undefined} />
        <KpiCard icon={<PercentIcon />} label="Win Rate" value={stats?.win_rate ?? 0} format="percent" accent={(stats?.win_rate ?? 0) >= 40 ? GREEN : AMBER} loading={statsState === 'loading'} />
        <KpiCard icon={<TimerIcon />} label="Quotations Expiring Soon" value={expiring.length} accent={AMBER} loading={expiringState === 'loading'} sub="Next 7 days" />
      </div>

      {statsState === 'error' && <div style={{ marginBottom: 18 }}><ErrorRetry message="Couldn't load pipeline stats." onRetry={loadStats} /></div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="exec-2col">
        <style>{`@media (max-width:1000px){ .exec-2col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard>
          <SectionHead title="Pipeline by Stage" subtitle="New → Contacted → Proposal → Negotiation" />
          {statsState === 'loading' ? <Skeleton h={260} /> : statsState === 'error' ? <ErrorRetry onRetry={loadStats} /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stageChart} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v: any, _n: any, p: any) => [`${formatAmount(v)} · ${p.payload.count} deal${p.payload.count === 1 ? '' : 's'}`, 'Value']} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="value" name="Value" radius={[6, 6, 0, 0]}>
                  {stageChart.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Recent Activity" />
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Latest Deals</div>
            {deals.loading ? <Skeleton h={90} /> : deals.error ? <ErrorRetry onRetry={deals.reload} /> : recentDeals.length === 0 ? <EmptyState message="No deals yet." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentDeals.map((d: any) => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontFamily: FF, fontSize: 12 }}>
                    <span style={{ color: DARK, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</span>
                    <span style={{ color: OG, fontWeight: 700, flexShrink: 0 }}>{formatAmount(d.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Latest Quotations</div>
            {quotations.loading ? <Skeleton h={90} /> : quotations.error ? <ErrorRetry onRetry={quotations.reload} /> : recentQuotations.length === 0 ? <EmptyState message="No quotations yet." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentQuotations.map((q: any) => (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontFamily: FF, fontSize: 12 }}>
                    <span style={{ color: DARK, fontWeight: 700 }}>{q.number || `#${q.id}`} <span style={{ color: '#9CA3AF', fontWeight: 500 }}>· {q.customer_name || '—'}</span></span>
                    <span style={{ color: OG, fontWeight: 700, flexShrink: 0 }}>{formatAmount(q.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard noPad>
        <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Top Leads" subtitle="Ranked by estimated value" /></div>
        {leads.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={160} /></div> : leads.error ? <ErrorRetry onRetry={leads.reload} /> : topLeads.length === 0 ? (
          <div style={{ padding: '0 22px 22px' }}><EmptyState message="No open leads." /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafbfc' }}>
                  {['Lead', 'Company', 'Value', 'Score', 'Follow-up', 'Status'].map(h => <th key={h} style={TH}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {topLeads.map((l: any) => {
                  const s = SCORE_META[l.score] ?? SCORE_META.warm;
                  return (
                    <tr key={l.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD, fontWeight: 700 }}>{l.name}</td>
                      <td style={TD}>{l.company || '—'}</td>
                      <td style={{ ...TD, fontWeight: 700, color: OG }}>{formatAmount(l.estimated_value)}</td>
                      <td style={TD}><Pill label={s.label} bg={s.bg} color={s.color} /></td>
                      <td style={TD}>{fmtShortDate(l.follow_up_date)}</td>
                      <td style={{ ...TD, textTransform: 'capitalize' }}>{l.status || 'new'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

const FunnelIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16l-6 8v6l-4 2v-8L4 4Z" /></svg>);
const TrophyIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4M10 15v3h4v-3M8 21h8" /></svg>);
const PercentIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>);
const TimerIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6" /></svg>);
