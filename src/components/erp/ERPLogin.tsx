import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useERPAuth } from '../../hooks/useERPAuth';

// ── colour tokens (XERXEZ brand, mirrors AIERPPage) ───────────────────────────
const C = {
  orange:      "#C9883A",
  orangeGrad:  "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
  orangeDeep:  "rgba(150,95,30,0.50)",
  orangeLight: "rgba(201,136,58,0.09)",
  warmDark:    "#1a1208",
  warmDarker:  "#0f0a05",
  cream:       "#F8F7F4",
  white:       "#FFFFFF",
  dark:        "#1A1A1A",
  muted:       "#6B6B6B",
  border:      "rgba(0,0,0,0.07)",
};

const shadow = {
  card:  "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.03)",
  badge: "0 4px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.30)",
};

// ── stat tile (left panel) ────────────────────────────────────────────────────
const StatTile = ({
  val, label, icon, color, delay,
}: { val: string; label: string; icon: string; color: string; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderTop: `2px solid ${color}`,
        borderRadius: 14,
        padding: '16px 14px',
        cursor: 'default',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.35)' : '0 4px 14px rgba(0,0,0,0.20)',
        transition: 'transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms cubic-bezier(0.22,1,0.36,1)',
        animation: `erpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: `${color}20`,
        border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
      }}>
        <i className={icon} style={{ color, fontSize: 12 }}></i>
      </div>
      <div style={{
        color, fontWeight: 800, fontSize: 20, lineHeight: 1, marginBottom: 4,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {val}
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.50)', fontSize: 11,
        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.35,
      }}>
        {label}
      </div>
    </div>
  );
};

// ── feature bullet ────────────────────────────────────────────────────────────
const Bullet = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    animation: `erpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: C.orangeGrad,
      boxShadow: shadow.badge,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <i className={icon} style={{ color: '#fff', fontSize: 11 }}></i>
    </div>
    <span style={{
      color: 'rgba(255,255,255,0.72)', fontSize: 13.5,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {text}
    </span>
  </div>
);

// ── 3D input icon badge ───────────────────────────────────────────────────────
const InputBadge = ({ icon, hasError, focused }: { icon: string; hasError: boolean; focused: boolean }) => (
  <span style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 26, borderRadius: 7,
    background: hasError
      ? 'linear-gradient(145deg, #f87171, #ef4444)'
      : focused
      ? C.orangeGrad
      : 'linear-gradient(145deg, #e2e8f0, #cbd5e1)',
    boxShadow: focused
      ? shadow.badge
      : hasError
      ? '0 2px 0 rgba(185,28,28,0.4)'
      : '0 2px 0 rgba(0,0,0,0.12)',
    transition: 'background 200ms, box-shadow 200ms',
    flexShrink: 0,
  }}>
    <i className={icon} style={{ color: '#fff', fontSize: 10 }}></i>
  </span>
);

// ── ERPLogin ──────────────────────────────────────────────────────────────────
interface Props { onSuccess: () => void; }

const ERPLogin = ({ onSuccess }: Props) => {
  const { login, loading, error: authError } = useERPAuth();

  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [shaking, setShaking]         = useState(false);
  const [uFocused, setUFocused]       = useState(false);
  const [pFocused, setPFocused]       = useState(false);
  const [btnHover, setBtnHover]       = useState(false);

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
    err ? '#FECACA' : focused ? C.orange : 'rgba(0,0,0,0.11)';
  const iBg     = (err: string) => err ? '#FFF8F8' : C.white;
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
        @keyframes erpFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes erpOrbPulse {
          0%,100% { transform: scale(1);    opacity: 1; }
          50%     { transform: scale(1.09); opacity: 0.82; }
        }
        @keyframes erpCardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .erp-shake { animation: erp-shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both !important; }
        .erp-spin  { animation: erp-spin 0.75s linear infinite; }
        .erp-input { font-family: 'DM Sans', sans-serif !important; }
        .erp-input::placeholder { color: #BBBBBB; }
        .erp-input:focus { outline: none; }

        /* login card entrance */
        .erp-login-card {
          animation: erpCardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both;
        }

        /* orb breathe */
        .erp-orb-1 { animation: erpOrbPulse 8s ease-in-out infinite; }
        .erp-orb-2 { animation: erpOrbPulse 10s 2.5s ease-in-out infinite; }
        .erp-orb-3 { animation: erpOrbPulse 12s 5s ease-in-out infinite; }

        /* right panel bg: cream on desktop, dark on mobile */
        .erp-right { background: ${C.cream}; }
        @media (max-width: 991px) {
          .erp-right {
            background: linear-gradient(150deg, #1a1208 0%, #0f0a05 100%) !important;
          }
          .erp-login-card {
            box-shadow: 0 8px 48px rgba(0,0,0,0.52), 0 2px 8px rgba(0,0,0,0.32) !important;
          }
          .erp-footer-note { color: rgba(255,255,255,0.22) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .erp-orb-1, .erp-orb-2, .erp-orb-3 { animation: none !important; }
          .erp-login-card { animation: none !important; }
          * { transition-duration: 0ms !important; animation-duration: 0ms !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex' }}>

        {/* ══════════════════════════════════════════════════
            LEFT  –  Brand panel  (desktop ≥ 992 px only)
        ══════════════════════════════════════════════════ */}
        <div
          className="d-none d-lg-flex"
          style={{
            flex: '0 0 56%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '56px 60px 48px',
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(150deg, ${C.warmDark} 0%, ${C.warmDarker} 100%)`,
          }}
        >
          {/* subtle dot grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          {/* ambient orbs */}
          <span className="erp-orb-1" style={{
            position: 'absolute', top: '-10%', left: '-8%',
            width: 540, height: 540, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,136,58,0.15) 0%, transparent 65%)',
            pointerEvents: 'none', zIndex: 0,
          }} />
          <span className="erp-orb-2" style={{
            position: 'absolute', bottom: '-18%', right: '-4%',
            width: 440, height: 440, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,136,58,0.10) 0%, transparent 65%)',
            pointerEvents: 'none', zIndex: 0,
          }} />
          <span className="erp-orb-3" style={{
            position: 'absolute', top: '38%', right: '10%',
            width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,136,58,0.08) 0%, transparent 65%)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          {/* ── brand content ── */}
          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* badge */}
            <div style={{ marginBottom: 18, animation: 'erpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(201,136,58,0.13)',
                border: '1px solid rgba(201,136,58,0.35)',
                color: '#E5B460', fontSize: 11, fontWeight: 700,
                padding: '6px 16px', borderRadius: 20,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                <i className="fas fa-bolt" style={{ fontSize: 9, color: C.orange }}></i>
                Enterprise Operations Platform
              </span>
            </div>

            {/* headline */}
            <h1 style={{
              color: '#fff', fontWeight: 800,
              fontSize: 'clamp(28px, 2.8vw, 44px)',
              lineHeight: 1.1, marginBottom: 18,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '-0.025em',
              animation: 'erpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both',
            }}>
              AI that runs your
              <br />
              <em style={{ color: C.orange, fontStyle: 'italic' }}>entire business</em>
            </h1>

            {/* sub-copy */}
            <p style={{
              color: 'rgba(255,255,255,0.55)', fontSize: 14.5, lineHeight: 1.72,
              maxWidth: 420, marginBottom: 34,
              fontFamily: "'DM Sans', sans-serif",
              animation: 'erpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.19s both',
            }}>
              AI-powered ERP with real-time analytics, role dashboards, and automated
              workflows — built to enterprise and government standards.
            </p>

            {/* feature bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 38 }}>
              <Bullet icon="fas fa-brain"      text="AI demand forecasting & anomaly detection"   delay={0.25} />
              <Bullet icon="fas fa-shield-alt" text="ISO 27001 & SOC 2 Type II certified"        delay={0.30} />
              <Bullet icon="fas fa-chart-bar"  text="Role-based dashboards for every department" delay={0.35} />
            </div>

            {/* 3D stat tiles */}
            <div style={{ display: 'flex', gap: 12 }}>
              <StatTile val="40%"   label="Cost reduction"     icon="fas fa-chart-line"     color={C.orange} delay={0.41} />
              <StatTile val="60%"   label="Faster decisions"   icon="fas fa-tachometer-alt" color="#10b981"  delay={0.47} />
              <StatTile val="99.9%" label="Uptime SLA"         icon="fas fa-server"         color="#3b82f6"  delay={0.53} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT  –  Login panel
        ══════════════════════════════════════════════════ */}
        <div
          className="erp-right"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 52,
            paddingBottom: 32,
            paddingLeft: 28,
            paddingRight: 28,
            minHeight: '100vh',
          }}
        >
          {/* ── login card ── */}
          <div
            className={`erp-login-card${shaking ? ' erp-shake' : ''}`}
            style={{
              background: C.white,
              borderRadius: 20,
              padding: '24px 28px 20px',
              width: '100%',
              maxWidth: 460,
              boxShadow: shadow.card,
              border: `1px solid rgba(0,0,0,0.06)`,
              borderTop: `3px solid ${C.orange}`,
            }}
          >
            {/* title */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <h2 style={{
                color: C.dark, fontWeight: 800, fontSize: 20,
                margin: '0 0 4px',
                fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em',
              }}>
                ERP Portal
              </h2>
              <p style={{
                color: C.muted, fontSize: 12.5,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Sign in to manage your enterprise
              </p>
            </div>

            <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', marginBottom: 14 }} />

            {/* auth error */}
            {authError && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
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
              <div style={{ marginBottom: 10 }}>
                <label style={{
                  display: 'block', fontSize: 12.5, fontWeight: 700,
                  color: C.dark, marginBottom: 7,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 11, top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                  }}>
                    <InputBadge icon="fas fa-user" hasError={!!usernameErr} focused={uFocused} />
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
                      padding: '12px 12px 12px 46px',
                      border: `1.5px solid ${iBorder(usernameErr, uFocused)}`,
                      borderRadius: 11, fontSize: 14,
                      color: C.dark, background: iBg(usernameErr),
                      boxShadow: iShadow(uFocused),
                      transition: 'border-color 200ms, box-shadow 200ms, background 200ms',
                    }}
                  />
                </div>
                {usernameErr && (
                  <p style={{
                    color: '#DC2626', fontSize: 11.5, margin: '5px 0 0 2px',
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: 10 }} />
                    {usernameErr}
                  </p>
                )}
              </div>

              {/* ── Password ── */}
              <div style={{ marginBottom: 10 }}>
                <label style={{
                  display: 'block', fontSize: 12.5, fontWeight: 700,
                  color: C.dark, marginBottom: 7,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 11, top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                  }}>
                    <InputBadge icon="fas fa-lock" hasError={!!passwordErr} focused={pFocused} />
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
                      padding: '12px 44px 12px 46px',
                      border: `1.5px solid ${iBorder(passwordErr, pFocused)}`,
                      borderRadius: 11, fontSize: 14,
                      color: C.dark, background: iBg(passwordErr),
                      boxShadow: iShadow(pFocused),
                      transition: 'border-color 200ms, box-shadow 200ms, background 200ms',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: 12, top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#AAAAAA',
                      padding: 4, fontSize: 13, lineHeight: 1,
                    }}
                  >
                    <i className={`fas fa-eye${showPw ? '-slash' : ''}`} />
                  </button>
                </div>
                {passwordErr && (
                  <p style={{
                    color: '#DC2626', fontSize: 11.5, margin: '5px 0 0 2px',
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: 10 }} />
                    {passwordErr}
                  </p>
                )}
              </div>

              {/* ── Remember + Forgot ── */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 16,
              }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  cursor: 'pointer', userSelect: 'none',
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ width: 15, height: 15, accentColor: C.orange, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 12.5, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                    Remember me
                  </span>
                </label>
                <a
                  href="mailto:info@xerxez.com?subject=ERP Password Reset Request"
                  style={{
                    fontSize: 12.5, color: C.orange, textDecoration: 'none',
                    fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* ── Sign in ── */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  width: '100%', height: 50,
                  background: C.orangeGrad,
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: btnHover && !loading
                    ? `0 6px 0 ${C.orangeDeep}, 0 10px 28px rgba(201,136,58,0.35)`
                    : `0 4px 0 ${C.orangeDeep}, 0 6px 20px rgba(201,136,58,0.28)`,
                  transform: btnHover && !loading ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 180ms cubic-bezier(0.22,1,0.36,1), box-shadow 180ms cubic-bezier(0.22,1,0.36,1)',
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

            {/* security badges */}
            <div style={{
              marginTop: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                color: '#9B9B9B', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif",
              }}>
                <i className="fas fa-lock" style={{ color: '#4ade80', fontSize: 11 }} />
                AES-256 Encrypted
              </span>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: C.cream, border: '1px solid rgba(201,136,58,0.20)',
                borderRadius: 20, padding: '3px 12px',
              }}>
                <i className="fas fa-certificate" style={{ color: C.orange, fontSize: 10 }} />
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                  ISO 27001
                </span>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '10px 0 8px' }} />
            <div style={{ textAlign: 'center' }}>
              <Link
                to="/"
                style={{
                  fontSize: 13, color: '#999', textDecoration: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'color 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = '#999')}
              >
                <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />
                Back to Website
              </Link>
            </div>
          </div>

          <p
            className="erp-footer-note"
            style={{
              marginTop: 20,
              color: 'rgba(0,0,0,0.28)',
              fontSize: 11.5,
              fontFamily: "'DM Sans', sans-serif",
              textAlign: 'center',
            }}
          >
            © {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
        </div>

      </div>
    </>
  );
};

export default ERPLogin;
