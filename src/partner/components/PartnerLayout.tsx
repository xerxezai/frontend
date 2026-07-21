import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PartnerSidebar from './PartnerSidebar';
import CurrencySwitcher from './CurrencySwitcher';
import { PartnerProvider, usePartner } from '../context/PartnerContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { partnerLogout } from '../api/partnerApi';
import { CREAM, FF } from '../constants';

const TIER_LABEL: Record<string, string> = { basic: 'Basic', professional: 'Professional', enterprise: 'Enterprise' };

function LayoutInner({ children }: { children: ReactNode }) {
  const { partner } = usePartner();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const doLogout = () => {
    partnerLogout();
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
            XERXEZ Partner
          </span>
          <CurrencySwitcher dark />
        </div>

        {/* desktop header */}
        <div className="prtl-header-desktop" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14,
          padding: '16px 32px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fff',
        }}>
          <CurrencySwitcher />
          {partner && (
            <>
              <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#141413' }}>{partner.full_name}</span>
              <span style={{ fontFamily: FF, fontSize: 12, color: '#9b9690' }}>{partner.partner_code}</span>
              <span style={{
                fontFamily: FF, fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20,
                background: 'rgba(201,136,58,0.10)', color: '#C9883A', textTransform: 'capitalize',
                border: '1px solid rgba(201,136,58,0.25)',
              }}>
                {TIER_LABEL[partner.commission_tier] || partner.commission_tier} Tier
              </span>
            </>
          )}
        </div>

        <div style={{ flex: 1, padding: '24px 20px 60px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

const PartnerLayout = ({ children }: { children: ReactNode }) => (
  <PartnerProvider>
    <CurrencyProvider>
      <LayoutInner>{children}</LayoutInner>
    </CurrencyProvider>
  </PartnerProvider>
);

export default PartnerLayout;
