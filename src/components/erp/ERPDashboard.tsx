import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Building2, Users, Star, DollarSign, TrendingUp, AlertCircle, Clock,
  UserCheck, CalendarX, ShoppingCart, Package, Truck, Network, Hourglass,
  RefreshCw, Activity as ActivityIcon,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useERPDashboard, useERPActivity, useSystemStatus, useERPSalesReport, useERPList, isSuperUser } from '../../hooks/useERPApi';
import { useCurrency } from '../../context/CurrencyContext';
import ERPTable from './ERPTable';
import { Link } from 'react-router-dom';
import { inquiryApi, type Inquiry } from './inquiries/inquiryApi';

// ── XERXEZ brand tokens ─────────────────────────────────────────────────────
const GOLD  = '#C9883A';
const DARK  = '#1a1208';
const CREAM = '#F8F7F4';
const FF    = "'DM Sans', sans-serif";

const C = {
  card:      '#FFFFFF',
  cardHover: '#FDF9F4',
  text:      DARK,
  muted:     'rgba(20,20,19,0.50)',
  border:    'rgba(0,0,0,0.08)',
};
const shadow = { card: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.07)' };

// ── premium section gradients ───────────────────────────────────────────────
const SECTION = {
  crm:       { from: '#0D9488', to: '#0F766E', accent: '#0D9488' },
  finance:   { from: '#1a6b3c', to: '#0f4d2a', accent: '#1a6b3c' },
  operations:{ from: '#C9883A', to: '#8B5E28', accent: GOLD },
  hr:        { from: '#1e3a6e', to: '#162a52', accent: '#1e3a6e' },
} as const;
type SectionKey = keyof typeof SECTION;

const ACTIVITY_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  crm:     { bg: 'rgba(13,148,136,0.12)',  color: '#0D9488', label: 'CRM' },
  finance: { bg: 'rgba(26,107,60,0.12)',   color: '#1a6b3c', label: 'Finance' },
  hr:      { bg: 'rgba(30,58,110,0.12)',   color: '#1e3a6e', label: 'HR' },
  sales:   { bg: 'rgba(201,136,58,0.14)',  color: GOLD,      label: 'Sales' },
};

// ── count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500, enabled = true) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!enabled || target <= 0) { setCurrent(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);
  return current;
}

// ── premium gradient stat card ──────────────────────────────────────────────
interface GradCardProps {
  label: string; rawValue: number | null; prefix?: string; decimals?: number;
  icon: React.ElementType; section: SectionKey; index: number; loaded: boolean;
}
const GradCard = ({ label, rawValue, prefix = '', decimals = 0, icon: Icon, section, index, loaded }: GradCardProps) => {
  const [hovered, setHovered] = useState(false);
  const sec = SECTION[section];
  const isNull = rawValue === null;
  const target = isNull ? 0 : decimals > 0 ? Math.round(rawValue * Math.pow(10, decimals)) : rawValue;
  const counted = useCountUp(target, 1500, loaded && !isNull);
  const display = isNull ? '—'
    : decimals > 0 ? `${prefix}${(counted / Math.pow(10, decimals)).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
    : `${prefix}${counted.toLocaleString()}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${sec.from} 0%, ${sec.to} 100%)`,
        borderRadius: 16,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? '0 14px 40px rgba(0,0,0,0.26)' : '0 8px 32px rgba(0,0,0,0.20)',
        transform: hovered ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        animation: `erpFadeUp 0.48s cubic-bezier(0.22,1,0.36,1) ${index * 0.08}s both`,
      }}
    >
      {/* subtle lighter gradient strip along bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 4,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.40), rgba(255,255,255,0.02))',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontFamily: FF, marginBottom: 10, fontWeight: 500 }}>
            {label}
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: FF, lineHeight: 1, letterSpacing: '-0.01em', wordBreak: 'break-word' }}>
            {display}
          </div>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={28} color="#fff" />
        </div>
      </div>
    </div>
  );
};

// ── skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = ({ index }: { index: number }) => (
  <div style={{
    background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
    boxShadow: shadow.card, padding: '24px', height: 132,
    animation: `erpFadeUp 0.36s ease ${index * 0.04}s both`,
  }}>
    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', animation: 'erpShimmer 1.5s ease-in-out infinite', marginBottom: 16 }} />
    <div style={{ height: 22, borderRadius: 5, background: 'rgba(0,0,0,0.06)', animation: 'erpShimmer 1.5s 0.1s ease-in-out infinite', marginBottom: 8, width: '50%' }} />
    <div style={{ height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.06)', animation: 'erpShimmer 1.5s 0.2s ease-in-out infinite', width: '75%' }} />
  </div>
);

// ── section heading (small, above a color group of cards) ──────────────────
const SectionHeading = ({ title }: { title: string }) => (
  <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
    <span style={{
      fontSize: 11, fontWeight: 800, color: C.muted,
      letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: FF,
    }}>
      {title}
    </span>
  </div>
);

// ── System Online / Offline badge ───────────────────────────────────────────
const SystemBadge = () => {
  const online = useSystemStatus(30000);
  const ok = online === true;
  const bad = online === false;
  const color = ok ? '#10b981' : bad ? '#ef4444' : '#9ca3af';
  const bg    = ok ? 'rgba(16,185,129,0.10)' : bad ? 'rgba(239,68,68,0.10)' : 'rgba(107,114,128,0.10)';
  const label = ok ? 'System Online' : bad ? 'System Offline' : 'Checking…';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: bg, padding: '8px 14px', borderRadius: 999,
      border: `1px solid ${color}33`, flexShrink: 0,
    }}>
      <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%', background: color,
          animation: online !== null ? 'erpPing 1.8s cubic-bezier(0,0,0.2,1) infinite' : 'none',
          opacity: 0.6,
        }} />
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color, fontFamily: FF, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
};

// ── Tab bar with sliding highlight ──────────────────────────────────────────
type Tab = 'Overview' | 'Finance' | 'CRM' | 'HR & Payroll' | 'Analytics';
const TABS: Tab[] = ['Overview', 'Finance', 'CRM', 'HR & Payroll', 'Analytics'];

const TabBar = ({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) => {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = refs.current[active];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  return (
    <div style={{
      position: 'relative', display: 'inline-flex', gap: 2,
      background: C.card, borderRadius: 14, padding: 5,
      boxShadow: shadow.card, border: `1px solid ${C.border}`,
      marginBottom: 24, maxWidth: '100%', overflowX: 'auto',
    }}>
      <div style={{
        position: 'absolute', top: 5, bottom: 5,
        left: indicator.left, width: indicator.width,
        background: `linear-gradient(135deg, #e8a84e, ${GOLD})`,
        borderRadius: 10,
        boxShadow: '0 3px 10px rgba(201,136,58,0.35)',
        transition: 'left 0.28s cubic-bezier(0.22,1,0.36,1), width 0.28s cubic-bezier(0.22,1,0.36,1)',
      }} />
      {TABS.map(t => (
        <button
          key={t}
          ref={el => { refs.current[t] = el; }}
          onClick={() => onChange(t)}
          style={{
            position: 'relative', zIndex: 1,
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: 'transparent', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 700, fontFamily: FF, whiteSpace: 'nowrap',
            color: active === t ? '#fff' : C.muted,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => { if (active !== t) (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
          onMouseLeave={e => { if (active !== t) (e.currentTarget as HTMLButtonElement).style.color = C.muted; }}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

// ── custom chart tooltip ────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  const { formatAmount } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.14)', border: `1px solid ${C.border}`,
      fontFamily: FF,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ fontSize: 11.5, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.dataKey === 'revenue' ? formatAmount(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

// ── Performance chart (used in Overview + Finance tabs) ─────────────────────
const PerformanceChart = ({ data, showCustomers = true }: { data: any[]; showCustomers?: boolean }) => (
  <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: '24px 24px 12px' }}>
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: 0, fontFamily: FF }}>Performance Overview</h3>
      <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', fontFamily: FF }}>Last 6 months</p>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GOLD} stopOpacity={0.32} />
            <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0D9488" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted, fontFamily: FF }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: C.muted, fontFamily: FF }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke={GOLD} strokeWidth={2.5} fill="url(#revGrad)"
          dot={{ fill: GOLD, strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} isAnimationActive animationDuration={900} />
        {showCustomers && (
          <Area type="monotone" dataKey="customers" name="New Customers" stroke="#0D9488" strokeWidth={2.5} fill="url(#custGrad)"
            dot={{ fill: '#0D9488', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} isAnimationActive animationDuration={900} />
        )}
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: FF, paddingTop: 10 }} iconType="circle" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// ── Recent Activity feed ────────────────────────────────────────────────────
const ActivityFeed = () => {
  const { data, loading } = useERPActivity(60000);
  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: '22px 22px 18px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Clock size={15} color={GOLD} />
        <h3 style={{ fontSize: 14.5, fontWeight: 800, color: C.text, margin: 0, fontFamily: FF }}>Recent Activities</h3>
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ height: 40, borderRadius: 8, background: 'rgba(0,0,0,0.05)', animation: 'erpShimmer 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p style={{ fontSize: 13, color: C.muted, fontFamily: FF, textAlign: 'center', padding: '24px 0' }}>No recent activity yet.</p>
      ) : (
        <div>
          {data.map((item, i) => {
            const badge = ACTIVITY_BADGE[item.type] ?? ACTIVITY_BADGE.crm;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '11px 8px', borderRadius: 9,
                  borderBottom: i < data.length - 1 ? `1px solid ${C.border}` : 'none',
                  animation: `erpSlideDown 0.35s ease ${i * 0.05}s both`,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = CREAM; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: badge.color, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <p style={{ fontSize: 13, color: C.text, margin: 0, fontFamily: FF, lineHeight: 1.4, fontWeight: 600 }}>
                      {item.title}
                    </p>
                    <span style={{
                      fontSize: 9.5, fontWeight: 800, color: badge.color, background: badge.bg,
                      padding: '2px 8px', borderRadius: 999, flexShrink: 0, letterSpacing: '0.04em',
                      textTransform: 'uppercase', fontFamily: FF,
                    }}>
                      {badge.label}
                    </span>
                  </div>
                  {item.subtitle && (
                    <p style={{ fontSize: 11.5, color: C.muted, margin: '2px 0 0', fontFamily: FF }}>{item.subtitle}</p>
                  )}
                  <span style={{ fontSize: 10.5, color: 'rgba(20,20,19,0.35)', fontFamily: FF }}>{item.time_ago}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Recent Inquiries widget (super admin only) ──────────────────────────────
const RECENT_INQUIRY_STATUS_COLOR: Record<string, string> = {
  new: '#e65100', reviewed: '#1d4ed8', replied: '#16a34a', closed: '#64748b',
};
const RecentInquiriesWidget = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inquiryApi.list({ status: 'new' })
      .then((data: any) => setInquiries(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: '22px 22px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ActivityIcon size={15} color={GOLD} />
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: C.text, margin: 0, fontFamily: FF }}>Recent Inquiries</h3>
        </div>
        <Link to="/erp/inquiries" style={{ fontSize: 12, fontWeight: 700, color: GOLD, fontFamily: FF, textDecoration: 'none' }}>
          View All →
        </Link>
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 44, borderRadius: 8, background: 'rgba(0,0,0,0.05)', animation: 'erpShimmer 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <p style={{ fontSize: 13, color: C.muted, fontFamily: FF, textAlign: 'center', padding: '18px 0' }}>No new inquiries.</p>
      ) : (
        <div>
          {inquiries.map((iq, i) => (
            <div
              key={iq.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                padding: '10px 8px', borderBottom: i < inquiries.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, color: C.text, margin: 0, fontFamily: FF, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {iq.full_name}{iq.company ? ` — ${iq.company}` : ''}
                </p>
                <p style={{ fontSize: 11.5, color: C.muted, margin: '2px 0 0', fontFamily: FF, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {iq.service || 'General Inquiry'} · {new Date(iq.created_at).toLocaleDateString()}
                </p>
              </div>
              <span style={{
                fontSize: 9.5, fontWeight: 800, color: '#fff', background: RECENT_INQUIRY_STATUS_COLOR[iq.status] || '#9ca3af',
                padding: '2px 9px', borderRadius: 999, flexShrink: 0, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: FF,
              }}>
                {iq.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Finance tab ──────────────────────────────────────────────────────────────
const FinanceTab = ({ data, loaded, monthlyTrend }: { data: any; loaded: boolean; monthlyTrend: any[] }) => {
  const invoices = useERPList<any>('invoicing/invoices/');
  const { symbol, convertAmount, formatAmount } = useCurrency();
  const cols = [
    { key: 'number',        label: 'Invoice #' },
    { key: 'customer_name', label: 'Customer',  render: (r: any) => r.customer_name || '—' },
    { key: 'status',        label: 'Status',    render: (r: any) => (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, textTransform: 'capitalize',
          background: r.status === 'paid' ? 'rgba(16,185,129,0.12)' : r.status === 'overdue' ? 'rgba(239,68,68,0.12)' : 'rgba(107,114,128,0.12)',
          color: r.status === 'paid' ? '#059669' : r.status === 'overdue' ? '#dc2626' : '#6b7280' }}>
          {r.status}
        </span>
      ) },
    { key: 'issue_date', label: 'Issue Date' },
    { key: 'total',      label: 'Total', render: (r: any) => formatAmount(r.total || 0) },
  ];
  return (
    <div style={{ animation: 'erpFadeUp 0.4s ease both' }}>
      <div className="erp-cards-grid" style={{ marginBottom: 24 }}>
        <GradCard label="Total Revenue"   rawValue={convertAmount(data?.finance?.total_revenue || '0')}   prefix={symbol + ' '} decimals={2} icon={DollarSign}      section="finance" index={0} loaded={loaded} />
        <GradCard label="This Month"      rawValue={convertAmount(data?.finance?.month_revenue || '0')}   prefix={symbol + ' '} decimals={2} icon={TrendingUp}      section="finance" index={1} loaded={loaded} />
        <GradCard label="Outstanding"     rawValue={convertAmount(data?.finance?.outstanding_invoices || '0')} prefix={symbol + ' '} decimals={2} icon={AlertCircle} section="finance" index={2} loaded={loaded} />
        <GradCard label="Overdue Invoices" rawValue={data?.finance?.overdue_invoices ?? null}                                            icon={Clock}          section="finance" index={3} loaded={loaded} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <PerformanceChart data={monthlyTrend} showCustomers={false} />
      </div>
      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: 22 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, color: C.text, margin: '0 0 14px', fontFamily: FF }}>Recent Transactions</h3>
        <ERPTable title="" columns={cols} data={invoices.data.slice(0, 8)} loading={invoices.loading} error={invoices.error} isAdmin={false} />
      </div>
    </div>
  );
};

// ── CRM tab ──────────────────────────────────────────────────────────────────
type CrmFilter = 'All' | 'Active' | 'Leads' | 'New';
const CRMTab = ({ data, loaded }: { data: any; loaded: boolean }) => {
  const leads = useERPList<any>('crm/leads/');
  const { formatAmount } = useCurrency();
  const [filter, setFilter] = useState<CrmFilter>('All');

  const filtered = useMemo(() => {
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    switch (filter) {
      case 'Active': return leads.data.filter(l => !['won', 'lost'].includes(l.status));
      case 'Leads':  return leads.data.filter(l => l.status === 'new');
      case 'New':    return leads.data.filter(l => new Date(l.created_at) >= monthStart);
      default:       return leads.data;
    }
  }, [leads.data, filter]);

  const statusColor: Record<string, { bg: string; color: string }> = {
    new: { bg: 'rgba(59,130,246,0.10)', color: '#3b82f6' },
    contacted: { bg: 'rgba(245,158,11,0.10)', color: '#d97706' },
    qualified: { bg: 'rgba(139,92,246,0.10)', color: '#7c3aed' },
    proposal: { bg: 'rgba(13,148,136,0.10)', color: '#0D9488' },
    won: { bg: 'rgba(16,185,129,0.10)', color: '#059669' },
    lost: { bg: 'rgba(239,68,68,0.10)', color: '#dc2626' },
  };
  const cols = [
    { key: 'name',    label: 'Lead' },
    { key: 'company', label: 'Company',  render: (r: any) => r.company || '—' },
    { key: 'source',  label: 'Source',   render: (r: any) => r.source || '—' },
    { key: 'status',  label: 'Status',   render: (r: any) => {
        const c = statusColor[r.status] ?? { bg: 'rgba(107,114,128,0.10)', color: '#6b7280' };
        return <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, textTransform: 'capitalize', ...c }}>{r.status}</span>;
      } },
    { key: 'estimated_value', label: 'Value', render: (r: any) => r.estimated_value ? formatAmount(r.estimated_value) : '—' },
  ];

  return (
    <div style={{ animation: 'erpFadeUp 0.4s ease both' }}>
      <div className="erp-cards-grid" style={{ marginBottom: 24 }}>
        <GradCard label="Active Customers" rawValue={data?.crm?.total_customers ?? null}      icon={Building2} section="crm" index={0} loaded={loaded} />
        <GradCard label="Total Leads"      rawValue={data?.crm?.total_leads ?? null}           icon={Users}     section="crm" index={1} loaded={loaded} />
        <GradCard label="New Leads (Month)" rawValue={data?.crm?.new_leads_this_month ?? null} icon={Star}      section="crm" index={2} loaded={loaded} />
      </div>

      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: C.text, margin: 0, fontFamily: FF }}>Lead Pipeline</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['All', 'Active', 'Leads', 'New'] as CrmFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: FF,
                border: 'none', cursor: 'pointer', transition: 'all 0.18s ease',
                background: filter === f ? `linear-gradient(135deg,#0f766e,#0D9488)` : 'rgba(0,0,0,0.05)',
                color: filter === f ? '#fff' : C.muted,
              }}>{f}</button>
            ))}
          </div>
        </div>
        <ERPTable title="" columns={cols} data={filtered} loading={leads.loading} error={leads.error} isAdmin={false} />
      </div>
    </div>
  );
};

// ── HR & Payroll tab ─────────────────────────────────────────────────────────
const HRTab = ({ data, loaded }: { data: any; loaded: boolean }) => {
  const employees = useERPList<any>('hr/employees/');
  const today = new Date().toISOString().slice(0, 10);
  const presentToday = useERPList<any>(`hr/attendance/?date=${today}&status=present`);
  const onLeave = useERPList<any>('hr/employees/?status=on_leave');

  const cols = [
    { key: 'full_name',       label: 'Employee' },
    { key: 'department_name', label: 'Department', render: (r: any) => r.department_name || '—' },
    { key: 'designation',     label: 'Designation', render: (r: any) => r.designation || '—' },
    { key: 'status',          label: 'Status', render: (r: any) => (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, textTransform: 'capitalize',
          background: r.status === 'active' ? 'rgba(16,185,129,0.10)' : 'rgba(107,114,128,0.10)',
          color: r.status === 'active' ? '#059669' : '#6b7280' }}>
          {String(r.status || '').replace('_', ' ')}
        </span>
      ) },
    { key: 'joined_on', label: 'Joined', render: (r: any) => r.joined_on || '—' },
  ];

  const quickStats = [
    { label: 'Present Today',      value: presentToday.data.length, color: '#059669', icon: UserCheck },
    { label: 'On Leave',           value: onLeave.data.length,      color: '#d97706', icon: CalendarX },
    { label: 'Pending Approvals',  value: data?.hr?.pending_leave_requests ?? 0, color: '#dc2626', icon: Clock },
  ];

  return (
    <div style={{ animation: 'erpFadeUp 0.4s ease both' }}>
      <div className="erp-cards-grid" style={{ marginBottom: 20 }}>
        <GradCard label="Active Employees" rawValue={data?.hr?.total_employees ?? null}        icon={UserCheck}  section="hr" index={0} loaded={loaded} />
        <GradCard label="Pending Leave"    rawValue={data?.hr?.pending_leave_requests ?? null}  icon={CalendarX}  section="hr" index={1} loaded={loaded} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {quickStats.map((s, i) => (
          <div key={s.label} style={{
            background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: shadow.card,
            padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
            animation: `erpFadeUp 0.4s ease ${i * 0.06}s both`,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: FF, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: C.muted, fontFamily: FF, marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: 22 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, color: C.text, margin: '0 0 14px', fontFamily: FF }}>Employees</h3>
        <ERPTable title="" columns={cols} data={employees.data.slice(0, 10)} loading={employees.loading} error={employees.error} isAdmin={false} />
      </div>
    </div>
  );
};

// ── Analytics tab ────────────────────────────────────────────────────────────
const PIE_COLORS = [GOLD, '#0D9488', '#1e3a6e', '#dc2626', '#7c3aed', '#059669'];
const AnalyticsTab = ({ monthlyTrend }: { monthlyTrend: any[] }) => {
  const { data: sales, loading } = useERPSalesReport();
  const pieData = (sales?.invoices_by_status ?? []).map((s: any) => ({
    name: (s.status || 'unknown').replace(/^\w/, (c: string) => c.toUpperCase()),
    value: Number(s.total) || s.count || 0,
  }));

  return (
    <div style={{ animation: 'erpFadeUp 0.4s ease both', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: '24px 24px 12px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: '0 0 4px', fontFamily: FF }}>Monthly Comparison</h3>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 16px', fontFamily: FF }}>Revenue vs. new customers, last 6 months</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyTrend} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted, fontFamily: FF }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.muted, fontFamily: FF }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: FF }} iconType="circle" />
            <Bar dataKey="revenue" name="Revenue" fill={GOLD} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} />
            <Bar dataKey="customers" name="New Customers" fill="#0D9488" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: shadow.card, padding: '24px 24px 12px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: '0 0 4px', fontFamily: FF }}>Revenue by Invoice Status</h3>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 16px', fontFamily: FF }}>All invoices</p>
        {loading ? (
          <div style={{ height: 240, borderRadius: 12, background: 'rgba(0,0,0,0.05)', animation: 'erpShimmer 1.5s ease-in-out infinite' }} />
        ) : pieData.length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted, fontFamily: FF, textAlign: 'center', padding: '60px 0' }}>No invoice data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} isAnimationActive animationDuration={900}>
                {pieData.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11.5, fontFamily: FF }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// ── Overview tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ data, loaded, monthlyTrend }: { data: any; loaded: boolean; monthlyTrend: any[] }) => {
  const { symbol, convertAmount } = useCurrency();
  return (
  <div style={{ animation: 'erpFadeUp 0.4s ease both' }}>
    <div className="erp-cards-grid" style={{ marginBottom: 28 }}>
      <SectionHeading title="CRM" />
      <GradCard label="Active Customers"    rawValue={data?.crm?.total_customers ?? null}      icon={Building2} section="crm" index={0} loaded={loaded} />
      <GradCard label="Total Leads"         rawValue={data?.crm?.total_leads ?? null}           icon={Users}     section="crm" index={1} loaded={loaded} />
      <GradCard label="New Leads (Month)"   rawValue={data?.crm?.new_leads_this_month ?? null}  icon={Star}      section="crm" index={2} loaded={loaded} />

      <SectionHeading title="Finance" />
      <GradCard label="Total Revenue"       rawValue={convertAmount(data?.finance?.total_revenue || '0')}       prefix={symbol + ' '} decimals={2} icon={DollarSign}   section="finance" index={3} loaded={loaded} />
      <GradCard label="This Month"          rawValue={convertAmount(data?.finance?.month_revenue || '0')}       prefix={symbol + ' '} decimals={2} icon={TrendingUp}   section="finance" index={4} loaded={loaded} />
      <GradCard label="Outstanding"         rawValue={convertAmount(data?.finance?.outstanding_invoices || '0')} prefix={symbol + ' '} decimals={2} icon={AlertCircle} section="finance" index={5} loaded={loaded} />
      <GradCard label="Overdue Invoices"    rawValue={data?.finance?.overdue_invoices ?? null}                                              icon={Clock}       section="finance" index={6} loaded={loaded} />

      <SectionHeading title="Operations" />
      <GradCard label="Open Orders"         rawValue={data?.sales?.open_orders ?? null}         icon={ShoppingCart} section="operations" index={7}  loaded={loaded} />
      <GradCard label="Active Products"     rawValue={data?.inventory?.total_products ?? null}  icon={Package}      section="operations" index={8}  loaded={loaded} />
      <GradCard label="Pending POs"         rawValue={data?.purchases?.pending_orders ?? null}  icon={Truck}        section="operations" index={9}  loaded={loaded} />
      <GradCard label="Total Commissions"   rawValue={convertAmount(data?.mlm?.total_commissions || '0')}   prefix={symbol + ' '} decimals={2} icon={Network}     section="operations" index={10} loaded={loaded} />
      <GradCard label="Pending Commissions" rawValue={convertAmount(data?.mlm?.pending_commissions || '0')} prefix={symbol + ' '} decimals={2} icon={Hourglass}   section="operations" index={11} loaded={loaded} />

      <SectionHeading title="HR & Payroll" />
      <GradCard label="Active Employees"    rawValue={data?.hr?.total_employees ?? null}         icon={UserCheck} section="hr" index={12} loaded={loaded} />
      <GradCard label="Pending Leave"       rawValue={data?.hr?.pending_leave_requests ?? null}  icon={CalendarX} section="hr" index={13} loaded={loaded} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }} className="erp-overview-split">
      <PerformanceChart data={monthlyTrend} />
      <ActivityFeed />
    </div>

    {isSuperUser() && (
      <div style={{ marginTop: 20 }}>
        <RecentInquiriesWidget />
      </div>
    )}
  </div>
  );
};

// ── dashboard ─────────────────────────────────────────────────────────────────
const ERPDashboard = () => {
  const { data, loading, error, reload } = useERPDashboard();
  const loaded = !loading && !error && !!data;
  const [tab, setTab] = useState<Tab>('Overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const [updatedAt, setUpdatedAt] = useState(() =>
    new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    setUpdatedAt(new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
  }, [data]);

  const monthlyTrend = data?.monthly_trend ?? [];

  const handleRefresh = () => { reload(); setRefreshKey(k => k + 1); };

  return (
    <div key={refreshKey}>
      <style>{`
        @keyframes erpFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes erpSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes erpShimmer {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.50; }
        }
        @keyframes erpPing {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .erp-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 1199px) {
          .erp-cards-grid { grid-template-columns: repeat(3, 1fr); }
          .erp-overview-split { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 767px) {
          .erp-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 479px) {
          .erp-cards-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 14,
        animation: 'erpSlideDown 0.3s ease both',
      }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: DARK, margin: 0, fontFamily: FF, letterSpacing: '-0.02em' }}>Dashboard</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: '4px 0 0', fontFamily: FF }}>Live overview of your enterprise</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <SystemBadge />
          <button
            onClick={handleRefresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '8px 16px', cursor: 'pointer', color: C.text,
              fontSize: 12.5, fontWeight: 700, fontFamily: FF, boxShadow: shadow.card,
              transition: 'background 0.18s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = CREAM; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.card; }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: C.card, padding: '8px 14px', borderRadius: 10,
            border: `1px solid ${C.border}`, boxShadow: shadow.card, flexShrink: 0,
          }}>
            <Clock size={11} color={GOLD} />
            <span style={{ color: C.muted, fontSize: 12, fontFamily: FF, whiteSpace: 'nowrap' }}>Updated {updatedAt}</span>
          </div>
        </div>
      </div>

      {/* error banner */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)',
          borderRadius: 12, padding: '14px 20px', marginBottom: 20,
          color: '#ef4444', fontFamily: FF, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* tabs */}
      <TabBar active={tab} onChange={setTab} />

      {/* tab content */}
      {loading ? (
        <div className="erp-cards-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
        </div>
      ) : !data ? (
        <div style={{ textAlign: 'center', padding: '72px 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg,#e8a84e,${GOLD})`,
            boxShadow: '0 4px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <ActivityIcon size={26} color="#fff" />
          </div>
          <p style={{ color: C.muted, fontSize: 15, fontFamily: FF, margin: 0, fontWeight: 600 }}>No data yet — start adding records</p>
        </div>
      ) : (
        <>
          {tab === 'Overview'      && <OverviewTab data={data} loaded={loaded} monthlyTrend={monthlyTrend} />}
          {tab === 'Finance'       && <FinanceTab data={data} loaded={loaded} monthlyTrend={monthlyTrend} />}
          {tab === 'CRM'           && <CRMTab data={data} loaded={loaded} />}
          {tab === 'HR & Payroll'  && <HRTab data={data} loaded={loaded} />}
          {tab === 'Analytics'     && <AnalyticsTab monthlyTrend={monthlyTrend} />}
        </>
      )}
    </div>
  );
};

export default ERPDashboard;
