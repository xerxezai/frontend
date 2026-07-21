import { usePartner } from '../context/PartnerContext';
import { OG, FF } from '../constants';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '24px 28px', marginBottom: 20,
};

const TIER_LABEL: Record<string, string> = { basic: 'Basic', professional: 'Professional', enterprise: 'Enterprise' };

const PartnerProfile = () => {
  const { partner, loading } = usePartner();

  if (loading || !partner) {
    return <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: FF, color: '#9b9690' }}>Loading profile…</div>;
  }

  const row = (label: string, value: React.ReactNode) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontFamily: FF }}>{label}</div>
      <div style={{ fontSize: 14, color: '#1A1A1A', fontFamily: FF }}>{value || '—'}</div>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: '#141413', marginBottom: 20 }}>
        My Profile
      </h1>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(145deg,#e8a84e,${OG})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: '#fff',
          }}>
            {partner.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: FF, fontSize: 17, fontWeight: 700, color: '#141413' }}>{partner.full_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ fontFamily: FF, fontSize: 12.5, color: '#9b9690' }}>{partner.partner_code}</span>
              <span style={{
                fontFamily: FF, fontSize: 10.5, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                background: 'rgba(201,136,58,0.10)', color: OG, textTransform: 'capitalize', border: '1px solid rgba(201,136,58,0.25)',
              }}>
                {TIER_LABEL[partner.commission_tier] || partner.commission_tier} Tier
              </span>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">{row('Email', partner.email)}</div>
          <div className="col-md-6">{row('Phone', partner.phone)}</div>
          <div className="col-md-6">{row('Location', `${partner.city}, ${partner.country}`)}</div>
          <div className="col-md-6">{row('Target Market', partner.target_market)}</div>
          <div className="col-md-6">{row('LinkedIn', partner.linkedin_url)}</div>
          <div className="col-md-6">{row('Languages', partner.languages.join(', '))}</div>
          <div className="col-md-6">{row('Profession', partner.current_profession)}</div>
          <div className="col-md-6">{row('Years of Experience', partner.years_experience)}</div>
          <div className="col-md-6">{row('Packages Approved For', partner.modules.join(', '))}</div>
          <div className="col-md-6">{row('Partner Since', new Date(partner.joined_at).toLocaleDateString())}</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: '#141413', marginBottom: 16 }}>
          Lifetime Stats
        </h3>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Deals', value: partner.total_deals, color: OG },
            { label: 'Commission Earned', value: `AED ${Number(partner.total_commission_earned).toLocaleString()}`, color: '#16a34a' },
            { label: 'Commission Paid', value: `AED ${Number(partner.total_commission_paid).toLocaleString()}`, color: '#1d4ed8' },
          ].map(s => (
            <div key={s.label} style={{ flex: '1 1 160px', background: '#fafaf8', border: '1px solid #F0EBE4', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ fontFamily: FF, fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
