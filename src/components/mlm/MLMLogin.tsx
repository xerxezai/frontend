import { useState } from 'react';
import { useMLMAuth } from '../../hooks/useMLM';

interface Props {
  onSuccess: () => void;
}

const MLMLogin = ({ onSuccess }: Props) => {
  const { login, loading, error } = useMLMAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) onSuccess();
  };

  return (
    <div className="mlm-login-wrapper">
      <div className="mlm-card">
        <div className="mlm-card-header">
          <h3>MLM Partner Login</h3>
          <p>Sign in to access your referral dashboard and earnings</p>
        </div>
        <form onSubmit={handleSubmit} className="mlm-form">
          {error && (
            <div className="mlm-alert mlm-alert-error">{error}</div>
          )}
          <div className="mlm-form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mlm-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="theme-btn w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <i className="far fa-arrow-right"></i>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MLMLogin;
