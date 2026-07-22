import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PartnerSidebar from './PartnerSidebar';
import CurrencySwitcher from './CurrencySwitcher';
import { PartnerProvider, usePartner } from '../context/PartnerContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { partnerLogout } from '../api/partnerApi';
import { OG, CREAM, FF } from '../constants';

const PAGE_TITLE: Record<string, string> = {
  dashboard: 'Dashboard', 'submit-deal': 'Submit a Deal', deals: 'My Deals',
  commission: 'Commission Tracker', training: 'Training Materials', marketing: 'Marketing Materials', profile: 'My Profile',
};

function LayoutInner({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const { partner } = usePartner();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const segment = location.pathname.split('/')[2] || 'dashboard';
  const pageTitle = PAGE_TITLE[segment] || 'Dashboard';
  const initial = (partner?.full_name || 'P').charAt(0).toUpperCase();

  const doLogout = () => {
    partnerLogout();
    onLogout();
    navigate('/partner', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex' }}>
      <style>{`
        @media (max-width: 900px) {
          .prtl-sidebar-desktop { display: none !important; }
          .prtl-topbar { display: flex !important; }
          .prtl-content { margin-left: 0 !important; }
          .prtl-header-desktop { display: none !important; }
        }
        .prtl-topbar { display: none; }
        .prtl-avatar-chip:hover { background: rgba(201,136,58,0.10) !important; border-color: rgba(201,136,58,0.30) !important; }
      `}</style>

      {/* desktop fixed sidebar */}
      <div className="prtl-sidebar-desktop" style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20 }}>
        <PartnerSidebar partner={partner} onLogout={doLogout} />
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex' }}>
          <div style={{ width: 240, height: '100%' }}>
            <PartnerSidebar partner={partner} onLogout={doLogout} onNavigate={() => setMobileOpen(false)} />
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.45)' }} onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="prtl-content" style={{ flex: 1, marginLeft: 240, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* mobile top bar */}
        <div className="prtl-topbar" style={{
          alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px',
          background: '#1a1208', position: 'sticky', top: 0, zIndex: 15,
        }}>
          <button
            type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu"
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', width: 44, height: 44 }}
          >
            <i className="fas fa-bars" />
          </button>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: '#fff' }}>
            {pageTitle}
          </span>
          <CurrencySwitcher dark />
        </div>

        {/* desktop header — matches ERPLayout's sticky header height/shadow exactly */}
        <div className="prtl-header-desktop" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: '0 32px', height: 64, background: '#fff',
          boxShadow: '0 1px 0 rgba(0,0,0,0.06), 0 2px 16px rgba(0,0,0,0.05)',
          position: 'sticky', top: 0, zIndex: 15,
        }}>
          <h1 style={{ fontFamily: FF, fontWeight: 800, fontSize: 20, color: '#141413', margin: 0, letterSpacing: '-0.01em' }}>
            {pageTitle}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <CurrencySwitcher />
            {partner && (
              <div className="prtl-avatar-chip" style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 12, padding: '5px 12px 5px 5px', transition: 'background 0.2s, border-color 0.2s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `linear-gradient(145deg,#e8a84e,${OG})`,
                  boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${OG}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, fontFamily: FF }}>{initial}</span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#141413', fontWeight: 700, fontSize: 12.5, fontFamily: FF, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{partner.full_name}</div>
                  <div style={{ color: '#9b9690', fontSize: 10.5, fontFamily: FF, whiteSpace: 'nowrap' }}>{partner.partner_code}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px 20px 60px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

const PartnerLayout = ({ children, onLogout }: { children: ReactNode; onLogout: () => void }) => (
  <PartnerProvider>
    <CurrencyProvider>
      <LayoutInner onLogout={onLogout}>{children}</LayoutInner>
    </CurrencyProvider>
  </PartnerProvider>
);

export default PartnerLayout;
