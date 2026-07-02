import { useState, useEffect } from 'react';
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

// ─── Floating-label input ────────────────────────────────────────────────────
function Field({
  label, value, onChange,
  type = 'text', multiline = false, disabled = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; multiline?: boolean; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const elevated = focused || value.length > 0;

  const base: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: disabled  ? 'rgba(255,255,255,0.02)'
               : focused  ? 'rgba(201,136,58,0.06)'
               :             'rgba(255,255,255,0.03)',
    border: `1px solid ${focused ? 'rgba(201,136,58,0.55)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: 10, color: '#fff', fontFamily: FONT, fontSize: 14,
    outline: 'none', resize: 'none',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(201,136,58,0.12)' : 'none',
    opacity: disabled ? 0.55 : 1,
  };

  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        position: 'absolute', left: 14, zIndex: 1, pointerEvents: 'none', fontFamily: FONT,
        top:        elevated ? 7       : '50%',
        transform:  elevated ? 'none'  : 'translateY(-50%)',
        fontSize:   elevated ? 9.5     : 13.5,
        color:      focused  ? OG      : 'rgba(255,255,255,0.35)',
        fontWeight: elevated ? 700     : 400,
        letterSpacing: elevated ? '0.07em' : '0',
        textTransform: (elevated ? 'uppercase' : 'none') as React.CSSProperties['textTransform'],
        transition: 'all 0.18s cubic-bezier(0.22,1,0.36,1)',
      }}>{label}</label>

      {multiline ? (
        <textarea
          rows={3} value={value} disabled={disabled}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, padding: '22px 14px 10px', minHeight: 88 }}
        />
      ) : (
        <input
          type={type} value={value} disabled={disabled}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, padding: elevated ? '20px 14px 10px' : '14px', height: 52 }}
        />
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
type FormData = {
  first_name: string; last_name: string; email: string;
  username: string; phone: string; department: string; bio: string;
};

export default function EditProfilePage() {
  const navigate  = useNavigate();
  const adminName = localStorage.getItem('xerxez_name') || 'User';
  const initial   = adminName.charAt(0).toUpperCase();

  const [form,    setForm]    = useState<FormData>({
    first_name: '', last_name: '', email: '', username: '', phone: '', department: '', bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    apiService.get('/auth/profile/').then(res => {
      if ('success' in res && res.success) {
        const d = res.data as any;
        setForm({
          first_name:  d.first_name  || '',
          last_name:   d.last_name   || '',
          email:       d.email       || '',
          username:    d.username    || '',
          phone:       d.phone       || '',
          department:  d.department  || '',
          bio:         d.bio         || '',
        });
      }
      setLoading(false);
    });
  }, []);

  const set = (key: keyof FormData) => (v: string) => setForm(p => ({ ...p, [key]: v }));

  const handleSave = async () => {
    if (!form.first_name && !form.username) {
      toast.error('First name or username is required');
      return;
    }
    setSaving(true);
    const res = await apiService.patch('/auth/profile/', {
      first_name: form.first_name,
      last_name:  form.last_name,
      email:      form.email,
      phone:      form.phone,
      department: form.department,
      bio:        form.bio,
    });
    setSaving(false);
    if ('success' in res && res.success) {
      localStorage.setItem('xerxez_name', form.first_name || form.username);
      toast.success('Profile updated successfully');
      navigate('/erp/profile');
    } else {
      const detail = (res as any).details;
      const msg = detail
        ? Object.entries(detail)
            .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
            .join(' | ')
        : ((res as any).message || 'Failed to save changes');
      toast.error(msg);
    }
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 780, margin: '0 auto' }}>

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
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0, letterSpacing: '-0.02em' }}>Edit Profile</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, margin: 0 }}>Update your personal information</p>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '176px 1fr', gap: 16 }}>

        {/* Avatar column */}
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.40, delay: 0.06 }}>
          <div style={{ ...CARD, padding: '24px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%', background: OG_G,
                boxShadow: `0 0 0 3px #0c0804, 0 0 0 5px ${OG}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: '#fff' }}>{initial}</span>
              </div>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 24, height: 24, borderRadius: '50%', background: OG_G,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(201,136,58,0.40)',
              }}>
                <i className="fas fa-camera" style={{ color: '#fff', fontSize: 9 }} />
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10.5, textAlign: 'center', lineHeight: 1.55, margin: 0 }}>
              Avatar upload coming soon
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.40, delay: 0.09 }}>
          <div style={{ ...CARD, padding: '22px 20px' }}>
            {loading ? (
              <div style={{ color: 'rgba(255,255,255,0.28)', textAlign: 'center', padding: '40px 0', fontSize: 13 }}>Loading…</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="First Name" value={form.first_name} onChange={set('first_name')} />
                  <Field label="Last Name"  value={form.last_name}  onChange={set('last_name')}  />
                </div>
                <Field label="Email"    type="email" value={form.email}      onChange={set('email')}    />
                <Field label="Username"              value={form.username}   onChange={set('username')} disabled />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Phone"      type="tel" value={form.phone}      onChange={set('phone')}      />
                  <Field label="Department"           value={form.department} onChange={set('department')} />
                </div>
                <Field label="Bio" multiline value={form.bio} onChange={set('bio')} />
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16 }}
        style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}
      >
        <button
          onClick={() => navigate('/erp/profile')}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '10px 22px', color: 'rgba(255,255,255,0.68)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, transition: 'background 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >Cancel</button>
        <button
          onClick={handleSave} disabled={saving}
          style={{ background: saving ? 'rgba(201,136,58,0.45)' : OG_G, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: FONT, boxShadow: saving ? 'none' : '0 3px 0 rgba(130,78,18,0.50)', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s' }}
        >
          {saving && (
            <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'erpSpin 0.7s linear infinite', display: 'inline-block' }} />
          )}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </motion.div>
      <style>{`@keyframes erpSpin { to { transform: rotate(360deg); } }`}</style>

    </div>
  );
}
