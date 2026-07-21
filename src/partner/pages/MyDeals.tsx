import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { partnerApi, type Deal } from '../api/partnerApi';
import { DEAL_STATUS_BADGE, OG, FF } from '../constants';

const PACKAGE_LABEL: Record<string, string> = { basic: 'Basic', professional: 'Professional', enterprise: 'Enterprise' };
const SYSTEM_LABEL: Record<string, string> = {
  excel: 'Currently using Excel', other_erp: 'Currently using another ERP',
  nothing: 'No system (manual process)', other: 'Other',
};

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '20px 24px',
};

function DealModal({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const s = DEAL_STATUS_BADGE[deal.status] ?? { label: deal.status, bg: '#f1f5f9', color: '#64748b' };
  const row = (label: string, value: React.ReactNode) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontFamily: FF }}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#1A1A1A', fontFamily: FF }}>{value || '—'}</div>
    </div>
  );
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflow: 'auto', padding: 20 }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: FF }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#141413' }}>{deal.deal_number}</h3>
            <span style={{ display: 'inline-block', marginTop: 6, padding: '3px 11px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
              {s.label}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#666', width: 32, height: 32 }}>&times;</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {row('Client Company', deal.client_company)}
          {row('Contact Person', deal.client_contact_person)}
          {row('Phone', deal.client_phone)}
          {row('Email', deal.client_email)}
          {row('Country', deal.client_country)}
          {row('Package', PACKAGE_LABEL[deal.package] || deal.package)}
          {row('Employees', deal.num_employees)}
          {row('Current System', SYSTEM_LABEL[deal.current_system] || deal.current_system)}
          {row('Deal Value', deal.deal_value ? `AED ${Number(deal.deal_value).toLocaleString()}` : 'Not set yet')}
          {row('Commission', deal.commission_amount ? `AED ${Number(deal.commission_amount).toLocaleString()} (${deal.commission_rate}%)` : 'Not confirmed yet')}
          {row('Submitted', new Date(deal.submitted_at).toLocaleString())}
          {row('Last Updated', new Date(deal.updated_at).toLocaleString())}
        </div>
        {deal.notes && (
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Notes</div>
            <div style={{ fontSize: 13, color: '#5a5650', background: '#fafaf8', border: '1px solid #F0EBE4', borderRadius: 8, padding: '10px 14px', lineHeight: 1.6 }}>{deal.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const MyDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Deal | null>(null);

  useEffect(() => {
    partnerApi.listDeals()
      .then(setDeals)
      .catch((e: any) => toast.error(e.message || 'Could not load deals'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: '#141413', marginBottom: 20 }}>
        My Deals
      </h1>

      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: FF, color: '#9b9690' }}>Loading…</div>
        ) : deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: FF, color: '#9b9690' }}>No deals submitted yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf8' }}>
                  {['Deal #', 'Client Company', 'Package', 'Status', 'Deal Value', 'Commission', 'Date Submitted', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F0EBE4', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map(d => {
                  const s = DEAL_STATUS_BADGE[d.status] ?? { label: d.status, bg: '#f1f5f9', color: '#64748b' };
                  return (
                    <tr key={d.id} onClick={() => setSelected(d)} style={{ cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', fontWeight: 700, color: OG, whiteSpace: 'nowrap' }}>{d.deal_number}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', color: '#141413', fontWeight: 600 }}>{d.client_company}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', textTransform: 'capitalize' }}>{d.package}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED' }}>
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>{s.label}</span>
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED' }}>{d.deal_value ? `AED ${Number(d.deal_value).toLocaleString()}` : '—'}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED' }}>{d.commission_amount ? `AED ${Number(d.commission_amount).toLocaleString()}` : '—'}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', whiteSpace: 'nowrap' }}>{new Date(d.submitted_at).toLocaleDateString()}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED' }}>
                        <button type="button" onClick={e => { e.stopPropagation(); setSelected(d); }} style={{
                          background: 'none', border: '1.5px solid #E4DFD8', borderRadius: 8, padding: '5px 12px',
                          fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: '#5a5650', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <DealModal deal={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default MyDeals;
