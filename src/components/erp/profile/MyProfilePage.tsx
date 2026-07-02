import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../../../services/api';

const OG   = '#C9883A';
const OG_G = 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)';
const CARD: React.CSSProperties = {
  background:  'rgba(255,255,255,0.04)',
  border:      '1px solid rgba(255,255,255,0.07)',
  borderTop:   '2px solid rgba(201,136,58,0.40)',
  borderRadius: 14,
};
const FONT = "'DM Sans', sans-serif";

function getIsAdmin() {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const payload = JSON.parse(atob(JSON.parse(stored).access.split('.')[1]));
      if (payload.is_staff === true || payload.is_superuser === true) return true;
    }
  } catch {}
  const role = localStorage.getItem('xerxez_role') || '';
  return ['admin', 'super_admin', 'superuser'].includes(role);
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const adminName = localStorage.getItem('xerxez_name') || 'User';
  const initial   = adminName.charAt(0).toUpperCase();
  const isAdmin   = getIsAdmin();

  useEffect(() => {
    apiService.get('/auth/profile/').then(res => {
      if ('success' in res && res.success) setProfile(res.data as Record<string, any>);
      setLoading(false);
    });
  }, []);

  const displayName = profile
    ? (`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || adminName)
    : adminName;

  const joinDate = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—';

  const activity = [
    { action: 'Logged into ERP dashboard',         time: 'Just now',  icon: 'fas fa-sign-in-alt' },
    { action: 'Accessed Payroll Reports',           time: 'Today',     icon: 'fas fa-chart-bar' },
    { action: 'Updated Attendance records',         time: 'Yesterday', icon: 'fas fa-calendar-check' },
    { action: 'Generated Payslips for June 2026',  time: '2 days ago',icon: 'fas fa-file-alt' },
  ];

  return (
    <div style={{ fontFamily: FONT }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #1a1208 0%, rgba(201,136,58,0.07) 55%, #0f0a05 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: `3px solid ${OG}`,
          borderRadius: 16,
          padding: '28px 28px 24px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 24px, rgba(201,136,58,0.028) 24px, rgba(201,136,58,0.028) 25px)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', flexWrap: 'wrap' }}>
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.10, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                width: 76, height: 76, borderRadius: '50%', flexShrink: 0,
                background: OG_G,
                boxShadow: `0 0 0 3px #1a1208, 0 0 0 5px ${OG}, 0 8px 28px rgba(201,136,58,0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 800, color: '#fff' }}>{initial}</span>
            </motion.div>

            <div style={{ flex: 1, minWidth: 160 }}>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 7px', letterSpacing: '-0.02em' }}>
                {loading ? adminName : displayName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(201,136,58,0.12)', border: '1px solid rgba(201,136,58,0.28)',
                  color: OG, fontSize: 9.5, fontWeight: 700,
                  padding: '3px 9px', borderRadius: 20,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 5px rgba(74,222,128,0.75)' }} />
                  {isAdmin ? 'Super Admin' : 'User'}
                </span>
                {profile?.department && (
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>· {profile.department}</span>
                )}
                {profile?.email && (
                  <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: 12 }}>· {profile.email}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { val: joinDate,                                           label: 'Member since' },
                { val: profile?.username || adminName.toLowerCase(),       label: 'Username' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'right' }}>
                  <div style={{ color: OG, fontWeight: 700, fontSize: 13 }}>{s.val}</div>
                  <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Two-column body ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.09 }}>
          <div style={{ ...CARD, padding: '22px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(201,136,58,0.10)', border: '1px solid rgba(201,136,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="fas fa-user" style={{ color: OG, fontSize: 11 }} />
              </span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>Personal Info</span>
            </div>

            {loading ? (
              <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>Loading…</div>
            ) : (
              <div>
                {[
                  { label: 'Full Name',    val: displayName },
                  { label: 'Username',     val: profile?.username    || '—' },
                  { label: 'Email',        val: profile?.email       || '—' },
                  { label: 'Phone',        val: profile?.phone       || 'Not set' },
                  { label: 'Department',   val: profile?.department  || 'Not set' },
                  { label: 'Member Since', val: joinDate },
                ].map((f, i) => (
                  <div key={f.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '9px 0',
                    borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    gap: 12,
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>{f.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.80)', fontSize: 12.5, fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{f.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.14 }}>
          <div style={{ ...CARD, padding: '22px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(201,136,58,0.10)', border: '1px solid rgba(201,136,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="fas fa-history" style={{ color: OG, fontSize: 11 }} />
              </span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>Recent Activity</span>
            </div>
            <div>
              {activity.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < activity.length - 1 ? 14 : 0, position: 'relative' }}>
                  {i < activity.length - 1 && (
                    <div style={{ position: 'absolute', left: 14, top: 28, bottom: 0, width: 1, background: 'rgba(201,136,58,0.13)' }} />
                  )}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(201,136,58,0.07)', border: '1px solid rgba(201,136,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={item.icon} style={{ color: OG, fontSize: 10 }} />
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{item.action}</div>
                    <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, marginTop: 3 }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Quick actions ─────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.19 }}>
        <div style={{ ...CARD, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', marginRight: 4, flexShrink: 0 }}>Quick Actions</span>
          {[
            { to: '/erp/profile/edit',     icon: 'fas fa-edit',  label: 'Edit Profile' },
            { to: '/erp/settings/account', icon: 'fas fa-key',   label: 'Change Password' },
            { to: '/erp/settings/privacy', icon: 'fas fa-lock',  label: 'Privacy' },
          ].map(a => (
            <Link
              key={a.to}
              to={a.to}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(201,136,58,0.07)', border: '1px solid rgba(201,136,58,0.16)',
                color: OG, fontSize: 12.5, fontWeight: 600,
                padding: '7px 14px', borderRadius: 9, textDecoration: 'none',
                transition: 'background 0.18s, transform 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,136,58,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,136,58,0.07)'; e.currentTarget.style.transform = ''; }}
            >
              <i className={a.icon} style={{ fontSize: 11 }} />
              {a.label}
            </Link>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
