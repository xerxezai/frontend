import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// ── XERXEZ brand tokens — matches every other ERP module (see procurementShared.tsx etc.) ──
export const OG      = '#D93522';
export const OG_G    = 'linear-gradient(145deg,#D93522 0%,#D93522 100%)';
export const DARK    = '#071a33';
export const PAGE_BG = '#F4F7FA';
export const WHITE   = '#FFFFFF';
export const FF       = "'DM Sans',sans-serif";
export const FF_TITLE = "'Poppins',sans-serif";
export const BORDER = 'rgba(7,26,51,0.08)';
export const BCARD  = '0 4px 20px rgba(7,26,51,0.08)';
export const BHOV    = '0 10px 32px rgba(7,26,51,0.10),0 2px 8px rgba(217,53,34,0.16)';

export const GREEN = '#10b981';
export const AMBER = '#f59e0b';
export const RED   = '#ef4444';
export const BLUE  = '#3b82f6';
export const PURPLE = '#8b5cf6';

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/** Reads is_staff / is_superuser straight off the JWT — same decode ERPLayout.tsx and
 * ERPPage.tsx already use to gate admin-only nav items and the login redirect. This page
 * aggregates every module's data, so it's gated on staff status rather than one rbacModule. */
export function isExecutiveAdmin(): boolean {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const payload = JSON.parse(atob(JSON.parse(stored).access.split('.')[1]));
      if (payload.is_staff === true || payload.is_superuser === true) return true;
    }
  } catch { /* malformed token — treat as non-admin */ }
  const role = localStorage.getItem('xerxez_role') || '';
  return role === 'admin' || role === 'super_admin' || role === 'superuser';
}

// ── animated count-up — same easing curve as CRMPipeline.tsx's win-rate ring ──────────────
export function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(prefersReducedMotion ? target : 0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (prefersReducedMotion) { setVal(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * target);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

// ── KPI card — 3D lift + red accent border on hover, animated number ──────────────────────
export const KpiCard = ({
  icon, label, value, format = 'number', accent = OG, sub, loading,
}: {
  icon: ReactNode; label: string; value: number; format?: 'number' | 'currency' | 'percent';
  accent?: string; sub?: string; loading?: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const animated = useCountUp(loading ? 0 : value);

  const display = format === 'percent'
    ? `${animated.toFixed(1)}%`
    : format === 'currency'
      ? animated.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : Math.round(animated).toLocaleString('en-US');

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: WHITE, borderRadius: 16, padding: '18px 20px',
        border: `1px solid ${hover ? 'rgba(217,53,34,0.35)' : BORDER}`,
        boxShadow: hover ? BHOV : BCARD,
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 260ms cubic-bezier(0.22,1,0.36,1),box-shadow 260ms cubic-bezier(0.22,1,0.36,1),border-color 260ms',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent, opacity: hover ? 1 : 0.55, transition: 'opacity 260ms' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0 }}>
          {icon}
        </span>
      </div>
      {loading ? (
        <Skeleton h={28} w="70%" mb={6} />
      ) : (
        <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 24, color: DARK, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
          {format === 'currency' ? `${display}` : display}
        </div>
      )}
      <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', fontWeight: 600, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontFamily: FF, fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{sub}</div>}
    </div>
  );
};

// ── skeleton shimmer ─────────────────────────────────────────────────────────────────────
export const Skeleton = ({ h = 60, w = '100%', r = 10, mb = 0 }: { h?: number; w?: string | number; r?: number; mb?: number }) => (
  <div style={{
    height: h, width: w, borderRadius: r, marginBottom: mb,
    background: 'linear-gradient(90deg,#eef1f5 25%,#e2e7ee 50%,#eef1f5 75%)',
    backgroundSize: '800px 100%', animation: 'execShimmer 1.4s infinite',
  }} />
);

export const SkeletonBlock = ({ rows = 4 }: { rows?: number }) => (
  <SectionCard>
    <Skeleton h={16} w="40%" mb={16} />
    {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} h={14} mb={10} />)}
  </SectionCard>
);

// ── section card wrapper — consistent radius/shadow across every tab ──────────────────────
export const SectionCard = ({ children, style = {}, noPad = false }: { children: ReactNode; style?: CSSProperties; noPad?: boolean }) => (
  <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, boxShadow: BCARD, padding: noPad ? 0 : '20px 22px', ...style }}>
    {children}
  </div>
);

export const SectionHead = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
    <div>
      <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14.5, color: DARK }}>{title}</div>
      {subtitle && <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {action}
  </div>
);

// ── alert banner — red/amber, left border, used for "action required" callouts ────────────
export const AlertBanner = ({ tone = 'red', title, children }: { tone?: 'red' | 'amber'; title: string; children?: ReactNode }) => {
  const color = tone === 'red' ? RED : AMBER;
  return (
    <div style={{
      background: tone === 'red' ? 'rgba(217,53,34,0.08)' : 'rgba(245,158,11,0.10)',
      borderLeft: `4px solid ${color}`, borderRadius: 10, padding: '14px 18px',
      display: 'flex', flexDirection: 'column', gap: 4, fontFamily: FF,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 13.5, color: DARK }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        {title}
      </div>
      {children && <div style={{ fontSize: 12.5, color: '#4b4b4b', lineHeight: 1.5, marginLeft: 24 }}>{children}</div>}
    </div>
  );
};

// ── live badge — the page's signature element, recurs on every tab ────────────────────────
export const LiveBadge = ({ updatedAt }: { updatedAt: Date }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', fontWeight: 600 }}>
    <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: GREEN, animation: prefersReducedMotion ? 'none' : 'execPulse 1.8s ease-out infinite' }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: GREEN }} />
    </span>
    Live · Updated {updatedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
  </div>
);

// ── per-section error state with retry — never blank the whole page for one failed fetch ──
export const ErrorRetry = ({ message, onRetry }: { message?: string; onRetry: () => void }) => (
  <div style={{ textAlign: 'center', padding: '32px 16px', fontFamily: FF }}>
    <div style={{ fontSize: 13, color: '#991b1b', fontWeight: 700, marginBottom: 10 }}>
      {message || "Couldn't load this data."}
    </div>
    <button onClick={onRetry} style={{
      background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '7px 16px',
      fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: OG, cursor: 'pointer',
    }}>
      Retry
    </button>
  </div>
);

export const EmptyState = ({ message }: { message: string }) => (
  <div style={{ textAlign: 'center', padding: '32px 16px', fontFamily: FF, fontSize: 12.5, color: '#9CA3AF', fontWeight: 600 }}>
    {message}
  </div>
);

// ── status pill — used across Approvals/Risk tables ────────────────────────────────────────
export const Pill = ({ label, bg, color }: { label: string; bg: string; color: string }) => (
  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color, fontFamily: FF, whiteSpace: 'nowrap' }}>
    {label}
  </span>
);

export const CountBadge = ({ n, tone = 'red' }: { n: number; tone?: 'red' | 'muted' }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20, padding: '0 6px',
    borderRadius: 20, fontSize: 11, fontWeight: 800, fontFamily: FF,
    background: n === 0 ? 'rgba(107,107,107,0.10)' : tone === 'red' ? 'rgba(217,53,34,0.12)' : 'rgba(107,107,107,0.10)',
    color: n === 0 ? '#6B6B6B' : tone === 'red' ? OG : '#6B6B6B',
  }}>
    {n}
  </span>
);

export const ActionBtn = ({ children, onClick, tone = 'default', disabled }: {
  children: ReactNode; onClick: () => void; tone?: 'approve' | 'reject' | 'default'; disabled?: boolean;
}) => {
  const palette = tone === 'approve'
    ? { bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.28)', color: '#059669' }
    : tone === 'reject'
      ? { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.24)', color: '#ef4444' }
      : { bg: '#F4F7FA', border: BORDER, color: DARK };
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 7,
        padding: '6px 12px', fontFamily: FF, fontWeight: 700, fontSize: 11.5, color: palette.color,
        cursor: disabled ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
};

export const inpSelect: CSSProperties = {
  padding: '7px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, background: WHITE,
  fontFamily: FF, fontSize: 12, fontWeight: 600, color: DARK, outline: 'none', cursor: 'pointer',
};

export const TH: CSSProperties = { padding: '10px 14px', textAlign: 'left', color: '#6B6B6B', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' };
export const TD: CSSProperties = { padding: '10px 14px', fontFamily: FF, fontSize: 12.5, color: DARK };

export const injectExecutiveKeyframes = () => (
  <style>{`
    @keyframes execShimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
    @keyframes execPulse { 0%{transform:scale(1);opacity:0.7} 70%{transform:scale(2.6);opacity:0} 100%{opacity:0} }
    @keyframes execFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes execTabIn { from{opacity:0} to{opacity:1} }
  `}</style>
);
