import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useCurrency } from '../../../../context/CurrencyContext';

// ── XERXEZ brand tokens ──────────────────────────────────────────────────────
export const OG    = '#C9883A';
export const OG_G  = 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)';
export const DARK  = '#1a1208';
export const CREAM = '#F8F7F4';
export const WHITE = '#FFFFFF';
export const FF    = "'DM Sans',sans-serif";
export const BCARD = '0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)';
export const BHOV  = '0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)';

// ── Card3D — copied exactly from AIERPPage.tsx ───────────────────────────────
export const Card3D = ({
  children, accent = OG, style = {}, p = '20px 18px',
}: { children: ReactNode; accent?: string; style?: CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        background: WHITE, borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        borderTop: `3px solid ${accent}`,
        boxShadow: h ? BHOV : BCARD,
        transform: h ? 'translateY(-7px)' : 'translateY(0)',
        transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms cubic-bezier(0.22,1,0.36,1)',
        padding: p, cursor: 'default', position: 'relative', ...style,
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </div>
  );
};

// ── shared form field styles ──────────────────────────────────────────────────
export const inp: CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(0,0,0,0.10)',
  background: '#F8F7F4', fontFamily: FF, fontSize: 13, outline: 'none', boxSizing: 'border-box',
};
export const lbl: CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#6B6B6B',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5, fontFamily: FF,
};
export const btnPrimary: CSSProperties = {
  background: OG_G, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px',
  fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer',
};
export const btnGhost: CSSProperties = {
  background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '10px 20px',
  cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13, color: '#6B6B6B',
};

// ── SlidePanel — right slide-in, translateX(100%)→0, 0.35s ───────────────────
export const SlidePanel = ({ title, subtitle, width = 440, onClose, footer, children }: {
  title: string; subtitle?: string; width?: number; onClose: () => void;
  footer?: ReactNode; children: ReactNode;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <style>{`
        @keyframes hrFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes hrSlideInRight { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
        @keyframes hrShimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes hrRowIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(2px)', animation: 'hrFadeIn 0.2s ease both' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: `min(${width}px, 100vw)`,
        background: '#fff', zIndex: 901, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'hrSlideInRight 0.35s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div>
            <h3 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: DARK, margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontFamily: FF, fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>{children}</div>
        {footer && <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', gap: 10 }}>{footer}</div>}
      </div>
    </>
  );
};

// ── Skeleton block ────────────────────────────────────────────────────────────
export const Skeleton = ({ h = 60, r = 12, mb = 12 }: { h?: number; r?: number; mb?: number }) => (
  <div style={{ height: h, borderRadius: r, marginBottom: mb, background: 'linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)', backgroundSize: '800px 100%', animation: 'hrShimmer 1.4s infinite' }} />
);

// ── page header ───────────────────────────────────────────────────────────────
export const PageHead = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: DARK, margin: 0, fontFamily: FF, letterSpacing: '-0.01em' }}>{title}</h2>
      {subtitle && <p style={{ color: '#6B6B6B', fontSize: 13, margin: '4px 0 0', fontFamily: FF }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ── empty state with orange CTA ───────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, message, cta }: { icon: React.ElementType; message: string; cta?: ReactNode }) => (
  <div style={{ textAlign: 'center', padding: '56px 24px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)' }}>
    <Icon size={44} color="#d1d5db" style={{ margin: '0 auto 14px', display: 'block' }} />
    <p style={{ color: '#6B6B6B', fontSize: 14, margin: cta ? '0 0 18px' : 0, fontFamily: FF, fontWeight: 600 }}>{message}</p>
    {cta}
  </div>
);

export const fmtINR = (v: string | number) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

/** Currency-aware formatter — respects the ERP navbar's selected currency (AED/INR/USD). */
export const useFmtCurrency = () => useCurrency().formatAmount;

export const timeAgo = (iso: string): string => {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const initials = (name: string) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface Employee { id: number; full_name: string; code: string; department: number | null; department_name?: string; designation?: string; status?: string; joined_on?: string | null; salary?: string; email?: string; }
