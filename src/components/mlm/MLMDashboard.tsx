import { useState } from 'react';
import { useMLMDashboard, useMLMCommissions } from '../../hooks/useMLM';
import MLMJoin from './MLMJoin';

interface Props {
  onLogout: () => void;
}

const MLMDashboard = ({ onLogout }: Props) => {
  const { dashboard, loading, error, hasProfile, reload } = useMLMDashboard();
  const { commissions, loading: commLoading } = useMLMCommissions();
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    if (!dashboard?.profile.referral_code) return;
    const link = `${window.location.origin}/mlm?ref=${dashboard.profile.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mlm-loading">
        <div className="mlm-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error === 'not_authenticated') {
    onLogout();
    return null;
  }

  if (error) {
    return (
      <div className="mlm-alert mlm-alert-error">
        {error}
        <button onClick={reload} className="mlm-btn-link">Retry</button>
      </div>
    );
  }

  if (hasProfile === false) {
    return <MLMJoin onSuccess={reload} />;
  }

  if (!dashboard) return null;

  const { profile, earnings, commissions_by_level, direct_referrals, total_downline } = dashboard;

  return (
    <div className="mlm-dashboard">
      {/* Header */}
      <div className="mlm-dashboard-header">
        <div>
          <h2>Partner Dashboard</h2>
          <p>Welcome back, <strong>{profile.full_name}</strong></p>
        </div>
        <button onClick={onLogout} className="mlm-btn-logout">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Referral Code Card */}
      <div className="mlm-referral-card">
        <div className="mlm-referral-info">
          <span className="mlm-label">Your Referral Code</span>
          <span className="mlm-referral-code">{profile.referral_code}</span>
          <span className="mlm-level-badge">Level {profile.level}</span>
        </div>
        <button onClick={copyReferralCode} className="theme-btn">
          {copied ? <><i className="fas fa-check"></i> Copied!</> : <><i className="far fa-copy"></i> Copy Link</>}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="mlm-stats-grid">
        <div className="mlm-stat-card mlm-stat-green">
          <div className="mlm-stat-icon"><i className="fas fa-wallet"></i></div>
          <div className="mlm-stat-info">
            <span className="mlm-stat-value">${parseFloat(earnings.total_earned).toFixed(2)}</span>
            <span className="mlm-stat-label">Total Earned</span>
          </div>
        </div>
        <div className="mlm-stat-card mlm-stat-orange">
          <div className="mlm-stat-icon"><i className="fas fa-clock"></i></div>
          <div className="mlm-stat-info">
            <span className="mlm-stat-value">${parseFloat(earnings.pending_earnings).toFixed(2)}</span>
            <span className="mlm-stat-label">Pending</span>
          </div>
        </div>
        <div className="mlm-stat-card mlm-stat-purple">
          <div className="mlm-stat-icon"><i className="fas fa-check-circle"></i></div>
          <div className="mlm-stat-info">
            <span className="mlm-stat-value">${parseFloat(earnings.paid_earnings).toFixed(2)}</span>
            <span className="mlm-stat-label">Paid Out</span>
          </div>
        </div>
        <div className="mlm-stat-card mlm-stat-blue">
          <div className="mlm-stat-icon"><i className="fas fa-users"></i></div>
          <div className="mlm-stat-info">
            <span className="mlm-stat-value">{direct_referrals}</span>
            <span className="mlm-stat-label">Direct Referrals</span>
          </div>
        </div>
        <div className="mlm-stat-card mlm-stat-teal">
          <div className="mlm-stat-icon"><i className="fas fa-sitemap"></i></div>
          <div className="mlm-stat-info">
            <span className="mlm-stat-value">{total_downline}</span>
            <span className="mlm-stat-label">Total Downline</span>
          </div>
        </div>
      </div>

      {/* Commission by Level */}
      {commissions_by_level.length > 0 && (
        <div className="mlm-section">
          <h4>Earnings by Level</h4>
          <div className="mlm-level-bars">
            {commissions_by_level.map(item => (
              <div key={item.level} className="mlm-level-bar-item">
                <span className="mlm-level-label">Level {item.level}</span>
                <div className="mlm-level-bar">
                  <div
                    className="mlm-level-bar-fill"
                    style={{ width: `${Math.min(100, (parseFloat(item.total) / parseFloat(earnings.total_earned)) * 100)}%` }}
                  ></div>
                </div>
                <span className="mlm-level-amount">${parseFloat(item.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Commissions */}
      <div className="mlm-section">
        <h4>Recent Commissions</h4>
        {commLoading ? (
          <p className="mlm-muted">Loading...</p>
        ) : commissions.length === 0 ? (
          <div className="mlm-empty">
            <i className="fas fa-coins"></i>
            <p>No commissions yet. Share your referral link to start earning!</p>
          </div>
        ) : (
          <div className="mlm-table-wrapper">
            <table className="mlm-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Level</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commissions.slice(0, 10).map(c => (
                  <tr key={c.id}>
                    <td>{c.source_username}</td>
                    <td>Level {c.level}</td>
                    <td>{c.commission_rate}%</td>
                    <td><strong>${parseFloat(c.amount).toFixed(2)}</strong></td>
                    <td>
                      <span className={`mlm-status mlm-status-${c.status}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLMDashboard;
