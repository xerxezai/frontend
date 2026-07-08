import { useState, useEffect, useRef } from 'react';
import { useERPDashboard } from '../../hooks/useERPApi';

// ── colour tokens ─────────────────────────────────────────────────────────────
const C = {
  orange:     "#C9883A",
  orangeGrad: "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
  orangeDeep: "rgba(150,95,30,0.50)",
  card:       "#FFFFFF",
  cardHover:  "#FDF9F4",
  text:       "#141413",
  muted:      "rgba(20,20,19,0.50)",
  border:     "rgba(0,0,0,0.08)",
};

const shadow = {
  card: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.07)",
};

// ── category colour palette ───────────────────────────────────────────────────
const CAT = {
  blue:   { grad: "linear-gradient(145deg, #60a5fa, #3b82f6)", deep: "rgba(37,99,235,0.40)",  glow: "rgba(59,130,246,0.18)",  accent: "#3b82f6" },
  green:  { grad: "linear-gradient(145deg, #34d399, #10b981)", deep: "rgba(4,120,87,0.40)",   glow: "rgba(16,185,129,0.18)",  accent: "#10b981" },
  orange: { grad: "linear-gradient(145deg, #e8a84e, #C9883A)", deep: "rgba(150,95,30,0.50)",  glow: "rgba(201,136,58,0.18)",  accent: "#C9883A" },
  purple: { grad: "linear-gradient(145deg, #a78bfa, #8b5cf6)", deep: "rgba(91,33,182,0.40)",  glow: "rgba(139,92,246,0.18)",  accent: "#8b5cf6" },
  red:    { grad: "linear-gradient(145deg, #f87171, #ef4444)", deep: "rgba(185,28,28,0.40)",   glow: "rgba(239,68,68,0.18)",   accent: "#ef4444" },
  teal:   { grad: "linear-gradient(145deg, #2dd4bf, #14b8a6)", deep: "rgba(13,148,136,0.40)", glow: "rgba(20,184,166,0.18)",  accent: "#14b8a6" },
} as const;

type CatKey = keyof typeof CAT;

// ── count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, enabled = true) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || target <= 0) { setCurrent(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3);          // ease-out cubic
      setCurrent(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return current;
}

// ── 3D stat card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label:    string;
  rawValue: number | null;
  prefix?:  string;
  decimals?: number;
  icon:     string;
  colorKey: CatKey;
  index:    number;
  loaded:   boolean;
}

const StatCard = ({
  label, rawValue, prefix = '', decimals = 0,
  icon, colorKey, index, loaded,
}: StatCardProps) => {
  const [hovered, setHovered] = useState(false);
  const cat    = CAT[colorKey];
  const isNull = rawValue === null;

  const target  = isNull ? 0
    : decimals > 0 ? Math.round(rawValue * Math.pow(10, decimals))
    : rawValue;
  const counted = useCountUp(target, 1200, loaded && !isNull);

  const display = isNull ? '—'
    : decimals > 0 ? `${prefix}${(counted / Math.pow(10, decimals)).toFixed(decimals)}`
    : `${prefix}${counted}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.cardHover : C.card,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${cat.accent}`,
        boxShadow: hovered
          ? `0 6px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(201,136,58,0.18)`
          : shadow.card,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms cubic-bezier(0.22,1,0.36,1)',
        padding: '18px 16px',
        cursor: 'default',
        animation: `erpFadeUp 0.48s cubic-bezier(0.22,1,0.36,1) ${index * 0.055}s both`,
      }}
    >
      {/* icon badge */}
      <div style={{
        width: 36, height: 36,
        borderRadius: 9,
        background: cat.grad,
        boxShadow: `0 2px 6px ${cat.glow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12, flexShrink: 0,
      }}>
        <i className={icon} style={{ color: '#fff', fontSize: 14 }}></i>
      </div>

      {/* number */}
      <div style={{
        fontSize: 24, fontWeight: 700, color: C.text,
        lineHeight: 1, marginBottom: 4,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '-0.01em', wordBreak: 'break-all',
      }}>
        {display}
      </div>

      {/* label */}
      <div style={{
        fontSize: 12, color: C.muted,
        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4,
      }}>
        {label}
      </div>
    </div>
  );
};

// ── skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = ({ index }: { index: number }) => (
  <div style={{
    background: C.card, borderRadius: 12,
    border: `1px solid ${C.border}`,
    borderTop: '2px solid rgba(0,0,0,0.06)',
    boxShadow: shadow.card,
    padding: '18px 16px',
    animation: `erpFadeUp 0.36s ease ${index * 0.04}s both`,
  }}>
    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(0,0,0,0.06)', animation: 'erpShimmer 1.5s ease-in-out infinite', marginBottom: 12 }} />
    <div style={{ height: 22, borderRadius: 5, background: 'rgba(0,0,0,0.06)', animation: 'erpShimmer 1.5s 0.1s ease-in-out infinite', marginBottom: 6, width: '50%' }} />
    <div style={{ height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.06)', animation: 'erpShimmer 1.5s 0.2s ease-in-out infinite', width: '75%' }} />
  </div>
);

// ── section label + coloured divider ─────────────────────────────────────────
const SectionLabel = ({ title, colorKey }: { title: string; colorKey: CatKey }) => {
  const accent = CAT[colorKey].accent;
  return (
    <div style={{
      gridColumn: '1 / -1',
      display: 'flex', alignItems: 'center', gap: 14,
      marginTop: 20, marginBottom: 8,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, color: accent,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
      }}>
        {title}
      </span>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(to right, ${accent}44, transparent)`,
      }} />
    </div>
  );
};

// ── empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '72px 24px' }}>
    <div style={{
      width: 64, height: 64, borderRadius: 18,
      background: C.orangeGrad,
      boxShadow: `0 4px 0 ${C.orangeDeep}, 0 6px 20px rgba(201,136,58,0.28)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 20px',
    }}>
      <i className="fas fa-chart-bar" style={{ color: '#fff', fontSize: 26 }}></i>
    </div>
    <p style={{ color: C.muted, fontSize: 15, fontFamily: "'DM Sans', sans-serif", margin: 0, fontWeight: 600 }}>
      No data yet — start adding records
    </p>
  </div>
);

// ── dashboard ─────────────────────────────────────────────────────────────────
const ERPDashboard = () => {
  const { data, loading, error } = useERPDashboard();
  const loaded = !loading && !error && !!data;

  const [updatedAt] = useState(() =>
    new Date().toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  );

  return (
    <div>
      <style>{`
        @keyframes erpFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes erpShimmer {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.50; }
        }
        .erp-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 1199px) {
          .erp-cards-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .erp-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 479px) {
          .erp-cards-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .erp-cards-grid * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 28, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h4 style={{
            fontWeight: 800, fontSize: 26, color: C.text,
            marginBottom: 4, fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '-0.02em', margin: 0,
          }}>
            Dashboard
          </h4>
          <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
            Live overview of your enterprise
          </p>
        </div>

        {/* last updated */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: C.card, padding: '8px 14px',
          borderRadius: 10, border: `1px solid ${C.border}`,
          boxShadow: shadow.card, flexShrink: 0,
        }}>
          <i className="fas fa-clock" style={{ color: C.orange, fontSize: 11 }}></i>
          <span style={{ color: C.muted, fontSize: 12, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
            Updated {updatedAt}
          </span>
        </div>
      </div>

      {/* error banner */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.22)',
          borderRadius: 12, padding: '14px 20px', marginBottom: 20,
          color: '#ef4444', fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        }}>
          <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
          {error}
        </div>
      )}

      {/* cards */}
      <div className="erp-cards-grid">
        {loading ? (
          Array.from({ length: 14 }).map((_, i) => <SkeletonCard key={i} index={i} />)
        ) : !data ? (
          <EmptyState />
        ) : (
          <>
            {/* ── CRM ── */}
            <SectionLabel title="CRM" colorKey="blue" />
            <StatCard label="Active Customers"   rawValue={data.crm?.total_customers        ?? null} icon="fas fa-building"          colorKey="blue"   index={0}  loaded={loaded} />
            <StatCard label="Total Leads"         rawValue={data.crm?.total_leads            ?? null} icon="fas fa-funnel-dollar"     colorKey="teal"   index={1}  loaded={loaded} />
            <StatCard label="New Leads (Month)"   rawValue={data.crm?.new_leads_this_month   ?? null} icon="fas fa-star"              colorKey="blue"   index={2}  loaded={loaded} />

            {/* ── Finance ── */}
            <SectionLabel title="Finance" colorKey="green" />
            <StatCard label="Total Revenue"       rawValue={parseFloat(data.finance?.total_revenue        || '0') || 0} prefix="$" decimals={2} icon="fas fa-dollar-sign"        colorKey="green"  index={3}  loaded={loaded} />
            <StatCard label="This Month"           rawValue={parseFloat(data.finance?.month_revenue        || '0') || 0} prefix="$" decimals={2} icon="fas fa-chart-line"          colorKey="blue"   index={4}  loaded={loaded} />
            <StatCard label="Outstanding"          rawValue={parseFloat(data.finance?.outstanding_invoices || '0') || 0} prefix="$" decimals={2} icon="fas fa-exclamation-circle"  colorKey="orange" index={5}  loaded={loaded} />
            <StatCard label="Overdue Invoices"     rawValue={data.finance?.overdue_invoices   ?? null}                                            icon="fas fa-clock"              colorKey="red"    index={6}  loaded={loaded} />

            {/* ── HR & Payroll ── */}
            <SectionLabel title="HR & Payroll" colorKey="teal" />
            <StatCard label="Active Employees"     rawValue={data.hr?.total_employees          ?? null} icon="fas fa-users"            colorKey="teal"   index={7}  loaded={loaded} />
            <StatCard label="Pending Leave"        rawValue={data.hr?.pending_leave_requests   ?? null} icon="fas fa-calendar-times"   colorKey="orange" index={8}  loaded={loaded} />

            {/* ── Operations ── */}
            <SectionLabel title="Operations" colorKey="orange" />
            <StatCard label="Open Orders"          rawValue={data.sales?.open_orders           ?? null} icon="fas fa-shopping-cart"    colorKey="orange" index={9}  loaded={loaded} />
            <StatCard label="Active Products"      rawValue={data.inventory?.total_products    ?? null} icon="fas fa-boxes"            colorKey="blue"   index={10} loaded={loaded} />
            <StatCard label="Pending POs"          rawValue={data.purchases?.pending_orders    ?? null} icon="fas fa-truck-loading"    colorKey="orange" index={11} loaded={loaded} />

            {/* ── MLM ── */}
            <SectionLabel title="MLM" colorKey="purple" />
            <StatCard label="Total Commissions"    rawValue={parseFloat(data.mlm?.total_commissions   || '0') || 0} prefix="$" decimals={2} icon="fas fa-sitemap"        colorKey="purple" index={12} loaded={loaded} />
            <StatCard label="Pending Commissions"  rawValue={parseFloat(data.mlm?.pending_commissions || '0') || 0} prefix="$" decimals={2} icon="fas fa-hourglass-half"  colorKey="purple" index={13} loaded={loaded} />
          </>
        )}
      </div>
    </div>
  );
};

export default ERPDashboard;
