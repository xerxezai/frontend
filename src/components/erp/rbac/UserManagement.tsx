import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';
import { rbacApi } from './rbacApi';
import CreateUserModal from './CreateUserModal';

const FF = "'DM Sans',sans-serif";
const OG = '#C9883A';
const BORDER = 'rgba(0,0,0,0.08)';

const ROLE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  super_admin:  { label: 'Super Admin',  bg: '#fee2e2', color: '#991b1b' },
  module_admin: { label: 'Module Admin', bg: '#dbeafe', color: '#1d4ed8' },
  regular_user: { label: 'Regular User', bg: '#d1fae5', color: '#065f46' },
  read_only:    { label: 'Read Only',    bg: '#f1f5f9', color: '#64748b' },
};

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  pending:  { label: 'Pending',  bg: '#fef3c7', color: '#92400e' },
  approved: { label: 'Approved', bg: '#d1fae5', color: '#065f46' },
  rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
};

const ALL_MODULES = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'crm', label: 'CRM' },
  { name: 'sales', label: 'Sales' },
  { name: 'procurement', label: 'Procurement' },
  { name: 'logistics', label: 'Logistics' },
  { name: 'accounting', label: 'Accounting' },
  { name: 'mlm', label: 'MLM' },
  { name: 'hr', label: 'HR Overview' },
];

const Badge = ({ map, value }: { map: Record<string, { label: string; bg: string; color: string }>; value: string }) => {
  const m = map[value] ?? { label: value, bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF, whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  );
};

function EditAccessModal({ user, onClose, onSaved }: { user: any; onClose: () => void; onSaved: () => void }) {
  const currentRole = user.module_access?.[0]?.role || 'regular_user';
  const [role, setRole] = useState(currentRole);
  const [modules, setModules] = useState<string[]>((user.module_access || []).map((a: any) => a.module_name));
  const [saving, setSaving] = useState(false);

  const toggle = (name: string) => setModules(prev => prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]);

  const save = async () => {
    if (role !== 'super_admin' && modules.length === 0) { toast.error('Assign at least one module.'); return; }
    setSaving(true);
    try {
      await rbacApi.updateUser(user.id, { role, modules: role === 'super_admin' ? ALL_MODULES.map(m => m.name) : modules });
      toast.success('Access updated');
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: FF }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Edit Access — {user.full_name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
            {Object.entries(ROLE_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        {role !== 'super_admin' ? (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Modules</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 14, background: '#f8f7f4', borderRadius: 8 }}>
              {ALL_MODULES.map(m => (
                <label key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                  <input type="checkbox" checked={modules.includes(m.name)} onChange={() => toggle(m.name)} style={{ accentColor: OG }} />
                  {m.label}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(201,136,58,0.08)', border: '1px solid rgba(201,136,58,0.25)', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, color: '#8B5E1A' }}>
            Super Admin has access to all modules automatically.
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '10px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeactivateConfirm({ userName, onCancel, onConfirm }: { userName: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 380, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: '#1A1A1A' }}>Deactivate {userName}?</h6>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>They will lose access to the ERP immediately. This can be reversed by reactivating them later.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px', cursor: 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>Deactivate</button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [tab, setTab] = useState<'users' | 'requests'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deactivating, setDeactivating] = useState<any>(null);
  const [busyRequestId, setBusyRequestId] = useState<number | null>(null);

  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    rbacApi.getUsers()
      .then((res: any) => setUsers(Array.isArray(res) ? res : []))
      .catch((e: any) => toast.error(e.message || 'Could not load users'))
      .finally(() => setUsersLoading(false));
  }, []);

  const loadRequests = useCallback(() => {
    setRequestsLoading(true);
    rbacApi.getAccessRequests()
      .then((res: any) => setRequests(Array.isArray(res) ? res : []))
      .catch((e: any) => toast.error(e.message || 'Could not load access requests'))
      .finally(() => setRequestsLoading(false));
  }, []);

  useEffect(() => { loadUsers(); loadRequests(); }, [loadUsers, loadRequests]);

  const pendingCount = useMemo(() => requests.filter(r => r.status === 'pending').length, [requests]);

  const confirmDeactivate = async () => {
    if (!deactivating) return;
    try {
      await rbacApi.deactivateUser(deactivating.id);
      toast.success('User deactivated');
      setDeactivating(null);
      loadUsers();
    } catch (e: any) { toast.error(e.message || 'Could not deactivate user'); }
  };

  const actOnRequest = async (id: number, action: 'approve' | 'reject') => {
    setBusyRequestId(id);
    try {
      await (action === 'approve' ? rbacApi.approveRequest(id) : rbacApi.rejectRequest(id));
      toast.success(`Request ${action}d`);
      loadRequests();
    } catch (e: any) { toast.error(e.message || `Could not ${action} request`); }
    finally { setBusyRequestId(null); }
  };

  const userCols = [
    { key: 'full_name', label: 'Name', width: 160 },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email', width: 180 },
    {
      key: 'module_access', label: 'Role',
      render: (r: any) => r.is_superuser
        ? <Badge map={ROLE_BADGE} value="super_admin" />
        : r.module_access?.[0] ? <Badge map={ROLE_BADGE} value={r.module_access[0].role} /> : <span style={{ color: '#9ca3af', fontSize: 12 }}>No access</span>,
    },
    {
      key: 'modules', label: 'Modules', width: 220,
      render: (r: any) => r.is_superuser ? (
        <span style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B' }}>All modules</span>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(r.module_access || []).length === 0
            ? <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
            : r.module_access.map((a: any) => (
              <span key={a.module_name} style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: '#F0EBE4', color: '#6B6B6B' }}>
                {a.module_display}
              </span>
            ))}
        </div>
      ),
    },
    { key: 'is_active', label: 'Status', render: (r: any) => <Badge map={{ true: { label: 'Active', bg: '#d1fae5', color: '#065f46' }, false: { label: 'Inactive', bg: '#f1f5f9', color: '#64748b' } }} value={String(r.is_active)} /> },
  ];

  const requestCols = [
    { key: 'user_name', label: 'User' },
    { key: 'module_name', label: 'Module' },
    { key: 'reason', label: 'Reason', width: 220 },
    { key: 'status', label: 'Status', render: (r: any) => <Badge map={STATUS_BADGE} value={r.status} /> },
    { key: 'created_at', label: 'Requested', render: (r: any) => new Date(r.created_at).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions',
      render: (r: any) => r.status !== 'pending' ? (
        <span style={{ fontFamily: FF, fontSize: 11.5, color: '#9ca3af' }}>{r.reviewed_by_name ? `by ${r.reviewed_by_name}` : '—'}</span>
      ) : (
        <div style={{ display: 'flex', gap: 5 }}>
          <button title="Approve" disabled={busyRequestId === r.id} onClick={() => actOnRequest(r.id, 'approve')}
            style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, borderRadius: 6, cursor: busyRequestId === r.id ? 'wait' : 'pointer' }}>
            <i className="fas fa-check" style={{ fontSize: 10 }} />
          </button>
          <button title="Reject" disabled={busyRequestId === r.id} onClick={() => actOnRequest(r.id, 'reject')}
            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, borderRadius: 6, cursor: busyRequestId === r.id ? 'wait' : 'pointer' }}>
            <i className="fas fa-times" style={{ fontSize: 10 }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <h4 style={{ fontFamily: FF, fontWeight: 800, fontSize: 19, color: '#1A1A1A', margin: 0 }}>User Management</h4>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
        {(['users', 'requests'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
            color: tab === t ? OG : '#6B6B6B', borderBottom: tab === t ? `2px solid ${OG}` : '2px solid transparent', marginBottom: -1,
          }}>
            {t === 'users' ? 'Users' : `Access Requests${pendingCount ? ` (${pendingCount} pending)` : ''}`}
          </button>
        ))}
      </div>

      {tab === 'users' ? (
        <ERPTable
          title="Users" columns={userCols} data={users} loading={usersLoading} error={null} isAdmin
          onAdd={() => setShowCreate(true)}
          onEdit={r => setEditing(r)}
          onDelete={id => setDeactivating(users.find(u => u.id === id))}
        />
      ) : (
        <ERPTable title="Access Requests" columns={requestCols} data={requests} loading={requestsLoading} error={null} isAdmin={false} />
      )}

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onSuccess={loadUsers} />}
      {editing && <EditAccessModal user={editing} onClose={() => setEditing(null)} onSaved={loadUsers} />}
      {deactivating && <DeactivateConfirm userName={deactivating.full_name} onCancel={() => setDeactivating(null)} onConfirm={confirmDeactivate} />}
    </div>
  );
}
