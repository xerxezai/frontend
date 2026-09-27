import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Inbox, Wallet, ListChecks, ArrowUpRight, UsersRound, Users2, ShoppingCart, Truck, Warehouse } from 'lucide-react';
import { erpFetch, useERPList } from '../../../hooks/useERPApi';
import { useCurrency } from '../../../context/CurrencyContext';
import {
  NAVY, GOLD, FF, MUTED, GREEN, AMBER, RED, BLUE, PURPLE, YELLOW, TEAL,
  BORDER, TrendKpiCard, SectionCard, SectionHead, SkeletonBlock2 as Skeleton, EmptyState,
  ActionBtn, fmtShortDate, todayISO,
} from './dashboardShared';

const greetingFor = (hour: number) => hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

const AlertsBanner = ({ overdueInvoices, expiringDocs, totalApprovals }: { overdueInvoices: number; expiringDocs: number; totalApprovals: number }) => {
  const [dismissed, setDismissed] = useState(false);
  const items: string[] = [];
  if (overdueInvoices > 0) items.push(`${overdueInvoices} invoice${overdueInvoices === 1 ? '' : 's'} overdue`);
  if (expiringDocs > 0) items.push(`${expiringDocs} employee document${expiringDocs === 1 ? '' : 's'} expiring`);
  if (totalApprovals > 0) items.push(`${totalApprovals} approval${totalApprovals === 1 ? '' : 's'} pending`);
  if (dismissed || items.length === 0) return null;
  return (
    <div style={{
      background: GOLD, color: '#fff', borderRadius: 14, padding: '13px 18px', marginBottom: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontFamily: FF,
      boxShadow: '0 6px 20px rgba(217,53,34,0.25)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        {items.map((it, i) => <span key={i} style={{ fontSize: 13, fontWeight: 700 }}>⚠️ {it}</span>)}
      </div>
      <button onClick={() => setDismissed(true)} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 7, width: 26, height: 26, color: '#fff', cursor: 'pointer' }}>✕</button>
    </div>
  );
};

const ChartTooltip = ({ active, payload, label, fmt }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(7,26,51,0.14)', border: `1px solid ${BORDER}`, fontFamily: FF }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{label}</div>}
      {payload.map((p: any) => <div key={p.dataKey} style={{ fontSize: 11.5, color: p.color, fontWeight: 600 }}>{p.name}: {fmt(p.value)}</div>)}
    </div>
  );
};

export default function OverviewTab({ refreshKey, onNavigateTab }: { refreshKey: number; onNavigateTab: (tab: string) => void }) {
  const { formatAmount, convertAmount } = useCurrency();
  const userName = (localStorage.getItem('xerxez_name') || 'there').split(' ')[0];
  const now = new Date();

  const employees = useERPList<any>('hr/employees/');
  const leaves = useERPList<any>('hr/leave-requests/');
  const expenses = useERPList<any>('accounting/expenses/');
  const overtime = useERPList<any>('hr/overtime/');
  const invoices = useERPList<any>('invoicing/invoices/');
  const leadsList = useERPList<any>('crm/leads/');
  const orders = useERPList<any>('sales/orders/');
  const shipments = useERPList<any>('logistics/shipments/');
  const activities = useERPList<any>('crm/activities/');

  const [accDash, setAccDash] = useState<any>(null);
  const [accState, setAccState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [procDash, setProcDash] = useState<any>(null);
  const [procState, setProcState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [logDash, setLogDash] = useState<any>(null);
  const [logState, setLogState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [pipeline, setPipeline] = useState<any>(null);
  const [pipelineState, setPipelineState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [expiringDocs, setExpiringDocs] = useState<any[]>([]);
  const [docsForbidden, setDocsForbidden] = useState(false);
  const [onboardingOverdue, setOnboardingOverdue] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    setAccState('loading'); erpFetch('accounting/dashboard/').then(d => { setAccDash(d); setAccState('ok'); }).catch(() => setAccState('error'));
    setProcState('loading'); erpFetch('procurement/dashboard/').then(d => { setProcDash(d); setProcState('ok'); }).catch(() => setProcState('error'));
    setLogState('loading'); erpFetch('logistics/dashboard/').then(d => { setLogDash(d); setLogState('ok'); }).catch(() => setLogState('error'));
    setPipelineState('loading'); erpFetch('crm/deals/pipeline-stats/').then(d => { setPipeline(d); setPipelineState('ok'); }).catch(() => setPipelineState('error'));
    erpFetch('hr/documents/expiring/').then((d: any) => setExpiringDocs(Array.isArray(d) ? d : [])).catch(() => setDocsForbidden(true));
    erpFetch('hr/onboarding/overdue/').then((d: any) => setOnboardingOverdue(Array.isArray(d) ? d : [])).catch(() => setOnboardingOverdue([]));
    setActivityLoading(true);
    erpFetch('reports/activity/').then((d: any) => setActivityFeed(Array.isArray(d) ? d : [])).catch(() => setActivityFeed([])).finally(() => setActivityLoading(false));
  }, [refreshKey]);

  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending');
  const pendingExpenses = expenses.data.filter((e: any) => e.status === 'pending');
  const pendingOvertime = overtime.data.filter((o: any) => o.status === 'pending');
  const totalApprovals = pendingLeaves.length + pendingExpenses.length + pendingOvertime.length;
  const overdueInvoices = invoices.data.filter((i: any) => i.is_overdue);
  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');
  const invoicedLive = invoices.data.filter((i: any) => i.status !== 'cancelled');
  const outstanding = invoicedLive.reduce((s: number, i: any) => { const bal = i.balance != null ? Number(i.balance) : Math.max(Number(i.total || 0) - Number(i.amount_paid || 0), 0); return s + bal; }, 0);
  const activeDealsCount = pipeline ? Object.entries(pipeline.by_stage as Record<string, { count: number }>).filter(([k]) => k !== 'won' && k !== 'lost').reduce((s, [, v]) => s + v.count, 0) : 0;

  const trend = accDash?.revenue_vs_expenses ?? [];
  const revThis = trend.length ? trend[trend.length - 1].revenue : 0;
  const revPrev = trend.length >= 2 ? trend[trend.length - 2].revenue : 0;
  const revDelta = revPrev > 0 ? ((revThis - revPrev) / revPrev) * 100 : undefined;
  const netThis = trend.length ? trend[trend.length - 1].revenue - trend[trend.length - 1].expenses : 0;
  const netPrev = trend.length >= 2 ? trend[trend.length - 2].revenue - trend[trend.length - 2].expenses : 0;
  const netDelta = netPrev !== 0 ? ((netThis - netPrev) / Math.abs(netPrev)) * 100 : undefined;

  const chartData = trend.map((t: any) => ({ month: t.month, revenue: convertAmount(t.revenue), expenses: convertAmount(t.expenses) }));

  const todaySchedule = useMemo(() => {
    const items: { label: string; sub: string; color: string }[] = [];
    activities.data.filter((a: any) => a.due_date === todayISO() && !a.completed).forEach((a: any) => items.push({ label: a.summary || 'Activity', sub: `${a.type} · CRM`, color: TEAL }));
    leadsList.data.filter((l: any) => l.follow_up_date === todayISO() && !['won', 'lost'].includes(l.status)).forEach((l: any) => items.push({ label: `Follow up with ${l.name}`, sub: 'CRM lead', color: BLUE }));
    shipments.data.filter((s: any) => s.estimated_delivery === todayISO() && s.status !== 'delivered').forEach((s: any) => items.push({ label: `Delivery expected — ${s.shipment_number}`, sub: s.customer_name || 'Logistics', color: PURPLE }));
    if (pendingLeaves.length > 0) items.push({ label: `${pendingLeaves.length} leave approval${pendingLeaves.length === 1 ? '' : 's'} due`, sub: 'HR', color: AMBER });
    return items;
  }, [activities.data, leadsList.data, shipments.data, pendingLeaves.length]);

  return (
    <div>
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontFamily: FF, fontWeight: 800, fontSize: 24, color: NAVY, margin: 0 }}>{greetingFor(now.getHours())}, {userName}</h1>
        <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>Your work, approvals, schedule and company updates in one place.</p>
      </div>

      <div style={{ marginTop: 16 }}>
        <AlertsBanner overdueInvoices={overdueInvoices.length} expiringDocs={docsForbidden ? 0 : expiringDocs.length} totalApprovals={totalApprovals} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }} className="dash-kpi-grid">
        <style>{`@media (max-width:1150px){.dash-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
        <TrendKpiCard icon={<Wallet size={14} />} label="Revenue This Month" value={convertAmount(revThis)} accent={BLUE} deltaPct={revDelta} loading={accState === 'loading'} sub={formatAmount(convertAmount(revThis))} />
        <TrendKpiCard icon={<ArrowUpRight size={14} />} label="Net Profit" value={convertAmount(netThis)} accent={NAVY} deltaPct={netDelta} loading={accState === 'loading'} sub={formatAmount(convertAmount(netThis))} />
        <TrendKpiCard icon={<AlertOutstandingIcon />} label="Outstanding Payments" value={convertAmount(outstanding)} accent={RED} loading={invoices.loading} sub={formatAmount(convertAmount(outstanding))} />
        <TrendKpiCard icon={<UsersRound size={14} />} label="Active Employees" value={activeEmployees.length} accent={GREEN} loading={employees.loading} sub={`${employees.data.length} total`} />
        <TrendKpiCard icon={<Users2 size={14} />} label="Active Deals" value={activeDealsCount} accent={PURPLE} loading={pipelineState === 'loading'} />
        <TrendKpiCard icon={<ShoppingCart size={14} />} label="Open POs" value={procDash?.pending_orders ?? 0} accent={YELLOW} loading={procState === 'loading'} />
        <TrendKpiCard icon={<Truck size={14} />} label="Shipments In Transit" value={logDash?.in_transit ?? 0} accent={TEAL} loading={logState === 'loading'} />
        <TrendKpiCard icon={<ListChecks size={14} />} label="Pending Approvals" value={totalApprovals} accent={AMBER} loading={leaves.loading || expenses.loading || overtime.loading} sub={`${pendingLeaves.length} leave · ${pendingExpenses.length} expense · ${pendingOvertime.length} OT`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <SectionCard>
          <SectionHead title="Company Performance" subtitle="Revenue vs. expenses — last 6 months" />
          {accState === 'loading' ? <Skeleton h={260} /> : accState === 'error' ? <EmptyState message="Couldn't load performance data." /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(7,26,51,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FF }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip fmt={formatAmount} />} cursor={{ fill: 'rgba(217,53,34,0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FF }} iconType="circle" />
                <Bar dataKey="revenue" name="Revenue" fill={GOLD} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <QuickAccess
          leadsCount={leadsList.data.filter((l: any) => l.status === 'new').length}
          openOrdersCount={orders.data.filter((o: any) => o.status === 'open').length}
          pendingPOs={procDash?.pending_orders ?? 0}
          inTransit={logDash?.in_transit ?? 0}
          overdueInvoicesCount={overdueInvoices.length}
          pendingLeaveCount={pendingLeaves.length}
          onNavigateTab={onNavigateTab}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }} className="dash-2col">
        <style>{`@media (max-width:1050px){.dash-2col{grid-template-columns:1fr!important}}`}</style>
        <MyWorkToday
          onboardingOverdue={onboardingOverdue}
          pendingLeaves={pendingLeaves} pendingExpenses={pendingExpenses} pendingOvertime={pendingOvertime}
          leaves={leaves} expenses={expenses} overtime={overtime}
          recent={activityFeed} recentLoading={activityLoading}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <SectionCard>
            <SectionHead title="Recent Activity" subtitle="Last 10 actions across all modules" />
            {activityLoading ? <div>{[0, 1, 2].map(i => <Skeleton key={i} h={16} mb={10} />)}</div> : activityFeed.length === 0 ? <EmptyState message="No recent activity yet." /> : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activityFeed.slice(0, 10).map((item: any, i: number) => (
                  <div key={item.id ?? i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderTop: i > 0 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, color: NAVY, fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 10.5, color: '#9CA3AF' }}>{item.time_ago}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard>
            <SectionHead title="Today's Schedule" />
            {todaySchedule.length === 0 ? <EmptyState message="No scheduled items for today." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todaySchedule.map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, paddingTop: i > 0 ? 9 : 0, borderTop: i > 0 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: it.color, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>{it.label}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{it.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

const AlertOutstandingIcon = () => <ArrowUpRight size={14} style={{ transform: 'rotate(90deg)' }} />;

type WorkTab = 'tasks' | 'approvals' | 'recent';
const MyWorkToday = ({ onboardingOverdue, pendingLeaves, pendingExpenses, pendingOvertime, leaves, expenses, overtime, recent, recentLoading }: {
  onboardingOverdue: any[]; pendingLeaves: any[]; pendingExpenses: any[]; pendingOvertime: any[];
  leaves: any; expenses: any; overtime: any; recent: any[]; recentLoading: boolean;
}) => {
  const [tab, setTab] = useState<WorkTab>('tasks');
  const [busy, setBusy] = useState<string | null>(null);
  const { formatAmount } = useCurrency();

  const decideLeave = async (id: number, action: 'approved' | 'rejected') => {
    setBusy(`l${id}`);
    try { await erpFetch(`hr/leave-requests/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action }) }); toast.success(`Leave ${action}`); leaves.reload(); }
    catch (e: any) { toast.error(e.message || 'Failed'); } finally { setBusy(null); }
  };
  const decideExpense = async (id: number, status: 'approved' | 'rejected') => {
    setBusy(`e${id}`);
    try { await erpFetch(`accounting/expenses/${id}/approve/`, { method: 'PUT', body: JSON.stringify({ status }) }); toast.success(`Expense ${status}`); expenses.reload(); }
    catch (e: any) { toast.error(e.message || 'Failed'); } finally { setBusy(null); }
  };
  const decideOvertime = async (id: number, action: 'approved' | 'rejected') => {
    setBusy(`o${id}`);
    try { await erpFetch(`hr/overtime/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action }) }); toast.success(`Overtime ${action}`); overtime.reload(); }
    catch (e: any) { toast.error(e.message || 'Failed'); } finally { setBusy(null); }
  };

  return (
    <SectionCard noPad>
      <div style={{ padding: '20px 22px 0' }}>
        <SectionHead title="My Work Today" />
        <div style={{ display: 'flex', gap: 18, borderBottom: `1px solid ${BORDER}`, marginTop: -6 }}>
          {([['tasks', 'Tasks'], ['approvals', 'Approvals'], ['recent', 'Recent']] as [WorkTab, string][]).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '8px 2px 10px',
              fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: tab === k ? GOLD : MUTED,
              borderBottom: tab === k ? `2px solid ${GOLD}` : '2px solid transparent',
            }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '18px 22px 20px' }}>
        {tab === 'tasks' && (
          onboardingOverdue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <Inbox size={32} color="#D1D5DB" style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>No open tasks assigned</div>
              <div style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 3 }}>New records will appear here when available.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {onboardingOverdue.map((t: any) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>{t.task}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{t.employee_name} · Onboarding</div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: RED }}>Due {fmtShortDate(t.due_date)}</span>
                </div>
              ))}
            </div>
          )
        )}
        {tab === 'approvals' && (
          pendingLeaves.length + pendingExpenses.length + pendingOvertime.length === 0 ? <EmptyState message="No pending approvals — all caught up." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingLeaves.map((l: any) => (
                <div key={`l${l.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>{l.employee_name} <span style={{ fontWeight: 500, color: '#9CA3AF' }}>· {l.type} leave · {l.days}d</span></div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <ActionBtn tone="approve" disabled={busy === `l${l.id}`} onClick={() => decideLeave(l.id, 'approved')}>Approve</ActionBtn>
                    <ActionBtn tone="reject" disabled={busy === `l${l.id}`} onClick={() => decideLeave(l.id, 'rejected')}>Reject</ActionBtn>
                  </div>
                </div>
              ))}
              {pendingExpenses.map((e: any) => (
                <div key={`e${e.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>{e.expense_number} <span style={{ fontWeight: 500, color: '#9CA3AF' }}>· {e.category} · {formatAmount(e.amount)}</span></div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <ActionBtn tone="approve" disabled={busy === `e${e.id}`} onClick={() => decideExpense(e.id, 'approved')}>Approve</ActionBtn>
                    <ActionBtn tone="reject" disabled={busy === `e${e.id}`} onClick={() => decideExpense(e.id, 'rejected')}>Reject</ActionBtn>
                  </div>
                </div>
              ))}
              {pendingOvertime.map((o: any) => (
                <div key={`o${o.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY }}>{o.employee_name} <span style={{ fontWeight: 500, color: '#9CA3AF' }}>· {Number(o.extra_hours).toFixed(1)}h overtime</span></div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <ActionBtn tone="approve" disabled={busy === `o${o.id}`} onClick={() => decideOvertime(o.id, 'approved')}>Approve</ActionBtn>
                    <ActionBtn tone="reject" disabled={busy === `o${o.id}`} onClick={() => decideOvertime(o.id, 'rejected')}>Reject</ActionBtn>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        {tab === 'recent' && (
          recentLoading ? <div>{[0, 1, 2].map(i => <Skeleton key={i} h={16} mb={10} />)}</div> : recent.length === 0 ? <EmptyState message="No recent activity yet." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recent.slice(0, 5).map((item: any, i: number) => (
                <div key={item.id ?? i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 9, borderBottom: i < 4 ? `1px solid ${BORDER}` : 'none' }}>
                  <span style={{ fontSize: 12.5, color: NAVY, fontWeight: 600 }}>{item.title}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{item.time_ago}</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </SectionCard>
  );
};

const QuickAccess = ({ leadsCount, openOrdersCount, pendingPOs, inTransit, overdueInvoicesCount, pendingLeaveCount, onNavigateTab }: {
  leadsCount: number; openOrdersCount: number; pendingPOs: number; inTransit: number; overdueInvoicesCount: number; pendingLeaveCount: number;
  onNavigateTab: (tab: string) => void;
}) => {
  const cards = [
    { icon: Users2, label: 'CRM', tab: 'crm', stat: `${leadsCount} new lead${leadsCount === 1 ? '' : 's'}`, color: TEAL },
    { icon: ShoppingCart, label: 'Sales', tab: 'sales', stat: `${openOrdersCount} open order${openOrdersCount === 1 ? '' : 's'}`, color: GOLD },
    { icon: Truck, label: 'Procurement', tab: 'procurement', stat: `${pendingPOs} pending PO${pendingPOs === 1 ? '' : 's'}`, color: YELLOW },
    { icon: Warehouse, label: 'Logistics', tab: 'overview', stat: `${inTransit} in transit`, color: PURPLE },
    { icon: Wallet, label: 'Accounting', tab: 'accounting', stat: `${overdueInvoicesCount} overdue`, color: RED },
    { icon: UsersRound, label: 'HR', tab: 'hr', stat: `${pendingLeaveCount} pending`, color: BLUE },
  ];
  return (
    <SectionCard>
      <SectionHead title="Quick Access" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {cards.map(c => (
          <button key={c.label} onClick={() => onNavigateTab(c.tab)} style={{
            display: 'flex', flexDirection: 'column', gap: 6, padding: '12px', borderRadius: 12,
            border: `1px solid ${BORDER}`, background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'transform 200ms',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 8, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}><c.icon size={14} /></span>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: NAVY }}>{c.label}</div>
            <div style={{ fontSize: 10.5, color: '#9CA3AF' }}>{c.stat}</div>
          </button>
        ))}
      </div>
    </SectionCard>
  );
};
