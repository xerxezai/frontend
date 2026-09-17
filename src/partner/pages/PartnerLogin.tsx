import { useState } from 'react';
import { Link } from 'react-router-dom';
import { partnerApi } from '../api/partnerApi';

// ── colour tokens — v2 navy/red theme, matching ERPLogin.tsx ────────────────
const C = {
  orange:     "#D93522",
  orangeGrad: "#D93522",
  warmDark:   "#0f2c4d",
  warmDarker: "#071a33",
  white:      "#FFFFFF",
  dark:       "#1A1A1A",
  muted:      "#6B6B6B",
};

const shadow = {
  card:  "0 20px 50px rgba(7,26,51,0.14), 0 2px 8px rgba(7,26,51,0.06)",
  badge: "0 8px 20px rgba(217,53,34,0.40)",
};

const Bullet = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: `erpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s both` }}>
    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: C.orangeGrad, boxShadow: shadow.badge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className={icon} style={{ color: '#fff', fontSize: 11 }}></i>
    </div>
    <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13.5, fontFamily: "'DM Sans', sans-serif" }}>{text}</span>
  </div>
);

const StatTile = ({ val, label, icon, delay }: { val: string; label: string; icon: string; delay: number }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, background: '#0d2a4a',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 14, padding: '16px 14px', cursor: 'default',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hov ? '0 16px 40px rgba(0,0,0,0.35)' : '0 4px 14px rgba(0,0,0,0.20)',
        transition: 'transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms cubic-bezier(0.22,1,0.36,1)',
        animation: `erpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <i className={icon} style={{ color: C.orange, fontSize: 12 }}></i>
      </div>
      <div style={{ color: C.orange, fontWeight: 800, fontSize: val.length > 6 ? 15 : 20, lineHeight: 1.15, marginBottom: 4, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
        {val}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.50)', fontSize: 11, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.35 }}>{label}</div>
    </div>
  );
};

const InputBadge = ({ icon, hasError, focused }: { icon: string; hasError: boolean; focused: boolean }) => (
  <span style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 26, borderRadius: 7,
    background: hasError ? 'linear-gradient(145deg, #f87171, #ef4444)' : focused ? C.orangeGrad : 'linear-gradient(145deg, #e2e8f0, #cbd5e1)',
    boxShadow: focused ? shadow.badge : hasError ? '0 2px 0 rgba(185,28,28,0.4)' : '0 2px 0 rgba(0,0,0,0.12)',
    transition: 'background 200ms, box-shadow 200ms', flexShrink: 0,
  }}>
    <i className={icon} style={{ color: '#fff', fontSize: 10 }}></i>
  </span>
);

const Spinner = () => (
  <svg className="erp-spin" width={17} height={17} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.30)" strokeWidth="2.5" />
    <path d="M9 2a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface Props {
  onSuccess: () => void;
}

const PartnerLogin = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const [shaking, setShaking] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      setShaking(true); setTimeout(() => setShaking(false), 520);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await partnerApi.login(email.trim(), password);
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Login failed.');
      setShaking(true); setTimeout(() => setShaking(false), 520);
    } finally {
      setLoading(false);
    }
  };

  const iStyle = (rp = 0): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box',
    padding: `12px ${12 + rp}px 12px 46px`,
    border: `1.5px solid ${error ? '#FECACA' : 'rgba(0,0,0,0.11)'}`,
    borderRadius: 11, fontSize: 14,
    color: C.dark, background: error ? '#FFF8F8' : C.white,
    transition: 'border-color 200ms, box-shadow 200ms, background 200ms',
    fontFamily: "'DM Sans', sans-serif",
  });

  const labelSt: React.CSSProperties = {
    display: 'block', fontSize: 12.5, fontWeight: 700,
    color: C.dark, marginBottom: 7, fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <>
      <style>{`
        @keyframes erp-shake { 0%,100%{transform:translateX(0)} 15%,55%{transform:translateX(-7px)} 35%,75%{transform:translateX(7px)} }
        @keyframes erp-spin { to{transform:rotate(360deg)} }
        @keyframes erpFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes erpSlideL { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes erpOrbPulse { 0%,100%{transform:scale(1) translate(0,0);opacity:1} 50%{transform:scale(1.09) translate(10px,-8px);opacity:0.82} }
        @keyframes erpGradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes erpCardIn { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .erp-shake{animation:erp-shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both!important}
        .erp-spin{animation:erp-spin 0.75s linear infinite}
        .erp-input{font-family:'DM Sans',sans-serif!important}
        .erp-input::placeholder{color:#BBBBBB}
        .erp-input:focus{outline:none}
        .erp-login-card{animation:erpCardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both}
        .erp-orb-1{animation:erpOrbPulse 8s ease-in-out infinite}
        .erp-orb-2{animation:erpOrbPulse 10s 2.5s ease-in-out infinite}
        .erp-orb-3{animation:erpOrbPulse 12s 5s ease-in-out infinite}
        .erp-left{background-size:200% 200%!important;animation:erpGradientShift 8s ease-in-out infinite}
        .erp-right{background:${C.white}}
        @media(max-width:991px){
          .erp-right{background:linear-gradient(150deg,${C.warmDark} 0%,${C.warmDarker} 100%)!important}
          .erp-login-card{box-shadow:0 8px 48px rgba(0,0,0,0.52),0 2px 8px rgba(0,0,0,0.32)!important}
          .erp-footer-note{color:rgba(255,255,255,0.22)!important}
        }
        @media(prefers-reduced-motion:reduce){
          .erp-orb-1,.erp-orb-2,.erp-orb-3,.erp-left{animation:none!important}
          .erp-login-card{animation:none!important}
          *{transition-duration:0ms!important;animation-duration:0ms!important}
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex' }}>

        {/* ══ LEFT — brand panel ══════════════════════════════════════════ */}
        <div className="d-none d-lg-flex erp-left" style={{ flex: '0 0 55%', flexDirection: 'column', justifyContent: 'center', padding: '24px 56px', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden auto', background: `linear-gradient(150deg, ${C.warmDark} 0%, ${C.warmDarker} 100%)` }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <span className="erp-orb-1" style={{ position: 'absolute', top: '-10%', left: '-8%', width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,53,34,0.15) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
          <span className="erp-orb-2" style={{ position: 'absolute', bottom: '-18%', right: '-4%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,53,34,0.10) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
          <span className="erp-orb-3" style={{ position: 'absolute', top: '38%', right: '10%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,53,34,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: 12, animation: 'erpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D93522', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 20, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <i className="fas fa-handshake" style={{ fontSize: 9, color: '#fff' }}></i>
                Partner Portal
              </span>
            </div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(24px, 2.2vw, 34px)', lineHeight: 1.1, marginBottom: 10, fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.025em', animation: 'erpSlideL 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both' }}>
              The XERXEZ<br />
              <em style={{ color: C.orange, fontStyle: 'italic' }}>Partner Program</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, lineHeight: 1.6, maxWidth: 420, marginBottom: 16, fontFamily: "'DM Sans', sans-serif", animation: 'erpSlideL 0.55s cubic-bezier(0.22,1,0.36,1) 0.19s both' }}>
              Submit deals, track commissions and grow your business with XERXEZ.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22 }}>
              <Bullet icon="fas fa-hand-holding-usd" text="Competitive commission rates on every successful referral" delay={0.25} />
              <Bullet icon="fas fa-chart-line"        text="Real-time commission tracking dashboard"                  delay={0.37} />
              <Bullet icon="fas fa-headset"            text="Dedicated partner support team"                          delay={0.43} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <StatTile val="Tiered" label="Commission Rate"       icon="fas fa-percentage"     delay={0.55} />
              <StatTile val="UAE & India" label="Based & Supported" icon="fas fa-map-marker-alt" delay={0.59} />
            </div>
          </div>
        </div>

        {/* ══ RIGHT — form panel ══════════════════════════════════════════ */}
        <div className="erp-right" style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 24, paddingBottom: 24, paddingLeft: 28, paddingRight: 28, minHeight: '100vh' }}>

          <div className={`erp-login-card${shaking ? ' erp-shake' : ''}`} style={{ background: C.white, borderRadius: 20, padding: '24px 28px 20px', width: '100%', maxWidth: 460, boxShadow: shadow.card, overflow: 'hidden' }}>

            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 20, margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>Partner Portal</h2>
              <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Log in to submit deals and track your commission</p>
            </div>
            <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', marginBottom: 14 }} />

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#DC2626', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-exclamation-circle" style={{ flexShrink: 0 }} />{error}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); submit(); }} noValidate>
              {/* email */}
              <div style={{ marginBottom: 10 }}>
                <label style={labelSt} htmlFor="partner-email">Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <InputBadge icon="fas fa-envelope" hasError={!!error} focused={emailFocused} />
                  </span>
                  <input
                    id="partner-email" className="erp-input" type="email" placeholder="you@example.com" value={email}
                    disabled={loading} autoComplete="username"
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)}
                    style={iStyle()}
                  />
                </div>
              </div>

              {/* password */}
              <div style={{ marginBottom: 10 }}>
                <label style={labelSt} htmlFor="partner-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <InputBadge icon="fas fa-lock" hasError={!!error} focused={passwordFocused} />
                  </span>
                  <input
                    id="partner-password" className="erp-input" type={showPassword ? 'text' : 'password'} placeholder="Your password" value={password}
                    disabled={loading} autoComplete="current-password"
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)}
                    style={iStyle(32)}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4, fontSize: 13, lineHeight: 1 }}
                  >
                    <i className={`fas fa-eye${showPassword ? '-slash' : ''}`} />
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <a href="mailto:info@xerxez.com?subject=Partner%20Portal%20Password%20Reset" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: C.orange, textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit" disabled={loading}
                onMouseEnter={() => setBtnHov(true)} onMouseLeave={() => setBtnHov(false)}
                style={{
                  width: '100%', height: 50, background: C.orangeGrad,
                  color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: btnHov && !loading ? `0 12px 30px rgba(217,53,34,0.45)` : `0 8px 20px rgba(217,53,34,0.35)`,
                  transform: btnHov && !loading ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 180ms cubic-bezier(0.22,1,0.36,1), box-shadow 180ms cubic-bezier(0.22,1,0.36,1)',
                  opacity: loading ? 0.88 : 1,
                }}
              >
                {loading ? <><Spinner />Logging in…</> : <>Login<i className="fas fa-arrow-right" style={{ fontSize: 12 }} /></>}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: C.muted, marginTop: 18, marginBottom: 0 }}>
              Not a partner yet?{' '}
              <Link to="/contact#partner" style={{ color: C.orange, fontWeight: 700, textDecoration: 'none' }}>Apply here</Link>
            </p>

            <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '14px 0 8px' }} />
            <div style={{ textAlign: 'center' }}>
              <Link to="/" style={{ fontSize: 13, color: '#999', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
                <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />Back to Website
              </Link>
            </div>
          </div>

          <p className="erp-footer-note" style={{ marginTop: 20, color: 'rgba(0,0,0,0.28)', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
            © {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default PartnerLogin;
