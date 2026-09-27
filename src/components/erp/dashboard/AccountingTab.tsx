import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch, useERPList } from '../../../hooks/useERPApi';
import { useCurrency } from '../../../context/CurrencyContext';
import { topCustomersByRevenue } from '../modules/executive/executiveData';
import {
  NAVY, GOLD, FF, MUTED, GREEN, AMBER, RED, BLUE, PURPLE, BORDER, TrendKpiCard, SectionCard,
  SectionHead, SkeletonBlock2 as Skeleton, EmptyState, TH, TD, fmtShortDate,
} from './dashboardShared';

const PIE_COLORS = [GOLD, '#0D9488', BLUE, PURPLE, RED, GREEN, AMBER, '#6366f1'];

export default function AccountingTab({ refreshKey }: { refreshKey: number }) {
  const { formatAmount, convertAmount } = useCurrency();
  const invoices = useERPList<any>('invoicing/invoices/');
  const expenses = useERPList<any>('accounting/expenses/');
  const payments = useERPList<any>('invoicing/payments/');

  const [dash, setDash] = useState<any>(null);
  const [dashState, setDashState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [balanceSheet, setBalanceSheet] = useState<any>(null);

  useEffect(() => {
    setDashState('loading');
    erpFetch('accounting/dashboard/').then(d => { setDash(d); setDashState('ok'); }).catch(() => setDashState('error'));
    erpFetch('accounting/balance-sheet/').then(setBalanceSheet).catch(() => setBalanceSheet(null));
  }, [refreshKey]);

  const trend = dash?.revenue_vs_expenses ?? [];
  const netTrend = trend.map((t: any) => ({ month: t.month, net: convertAmount(t.revenue - t.expenses) }));
  const expenseBreakdown = (dash?.expense_breakdown ?? []).map((e: any) => ({ category: e.category, total: convertAmount(e.total) }));

  const liveInvoices = invoices.data.filter((i: any) => i.status !== 'cancelled');
  const overdue = liveInvoices.filter((i: any) => i.is_overdue);
  const topCustomers = topCustomersByRevenue(liveInvoices, 5);
  const pendingExpenses = expenses.data.filter((e: any) => e.status === 'pending');
  const recentPayments = [...payments.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="dash-kpi-grid">
        <style>{`@media (max-width:1150px){.dash-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
        <TrendKpiCard icon={<span>◆</span>} label="Total Revenue" value={convertAmount(dash?.total_revenue_this_month ?? 0)} accent={BLUE} loading={dashState === 'loading'} sub={dashState === 'ok' ? formatAmount(convertAmount(dash.total_revenue_this_month)) : undefined} />
        <TrendKpiCard icon={<span>◆</span>} label="Total Expenses" value={convertAmount(dash?.total_expenses_this_month ?? 0)} accent={PURPLE} loading={dashState === 'loading'} sub={dashState === 'ok' ? formatAmount(convertAmount(dash.total_expenses_this_month)) : undefined} />
        <TrendKpiCard icon={<span>◆</span>} label="Net Profit" value={convertAmount(dash?.net_profit_this_month ?? 0)} accent={GREEN} loading={dashState === 'loading'} sub={dashState === 'ok' ? formatAmount(convertAmount(dash.net_profit_this_month)) : undefined} />
        <TrendKpiCard icon={<span>◆</span>} label="Tax Collected" value={convertAmount(dash?.tax_collected_this_month ?? 0)} accent={AMBER} loading={dashState === 'loading'} sub={dashState === 'ok' ? formatAmount(convertAmount(dash.tax_collected_this_month)) : undefined} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Revenue vs. Expenses" subtitle="Last 6 months" />
          {dashState === 'loading' ? <Skeleton h={240} /> : trend.length === 0 ? <EmptyState message="No data yet." /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trend.map((t: any) => ({ month: t.month, revenue: convertAmount(t.revenue), expenses: convertAmount(t.expenses) }))} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => formatAmount(v)} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="revenue" name="Revenue" fill={GOLD} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={PURPLE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Net Profit Trend" />
          {dashState === 'loading' ? <Skeleton h={240} /> : netTrend.length === 0 ? <EmptyState message="No data yet." /> : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={netTrend} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => formatAmount(v)} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Line type="monotone" dataKey="net" name="Net Profit" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Expense Breakdown" />
          {expenseBreakdown.length === 0 ? <EmptyState message="No approved expenses yet." /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="total" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {expenseBreakdown.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatAmount(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Balance Sheet Summary" />
          {!balanceSheet ? <Skeleton h={220} /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, height: '100%' }}>
              {[
                { label: 'Assets', value: balanceSheet.assets?.total_assets, color: BLUE },
                { label: 'Liabilities', value: balanceSheet.liabilities?.total_liabilities, color: RED },
                { label: 'Equity', value: balanceSheet.equity?.total_equity, color: GREEN },
              ].map(b => (
                <div key={b.label} style={{ borderRadius: 12, border: `1px solid ${BORDER}`, borderTop: `3px solid ${b.color}`, padding: '14px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8 }}>{b.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: b.color }}>{formatAmount(convertAmount(b.value ?? 0))}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Top 5 Customers" subtitle="By revenue" /></div>
          {invoices.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : topCustomers.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No revenue yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Customer', 'Revenue'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{topCustomers.map(c => (
                <tr key={c.name} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{c.name}</td>
                  <td style={{ ...TD, fontWeight: 700, color: GOLD }}>{formatAmount(c.value)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Overdue Invoices" /></div>
          {overdue.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No overdue invoices." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Invoice', 'Customer', 'Due'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{overdue.slice(0, 6).map((i: any) => (
                <tr key={i.id} style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(217,53,34,0.04)' }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{i.number || `#${i.id}`}</td>
                  <td style={TD}>{i.customer_name || '—'}</td>
                  <td style={{ ...TD, color: RED, fontWeight: 700 }}>{fmtShortDate(i.due_date)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Pending Expense Approvals" />
          {expenses.loading ? <Skeleton h={100} /> : pendingExpenses.length === 0 ? <EmptyState message="No pending expenses." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingExpenses.slice(0, 5).map((e: any) => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: NAVY, fontWeight: 700 }}>{e.expense_number}</span>
                  <span style={{ color: GOLD, fontWeight: 700 }}>{formatAmount(e.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Recent Payments" /></div>
          {payments.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : recentPayments.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No payments recorded yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Invoice', 'Customer', 'Amount', 'Method', 'Date'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{recentPayments.map((p: any) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{p.invoice_number || '—'}</td>
                  <td style={TD}>{p.customer_name || '—'}</td>
                  <td style={{ ...TD, fontWeight: 700, color: GREEN }}>{formatAmount(p.amount)}</td>
                  <td style={{ ...TD, textTransform: 'capitalize' }}>{p.method}</td>
                  <td style={TD}>{p.paid_at ? fmtShortDate(p.paid_at.slice(0, 10)) : '—'}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
