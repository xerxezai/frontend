import { NavLink } from 'react-router-dom';
import { OG, FF } from '../constants';
import type { PartnerProfile } from '../api/partnerApi';

const NAV_ITEMS = [
  { to: '/partner/dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
  { to: '/partner/submit-deal', label: 'Submit Deal', icon: 'fas fa-file-signature' },
  { to: '/partner/deals', label: 'My Deals', icon: 'fas fa-list-ul' },
  { to: '/partner/commission', label: 'Commission', icon: 'fas fa-hand-holding-usd' },
  { to: '/partner/training', label: 'Training Materials', icon: 'fas fa-graduation-cap' },
  { to: '/partner/marketing', label: 'Marketing Materials', icon: 'fas fa-bullhorn' },
  { to: '/partner/profile', label: 'My Profile', icon: 'fas fa-user' },
];

const TIER_LABEL: Record<string, string> = { basic: 'Basic', professional: 'Professional', enterprise: 'Enterprise' };

interface Props {
  partner: PartnerProfile | null;
  onNavigate?: () => void;
  onLogout: () => void;
}

const PartnerSidebar = ({ partner, onNavigate, onLogout }: Props) => (
  <div style={{
    width: 240, height: '100%', background: '#1a1208', display: 'flex', flexDirection: 'column',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  }}>
    <style>{`
      @keyframes prtlNavIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }
      .prtl-nav-item { animation: prtlNavIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
      .prtl-nav-item:not(.prtl-nav-active):hover { background: rgba(255,255,255,0.06) !important; color: #fff !important; }
      @media (prefers-reduced-motion: reduce) { .prtl-nav-item { animation: none !important; } }
    `}</style>

    <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
        XERXEZ
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
        <span style={{ fontFamily: FF, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: OG, whiteSpace: 'nowrap' }}>
          Partner Portal
        </span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(201,136,58,0.35), transparent)' }} />
      </div>
    </div>

    {partner && (
      <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {partner.full_name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{partner.partner_code || '—'}</span>
          <span style={{
            fontFamily: FF, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
            background: 'rgba(201,136,58,0.18)', color: OG, textTransform: 'capitalize',
          }}>
            {TIER_LABEL[partner.commission_tier] || partner.commission_tier}
          </span>
        </div>
      </div>
    )}

    <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
      {NAV_ITEMS.map((item, i) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) => `prtl-nav-item${isActive ? ' prtl-nav-active' : ''}`}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
            fontFamily: FF, fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
            background: isActive ? 'linear-gradient(145deg,#e8a84e,#C9883A)' : 'transparent',
            boxShadow: isActive ? '0 3px 10px rgba(201,136,58,0.35)' : 'none',
            transition: 'background 0.15s, color 0.15s',
            minHeight: 44,
            animationDelay: `${i * 0.05}s`,
          })}
        >
          <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={item.icon} style={{ fontSize: 14 }} />
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        type="button"
        onClick={onLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', borderRadius: 10,
          fontFamily: FF, fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.62)',
          background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.10)'; e.currentTarget.style.color = 'rgba(248,113,113,0.9)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; }}
      >
        <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className="fas fa-sign-out-alt" style={{ fontSize: 14 }} />
        </span>
        Logout
      </button>
    </div>
  </div>
);

export default PartnerSidebar;
