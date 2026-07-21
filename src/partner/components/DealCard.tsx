import type { Deal } from '../api/partnerApi';
import { DEAL_STATUS_BADGE, FF, OG } from '../constants';

const PACKAGE_LABEL: Record<string, string> = { basic: 'Basic', professional: 'Professional', enterprise: 'Enterprise' };

interface Props {
  deal: Deal;
  onClick?: () => void;
}

const DealCard = ({ deal, onClick }: Props) => {
  const s = DEAL_STATUS_BADGE[deal.status] ?? { label: deal.status, bg: '#f1f5f9', color: '#64748b' };
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12,
        padding: '13px 16px', cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: OG }}>{deal.deal_number}</span>
          <span style={{ fontFamily: FF, fontSize: 11, color: '#9b9690' }}>{PACKAGE_LABEL[deal.package] || deal.package}</span>
        </div>
        <div style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: '#141413', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {deal.client_company}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: deal.deal_value ? '#141413' : '#c7c2ba' }}>
          {deal.deal_value ? `AED ${Number(deal.deal_value).toLocaleString()}` : '—'}
        </span>
        <span style={{
          display: 'inline-block', padding: '3px 11px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: s.bg, color: s.color, fontFamily: FF, whiteSpace: 'nowrap',
        }}>
          {s.label}
        </span>
      </div>
    </div>
  );
};

export default DealCard;
