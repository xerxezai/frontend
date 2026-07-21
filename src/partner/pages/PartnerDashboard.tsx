import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FileSignature, Trophy, Hourglass, Coins, Clock, CheckCircle2,
} from 'lucide-react';
import { partnerApi, type DashboardStats, type Deal } from '../api/partnerApi';
import DealCard from '../components/DealCard';
import { useCurrency } from '../context/CurrencyContext';
import { OG, FF } from '../constants';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.07)', padding: '24px 26px',
};

// ── same 6-color families as the ERP dashboard's section gradients ──────────
const GRAD = {
  gold:   { from: '#e8a84e', to: OG },
  green:  { from: '#22c55e', to: '#15803d' },
  orange: { from: '#f0993e', to: '#c2540a' },
  blue:   { from: '#3b82f6', to: '#1d4ed8' },
} as const;

// ── count-up hook — copied from ERPDashboard.tsx for visual parity ─────────
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

interface GradCardProps {
  label: string; rawValue: number; prefix?: string; decimals?: number;
  icon: React.ElementType; grad: keyof typeof GRAD; index: number; loaded: boolean;
}
const GradCard = ({ label, rawValue, prefix = '', decimals = 0, icon: Icon, grad, index, loaded }: GradCardProps) => {
  const [hovered, setHovered] = useState(false);
  const g = GRAD[grad];
  const target = decimals > 0 ? Math.round(rawValue * Math.pow(10, decimals)) : rawValue;
  const counted = useCountUp(target, 1400, loaded);
  const display = decimals > 0
    ? `${prefix}${(counted / Math.pow(10, decimals)).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
    : `${prefix}${counted.toLocaleString()}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)`,
        borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden',
        boxShadow: hovered ? '0 14px 40px rgba(0,0,0,0.24)' : '0 8px 28px rgba(0,0,0,0.18)',
        transform: hovered ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        flex: '1 1 190px', minWidth: 0,
        animation: `prtlFadeUp 0.48s cubic-bezier(0.22,1,0.36,1) ${index * 0.07}s both`,
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: 'linear-gradient(90deg, rgba(255,255,255,0.40), rgba(255,255,255,0.02))' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', fontFamily: FF, marginBottom: 9, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: FF, lineHeight: 1, letterSpacing: '-0.01em', wordBreak: 'break-word' }}>
            {display}
          </div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color="#fff" />
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = ({ index }: { index: number }) => (
  <div style={{
    background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.07)', padding: 22, height: 106,
    flex: '1 1 190px', minWidth: 0, animation: `prtlFadeUp 0.36s ease ${index * 0.04}s both`,
  }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', float: 'right', animation: 'prtlShimmer 1.5s ease-in-out infinite' }} />
    <div style={{ height: 12, width: '55%', borderRadius: 4, background: 'rgba(0,0,0,0.06)', animation: 'prtlShimmer 1.5s ease-in-out infinite', marginBottom: 12 }} />
    <div style={{ height: 22, width: '40%', borderRadius: 5, background: 'rgba(0,0,0,0.06)', animation: 'prtlShimmer 1.5s 0.1s ease-in-out infinite' }} />
  </div>
);

const PartnerDashboard = () => {
  const { currency } = useCurrency();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([partnerApi.dashboard(), partnerApi.listDeals()])
      .then(([s, d]) => { setStats(s); setDeals(d.slice(0, 5)); })
      .catch((e: any) => toast.error(e.message || 'Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const conv = (amount: string | undefined) => Number(amount || 0) * currency.rate;

  return (
    <div>
      <style>{`
        @keyframes prtlFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes prtlShimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (prefers-reduced-motion: reduce) {
          .prtl-dash * { animation: none !important; }
        }
      `}</style>
      <div className="prtl-dash">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <Link to="/partner/submit-deal" style={{
            display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            background: `linear-gradient(145deg,#e8a84e,${OG})`, color: '#fff', fontFamily: FF, fontWeight: 700, fontSize: 13.5,
            padding: '11px 20px', borderRadius: 10, boxShadow: '0 4px 0 rgba(120,70,15,0.50), 0 8px 24px rgba(201,136,58,0.25)',
          }}>
            <i className="fas fa-plus" style={{ fontSize: 12 }} /> Submit New Deal
          </Link>
        </div>

        {loading ? (
          <>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
              {[0, 1, 2].map(i => <SkeletonCard key={i} index={i} />)}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
              {[3, 4, 5].map(i => <SkeletonCard key={i} index={i} />)}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
              <GradCard label="Total Deals Submitted" rawValue={stats?.total_deals ?? 0} icon={FileSignature} grad="gold" index={0} loaded={!loading} />
              <GradCard label="Deals Won" rawValue={stats?.won_deals ?? 0} icon={Trophy} grad="green" index={1} loaded={!loading} />
              <GradCard label="Deals Pending" rawValue={stats?.pending_deals ?? 0} icon={Hourglass} grad="orange" index={2} loaded={!loading} />
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
              <GradCard label="Commission Earned" rawValue={conv(stats?.total_commission_earned)} prefix={`${currency.symbol} `} decimals={2} icon={Coins} grad="green" index={3} loaded={!loading} />
              <GradCard label="Commission Pending" rawValue={conv(stats?.total_commission_pending)} prefix={`${currency.symbol} `} decimals={2} icon={Clock} grad="orange" index={4} loaded={!loading} />
              <GradCard label="Commission Paid" rawValue={conv(stats?.total_commission_paid)} prefix={`${currency.symbol} `} decimals={2} icon={CheckCircle2} grad="blue" index={5} loaded={!loading} />
            </div>
          </>
        )}

        <div style={{ ...cardStyle, animation: 'prtlFadeUp 0.48s cubic-bezier(0.22,1,0.36,1) 0.4s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: '#141413', margin: 0 }}>
              Recent Deals
            </h3>
            <Link to="/partner/deals" style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: OG, textDecoration: 'none' }}>
              View all →
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[0, 1].map(i => (
                <div key={i} style={{ height: 56, borderRadius: 12, background: 'rgba(0,0,0,0.04)', animation: `prtlShimmer 1.5s ${i * 0.1}s ease-in-out infinite` }} />
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontFamily: FF, fontSize: 13.5, color: '#9b9690', marginBottom: 14 }}>
                No deals submitted yet — your first submission starts here.
              </p>
              <Link to="/partner/submit-deal" style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: OG, textDecoration: 'none' }}>
                Submit your first deal →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {deals.map(d => <DealCard key={d.id} deal={d} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
