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
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="bg-white rounded-4 p-4 p-md-5 shadow" style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center mb-4">
          <img src="/assets/img/logo/xerxez_logo.png" alt="Xerxez" height={40} style={{ width: 'auto' }} />
        </div>
        <h4 className="fw-bold text-center mb-1" style={{ color: '#1a1a2e' }}>ERP Portal</h4>
        <p className="text-center text-muted mb-4" style={{ fontSize: 14 }}>Sign in to manage your business</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger py-2" style={{ fontSize: 14 }}>{error}</div>}
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: 13, color: '#555' }}>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              style={{ borderColor: '#e2e8f0', color: '#1a1a2e' }}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: 13, color: '#555' }}>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{ borderColor: '#e2e8f0', color: '#1a1a2e' }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 fw-semibold"
            disabled={loading}
            style={{ background: '#6c57d2', color: '#fff', padding: '10px', borderRadius: 8 }}
          >
            {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...</> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ERPLogin;


