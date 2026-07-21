import { useState } from 'react';
import { Link } from 'react-router-dom';
import { partnerApi } from '../api/partnerApi';
import { OG, DARK, CREAM, FF } from '../constants';

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', height: 46, padding: '0 14px', borderRadius: 10,
  border: '1.5px solid #E4DFD8', fontSize: 13.5, fontFamily: FF, color: '#141413',
  background: '#fafaf8', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#5a5650',
  letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6, fontFamily: FF,
};

interface Props {
  onSuccess: () => void;
}

const PartnerLogin = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      await partnerApi.login(email.trim(), password);
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: `linear-gradient(170deg,${DARK} 0%,#0f0a05 100%)`, padding: '64px 20px 54px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '0.02em', marginBottom: 4 }}>
          XERXEZ
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,136,58,0.12)',
          border: '1px solid rgba(201,136,58,0.30)', borderRadius: 100, padding: '6px 18px', margin: '10px 0 18px',
          fontFamily: FF, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: OG,
        }}>
          Partner Portal
        </span>
        <p style={{ fontFamily: FF, fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Log in to submit deals and track your commission.
        </p>
      </div>

      <div style={{ flex: 1, background: CREAM, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)', padding: '28px 28px 24px',
          maxWidth: 420, width: '100%',
        }}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle} htmlFor="partner-email">Email</label>
            <input
              id="partner-email" type="email" placeholder="you@example.com" value={email} style={inputStyle} disabled={loading}
              autoComplete="username"
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
          <div style={{ marginBottom: 6 }}>
            <label style={labelStyle} htmlFor="partner-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="partner-password" type={showPassword ? 'text' : 'password'} placeholder="Your password" value={password}
                style={{ ...inputStyle, paddingRight: 44 }} disabled={loading} autoComplete="current-password"
                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
              />
              <button
                type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                  width: 38, height: 38, background: 'none', border: 'none', color: '#9b9690', cursor: 'pointer',
                }}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} style={{ fontSize: 13 }} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <a href="mailto:info@xerxez.com?subject=Partner%20Portal%20Password%20Reset" style={{ fontFamily: FF, fontSize: 12, color: OG, textDecoration: 'none', fontWeight: 600 }}>
              Forgot password?
            </a>
          </div>

          {error && <p role="alert" style={{ color: '#ef4444', fontSize: 13, fontFamily: FF, marginBottom: 14 }}>{error}</p>}

          <button
            onClick={submit} disabled={loading}
            style={{
              width: '100%', height: 48, background: loading ? 'rgba(201,136,58,0.6)' : `linear-gradient(145deg,#e8a84e,${OG})`,
              color: '#fff', border: 'none', borderRadius: 12, fontFamily: FF, fontWeight: 700, fontSize: 14,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', fontFamily: FF, fontSize: 12.5, color: '#9b9690', marginTop: 18, marginBottom: 0 }}>
            Not a partner yet? <Link to="/contact#partner" style={{ color: OG, fontWeight: 700, textDecoration: 'none' }}>Apply here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
