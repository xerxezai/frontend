import { useState } from 'react';
import { useMLMJoin } from '../../hooks/useMLM';

interface Props {
  onSuccess: () => void;
}

const MLMJoin = ({ onSuccess }: Props) => {
  const { join, loading, error, success } = useMLMJoin();
  const [referrerCode, setReferrerCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await join(referrerCode.trim() || undefined);
  };

  if (success) {
    onSuccess();
    return null;
  }

  return (
    <div className="mlm-join-wrapper">
      <div className="mlm-card">
        <div className="mlm-card-header">
          <div className="mlm-icon-badge">
            <i className="fas fa-users"></i>
          </div>
          <h3>Join XERXEZ Partner Network</h3>
          <p>
            Earn commissions by referring clients to XERXEZ enterprise solutions.
            Get paid automatically when your referrals make purchases.
          </p>
        </div>

        <div className="mlm-benefits">
          <div className="mlm-benefit-item">
            <i className="fas fa-check-circle"></i>
            <span>Level 1 — 10% commission on direct referrals</span>
          </div>
          <div className="mlm-benefit-item">
            <i className="fas fa-check-circle"></i>
            <span>Level 2 — 5% commission on 2nd level referrals</span>
          </div>
          <div className="mlm-benefit-item">
            <i className="fas fa-check-circle"></i>
            <span>Level 3 — 2% commission on 3rd level referrals</span>
          </div>
          <div className="mlm-benefit-item">
            <i className="fas fa-check-circle"></i>
            <span>Real-time earnings tracking &amp; dashboard</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mlm-form">
          {error && (
            <div className="mlm-alert mlm-alert-error">{error}</div>
          )}
          <div className="mlm-form-group">
            <label>Referral Code (optional)</label>
            <input
              type="text"
              value={referrerCode}
              onChange={e => setReferrerCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code if you were invited"
              maxLength={20}
            />
            <small>Leave empty if joining without a referral</small>
          </div>
          <button type="submit" className="theme-btn w-100" disabled={loading}>
            {loading ? 'Joining...' : 'Join Partner Network'}
            {!loading && <i className="far fa-arrow-right"></i>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MLMJoin;

