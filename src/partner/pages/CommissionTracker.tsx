import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { partnerApi, type Deal, type DashboardStats } from '../api/partnerApi';
import { useCurrency } from '../context/CurrencyContext';
import { COMMISSION_STATUS_BADGE, OG, FF } from '../constants';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '20px 24px',
};

const SummaryCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div style={{ ...cardStyle, padding: '18px 22px', borderTopColor: color, flex: '1 1 220px' }}>
    <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: FF }}>{value}</div>
  </div>
);

const CommissionTracker = () => {
  const { formatAmount } = useCurrency();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([partnerApi.dashboard(), partnerApi.listDeals()])
      .then(([s, d]) => { setStats(s); setDeals(d.filter(x => x.commission_amount)); })
      .catch((e: any) => toast.error(e.message || 'Could not load commission data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: '#141413', marginBottom: 20 }}>
        Commission Tracker
      </h1>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
        <SummaryCard label="Total Earned" value={formatAmount(stats?.total_commission_earned)} color="#16a34a" />
        <SummaryCard label="Pending Payment" value={formatAmount(stats?.total_commission_pending)} color="#e65100" />
        <SummaryCard label="Total Paid" value={formatAmount(stats?.total_commission_paid)} color="#1d4ed8" />
      </div>

      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: FF, color: '#9b9690' }}>Loading…</div>
        ) : deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: FF, color: '#9b9690' }}>
            No commission to show yet — commission appears once a deal's value is confirmed.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf8' }}>
                  {['Deal #', 'Client Company', 'Package', 'Deal Value', 'Rate', 'Commission', 'Status', 'Paid Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F0EBE4', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map(d => {
                  const cs = COMMISSION_STATUS_BADGE[d.commission_status] ?? { label: d.commission_status, bg: '#f1f5f9', color: '#64748b' };
                  return (
                    <tr key={d.id}>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', fontWeight: 700, color: OG, whiteSpace: 'nowrap' }}>{d.deal_number}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', fontWeight: 600, color: '#141413' }}>{d.client_company}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', textTransform: 'capitalize' }}>{d.package}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED' }}>{formatAmount(d.deal_value)}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED' }}>{d.commission_rate}%</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', fontWeight: 700, color: '#16a34a' }}>{formatAmount(d.commission_amount)}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED' }}>
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cs.bg, color: cs.color }}>{cs.label}</span>
                      </td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid #F5F2ED', whiteSpace: 'nowrap' }}>
                        {d.commission_paid_at ? new Date(d.commission_paid_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionTracker;
