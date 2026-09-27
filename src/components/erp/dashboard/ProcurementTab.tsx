import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { erpFetch, useERPList } from '../../../hooks/useERPApi';
import { useCurrency } from '../../../context/CurrencyContext';
import {
  NAVY, GOLD, FF, MUTED, GREEN, AMBER, RED, BLUE, BORDER, TrendKpiCard, SectionCard,
  SectionHead, SkeletonBlock2 as Skeleton, EmptyState, TH, TD, fmtShortDate,
} from './dashboardShared';

const PO_STATUS_META: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: '#9CA3AF' }, sent: { label: 'Sent', color: BLUE }, received: { label: 'Received', color: GREEN }, cancelled: { label: 'Cancelled', color: '#6B6B6B' },
};

export default function ProcurementTab({ refreshKey }: { refreshKey: number }) {
  const { formatAmount, convertAmount } = useCurrency();
  const purchaseOrders = useERPList<any>('procurement/purchase-orders/');
  const bills = useERPList<any>('procurement/bills/');

  const [dash, setDash] = useState<any>(null);
  const [dashState, setDashState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [invDash, setInvDash] = useState<any>(null);

  useEffect(() => {
    setDashState('loading');
    erpFetch('procurement/dashboard/').then(d => { setDash(d); setDashState('ok'); }).catch(() => setDashState('error'));
    erpFetch('inventory/dashboard/').then(setInvDash).catch(() => setInvDash(null));
  }, [refreshKey]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const posThisMonth = purchaseOrders.data.filter((p: any) => p.order_date && new Date(p.order_date) >= monthStart).length;
  const overdueBills = bills.data.filter((b: any) => b.is_overdue);

  const statusDonut = Object.entries(PO_STATUS_META).map(([status, meta]) => ({
    status, ...meta, value: purchaseOrders.data.filter((p: any) => p.status === status).length,
  })).filter(d => d.value > 0);

  const recentPOs = [...purchaseOrders.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5);
  const pendingReceipts = purchaseOrders.data.filter((p: any) => !['received', 'cancelled'].includes(p.status));

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="dash-kpi-grid">
        <style>{`@media (max-width:1150px){.dash-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
        <TrendKpiCard icon={<span>◆</span>} label="Total POs This Month" value={posThisMonth} accent={GOLD} loading={purchaseOrders.loading} />
        <TrendKpiCard icon={<span>◆</span>} label="Total Spent" value={convertAmount(dash?.total_spent_this_month ?? 0)} accent="#8b5cf6" loading={dashState === 'loading'} sub={dashState === 'ok' ? formatAmount(convertAmount(dash.total_spent_this_month)) : undefined} />
        <TrendKpiCard icon={<span>◆</span>} label="Pending Orders" value={dash?.pending_orders ?? 0} accent={AMBER} loading={dashState === 'loading'} />
        <TrendKpiCard icon={<span>◆</span>} label="Overdue Bills" value={overdueBills.length} accent={RED} loading={bills.loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Spending" subtitle="Last 6 months" />
          {dashState === 'loading' ? <Skeleton h={260} /> : !dash?.monthly_spending?.length ? <EmptyState message="No spending data yet." /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dash.monthly_spending.map((m: any) => ({ month: m.month, total: convertAmount(m.total) }))} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => formatAmount(v)} contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 10, border: `1px solid ${BORDER}` }} />
                <Bar dataKey="total" name="Spent" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
        <SectionCard>
          <SectionHead title="Purchase Orders by Status" />
          {purchaseOrders.loading ? <Skeleton h={260} /> : statusDonut.length === 0 ? <EmptyState message="No purchase orders yet." /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusDonut} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {statusDonut.map(d => <Cell key={d.status} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: any, n: any) => [`${v} order${v === 1 ? '' : 's'}`, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Top 5 Suppliers" subtitle="By spending" /></div>
          {dashState === 'loading' ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : !dash?.top_suppliers?.length ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No supplier spending yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Supplier', 'Spent'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{dash.top_suppliers.map((s: any, i: number) => (
                <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{s.name || s.supplier_name}</td>
                  <td style={{ ...TD, fontWeight: 700, color: GOLD }}>{formatAmount(convertAmount(s.total || s.total_spent))}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Overdue Bills" /></div>
          {bills.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : overdueBills.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No overdue bills." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Bill', 'Supplier', 'Due', 'Amount'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{overdueBills.map((b: any) => (
                <tr key={b.id} style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(217,53,34,0.04)' }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{b.bill_number}</td>
                  <td style={TD}>{b.supplier_name}</td>
                  <td style={{ ...TD, color: RED, fontWeight: 700 }}>{fmtShortDate(b.due_date)}</td>
                  <td style={{ ...TD, fontWeight: 800, color: RED }}>{formatAmount(convertAmount(b.amount))}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard noPad>
          <div style={{ padding: '20px 22px 4px' }}><SectionHead title="Recent Purchase Orders" /></div>
          {purchaseOrders.loading ? <div style={{ padding: '0 22px 20px' }}><Skeleton h={140} /></div> : recentPOs.length === 0 ? <div style={{ padding: '0 22px 22px' }}><EmptyState message="No purchase orders yet." /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#fafbfc' }}>{['Number', 'Supplier', 'Status', 'Amount', 'Delivery'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{recentPOs.map((p: any) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...TD, fontWeight: 700 }}>{p.po_number}</td>
                  <td style={TD}>{p.supplier_name}</td>
                  <td style={{ ...TD, textTransform: 'capitalize' }}>{p.status}</td>
                  <td style={{ ...TD, fontWeight: 700, color: GOLD }}>{formatAmount(convertAmount(p.total))}</td>
                  <td style={TD}>{fmtShortDate(p.expected_delivery)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </SectionCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <SectionCard>
            <SectionHead title="Goods Receipts Pending" subtitle="POs not yet marked received" />
            {purchaseOrders.loading ? <Skeleton h={80} /> : pendingReceipts.length === 0 ? <EmptyState message="All purchase orders received." /> : (
              <div style={{ fontSize: 20, fontWeight: 900, color: AMBER }}>{pendingReceipts.length}</div>
            )}
          </SectionCard>
          <SectionCard>
            <SectionHead title="Low Stock Alerts" />
            {!invDash ? <Skeleton h={80} /> : (invDash.low_stock_count ?? 0) === 0 ? <EmptyState message="All products above minimum stock." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: RED, marginBottom: 4 }}>{invDash.low_stock_count}</div>
                {(invDash.low_stock_items ?? []).slice(0, 4).map((p: any) => (
                  <div key={p.id} style={{ fontSize: 12, color: NAVY, fontWeight: 600 }}>{p.name} <span style={{ color: '#9CA3AF' }}>({p.current_stock}/{p.min_stock_level})</span></div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
