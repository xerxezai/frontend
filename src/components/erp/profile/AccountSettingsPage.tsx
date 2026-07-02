import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import apiService from '../../../services/api';

const OG   = '#C9883A';
const OG_G = 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)';
const CARD: React.CSSProperties = {
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(255,255,255,0.07)',
  borderTop:    '2px solid rgba(201,136,58,0.40)',
  borderRadius: 14,
};
const FONT = "'DM Sans', sans-serif";

// ─── Password field ──────────────────────────────────────────────────────────
function PwdField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const [show,    setShow]    = useState(false);
  const elevated = focused || value.length > 0;

  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        position: 'absolute', left: 14, zIndex: 1, pointerEvents: 'none', fontFamily: FONT,
        top:           elevated ? 7       : '50%',
        transform:     elevated ? 'none'  : 'translateY(-50%)',
        fontSize:      elevated ? 9.5     : 13.5,
        color:         focused  ? OG      : 'rgba(255,255,255,0.35)',
        fontWeight:    elevated ? 700     : 400,
        letterSpacing: elevated ? '0.07em': '0',
        textTransform: (elevated ? 'uppercase' : 'none') as React.CSSProperties['textTransform'],
        transition: 'all 0.18s cubic-bezier(0.22,1,0.36,1)',
      }}>{label}</label>
      <input
        type={show ? 'text' : 'password'} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: focused ? 'rgba(201,136,58,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? 'rgba(201,136,58,0.55)' : 'rgba(255,255,255,0.09)'}`,
          borderRadius: 10, color: '#fff', fontFamily: FONT, fontSize: 14, outline: 'none',
          padding: elevated ? '20px 44px 10px 14px' : '14px 44px 14px 14px',
          height: 52,
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(201,136,58,0.12)' : 'none',
        }}
      />
      <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
        style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.30)', padding: 4 }}>
        <i className={`fas fa-eye${show ? '-slash' : ''}`} style={{ fontSize: 13 }} />
      </button>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AccountSettingsPage() {
  const navigate  = useNavigate();
  const adminName = localStorage.getItem('xerxez_name') || 'User';

  const [pwd, setPwd] = useState({ old: '', new_: '', confirm: '' });
  const [pwdBusy, setPwdBusy]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handlePasswordChange = async () => {
    if (!pwd.old || !pwd.new_ || !pwd.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (pwd.new_ !== pwd.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwd.new_.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setPwdBusy(true);
    const res = await apiService.post('/auth/change-password/', {
      old_password:         pwd.old,
      new_password:         pwd.new_,
      new_password_confirm: pwd.confirm,
    });
    setPwdBusy(false);
    if ('success' in res && res.success) {
      toast.success('Password changed successfully');
      setPwd({ old: '', new_: '', confirm: '' });
    } else {
      const detail = (res as any).details;
      const msg = detail
        ? Object.entries(detail).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join(' | ')
        : ((res as any).message || 'Failed to change password');
      toast.error(msg);
    }
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 680, margin: '0 auto' }}>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}
      >
        <button
          onClick={() => navigate('/erp/profile')} aria-label="Back"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)', flexShrink: 0, transition: 'background 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <i className="fas fa-arrow-left" style={{ fontSize: 12 }} />
        </button>
        <div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0, letterSpacing: '-0.02em' }}>Account Settings</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, margin: 0 }}>Manage your security and account preferences</p>
        </div>
      </motion.div>

      {/* ── Change Password ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.07 }}>
        <div style={{ ...CARD, padding: '22px 20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(201,136,58,0.10)', border: '1px solid rgba(201,136,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-key" style={{ color: OG, fontSize: 11 }} />
            </span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>Change Password</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PwdField label="Current Password" value={pwd.old}     onChange={v => setPwd(p => ({ ...p, old: v }))} />
            <PwdField label="New Password"     value={pwd.new_}    onChange={v => setPwd(p => ({ ...p, new_: v }))} />
            <PwdField label="Confirm Password" value={pwd.confirm} onChange={v => setPwd(p => ({ ...p, confirm: v }))} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              onClick={handlePasswordChange} disabled={pwdBusy}
              style={{ background: pwdBusy ? 'rgba(201,136,58,0.45)' : OG_G, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: pwdBusy ? 'not-allowed' : 'pointer', fontFamily: FONT, boxShadow: pwdBusy ? 'none' : '0 3px 0 rgba(130,78,18,0.50)', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {pwdBusy && (
                <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'erpSpin 0.7s linear infinite', display: 'inline-block' }} />
              )}
              {pwdBusy ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Active Sessions ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.12 }}>
        <div style={{ ...CARD, padding: '22px 20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(201,136,58,0.10)', border: '1px solid rgba(201,136,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-desktop" style={{ color: OG, fontSize: 11 }} />
            </span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>Active Sessions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'rgba(201,136,58,0.04)', border: '1px solid rgba(201,136,58,0.12)', borderRadius: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(201,136,58,0.09)', border: '1px solid rgba(201,136,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-globe" style={{ color: OG, fontSize: 14 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>Current browser session</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11.5, marginTop: 2 }}>Signed in as {adminName} · Active now</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px rgba(74,222,128,0.70)' }} />
              <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700 }}>Active</span>
            </div>
            <span style={{ background: 'rgba(201,136,58,0.12)', border: '1px solid rgba(201,136,58,0.22)', color: OG, fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.07em', textTransform: 'uppercase', flexShrink: 0 }}>
              This device
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Danger Zone ──────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.17 }}>
        <div style={{ ...CARD, borderTop: '2px solid rgba(239,68,68,0.40)', padding: '22px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#f87171', fontSize: 11 }} />
            </span>
            <span style={{ color: '#f87171', fontWeight: 700, fontSize: 13.5 }}>Danger Zone</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 600 }}>Delete Account</div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 3 }}>This action is permanent and cannot be undone.</div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '9px 18px', color: '#f87171', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, flexShrink: 0, transition: 'background 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            >Delete Account</button>
          </div>
        </div>
      </motion.div>

      {/* ── Confirmation Modal ───────────────────────────────────────── */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'linear-gradient(160deg, #1a1208 0%, #0f0a05 100%)', border: '1px solid rgba(239,68,68,0.30)', borderTop: '2px solid #f87171', borderRadius: 16, padding: '28px 28px 24px', maxWidth: 420, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.70)', fontFamily: FONT }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <i className="fas fa-trash" style={{ color: '#f87171', fontSize: 18 }} />
            </div>
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 17, margin: '0 0 10px', letterSpacing: '-0.02em' }}>Delete Account?</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6, margin: '0 0 22px' }}>
              This action is <strong style={{ color: '#f87171' }}>permanent</strong> and cannot be undone. All your data will be deleted immediately. Contact your administrator to proceed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px', color: 'rgba(255,255,255,0.70)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
              >Cancel</button>
              <button
                onClick={() => { toast.info('Please contact your administrator to delete your account.'); setShowModal(false); }}
                style={{ flex: 1, background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.30)', borderRadius: 10, padding: '10px', color: '#f87171', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}
              >Contact Admin</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes erpSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
