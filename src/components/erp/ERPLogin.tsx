import { useState } from 'react';
import { useERPAuth } from '../../hooks/useERPAuth';

interface Props { onSuccess: () => void; }

const ERPLogin = ({ onSuccess }: Props) => {
  const { login, loading, error } = useERPAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) onSuccess();
  };

  return (
    <div className="erp-login-page">
      <div className="erp-login-card">
        <div className="erp-login-logo">
          <img src="/assets/img/logo/black-logo.svg" alt="Xerxez" height={40} />
        </div>
        <h2>ERP Portal</h2>
        <p>Sign in to manage your business</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="erp-alert erp-alert-error">{error}</div>}
          <div className="erp-field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
          </div>
          <div className="erp-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>
          <button type="submit" className="erp-btn erp-btn-primary w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ERPLogin;
