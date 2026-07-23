import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { AlertTriangle, XCircle, Plus, Pencil, UserX, ShieldOff } from 'lucide-react';
import { useAccess } from '../../../context/AccessContext';
import { companiesApi } from './companiesApi';
import MyCompanyAddUserModal from './MyCompanyAddUserModal';
import MyCompanyEditUserModal from './MyCompanyEditUserModal';

const FF = "'DM Sans',sans-serif";
const OG = '#C9883A';
const DARK = '#1A1A1A';
const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const ROLE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  company_admin: { label: 'Company Admin', bg: '#fee2e2', color: '#991b1b' },
  module_admin:  { label: 'Module Admin',  bg: '#dbeafe', color: '#1d4ed8' },
  regular_user:  { label: 'Regular User',  bg: '#d1fae5', color: '#065f46' },
  read_only:     { label: 'Read Only',     bg: '#f1f5f9', color: '#64748b' },
};
const MODULE_LABEL: Record<string, string> = {
  dashboard: 'Dashboard', crm: 'CRM', sales: 'Sales', procurement: 'Procurement',
  logistics: 'Logistics', accounting: 'Accounting', mlm: 'MLM', hr: 'HR Overview',
};

const Badge = ({ role }: { role: string }) => {
  const m = ROLE_BADGE[role] ?? { label: role, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  );
};

const limitColor = (pct: number) => (pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981');

export default function MyCompanyUsers() {
  const { isCompanyAdmin, isLoading: accessLoading } = useAccess();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deactivating, setDeactivating] = useState<any>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([companiesApi.getMyCompanyUsers(), companiesApi.getMyCompanyStats()])
      .then(([u, s]: any[]) => { setUsers(Array.isArray(u) ? u : []); setStats(s); })
      .catch((e: any) => { setError(e.message || 'Could not load your company users'); toast.error(e.message || 'Could not load your company users'); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (isCompanyAdmin) load(); }, [isCompanyAdmin, load]);

  const confirmDeactivate = async () => {
    if (!deactivating) return;
    try {
      await companiesApi.deactivateMyCompanyUser(deactivating.user_id);
      toast.success('User deactivated');
      setDeactivating(null);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Could not deactivate user');
    }
  };

  if (accessLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
        <div className="spinner-border" style={{ color: OG }} role="status"></div>
      </div>
    );
  }
  if (!isCompanyAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: `1px solid ${BORDER}`, borderTop: `3px solid #ef4444` }}>
        <ShieldOff size={40} color="#ef4444" style={{ margin: '0 auto 14px', display: 'block' }} />
        <p style={{ color: MUTED, fontFamily: FF, fontSize: 14, fontWeight: 600, margin: 0 }}>This page is only available to Company Admins.</p>
      </div>
    );
  }

  const maxUsers = stats?.max_users ?? 0;
  const currentUsers = stats?.current_users ?? 0;
  const remaining = stats?.remaining_slots ?? Math.max(maxUsers - currentUsers, 0);
  const pct = maxUsers > 0 ? Math.min((currentUsers / maxUsers) * 100, 100) : 0;
  const atLimit = maxUsers > 0 && remaining <= 0;
  const nearLimit = !atLimit && remaining > 0 && remaining <= 2;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: DARK, margin: 0 }}>My Company Users</h4>
        <p style={{ fontFamily: FF, fontSize: 13, color: MUTED, margin: '4px 0 0' }}>
          {stats?.company_name || 'Your company'} — {currentUsers} of {maxUsers} users
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <span style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: DARK }}>{currentUsers} / {maxUsers} users</span>
          <span style={{ fontFamily: FF, fontSize: 11.5, fontWeight: 700, color: limitColor(pct) }}>{Math.round(pct)}% used</span>
        </div>
        <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: limitColor(pct), transition: 'width 300ms ease' }} />
        </div>

        {nearLimit && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 9, padding: '10px 14px' }}>
            <AlertTriangle size={15} color="#92400e" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: FF, fontSize: 12.5, color: '#92400e' }}>
              You have {remaining} user slot{remaining === 1 ? '' : 's'} remaining. Contact XERXEZ to increase your limit.
            </span>
          </div>
        )}
        {atLimit && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '10px 14px' }}>
            <XCircle size={15} color="#991b1b" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: FF, fontSize: 12.5, color: '#991b1b' }}>
              User limit reached ({currentUsers}/{maxUsers}). Contact XERXEZ at xerxez.in@gmail.com to add more users.
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button
          onClick={() => setShowAdd(true)}
          disabled={atLimit}
          title={atLimit ? 'User limit reached — contact XERXEZ to add more users' : undefined}
          style={{
            background: atLimit ? '#e5e0d8' : 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none',
            borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
            cursor: atLimit ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Plus size={13} />Add User
        </button>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
          <div className="spinner-border" style={{ color: OG }} role="status"></div>
          <p>Loading users…</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: `1px solid ${BORDER}`, borderTop: `3px solid ${OG}` }}>
          <p style={{ color: MUTED, fontFamily: FF, fontSize: 13.5, fontWeight: 600, margin: 0 }}>No users yet. Add the first one.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Name', 'Username', 'Email', 'Role', 'Modules', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => {
                  const locked = u.role === 'company_admin' || u.role === 'super_admin';
                  return (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '10px 16px', fontWeight: 700, color: DARK, whiteSpace: 'nowrap' }}>{u.full_name}</td>
                      <td style={{ padding: '10px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{u.username}</td>
                      <td style={{ padding: '10px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{u.email}</td>
                      <td style={{ padding: '10px 16px' }}><Badge role={u.role} /></td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 220 }}>
                          {(u.modules || []).length === 0
                            ? <span style={{ color: '#9ca3af', fontSize: 11.5 }}>—</span>
                            : u.modules.map((m: string) => (
                              <span key={m} style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: '#F0EBE4', color: MUTED, whiteSpace: 'nowrap' }}>
                                {MODULE_LABEL[m] || m}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: FF, background: u.is_active ? '#d1fae5' : '#f1f5f9', color: u.is_active ? '#065f46' : '#64748b' }}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button
                            title={locked ? 'Contact XERXEZ to remove admin access' : 'Edit'}
                            disabled={locked}
                            onClick={() => setEditing(u)}
                            style={{ background: 'rgba(201,136,58,0.08)', color: OG, border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.4 : 1, flexShrink: 0 }}
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            title={locked ? 'Contact XERXEZ to remove admin access' : 'Deactivate'}
                            disabled={locked}
                            onClick={() => setDeactivating(u)}
                            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.4 : 1, flexShrink: 0 }}
                          >
                            <UserX size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <MyCompanyAddUserModal
          onClose={() => setShowAdd(false)}
          onSuccess={(email) => { load(); toast.success(`User added successfully! Welcome email sent to ${email} with login credentials and attendance instructions.`); }}
        />
      )}
      {editing && (
        <MyCompanyEditUserModal
          user={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => { setEditing(null); load(); toast.success('User updated'); }}
        />
      )}
      {deactivating && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setDeactivating(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 380, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
            <h6 style={{ fontWeight: 800, marginBottom: 8, color: DARK }}>Deactivate {deactivating.full_name}?</h6>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>They will lose access immediately. This can be reversed by a XERXEZ admin.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeactivating(null)} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: 9, cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
              <button onClick={confirmDeactivate} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: 9, cursor: 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
