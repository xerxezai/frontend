import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useERPAuth } from '../../hooks/useERPAuth';
import apiService from '../../services/api';

// ── colour tokens ─────────────────────────────────────────────────────────────
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
};

const shadow = {
  card:  "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.03)",
  badge: "0 4px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.30)",
};

type Mode = 'login' | 'reg' | 'fp1' | 'fp2' | 'fp3' | 'fp4';

// ── count-up value — parses the leading number out of a stat string and
//    animates it from 0 once `trigger` flips true; non-numeric strings
//    (e.g. "<6 Mo") just render as-is ──────────────────────────────────────
const CountValue = ({ raw, trigger, duration = 1200 }: { raw: string; trigger: boolean; duration?: number }) => {
  const parsed = useMemo(() => {
    const m = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    const [, prefix, numStr, suffix] = m;
    return {
      prefix, suffix,
      target: parseFloat(numStr.replace(/,/g, '')),
      decimals: numStr.includes('.') ? numStr.split('.')[1].length : 0,
      hasComma: numStr.includes(','),
    };
  }, [raw]);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : raw);
  useEffect(() => {
    if (!parsed || !trigger) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = parsed.target * eased;
      const num = parsed.decimals > 0
        ? val.toFixed(parsed.decimals)
        : parsed.hasComma ? Math.round(val).toLocaleString('en-IN') : String(Math.round(val));
      setDisplay(`${parsed.prefix}${num}${parsed.suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, parsed, duration]);
  return <>{display}</>;
};

// ── stat tile (left panel) — orange only, with count-up ───────────────────────
const StatTile = ({ val, label, icon, delay, trigger }: {
  val: string; label: string; icon: string; delay: number; trigger: boolean;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)', borderTop: `2px solid ${C.orange}`,
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
      <div style={{ color: C.orange, fontWeight: 800, fontSize: 20, lineHeight: 1, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
        <CountValue raw={val} trigger={trigger} />
      </div>
      <div style={{ color: 'rgba(255,255,255,0.50)', fontSize: 11, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.35 }}>{label}</div>
    </div>
  );
};

// ── trust line (green pulsing dot) ─────────────────────────────────────────────
const TrustLine = ({ text, delay }: { text: string; delay: number }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 9,
    background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.30)',
    borderRadius: 20, padding: '8px 16px',
    animation: `erpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
  }}>
    <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', animation: 'erpUrgentPing 1.6s ease-in-out infinite' }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80' }} />
    </span>
    <span style={{ color: '#6ee7a0', fontSize: 12.5, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{text}</span>
  </div>
);


const Bullet = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: `erpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s both` }}>
    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: C.orangeGrad, boxShadow: shadow.badge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className={icon} style={{ color: '#fff', fontSize: 11 }}></i>
    </div>
    <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13.5, fontFamily: "'DM Sans', sans-serif" }}>{text}</span>
  </div>
);

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

const StepDots = ({ current, total }: { current: number; total: number }) => (
  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 4, background: i === current ? C.orange : 'rgba(0,0,0,0.12)', transition: 'width 280ms cubic-bezier(0.22,1,0.36,1), background 280ms' }} />
    ))}
  </div>
);

// ── ERPLogin ──────────────────────────────────────────────────────────────────
interface Props { onSuccess: () => void; }

const ERPLogin = ({ onSuccess }: Props) => {
  const { login, loading: loginLoading, error: authError } = useERPAuth();

  // fire the left-panel stat count-up once, shortly after mount
  const [statsLive, setStatsLive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStatsLive(true), 550);
    return () => clearTimeout(t);
  }, []);

  // navigation
  const [mode, setMode] = useState<Mode>('login');
  const [anim, setAnim] = useState<'fwd' | 'bck'>('fwd');
  const [shaking, setShaking] = useState(false);

  const go = (next: Mode, dir: 'fwd' | 'bck' = 'fwd') => {
    setAnim(dir);
    setMode(next);
    setApiError('');
  };

  const triggerShake = () => { setShaking(true); setTimeout(() => setShaking(false), 520); };

  // shared async state
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError]     = useState('');

  // ── login state ──
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [uFocused, setUFocused]       = useState(false);
  const [pFocused, setPFocused]       = useState(false);
  const [btnHov, setBtnHov]           = useState(false);

  // ── register state ──
  const [reg, setReg] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirm: '' });
  const [showRegPw, setShowRegPw]   = useState(false);
  const [showRegCf, setShowRegCf]   = useState(false);
  const [regErr, setRegErr]         = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [r1f, setR1f] = useState(false); // firstName focus
  const [r2f, setR2f] = useState(false); // lastName focus
  const [r3f, setR3f] = useState(false); // username focus
  const [r4f, setR4f] = useState(false); // email focus
  const [r5f, setR5f] = useState(false); // password focus
  const [r6f, setR6f] = useState(false); // confirm focus

  // ── forgot password state ──
  const [fpEmail, setFpEmail]       = useState('');
  const [fpEmailErr, setFpEmailErr] = useState('');
  const [fpEmailFoc, setFpEmailFoc] = useState(false);
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [otpErr, setOtpErr]         = useState('');
  const [countdown, setCountdown]   = useState(600);
  const [fpToken, setFpToken]       = useState('');
  const [newPw, setNewPw]           = useState('');
  const [newPwCf, setNewPwCf]       = useState('');
  const [showNewPw, setShowNewPw]   = useState(false);
  const [showNewCf, setShowNewCf]   = useState(false);
  const [pwErr, setPwErr]           = useState('');
  const [fp3PwFoc, setFp3PwFoc]    = useState(false);
  const [fp3CfFoc, setFp3CfFoc]    = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);

  // countdown for OTP
  useEffect(() => {
    if (mode !== 'fp2') return;
    setCountdown(600);
    const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [mode]);

  // auto-focus first OTP box
  useEffect(() => {
    if (mode === 'fp2') setTimeout(() => otpRefs.current[0]?.focus(), 80);
  }, [mode]);

  // auto-redirect after success
  useEffect(() => {
    if (mode !== 'fp4') return;
    const t = setTimeout(() => go('login', 'bck'), 3200);
    return () => clearTimeout(t);
  }, [mode]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ── style helpers ──
  const iBorder = (err: string, focused: boolean) => err ? '#FECACA' : focused ? C.orange : 'rgba(0,0,0,0.11)';
  const iBg     = (err: string) => err ? '#FFF8F8' : C.white;
  const iShadow = (focused: boolean) => focused ? '0 0 0 3px rgba(201,136,58,0.14)' : 'none';

  const iStyle = (err: string, foc: boolean, rp = 0): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box',
    padding: `12px ${12 + rp}px 12px 46px`,
    border: `1.5px solid ${iBorder(err, foc)}`,
    borderRadius: 11, fontSize: 14,
    color: C.dark, background: iBg(err),
    boxShadow: iShadow(foc),
    transition: 'border-color 200ms, box-shadow 200ms, background 200ms',
    fontFamily: "'DM Sans', sans-serif",
  });

  const labelSt: React.CSSProperties = {
    display: 'block', fontSize: 12.5, fontWeight: 700,
    color: C.dark, marginBottom: 7, fontFamily: "'DM Sans', sans-serif",
  };

  const ErrText = ({ msg }: { msg: string }) => msg ? (
    <p style={{ color: '#DC2626', fontSize: 11.5, margin: '5px 0 0 2px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: 10 }} />{msg}
    </p>
  ) : null;

  const PrimaryBtn = ({ label, onClick, busy }: { label: string; onClick?: () => void; busy: boolean }) => (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={busy}
      onMouseEnter={() => setBtnHov(true)}
      onMouseLeave={() => setBtnHov(false)}
      style={{
        width: '100%', height: 50, background: C.orangeGrad,
        color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif", cursor: busy ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        boxShadow: btnHov && !busy
          ? `0 6px 0 ${C.orangeDeep}, 0 10px 28px rgba(201,136,58,0.35)`
          : `0 4px 0 ${C.orangeDeep}, 0 6px 20px rgba(201,136,58,0.28)`,
        transform: btnHov && !busy ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 180ms cubic-bezier(0.22,1,0.36,1), box-shadow 180ms cubic-bezier(0.22,1,0.36,1)',
        opacity: busy ? 0.88 : 1,
      }}
    >
      {busy
        ? <><Spinner />{label}…</>
        : <>{label}<i className="fas fa-arrow-right" style={{ fontSize: 12 }} /></>
      }
    </button>
  );

  const BackBtn = ({ label, target, dir = 'bck' }: { label: string; target: Mode; dir?: 'fwd' | 'bck' }) => (
    <button
      type="button" onClick={() => go(target, dir)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: C.muted, fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 0', transition: 'color 150ms' }}
      onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
    >
      <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />{label}
    </button>
  );

  const ErrBanner = ({ msg }: { msg: string }) => msg ? (
    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#DC2626', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
      <i className="fas fa-exclamation-circle" style={{ flexShrink: 0 }} />{msg}
    </div>
  ) : null;

  // ── event handlers ──

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!username.trim()) { setUsernameErr('Username is required'); ok = false; } else setUsernameErr('');
    if (!password)        { setPasswordErr('Password is required'); ok = false; } else setPasswordErr('');
    if (!ok) { triggerShake(); return; }
    const success = await login(username, password);
    if (success) onSuccess(); else triggerShake();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegErr('');
    const { firstName, lastName, username: u, email, password: p, confirm } = reg;
    if (!firstName.trim() || !lastName.trim() || !u.trim() || !email.trim() || !p || !confirm) { setRegErr('All fields are required'); return; }
    if (p !== confirm) { setRegErr("Passwords don't match"); return; }
    if (p.length < 8)  { setRegErr('Password must be at least 8 characters'); return; }
    setRegLoading(true);
    const res = await apiService.post('/auth/register/', {
      first_name: firstName, last_name: lastName,
      username: u, email, password: p, password_confirm: confirm,
    });
    setRegLoading(false);
    if (!res.success) {
      const d = (res as any).details || {};
      setRegErr(d.non_field_errors?.[0] || d.username?.[0] || d.email?.[0] || d.password?.[0] || (res as any).message || 'Registration failed.');
      return;
    }
    const data = (res as any).data;
    if (data?.access) {
      localStorage.setItem('xerxez_token', data.access);
      localStorage.setItem('xerxez_role',  data.role || 'admin');
      localStorage.setItem('xerxez_name',  data.name || data.username || '');
      localStorage.setItem('auth_tokens',  JSON.stringify({ access: data.access, refresh: data.refresh }));
      onSuccess();
    } else {
      go('login', 'bck');
    }
  };

  const handleSendOTP = async () => {
    if (!fpEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail)) { setFpEmailErr('Enter a valid email address'); return; }
    setFpEmailErr('');
    setApiLoading(true);
    await apiService.post('/auth/forgot-password/', { email: fpEmail });
    setApiLoading(false);
    setOtp(['', '', '', '', '', '']); setOtpErr('');
    go('fp2', 'fwd');
  };

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    setOtp(prev => { const n = [...prev]; n[idx] = digit; return n; });
    setOtpErr('');
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowLeft'  && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) { setOtpErr('Enter all 6 digits'); return; }
    setApiLoading(true);
    const res = await apiService.post('/auth/verify-otp/', { email: fpEmail, otp: code });
    setApiLoading(false);
    if (!res.success) { setOtpErr((res as any).details?.error || (res as any).message || 'Invalid or expired OTP'); return; }
    setFpToken((res as any).data?.reset_token || '');
    setNewPw(''); setNewPwCf(''); setPwErr('');
    go('fp3', 'fwd');
  };

  const handleResetPassword = async () => {
    if (!newPw || newPw.length < 8) { setPwErr('Password must be at least 8 characters'); return; }
    if (newPw !== newPwCf)          { setPwErr("Passwords don't match"); return; }
    setPwErr('');
    setApiLoading(true);
    const res = await apiService.post('/auth/reset-password/', { reset_token: fpToken, new_password: newPw });
    setApiLoading(false);
    if (!res.success) { setPwErr((res as any).details?.error || (res as any).message || 'Reset failed. Try again.'); return; }
    go('fp4', 'fwd');
  };

  // ═══════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @keyframes erp-shake { 0%,100%{transform:translateX(0)} 15%,55%{transform:translateX(-7px)} 35%,75%{transform:translateX(7px)} }
        @keyframes erp-spin { to{transform:rotate(360deg)} }
        @keyframes erpFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes erpSlideL { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes erpOrbPulse { 0%,100%{transform:scale(1) translate(0,0);opacity:1} 50%{transform:scale(1.09) translate(10px,-8px);opacity:0.82} }
        @keyframes erpUrgentPing { 0%{transform:scale(1);opacity:0.8} 70%{transform:scale(2.4);opacity:0} 100%{transform:scale(1);opacity:0} }
        @keyframes erpGradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes erpCardIn { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes erp-step-fwd { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes erp-step-bck { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes erp-circle-draw { from{stroke-dashoffset:233} to{stroke-dashoffset:0} }
        @keyframes erp-check-draw  { from{stroke-dashoffset:60}  to{stroke-dashoffset:0} }
        @keyframes erp-success-pop { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }

        .erp-shake{animation:erp-shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both!important}
        .erp-spin{animation:erp-spin 0.75s linear infinite}
        .erp-input{font-family:'DM Sans',sans-serif!important}
        .erp-input::placeholder{color:#BBBBBB}
        .erp-input:focus{outline:none}
        .erp-login-card{animation:erpCardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both}
        .erp-orb-1{animation:erpOrbPulse 8s ease-in-out infinite}
        .erp-orb-2{animation:erpOrbPulse 10s 2.5s ease-in-out infinite}
        .erp-orb-3{animation:erpOrbPulse 12s 5s ease-in-out infinite}
        .erp-orb-4{animation:erpOrbPulse 9s 1.5s ease-in-out infinite}
        .erp-left{background-size:200% 200%!important;animation:erpGradientShift 8s ease-in-out infinite}
        .erp-left::-webkit-scrollbar{width:6px}
        .erp-left::-webkit-scrollbar-thumb{background:rgba(201,136,58,0.25);border-radius:3px}
        .erp-step-fwd{animation:erp-step-fwd 0.30s cubic-bezier(0.22,1,0.36,1) both}
        .erp-step-bck{animation:erp-step-bck 0.30s cubic-bezier(0.22,1,0.36,1) both}
        .erp-otp-box:focus{border-color:#C9883A!important;box-shadow:0 0 0 3px rgba(201,136,58,0.18),0 3px 0 rgba(150,95,30,0.35)!important;outline:none}
        .erp-otp-box:active{transform:translateY(2px) scale(0.94)}
        .erp-right{background:${C.cream}}
        @media(max-width:991px){
          .erp-right{background:linear-gradient(150deg,#1a1208 0%,#0f0a05 100%)!important}
          .erp-login-card{box-shadow:0 8px 48px rgba(0,0,0,0.52),0 2px 8px rgba(0,0,0,0.32)!important}
          .erp-footer-note{color:rgba(255,255,255,0.22)!important}
        }
        @media(prefers-reduced-motion:reduce){
          .erp-orb-1,.erp-orb-2,.erp-orb-3,.erp-orb-4,.erp-left{animation:none!important}
          .erp-login-card{animation:none!important}
          *{transition-duration:0ms!important;animation-duration:0ms!important}
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex' }}>

        {/* ══ LEFT — brand panel ══════════════════════════════════════════ */}
        <div className="d-none d-lg-flex erp-left" style={{ flex: '0 0 56%', flexDirection: 'column', justifyContent: 'center', padding: '24px 56px', position: 'relative', overflow: 'hidden auto', background: `linear-gradient(150deg, ${C.warmDark} 0%, ${C.warmDarker} 100%)` }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <span className="erp-orb-1" style={{ position: 'absolute', top: '-10%', left: '-8%', width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,136,58,0.15) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
          <span className="erp-orb-2" style={{ position: 'absolute', bottom: '-18%', right: '-4%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,136,58,0.10) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
          <span className="erp-orb-3" style={{ position: 'absolute', top: '38%', right: '10%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,136,58,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
          <span className="erp-orb-4" style={{ position: 'absolute', top: '64%', left: '20%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,136,58,0.07) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: 12, animation: 'erpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,136,58,0.13)', border: '1px solid rgba(201,136,58,0.35)', color: '#E5B460', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 20, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <i className="fas fa-bolt" style={{ fontSize: 9, color: C.orange }}></i>
                Enterprise Operations Platform
              </span>
            </div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(24px, 2.2vw, 34px)', lineHeight: 1.1, marginBottom: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.025em', animation: 'erpSlideL 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both' }}>
              The AI ERP That<br />
              <em style={{ color: C.orange, fontStyle: 'italic' }}>Replaces 5 Legacy Systems</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, lineHeight: 1.6, maxWidth: 420, marginBottom: 16, fontFamily: "'DM Sans', sans-serif", animation: 'erpSlideL 0.55s cubic-bezier(0.22,1,0.36,1) 0.19s both' }}>
              Trusted by enterprises across India &amp; UAE to streamline operations with AI.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
              <Bullet icon="fas fa-brain"      text="AI demand forecasting & anomaly detection"   delay={0.25} />
              <Bullet icon="fas fa-chart-bar"  text="Role-based dashboards for every department"  delay={0.37} />
              <Bullet icon="fas fa-rocket"     text="Deploy in phases, milestone-driven"          delay={0.43} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <TrustLine text="Invite-only enterprise access" delay={0.49} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <StatTile val="8+"  label="AI Modules"        icon="fas fa-cubes"          delay={0.55} trigger={statsLive} />
              <StatTile val="UAE" label="Based & Supported" icon="fas fa-map-marker-alt" delay={0.59} trigger={statsLive} />
            </div>
          </div>
        </div>

        {/* ══ RIGHT — form panel ══════════════════════════════════════════ */}
        <div className="erp-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 52, paddingBottom: 32, paddingLeft: 28, paddingRight: 28, minHeight: '100vh' }}>

          <div className={`erp-login-card${shaking ? ' erp-shake' : ''}`} style={{ background: C.white, borderRadius: 20, padding: '24px 28px 20px', width: '100%', maxWidth: 460, boxShadow: shadow.card, border: '1px solid rgba(0,0,0,0.06)', borderTop: `3px solid ${C.orange}`, overflow: 'hidden' }}>

            {/* animated step wrapper */}
            <div key={mode} className={`erp-step-${anim}`}>

              {/* ════════════════ LOGIN ════════════════ */}
              {mode === 'login' && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 14 }}>
                    <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 20, margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>ERP Portal</h2>
                    <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Sign in to manage your enterprise</p>
                  </div>
                  <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', marginBottom: 14 }} />

                  {authError && <ErrBanner msg={authError} />}

                  <form onSubmit={handleLogin} noValidate>
                    {/* username */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelSt}>Username</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <InputBadge icon="fas fa-user" hasError={!!usernameErr} focused={uFocused} />
                        </span>
                        <input className="erp-input" type="text" value={username} placeholder="Enter your username" autoComplete="username"
                          onChange={e => { setUsername(e.target.value); if (e.target.value.trim()) setUsernameErr(''); }}
                          onFocus={() => setUFocused(true)} onBlur={() => setUFocused(false)}
                          style={iStyle(usernameErr, uFocused)} />
                      </div>
                      <ErrText msg={usernameErr} />
                    </div>

                    {/* password */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelSt}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <InputBadge icon="fas fa-lock" hasError={!!passwordErr} focused={pFocused} />
                        </span>
                        <input className="erp-input" type={showPw ? 'text' : 'password'} value={password} placeholder="Enter your password" autoComplete="current-password"
                          onChange={e => { setPassword(e.target.value); if (e.target.value) setPasswordErr(''); }}
                          onFocus={() => setPFocused(true)} onBlur={() => setPFocused(false)}
                          style={iStyle(passwordErr, pFocused, 32)} />
                        <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide' : 'Show'}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4, fontSize: 13, lineHeight: 1 }}>
                          <i className={`fas fa-eye${showPw ? '-slash' : ''}`} />
                        </button>
                      </div>
                      <ErrText msg={passwordErr} />
                    </div>

                    {/* remember + forgot */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ width: 15, height: 15, accentColor: C.orange, cursor: 'pointer' }} />
                        <span style={{ fontSize: 12.5, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Remember me</span>
                      </label>
                      <button type="button" onClick={() => go('fp1', 'fwd')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: C.orange, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                        Forgot Password?
                      </button>
                    </div>

                    <PrimaryBtn label="Sign In" busy={loginLoading} />
                  </form>

                  {/* security badges */}
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#9B9B9B', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif" }}>
                      <i className="fas fa-lock" style={{ color: '#4ade80', fontSize: 11 }} />AES-256 Encrypted
                    </span>
                  </div>

                  <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '10px 0 8px' }} />
                  <div style={{ textAlign: 'center', marginBottom: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                      <i className="fas fa-shield-alt" style={{ color: C.orange, fontSize: 11 }} />
                      Access restricted to invited enterprises only
                    </span>
                  </div>
                  <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '6px 0 8px' }} />
                  <div style={{ textAlign: 'center' }}>
                    <Link to="/" style={{ fontSize: 13, color: '#999', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 150ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                      onMouseLeave={e => (e.currentTarget.style.color = '#999')}>
                      <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />Back to Website
                    </Link>
                  </div>
                </>
              )}

              {/* ════════════════ REGISTER ════════════════ */}
              {mode === 'reg' && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 14 }}>
                    <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 20, margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>Create Account</h2>
                    <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Join the XERXEZ Enterprise Platform</p>
                  </div>
                  <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', marginBottom: 14 }} />

                  <ErrBanner msg={regErr} />

                  <form onSubmit={handleRegister} noValidate>
                    {/* first + last name row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={labelSt}>First Name</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <InputBadge icon="fas fa-user" hasError={false} focused={r1f} />
                          </span>
                          <input className="erp-input" type="text" value={reg.firstName} placeholder="First"
                            onChange={e => setReg(r => ({ ...r, firstName: e.target.value }))}
                            onFocus={() => setR1f(true)} onBlur={() => setR1f(false)} style={iStyle('', r1f)} />
                        </div>
                      </div>
                      <div>
                        <label style={labelSt}>Last Name</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <InputBadge icon="fas fa-user" hasError={false} focused={r2f} />
                          </span>
                          <input className="erp-input" type="text" value={reg.lastName} placeholder="Last"
                            onChange={e => setReg(r => ({ ...r, lastName: e.target.value }))}
                            onFocus={() => setR2f(true)} onBlur={() => setR2f(false)} style={iStyle('', r2f)} />
                        </div>
                      </div>
                    </div>

                    {/* username */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelSt}>Username</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <InputBadge icon="fas fa-at" hasError={false} focused={r3f} />
                        </span>
                        <input className="erp-input" type="text" value={reg.username} placeholder="Choose a username"
                          onChange={e => setReg(r => ({ ...r, username: e.target.value }))}
                          onFocus={() => setR3f(true)} onBlur={() => setR3f(false)} style={iStyle('', r3f)} />
                      </div>
                    </div>

                    {/* email */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelSt}>Email</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <InputBadge icon="fas fa-envelope" hasError={false} focused={r4f} />
                        </span>
                        <input className="erp-input" type="email" value={reg.email} placeholder="your@email.com" autoComplete="email"
                          onChange={e => setReg(r => ({ ...r, email: e.target.value }))}
                          onFocus={() => setR4f(true)} onBlur={() => setR4f(false)} style={iStyle('', r4f)} />
                      </div>
                    </div>

                    {/* password */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelSt}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <InputBadge icon="fas fa-lock" hasError={false} focused={r5f} />
                        </span>
                        <input className="erp-input" type={showRegPw ? 'text' : 'password'} value={reg.password} placeholder="Min. 8 characters" autoComplete="new-password"
                          onChange={e => setReg(r => ({ ...r, password: e.target.value }))}
                          onFocus={() => setR5f(true)} onBlur={() => setR5f(false)} style={iStyle('', r5f, 32)} />
                        <button type="button" onClick={() => setShowRegPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4, fontSize: 13, lineHeight: 1 }}>
                          <i className={`fas fa-eye${showRegPw ? '-slash' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* confirm */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelSt}>Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <InputBadge icon="fas fa-lock" hasError={false} focused={r6f} />
                        </span>
                        <input className="erp-input" type={showRegCf ? 'text' : 'password'} value={reg.confirm} placeholder="Repeat password" autoComplete="new-password"
                          onChange={e => setReg(r => ({ ...r, confirm: e.target.value }))}
                          onFocus={() => setR6f(true)} onBlur={() => setR6f(false)} style={iStyle('', r6f, 32)} />
                        <button type="button" onClick={() => setShowRegCf(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4, fontSize: 13, lineHeight: 1 }}>
                          <i className={`fas fa-eye${showRegCf ? '-slash' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <PrimaryBtn label="Create Account" busy={regLoading} />
                  </form>

                  <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '12px 0 8px' }} />
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 12.5, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                      Already have an account?{' '}
                      <button type="button" onClick={() => go('login', 'bck')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.orange, fontWeight: 700, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                        Sign In
                      </button>
                    </span>
                  </div>
                </>
              )}

              {/* ════════════════ FP1 — Email ════════════════ */}
              {mode === 'fp1' && (
                <>
                  <StepDots current={0} total={3} />
                  <div style={{ textAlign: 'center', marginBottom: 18 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px', background: C.orangeGrad, boxShadow: shadow.badge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-key" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 18, margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>Forgot Password?</h2>
                    <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Enter your email to receive a 6-digit OTP</p>
                  </div>

                  <ErrBanner msg={apiError} />

                  <div style={{ marginBottom: 16 }}>
                    <label style={labelSt}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <InputBadge icon="fas fa-envelope" hasError={!!fpEmailErr} focused={fpEmailFoc} />
                      </span>
                      <input className="erp-input" type="email" value={fpEmail} placeholder="your@email.com" autoComplete="email"
                        onChange={e => { setFpEmail(e.target.value); setFpEmailErr(''); }}
                        onFocus={() => setFpEmailFoc(true)} onBlur={() => setFpEmailFoc(false)}
                        onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                        style={iStyle(fpEmailErr, fpEmailFoc)} />
                    </div>
                    <ErrText msg={fpEmailErr} />
                  </div>

                  <PrimaryBtn label="Send OTP" onClick={handleSendOTP} busy={apiLoading} />
                  <div style={{ textAlign: 'center', marginTop: 12 }}><BackBtn label="Back to Sign In" target="login" /></div>
                </>
              )}

              {/* ════════════════ FP2 — OTP ════════════════ */}
              {mode === 'fp2' && (
                <>
                  <StepDots current={1} total={3} />
                  <div style={{ textAlign: 'center', marginBottom: 18 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px', background: C.orangeGrad, boxShadow: shadow.badge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-shield-alt" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 18, margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>Enter OTP</h2>
                    <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      We sent a code to <strong style={{ color: C.dark }}>{fpEmail}</strong>
                    </p>
                  </div>

                  {/* 6 OTP boxes */}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className="erp-otp-box erp-input"
                        style={{
                          width: 44, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 700,
                          border: `1.5px solid ${digit ? C.orange : 'rgba(0,0,0,0.13)'}`,
                          borderRadius: 10, background: digit ? C.orangeLight : C.white,
                          color: C.dark, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                          transition: 'border-color 150ms, background 150ms, box-shadow 150ms, transform 100ms',
                          cursor: 'text', boxSizing: 'border-box',
                        }}
                      />
                    ))}
                  </div>

                  {otpErr && (
                    <p style={{ color: '#DC2626', fontSize: 12, margin: '4px 0 8px', fontFamily: "'DM Sans', sans-serif", textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      <i className="fas fa-exclamation-circle" style={{ fontSize: 11 }} />{otpErr}
                    </p>
                  )}

                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    {countdown > 0 ? (
                      <span style={{ fontSize: 12.5, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                        Expires in{' '}<span style={{ color: countdown < 60 ? '#ef4444' : C.orange, fontWeight: 700 }}>{formatTime(countdown)}</span>
                      </span>
                    ) : (
                      <button type="button" onClick={() => { setOtp(['','','','','','']); handleSendOTP(); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.orange, fontWeight: 700, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif" }}>
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <PrimaryBtn label="Verify OTP" onClick={handleVerifyOTP} busy={apiLoading} />
                  <div style={{ textAlign: 'center', marginTop: 12 }}><BackBtn label="Back" target="fp1" /></div>
                </>
              )}

              {/* ════════════════ FP3 — New Password ════════════════ */}
              {mode === 'fp3' && (
                <>
                  <StepDots current={2} total={3} />
                  <div style={{ textAlign: 'center', marginBottom: 18 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px', background: C.orangeGrad, boxShadow: shadow.badge, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-lock" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 18, margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>Set New Password</h2>
                    <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Choose a strong password for your account</p>
                  </div>

                  <ErrBanner msg={pwErr} />

                  {/* new password */}
                  <div style={{ marginBottom: 10 }}>
                    <label style={labelSt}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <InputBadge icon="fas fa-lock" hasError={false} focused={fp3PwFoc} />
                      </span>
                      <input className="erp-input" type={showNewPw ? 'text' : 'password'} value={newPw} placeholder="Min. 8 characters" autoComplete="new-password"
                        onChange={e => { setNewPw(e.target.value); setPwErr(''); }}
                        onFocus={() => setFp3PwFoc(true)} onBlur={() => setFp3PwFoc(false)}
                        style={iStyle('', fp3PwFoc, 32)} />
                      <button type="button" onClick={() => setShowNewPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4, fontSize: 13, lineHeight: 1 }}>
                        <i className={`fas fa-eye${showNewPw ? '-slash' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* confirm password */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelSt}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <InputBadge icon="fas fa-lock" hasError={false} focused={fp3CfFoc} />
                      </span>
                      <input className="erp-input" type={showNewCf ? 'text' : 'password'} value={newPwCf} placeholder="Repeat new password" autoComplete="new-password"
                        onChange={e => { setNewPwCf(e.target.value); setPwErr(''); }}
                        onFocus={() => setFp3CfFoc(true)} onBlur={() => setFp3CfFoc(false)}
                        style={iStyle('', fp3CfFoc, 32)} />
                      <button type="button" onClick={() => setShowNewCf(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4, fontSize: 13, lineHeight: 1 }}>
                        <i className={`fas fa-eye${showNewCf ? '-slash' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <PrimaryBtn label="Reset Password" onClick={handleResetPassword} busy={apiLoading} />
                </>
              )}

              {/* ════════════════ FP4 — Success ════════════════ */}
              {mode === 'fp4' && (
                <div style={{ textAlign: 'center', padding: '28px 0 24px' }}>
                  <svg width={80} height={80} viewBox="0 0 80 80" fill="none"
                    style={{ display: 'block', margin: '0 auto 20px', animation: 'erp-success-pop 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
                    <circle cx="40" cy="40" r="37" stroke={C.orange} strokeWidth="2.5"
                      style={{ strokeDasharray: 233, strokeDashoffset: 0, animation: 'erp-circle-draw 0.6s ease-out both' }} />
                    <polyline points="23,40 34,52 58,26" stroke={C.orange} strokeWidth="4"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ strokeDasharray: 60, strokeDashoffset: 0, animation: 'erp-check-draw 0.38s 0.52s ease-out both' }} />
                  </svg>
                  <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 20, margin: '0 0 8px', fontFamily: "'DM Sans', sans-serif" }}>Password Reset!</h2>
                  <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                    Your password has been updated successfully.<br />Redirecting to sign in…
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.orangeLight, border: '1px solid rgba(201,136,58,0.25)', borderRadius: 20, padding: '6px 18px' }}>
                    <i className="fas fa-lock" style={{ color: C.orange, fontSize: 11 }}></i>
                    <span style={{ fontSize: 12, color: C.orange, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Security updated</span>
                  </div>
                </div>
              )}

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

export default ERPLogin;
