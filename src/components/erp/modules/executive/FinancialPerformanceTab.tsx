import { useMemo, useState } from 'react';
import {
  ComposedChart, Bar, Line, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import {
  OG, DARK, WHITE, BORDER, GREEN, AMBER, RED, KpiCard, SectionCard, SectionHead, Skeleton,
  ErrorRetry, EmptyState, AlertBanner, FF, TH, TD, inpSelect,
} from './executiveShared';
import { buildInvoiceMonthlySeries, buildReceivablesAgeing, topOutstandingByClient, daysUntil, fmtShortDate } from './executiveData';

const ChartTooltip = ({ active, payload, label, fmt }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(7,26,51,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} style={{ fontSize: 11.5, color: p.color ?? p.fill, fontWeight: 600 }}>
          {p.name}: {p.dataKey === 'collectionRate' ? `${Number(p.value).toFixed(1)}%` : fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function FinancialPerformanceTab({ period }: { period: 'monthly' | 'ytd' }) {
  const { formatAmount, convertAmount } = useCurrency();
  const invoices = useERPList<any>('invoicing/invoices/');
  const [monthFocus, setMonthFocus] = useState('all');

  const monthly = useMemo(() => buildInvoiceMonthlySeries(invoices.data, 12), [invoices.data]);
  const chartSeries = useMemo(() => {
    if (period === 'monthly') return monthly.map(p => ({ month: p.month, invoiced: convertAmount(p.invoiced), collected: convertAmount(p.collected), collectionRate: p.collectionRate }));
    // YTD — cumulative running totals across the trend window
    let runInv = 0, runCol = 0;
    return monthly.map(p => {
      runInv += p.invoiced; runCol += p.collected;
      return { month: p.month, invoiced: convertAmount(runInv), collected: convertAmount(runCol), collectionRate: runInv > 0 ? (runCol / runInv) * 100 : 0 };
    });
  }, [monthly, period, convertAmount]);

  const now = new Date();
  const inPeriod = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (period === 'ytd') return d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };
  const live = invoices.data.filter((i: any) => i.status !== 'cancelled');
  const periodInvoices = live.filter((i: any) => inPeriod(i.issue_date));
  const invoicedRevenue = periodInvoices.reduce((s: number, i: any) => s + Number(i.total || 0), 0);
  const totalInvoiceValue = live.reduce((s: number, i: any) => s + Number(i.total || 0), 0);
  const totalReceived = live.reduce((s: number, i: any) => s + Number(i.amount_paid || 0), 0);
  const totalPending = Math.max(totalInvoiceValue - totalReceived, 0);
  const collectionRate = totalInvoiceValue > 0 ? (totalReceived / totalInvoiceValue) * 100 : 0;

  const overdue = live.filter((i: any) => i.is_overdue);
  const overdueTotal = overdue.reduce((s: number, i: any) => {
    const bal = i.balance != null ? Number(i.balance) : Math.max(Number(i.total || 0) - Number(i.amount_paid || 0), 0);
    return s + bal;
  }, 0);

  const receivablesByClient = topOutstandingByClient(live, 5);
  const ageing = buildReceivablesAgeing(live);

  const priorities = [...overdue]
    .map((i: any) => ({
      ...i,
      _overdue: -(daysUntil(i.due_date) ?? 0),
      _balance: i.balance != null ? Number(i.balance) : Math.max(Number(i.total || 0) - Number(i.amount_paid || 0), 0),
    }))
    .sort((a, b) => b._overdue - a._overdue)
    .slice(0, 5);

  const monthOptions = monthly.map(m => m.month);

  return (
    <div>
      {overdue.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <AlertBanner tone="red" title={`Executive action required: ${overdue.length} overdue invoice${overdue.length === 1 ? '' : 's'} totaling ${formatAmount(overdueTotal)}`}>
            Review the collection priorities table below — sorted by days overdue.
          </AlertBanner>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 22 }} className="exec-kpi-grid">
        <style>{`
          @media (max-width:1200px){ .exec-kpi-grid{grid-template-columns:repeat(3,1fr)!important} }
          @media (max-width:640px){ .exec-kpi-grid{grid-template-columns:repeat(2,1fr)!important} }
        `}</style>
        <KpiCard icon={<InvoiceIcon />} label="Invoiced Revenue" value={convertAmount(invoicedRevenue)} format="currency" accent={OG} loading={invoices.loading} sub={period === 'ytd' ? 'Year to date' : 'This month'} />
        <KpiCard icon={<StackIcon />} label="Total Invoice Value" value={convertAmount(totalInvoiceValue)} format="currency" accent="#1d4ed8" loading={invoices.loading} sub="All invoices" />
        <KpiCard icon={<CheckIcon />} label="Total Received" value={convertAmount(totalReceived)} format="currency" accent={GREEN} loading={invoices.loading} sub="All invoices" />
        <KpiCard icon={<HourglassIcon />} label="Total Pending" value={convertAmount(totalPending)} format="currency" accent={AMBER} loading={invoices.loading} sub="All invoices" />
        <KpiCard icon={<PercentIcon />} label="Collection Rate" value={collectionRate} format="percent" accent={collectionRate >= 70 ? GREEN : RED} loading={invoices.loading} sub="Received / invoiced" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, marginBottom: 18 }} className="exec-2col">
        <style>{`@media (max-width:1000px){ .exec-2col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard>
          <SectionHead
            title="Invoicing & Collections"
            subtitle={period === 'ytd' ? 'Cumulative year-to-date' : 'Monthly — last 12 months'}
            action={
              <select value={monthFocus} onChange={e => setMonthFocus(e.target.value)} style={inpSelect}>
                <option value="all">All months</option>
                {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            }
          />
          {invoices.loading ? <Skeleton h={280} /> : invoices.error ? <ErrorRetry onRetry={invoices.reload} /> : (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={monthFocus === 'all' ? chartSeries : chartSeries.filter(p => p.month === monthFocus)} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip content={<ChartTooltip fmt={formatAmount} />} cursor={{ fill: 'rgba(217,53,34,0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FF }} iconType="circle" />
                <Bar yAxisId="left" dataKey="invoiced" name="Invoiced" fill={OG} radius={[3, 3, 0, 0]} />
                <Bar yAxisId="left" dataKey="collected" name="Collected" fill={GREEN} radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="collectionRate" name="Collection Rate %" stroke={DARK} strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Receivables by Client" subtitle="Top 5 outstanding balances" />
          {invoices.loading ? <Skeleton h={280} /> : invoices.error ? <ErrorRetry onRetry={invoices.reload} /> : receivablesByClient.length === 0 ? (
            <EmptyState message="No outstanding receivables." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={receivablesByClient} layout="vertical" margin={{ top: 6, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${Math.round(convertAmount(v) / 1000)}k`} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => formatAmount(v)} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="value" name="Outstanding" fill={OG} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }} className="exec-2col">
        <style>{`@media (max-width:1000px){ .exec-2col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Invoice Collection Priorities" subtitle="Top 5 by days overdue" /></div>
          {invoices.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : invoices.error ? <ErrorRetry onRetry={invoices.reload} /> : priorities.length === 0 ? (
            <div style={{ padding: '0 22px 22px' }}><EmptyState message="No overdue invoices — nothing to prioritize." /></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafbfc' }}>
                    {['Invoice', 'Client', 'Balance Due', 'Due Date', 'Days Overdue'].map(h => <th key={h} style={TH}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {priorities.map((r: any) => (
                    <tr key={r.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ ...TD, fontWeight: 700 }}>{r.number || `#${r.id}`}</td>
                      <td style={TD}>{r.customer_name || '—'}</td>
                      <td style={{ ...TD, fontWeight: 700, color: OG }}>{formatAmount(r._balance)}</td>
                      <td style={TD}>{fmtShortDate(r.due_date)}</td>
                      <td style={{ ...TD, fontWeight: 800, color: RED }}>{r._overdue}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Receivables Ageing" subtitle="Open balance by days overdue" />
          {invoices.loading ? <Skeleton h={200} /> : invoices.error ? <ErrorRetry onRetry={invoices.reload} /> : ageing.every(b => b.value === 0) ? (
            <EmptyState message="No aged receivables — everything is current." />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageing.map(b => ({ ...b, value: convertAmount(b.value) }))} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => formatAmount(v)} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="value" name="Outstanding" radius={[4, 4, 0, 0]}>
                  {ageing.map((_, i) => <Cell key={i} fill={[GREEN, AMBER, '#f97316', RED][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

const InvoiceIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>);
const StackIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4M4 16l8 4 8-4" /></svg>);
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const HourglassIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12M6 21h12M7 3c0 6 5 7 5 9s-5 3-5 9M17 3c0 6-5 7-5 9s5 3 5 9" /></svg>);
const PercentIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>);
