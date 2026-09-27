import { Link } from 'react-router-dom';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import {
  OG, DARK, WHITE, BORDER, GREEN, AMBER, RED, BLUE, KpiCard, SectionCard, SectionHead,
  Skeleton, ErrorRetry, EmptyState, FF, TD, CountBadge,
} from './executiveShared';
import { buildInvoiceMonthlySeries, topCustomersByRevenue } from './executiveData';

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

export default function OverviewTab({ period }: { period: 'monthly' | 'ytd' }) {
  const { formatAmount, convertAmount } = useCurrency();

  const invoices = useERPList<any>('invoicing/invoices/');
  const projects = useERPList<any>('project-management/projects/');
  const employees = useERPList<any>('hr/employees/');
  const orders = useERPList<any>('sales/orders/');
  const leaves = useERPList<any>('hr/leave-requests/');
  const expenses = useERPList<any>('accounting/expenses/');
  const overtime = useERPList<any>('hr/overtime/');

  const now = new Date();
  const inPeriod = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (period === 'ytd') return d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const invLoaded = !invoices.loading && !invoices.error;
  const periodInvoices = invLoaded ? invoices.data.filter((i: any) => i.status !== 'cancelled' && inPeriod(i.issue_date)) : [];
  const totalRevenue = periodInvoices.reduce((s: number, i: any) => s + Number(i.total || 0), 0);
  const totalCollected = periodInvoices.reduce((s: number, i: any) => s + Number(i.amount_paid || 0), 0);
  const totalOutstanding = invLoaded
    ? invoices.data.reduce((s: number, i: any) => {
        if (i.status === 'cancelled') return s;
        const bal = i.balance != null ? Number(i.balance) : Math.max(Number(i.total || 0) - Number(i.amount_paid || 0), 0);
        return s + bal;
      }, 0)
    : 0;

  const activeProjects = projects.data.filter((p: any) => p.status === 'active');
  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');

  const chartData = buildInvoiceMonthlySeries(invLoaded ? invoices.data : []).map(p => ({
    month: p.month, invoiced: convertAmount(p.invoiced), collected: convertAmount(p.collected), outstanding: convertAmount(p.outstanding), collectionRate: p.collectionRate,
  }));

  // ── Portfolio risk donut — real project.priority among non-closed projects (see file notes) ──
  const openProjects = projects.data.filter((p: any) => p.status !== 'completed' && p.status !== 'cancelled');
  const riskCounts = {
    ok: openProjects.filter((p: any) => p.priority === 'low' || p.priority === 'medium' || !p.priority).length,
    review: openProjects.filter((p: any) => p.priority === 'high').length,
    critical: openProjects.filter((p: any) => p.priority === 'critical').length,
  };
  const riskTotal = riskCounts.ok + riskCounts.review + riskCounts.critical;
  const riskData = [
    { name: 'No exceptions', value: riskCounts.ok, color: GREEN },
    { name: 'Needs review', value: riskCounts.review, color: AMBER },
    { name: 'Critical', value: riskCounts.critical, color: RED },
  ];

  const topCustomers = topCustomersByRevenue(invLoaded ? invoices.data : [], 5);
  const recentOrders = [...orders.data].sort((a: any, b: any) => b.id - a.id).slice(0, 5);
  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending').length;
  const pendingExpenses = expenses.data.filter((e: any) => e.status === 'pending').length;
  const pendingOvertime = overtime.data.filter((o: any) => o.status === 'pending').length;

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 22 }} className="exec-kpi-grid">
        <style>{`
          @media (max-width:1200px){ .exec-kpi-grid{grid-template-columns:repeat(3,1fr)!important} }
          @media (max-width:640px){ .exec-kpi-grid{grid-template-columns:repeat(2,1fr)!important} }
        `}</style>
        <KpiCard icon={<CoinIcon />} label="Total Revenue" value={convertAmount(totalRevenue)} format="currency" accent={OG} loading={invoices.loading} sub={period === 'ytd' ? 'Year to date' : 'This month'} />
        <KpiCard icon={<CheckCircleIcon />} label="Total Collected" value={convertAmount(totalCollected)} format="currency" accent={GREEN} loading={invoices.loading} sub={period === 'ytd' ? 'Year to date' : 'This month'} />
        <KpiCard icon={<ClockIcon />} label="Outstanding" value={convertAmount(totalOutstanding)} format="currency" accent={AMBER} loading={invoices.loading} sub="Current balance, all invoices" />
        <KpiCard icon={<BriefcaseIcon />} label="Active Projects" value={activeProjects.length} accent={BLUE} loading={projects.loading} sub={`${projects.data.length} total`} />
        <KpiCard icon={<UsersIcon />} label="Total Employees" value={employees.data.length} accent="#8b5cf6" loading={employees.loading} sub={`${activeEmployees.length} active`} />
      </div>

      {/* Chart row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, marginBottom: 18 }} className="exec-2col">
        <style>{`@media (max-width:1000px){ .exec-2col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard>
          <SectionHead title="Company Performance" subtitle="Invoiced vs. collected vs. outstanding — last 12 months" />
          {invoices.loading ? <Skeleton h={280} /> : invoices.error ? <ErrorRetry onRetry={invoices.reload} /> : (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={chartData} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10.5, fill: '#6B6B6B', fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip content={<ChartTooltip fmt={formatAmount} />} cursor={{ fill: 'rgba(217,53,34,0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FF }} iconType="circle" />
                <Bar yAxisId="left" dataKey="invoiced" name="Invoiced" fill={OG} radius={[3, 3, 0, 0]} />
                <Bar yAxisId="left" dataKey="collected" name="Collected" fill={GREEN} radius={[3, 3, 0, 0]} />
                <Bar yAxisId="left" dataKey="outstanding" name="Outstanding" fill={AMBER} radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="collectionRate" name="Collection Rate %" stroke={DARK} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Portfolio Risk" subtitle="Open projects by priority" />
          {projects.loading ? <Skeleton h={280} /> : projects.error ? <ErrorRetry onRetry={projects.reload} /> : riskTotal === 0 ? (
            <EmptyState message="No open projects to assess." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={56} outerRadius={82} paddingAngle={2}>
                    {riskData.map(d => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any, n: any) => [`${v} project${v === 1 ? '' : 's'}`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {riskData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FF, fontSize: 12.5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: DARK, fontWeight: 600 }}>
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.color }} />{d.name}
                    </span>
                    <span style={{ fontWeight: 800, color: DARK }}>{d.value} <span style={{ color: '#9CA3AF', fontWeight: 600 }}>({riskTotal ? Math.round((d.value / riskTotal) * 100) : 0}%)</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Bottom summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }} className="exec-3col">
        <style>{`@media (max-width:1000px){ .exec-3col{grid-template-columns:1fr!important} }`}</style>

        <SectionCard>
          <SectionHead title="Top 5 Customers" subtitle="By revenue" />
          {invoices.loading ? <SkeletonInline /> : invoices.error ? <ErrorRetry onRetry={invoices.reload} /> : topCustomers.length === 0 ? (
            <EmptyState message="No invoiced revenue yet." />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {topCustomers.map(c => (
                  <tr key={c.name} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ ...TD, padding: '9px 0', fontWeight: 700 }}>{c.name}</td>
                    <td style={{ ...TD, padding: '9px 0', textAlign: 'right', color: OG, fontWeight: 800 }}>{formatAmount(c.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Recent Sales Orders" action={<Link to="/erp/sales/orders" style={{ fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: OG, textDecoration: 'none' }}>View all</Link>} />
          {orders.loading ? <SkeletonInline /> : orders.error ? <ErrorRetry onRetry={orders.reload} /> : recentOrders.length === 0 ? (
            <EmptyState message="No sales orders yet." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentOrders.map((o: any) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 9, borderTop: `1px solid ${BORDER}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.number || `#${o.id}`}</div>
                    <div style={{ fontFamily: FF, fontSize: 11, color: '#9CA3AF' }}>{o.customer_name || '—'}</div>
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, flexShrink: 0 }}>{formatAmount(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead title="Pending Approvals" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ApprovalRow label="Leave requests" count={pendingLeaves} to="/erp/executive-overview" />
            <ApprovalRow label="Expense claims" count={pendingExpenses} to="/erp/executive-overview" />
            <ApprovalRow label="Overtime requests" count={pendingOvertime} to="/erp/executive-overview" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

const ApprovalRow = ({ label, count }: { label: string; count: number; to: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 9, borderTop: `1px solid ${BORDER}` }}>
    <span style={{ fontFamily: FF, fontSize: 12.5, color: DARK, fontWeight: 600 }}>{label}</span>
    <CountBadge n={count} />
  </div>
);

const SkeletonInline = () => (
  <div>{[0, 1, 2].map(i => <Skeleton key={i} h={16} mb={10} />)}</div>
);

// ── inline icon set — matches the FA-icon visual weight already used across the ERP without
// pulling in a second icon library just for this page ─────────────────────────────────────
const CoinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5c0-1.4 1.1-2 2.5-2s2.5.7 2.5 2c0 2.5-5 1.5-5 4 0 1.3 1.1 2 2.5 2s2.5-.6 2.5-2" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 5-5" />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.3 3-6 6.5-6s6.5 2.7 6.5 6" />
    <circle cx="17" cy="9" r="2.6" /><path d="M15.7 14.2c2.6.3 4.8 2.6 4.8 5.8" />
  </svg>
);
