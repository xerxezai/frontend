import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { BORDER, Skeleton, useCountUp } from '../modules/executive/executiveShared';

export const NAVY = '#071a33';
export const GOLD = '#D93522';
export const PAGE_BG = '#F4F7FA';
export const FF = "'DM Sans', sans-serif";
export const MUTED = '#6B6B6B';
export const GREEN = '#10b981';
export const AMBER = '#f59e0b';
export const RED = '#D93522';
export const BLUE = '#3b82f6';
export const PURPLE = '#8b5cf6';
export const TEAL = '#0D9488';
export const YELLOW = '#eab308';
export const CARD_SHADOW = '0 4px 20px rgba(7,26,51,0.08)';

/** KPI card with a colored 4px left border, count-up value, and — only when a real prior-
 * period figure exists — a trend arrow + % change. Never fabricates a trend for metrics with
 * no historical baseline (deltaPct undefined = no arrow shown, not a fake "0%"). */
export const TrendKpiCard = ({ icon, label, value, format = 'number', accent, deltaPct, loading, sub }: {
  icon: React.ReactNode; label: string; value: number; format?: 'number' | 'currency' | 'percent';
  accent: string; deltaPct?: number; loading?: boolean; sub?: string;
}) => {
  const [hover, setHover] = useState(false);
  const animated = useCountUp(loading ? 0 : value);
  const display = format === 'percent' ? `${animated.toFixed(1)}%` : Math.round(animated).toLocaleString('en-US');
  const up = (deltaPct ?? 0) >= 0;
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', borderRadius: 16, padding: '16px 18px', boxShadow: CARD_SHADOW,
        borderLeft: `4px solid ${accent}`, transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)', fontFamily: FF,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: MUTED }}>{label}</span>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: `${accent}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0 }}>{icon}</span>
      </div>
      {loading ? <Skeleton h={24} w="65%" /> : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: 21, color: NAVY, fontVariantNumeric: 'tabular-nums' }}>{display}</span>
          {deltaPct !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11.5, fontWeight: 800, color: up ? GREEN : RED }}>
              {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{Math.abs(deltaPct).toFixed(1)}%
            </span>
          )}
        </div>
      )}
      {sub && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{sub}</div>}
    </div>
  );
};

export { BORDER };
export {
  SectionCard, SectionHead, Skeleton as SkeletonBlock2, ErrorRetry, EmptyState, ActionBtn,
  CountBadge, Pill, TH, TD, injectExecutiveKeyframes,
} from '../modules/executive/executiveShared';
export { fmtShortDate, todayISO } from '../modules/executive/executiveData';
