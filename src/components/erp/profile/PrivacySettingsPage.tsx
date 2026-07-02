import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const OG_G = 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)';
const CARD: React.CSSProperties = {
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(255,255,255,0.07)',
  borderTop:    '2px solid rgba(201,136,58,0.40)',
  borderRadius: 14,
};
const FONT = "'DM Sans', sans-serif";

const SETTINGS = [
  { key: 'email_notifs',    label: 'Email Notifications',   desc: 'Receive emails about ERP activity and updates',                   def: true  },
  { key: 'login_alerts',    label: 'Login Alerts',           desc: 'Get notified when someone signs in to your account',              def: true  },
  { key: 'activity_digest', label: 'Weekly Activity Report', desc: 'A weekly digest of your activity across ERP modules',            def: false },
  { key: 'marketing',       label: 'Marketing Emails',       desc: 'Product updates, new features, and promotional content',         def: false },
  { key: 'two_factor',      label: 'Two-Factor Auth Reminders', desc: 'Reminders to enable 2FA for enhanced account security',      def: false },
  { key: 'public_profile',  label: 'Public Profile',         desc: 'Let other team members view your profile and contact info',      def: true  },
] as const;

type Key = typeof SETTINGS[number]['key'];
type State = Record<Key, boolean>;

const STORE = 'erp_privacy';

function load(): State {
  try {
    const s = localStorage.getItem(STORE);
    if (s) return JSON.parse(s) as State;
  } catch {}
  return Object.fromEntries(SETTINGS.map(s => [s.key, s.def])) as State;
}

// ─── Animated toggle ─────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={on} onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', padding: 0,
        background: on ? OG_G : 'rgba(255,255,255,0.12)',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        transition: 'background 0.25s ease',
        boxShadow: on ? '0 0 10px rgba(201,136,58,0.28)' : 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
        display: 'block',
      }} />
    </button>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PrivacySettingsPage() {
  const navigate = useNavigate();
  const [priv, setPriv] = useState<State>(load);
  const [dirty, setDirty] = useState(false);

  const toggle = (key: Key) => {
    setPriv(p => ({ ...p, [key]: !p[key] }));
    setDirty(true);
  };

  const handleSave = () => {
    localStorage.setItem(STORE, JSON.stringify(priv));
    setDirty(false);
    toast.success('Privacy preferences saved');
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
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0, letterSpacing: '-0.02em' }}>Privacy Settings</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, margin: 0 }}>Control your data, notifications, and visibility</p>
        </div>
      </motion.div>

      {/* ── Toggle list ──────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.07 }}>
        <div style={{ ...CARD, overflow: 'hidden', marginBottom: 16 }}>
          {SETTINGS.map((s, i) => (
            <div
              key={s.key}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                borderBottom: i < SETTINGS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                cursor: 'default',
                transition: 'background 0.16s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,136,58,0.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{s.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
              <Toggle on={priv[s.key]} onToggle={() => toggle(s.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Save button ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.14 }}
        style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}
      >
        <button
          onClick={handleSave}
          style={{ background: OG_G, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 3px 0 rgba(130,78,18,0.50)', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s', opacity: dirty ? 1 : 0.65 }}
        >
          {!dirty && <i className="fas fa-check" style={{ fontSize: 11 }} />}
          {dirty ? 'Save Preferences' : 'Saved'}
        </button>
      </motion.div>

    </div>
  );
}
