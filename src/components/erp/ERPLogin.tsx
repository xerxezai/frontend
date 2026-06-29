import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useERPAuth } from '../../hooks/useERPAuth';

const O  = "#C9883A";
const OD = "#a96d24";

interface Props { onSuccess: () => void; }

const ERPLogin = ({ onSuccess }: Props) => {
  const { login, loading, error: authError } = useERPAuth();

  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [shaking, setShaking]         = useState(false);

  const [uFocused, setUFocused] = useState(false);
  const [pFocused, setPFocused] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 520);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!username.trim()) { setUsernameErr('Username is required'); ok = false; }
    else setUsernameErr('');
    if (!password) { setPasswordErr('Password is required'); ok = false; }
    else setPasswordErr('');
    if (!ok) { triggerShake(); return; }
    const success = await login(username, password);
    if (success) onSuccess();
    else triggerShake();
  };

  const iBorder = (err: string, focused: boolean) =>
    err ? '#FECACA' : focused ? O : '#E5E5E5';
  const iBg     = (err: string) => err ? '#FFF8F8' : '#FFFFFF';
  const iShadow = (focused: boolean) =>
    focused ? '0 0 0 3px rgba(201,136,58,0.14)' : 'none';

  return (
    <>
      <style>{`
        @keyframes erp-shake {
          0%,100% { transform: translateX(0); }
          15%,55%  { transform: translateX(-7px); }
          35%,75%  { transform: translateX(7px); }
        }
        @keyframes erp-spin { to { transform: rotate(360deg); } }
        .erp-shake { animation: erp-shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .erp-input { font-family: 'DM Sans', sans-serif !important; }
        .erp-input::placeholder { color: #BBBBBB; }
        .erp-input:focus { outline: none; }
        .erp-spin { animation: erp-spin 0.75s linear infinite; }
      `}</style>

      {/* ── Full viewport wrapper ── */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        /* Warm mahogany-brown — echoes the brand orange without being pure black */
        background: 'linear-gradient(150deg, #2B1708 0%, #160B03 55%, #221205 100%)',
        padding: '20px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Large center-top orange glow — brand warmth */}
        <span style={{
          position: 'absolute', top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,136,58,0.13) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        {/* Bottom-right accent orb */}
        <span style={{
          position: 'absolute', bottom: '-10%', right: '5%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,136,58,0.09) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        {/* Top-left warm corner glow */}
        <span style={{
          position: 'absolute', top: 0, left: 0,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle at 0% 0%, rgba(201,136,58,0.08) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── Login card ── */}
        <div
          className={shaking ? 'erp-shake' : ''}
          style={{
            position: 'relative', zIndex: 1,
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '36px 40px',
            width: '100%',
            maxWidth: 420,
            boxShadow: '0 8px 48px rgba(0,0,0,0.50), 0 2px 8px rgba(0,0,0,0.30)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <img
              src="/assets/img/logo/black-logo.svg"
              alt="XERXEZ"
              height={36}
              style={{ display: 'inline-block', width: 'auto' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/img/logo/xerxez_logo.png';
              }}
            />
          </div>

          {/* Title */}
          <h1 style={{
            color: '#1A1A1A', fontWeight: 800, fontSize: 22,
            textAlign: 'center', marginBottom: 4, marginTop: 0,
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em',
          }}>
            ERP Portal
          </h1>
          <p style={{
            color: '#888888', fontSize: 13.5, textAlign: 'center',
            marginBottom: 0, fontFamily: "'DM Sans', sans-serif",
          }}>
            Sign in to manage your business
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '16px 0 18px' }} />

          {/* Auth error banner */}
          {authError && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '9px 14px', marginBottom: 16,
              fontSize: 13, color: '#DC2626',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="fas fa-exclamation-circle" style={{ flexShrink: 0 }} />
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Username ── */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 12.5, fontWeight: 700,
                color: '#1A1A1A', marginBottom: 6,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)',
                  color: usernameErr ? '#DC2626' : uFocused ? O : '#BBBBBB',
                  fontSize: 13, pointerEvents: 'none', transition: 'color 200ms',
                }}>
                  <i className="fas fa-user" />
                </span>
                <input
                  className="erp-input"
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); if (e.target.value.trim()) setUsernameErr(''); }}
                  onFocus={() => setUFocused(true)}
                  onBlur={() => setUFocused(false)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px 12px 12px 38px',
                    border: `1px solid ${iBorder(usernameErr, uFocused)}`,
                    borderRadius: 10, fontSize: 14.5,
                    color: '#1A1A1A', background: iBg(usernameErr),
                    boxShadow: iShadow(uFocused),
                    transition: 'border-color 200ms, box-shadow 200ms, background 200ms',
                  }}
                />
              </div>
              {usernameErr && (
                <p style={{
                  color: '#DC2626', fontSize: 12, margin: '4px 0 0 2px',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <i className="fas fa-exclamation-circle" style={{ fontSize: 10 }} />
                  {usernameErr}
                </p>
              )}
            </div>

            {/* ── Password ── */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 12.5, fontWeight: 700,
                color: '#1A1A1A', marginBottom: 6,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)',
                  color: passwordErr ? '#DC2626' : pFocused ? O : '#BBBBBB',
                  fontSize: 13, pointerEvents: 'none', transition: 'color 200ms',
                }}>
                  <i className="fas fa-lock" />
                </span>
                <input
                  className="erp-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (e.target.value) setPasswordErr(''); }}
                  onFocus={() => setPFocused(true)}
                  onBlur={() => setPFocused(false)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px 44px 12px 38px',
                    border: `1px solid ${iBorder(passwordErr, pFocused)}`,
                    borderRadius: 10, fontSize: 14.5,
                    color: '#1A1A1A', background: iBg(passwordErr),
                    boxShadow: iShadow(pFocused),
                    transition: 'border-color 200ms, box-shadow 200ms, background 200ms',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#AAAAAA',
                    padding: 0, fontSize: 13, lineHeight: 1,
                  }}
                >
                  <i className={`fas fa-eye${showPw ? '-slash' : ''}`} />
                </button>
              </div>
              {passwordErr && (
                <p style={{
                  color: '#DC2626', fontSize: 12, margin: '4px 0 0 2px',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <i className="fas fa-exclamation-circle" style={{ fontSize: 10 }} />
                  {passwordErr}
                </p>
              )}
            </div>

            {/* ── Remember me + Forgot ── */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 20,
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: O, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 12.5, color: '#555', fontFamily: "'DM Sans', sans-serif" }}>
                  Remember me
                </span>
              </label>
              <a
                href="mailto:info@xerxez.com?subject=ERP Password Reset Request"
                style={{ fontSize: 12.5, color: O, textDecoration: 'none', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = OD)}
                onMouseLeave={e => (e.currentTarget.style.color = O)}
              >
                Forgot Password?
              </a>
            </div>

            {/* ── Sign in button ── */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                width: '100%', height: 48,
                background: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 4px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.28)',
                transform: btnHover && !loading ? 'scale(1.01) translateY(-1px)' : 'scale(1)',
                filter: btnHover && !loading ? 'brightness(0.92)' : 'none',
                transition: 'transform 150ms ease, filter 150ms ease',
                opacity: loading ? 0.88 : 1,
                letterSpacing: '0.01em',
              }}
            >
              {loading ? (
                <>
                  <svg className="erp-spin" width={17} height={17} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.30)" strokeWidth="2.5" />
                    <path d="M9 2a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
                </>
              )}
            </button>
          </form>

          {/* ── Security badges ── */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              color: '#9B9B9B', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif",
            }}>
              <i className="fas fa-lock" style={{ color: '#4ade80', fontSize: 11 }} />
              AES-256 Encrypted
            </span>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#F8F7F4', border: '1px solid rgba(201,136,58,0.20)',
              borderRadius: 20, padding: '3px 12px',
            }}>
              <i className="fas fa-certificate" style={{ color: O, fontSize: 10 }} />
              <span style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                ISO 27001
              </span>
            </div>
          </div>

          {/* ── Divider + Back ── */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '16px 0 14px' }} />
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/"
              style={{
                fontSize: 13, color: '#999', textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A1A1A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#999')}
            >
              <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />
              Back to Website
            </Link>
          </div>
        </div>

        {/* ── Page footer ── */}
        <p style={{
          marginTop: 20, position: 'relative', zIndex: 1,
          color: 'rgba(255,255,255,0.22)', fontSize: 11.5,
          fontFamily: "'DM Sans', sans-serif", textAlign: 'center',
        }}>
          © {new Date().getFullYear()} XERXEZ. All Rights Reserved.
        </p>
      </div>
    </>
  );
};

export default ERPLogin;
