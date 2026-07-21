import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { partnerApi, type DashboardStats, type Deal } from '../api/partnerApi';
import DealCard from '../components/DealCard';
import { OG, FF } from '../constants';

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '24px 26px',
};

const StatCard = ({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) => (
  <div style={{ ...cardStyle, padding: '18px 22px', borderTopColor: color, flex: '1 1 190px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: '#9b9690', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <i className={icon} style={{ color, fontSize: 15, opacity: 0.7 }} />
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', fontFamily: FF }}>{value}</div>
  </div>
);

const PartnerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([partnerApi.dashboard(), partnerApi.listDeals()])
      .then(([s, d]) => { setStats(s); setDeals(d.slice(0, 5)); })
      .catch((e: any) => toast.error(e.message || 'Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: FF, color: '#9b9690' }}>Loading dashboard…</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: '#141413', margin: 0 }}>
          Dashboard
        </h1>
        <Link to="/partner/submit-deal" style={{
          display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          background: `linear-gradient(145deg,#e8a84e,${OG})`, color: '#fff', fontFamily: FF, fontWeight: 700, fontSize: 13.5,
          padding: '11px 20px', borderRadius: 10, boxShadow: '0 4px 0 rgba(120,70,15,0.50), 0 8px 24px rgba(201,136,58,0.25)',
        }}>
          <i className="fas fa-plus" style={{ fontSize: 12 }} /> Submit New Deal
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
        <StatCard label="Total Deals Submitted" value={stats?.total_deals ?? 0} color={OG} icon="fas fa-file-signature" />
        <StatCard label="Deals Won" value={stats?.won_deals ?? 0} color="#16a34a" icon="fas fa-trophy" />
        <StatCard label="Deals Pending" value={stats?.pending_deals ?? 0} color="#e65100" icon="fas fa-hourglass-half" />
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard label="Commission Earned" value={`AED ${Number(stats?.total_commission_earned ?? 0).toLocaleString()}`} color="#16a34a" icon="fas fa-coins" />
        <StatCard label="Commission Pending" value={`AED ${Number(stats?.total_commission_pending ?? 0).toLocaleString()}`} color="#e65100" icon="fas fa-hourglass-half" />
        <StatCard label="Commission Paid" value={`AED ${Number(stats?.total_commission_paid ?? 0).toLocaleString()}`} color="#1d4ed8" icon="fas fa-check-circle" />
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: '#141413', margin: 0 }}>
            Recent Deals
          </h3>
          <Link to="/partner/deals" style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: OG, textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        {deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ fontFamily: FF, fontSize: 13.5, color: '#9b9690', marginBottom: 14 }}>
              No deals submitted yet — your first submission starts here.
            </p>
            <Link to="/partner/submit-deal" style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: OG, textDecoration: 'none' }}>
              Submit your first deal →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deals.map(d => <DealCard key={d.id} deal={d} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;
