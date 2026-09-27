import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch, useERPList } from '../../../hooks/useERPApi';
import { useCurrency } from '../../../context/CurrencyContext';
import { buildInvoiceMonthlySeries, topCustomersByRevenue } from '../modules/executive/executiveData';
import {
  NAVY, GOLD, FF, MUTED, GREEN, AMBER, RED, BORDER, TrendKpiCard, SectionCard, SectionHead,
  SkeletonBlock2 as Skeleton, EmptyState, Pill, TH, TD, fmtShortDate,
} from './dashboardShared';

const STATUS_META: Record<string, { label: string; color: string }> = {
  paid: { label: 'Paid', color: GREEN }, overdue: { label: 'Overdue', color: RED },
  draft: { label: 'Draft', color: '#9CA3AF' }, sent: { label: 'Sent', color: '#3b82f6' }, cancelled: { label: 'Cancelled', color: '#6B6B6B' },
};

export default function SalesTab({ refreshKey }: { refreshKey: number }) {
  const { formatAmount, convertAmount } = useCurrency();
  const orders = useERPList<any>('sales/orders/');
  const quotations = useERPList<any>('sales/quotations/');
  const invoices = useERPList<any>('invoicing/invoices/');

  const [expiring, setExpiring] = useState<any[]>([]);
  useEffect(() => { erpFetch('sales/quotations/expiring/').then((d: any) => setExpiring(Array.isArray(d) ? d : d.results ?? [])).catch(() => setExpiring([])); }, [refreshKey]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const salesThisMonth = orders.data.filter((o: any) => o.order_date && new Date(o.order_date) >= monthStart).reduce((s: number, o: any) => s + Number(o.total || 0), 0);

  const liveInvoices = invoices.data.filter((i: any) => i.status !== 'cancelled');
  const invoicedAmount = liveInvoices.reduce((s: number, i: any) => s + Number(i.total || 0), 0);
  const collectionRate = invoicedAmount > 0 ? (liveInvoices.reduce((s: number, i: any) => s + Number(i.amount_paid || 0), 0) / invoicedAmount) * 100 : 0;

  const monthly = useMemo(() => buildInvoiceMonthlySeries(invoices.data, 6).map(p => ({ month: p.month, invoiced: convertAmount(p.invoiced) })), [invoices.data, convertAmount]);

  const productSales = useMemo(() => {
    const map = new Map<string, number>();
    orders.data.forEach((o: any) => (o.items ?? []).forEach((it: any) => {
      const name = it.product_name || 'Other';
      map.set(name, (map.get(name) || 0) + Number(it.total || 0));
    }));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [orders.data]);
  const PIE_COLORS = [GOLD, '#3b82f6', '#8b5cf6', GREEN, AMBER, '#0D9488'];

  const topCustomers = topCustomersByRevenue(liveInvoices, 5);
  const recentOrders = [...orders.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5);
  const overdue = liveInvoices.filter((i: any) => i.is_overdue);

  const invoiceStatusDonut = useMemo(() => {
    const counts: Record<string, number> = {};
    invoices.data.forEach((i: any) => { const key = i.is_overdue ? 'overdue' : i.status; counts[key] = (counts[key] || 0) + 1; });
    return Object.entries(counts).map(([status, value]) => ({ status, value, ...STATUS_META[status] ?? { label: status, color: '#9CA3AF' } }));
  }, [invoices.data]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="dash-kpi-grid">
        <style>{`@media (max-width:1150px){.dash-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
        <TrendKpiCard icon={<span>◆</span>} label="Total Sales This Month" value={convertAmount(salesThisMonth)} accent={GOLD} loading={orders.loading} sub={formatAmount(convertAmount(salesThisMonth))} />
        <TrendKpiCard icon={<span>◆</span>} label="Total Quotations" value={quotations.data.length} accent="#3b82f6" loading={quotations.loading} />
        <TrendKpiCard icon={<span>◆</span>} label="Invoiced Amount" value={convertAmount(invoicedAmount)} accent="#8b5cf6" loading={invoices.loading} sub={formatAmount(convertAmount(invoicedAmount))} />
        <TrendKpiCard icon={<span>◆</span>} label="Collection Rate" value={collectionRate} format="percent" accent={collectionRate >= 70 ? GREEN : AMBER} loading={invoices.loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Revenue" subtitle="Last 6 months, invoiced" />
          {invoices.loading ? <Skeleton h={260} /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthly} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => formatAmount(v)} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="invoiced" name="Invoiced" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Sales by Product" subtitle="Top 6" />
          {orders.loading ? <Skeleton h={260} /> : productSales.length === 0 ? <EmptyState message="No per-product line-item data available." /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={productSales} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {productSales.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatAmount(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Top 5 Customers" subtitle="By sales" /></div>
          {invoices.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : topCustomers.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No invoiced sales yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Customer', 'Value'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{topCustomers.map(c => (
                <tr key={c.name} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{c.name}</td>
                  <td style={{ ...TD, fontWeight: 700, color: GOLD }}>{formatAmount(c.value)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Quotations Expiring Soon" />
          {expiring.length === 0 ? <EmptyState message="No quotations expiring soon." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {expiring.slice(0, 6).map((q: any) => (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>{q.number || `#${q.id}`} <span style={{ fontWeight: 500, color: '#9CA3AF' }}>· {q.customer_name}</span></span>
                  <Pill label={`Expires ${fmtShortDate(q.valid_until)}`} bg="#ffedd5" color="#c2410c" />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Recent Sales Orders" /></div>
          {orders.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : recentOrders.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No sales orders yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Number', 'Customer', 'Status', 'Total'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{recentOrders.map((o: any) => (
                <tr key={o.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{o.number || `#${o.id}`}</td>
                  <td style={TD}>{o.customer_name || '—'}</td>
                  <td style={{ ...TD, textTransform: 'capitalize' }}>{o.status}</td>
                  <td style={{ ...TD, fontWeight: 700, color: GOLD }}>{formatAmount(o.total)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Invoice Status" />
          {invoices.loading ? <Skeleton h={200} /> : invoiceStatusDonut.length === 0 ? <EmptyState message="No invoices yet." /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={invoiceStatusDonut} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={2}>
                  {invoiceStatusDonut.map(d => <Cell key={d.status} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: any, n: any) => [`${v} invoice${v === 1 ? '' : 's'}`, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <SectionCard noPad>
        <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Overdue Invoices" /></div>
        {overdue.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No overdue invoices." /></div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#fafbfc' }}>{['Invoice', 'Customer', 'Due Date', 'Balance'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>{overdue.map((i: any) => {
              const bal = i.balance != null ? Number(i.balance) : Math.max(Number(i.total || 0) - Number(i.amount_paid || 0), 0);
              return (
                <tr key={i.id} style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(217,53,34,0.04)' }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{i.number || `#${i.id}`}</td>
                  <td style={TD}>{i.customer_name || '—'}</td>
                  <td style={{ ...TD, color: RED, fontWeight: 700 }}>{fmtShortDate(i.due_date)}</td>
                  <td style={{ ...TD, fontWeight: 800, color: RED }}>{formatAmount(bal)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}
