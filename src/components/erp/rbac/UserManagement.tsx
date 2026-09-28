import { useState, useEffect, useCallback, useMemo, type CSSProperties, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';
import { rbacApi } from './rbacApi';
import CreateUserModal from './CreateUserModal';
import { useAccess } from '../../../context/AccessContext';

/** Decodes the JWT access token and returns the logged-in user's id, if any —
 * same decode approach as isSuperUser()/isAdminUser() elsewhere in the ERP. */
function getCurrentUserId(): number | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const payload = JSON.parse(atob(JSON.parse(stored).access.split('.')[1]));
      return payload.user_id ?? null;
    }
  } catch { /* fall through */ }
  return null;
}

const FF = "'DM Sans',sans-serif";
const OG = '#D93522';
const BORDER = 'rgba(0,0,0,0.08)';

// Matches ERPTable.tsx's TH/TD exactly, so the bespoke Users table (needed for the
// checkbox column ERPTable doesn't support) still looks identical to every other list.
const TH: CSSProperties = {
  fontSize: 10, letterSpacing: '0.6px', padding: '10px 10px',
  textTransform: 'uppercase', fontWeight: 700, color: '#6B6B6B',
  borderBottom: '1px solid rgba(0,0,0,0.07)', whiteSpace: 'nowrap',
  overflow: 'hidden', textOverflow: 'ellipsis',
};
const TD: CSSProperties = {
  padding: '9px 10px', verticalAlign: 'middle', color: '#333',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  fontSize: 12.5,
};

const ROLE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  super_admin:   { label: 'Super Admin',   bg: '#fee2e2', color: '#991b1b' },
  company_admin: { label: 'Company Admin', bg: '#fde68a', color: '#92400e' },
  module_admin:  { label: 'Module Admin',  bg: '#dbeafe', color: '#1d4ed8' },
  regular_user:  { label: 'Regular User',  bg: '#d1fae5', color: '#065f46' },
  read_only:     { label: 'Read Only',     bg: '#f1f5f9', color: '#64748b' },
  no_access:     { label: 'No Access',     bg: '#f3f4f6', color: '#9ca3af' },
};

// Assignable per-module roles — matches apps.rbac.models.UserModuleAccess.ROLE_CHOICES minus
// 'super_admin'/'company_admin' (those aren't granted per-module through this screen) plus a
// synthetic 'no_access' option: the backend has no such stored role, so picking it in the Edit
// modal calls revokeAccess() (soft-deletes the UserModuleAccess row) instead of grantAccess().
const ASSIGNABLE_ROLES: { value: string; label: string }[] = [
  { value: 'module_admin', label: 'Module Admin' },
  { value: 'regular_user', label: 'Regular User' },
  { value: 'read_only', label: 'Read Only' },
];
const EDIT_ROLES: { value: string; label: string }[] = [...ASSIGNABLE_ROLES, { value: 'no_access', label: 'No Access (remove)' }];

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
      const payload = { role, modules: role === 'super_admin' ? ALL_MODULES.map(m => m.name) : modules };
      await rbacApi.updateUser(user.id, payload);
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
          <div style={{ background: 'rgba(217,53,34,0.08)', border: '1px solid rgba(217,53,34,0.25)', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, color: '#8B5E1A' }}>
            Super Admin has access to all modules automatically.
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '10px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#D93522,#D93522)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Module Access tab — flattened User × Module × Role rows ────────────────────────────────
interface AccessRow {
  userId: number; userName: string; userEmail: string;
  moduleName: string; moduleDisplay: string; role: string;
}

function EditModuleRoleModal({ row, onClose, onSaved }: { row: AccessRow; onClose: () => void; onSaved: () => void }) {
  const [role, setRole] = useState(row.role);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (role === 'no_access') {
        await rbacApi.revokeAccess(row.userId, { module_name: row.moduleName });
        toast.success('Access removed');
      } else {
        await rbacApi.grantAccess(row.userId, { module_name: row.moduleName, role });
        toast.success('Role updated');
      }
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: FF }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Edit Role</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>User</label>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8F7F4', fontSize: 13.5, color: '#1A1A1A' }}>{row.userName} <span style={{ color: '#9ca3af' }}>({row.userEmail})</span></div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Module</label>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8F7F4', fontSize: 13.5, color: '#1A1A1A' }}>{row.moduleDisplay}</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
            {EDIT_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '10px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#D93522,#D93522)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddAccessModal({ users, onClose, onSaved }: { users: any[]; onClose: () => void; onSaved: () => void }) {
  const [userId, setUserId] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [role, setRole] = useState('regular_user');
  const [saving, setSaving] = useState(false);

  const eligibleUsers = users.filter(u => !u.is_superuser);

  const save = async () => {
    if (!userId || !moduleName) { toast.error('Select a user and a module.'); return; }
    setSaving(true);
    try {
      await rbacApi.grantAccess(Number(userId), { module_name: moduleName, role });
      toast.success('Access granted');
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Could not grant access'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: FF }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Add Module Access</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>User</label>
          <select value={userId} onChange={e => setUserId(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
            <option value="">— Select user —</option>
            {eligibleUsers.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Module</label>
          <select value={moduleName} onChange={e => setModuleName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
            <option value="">— Select module —</option>
            {ALL_MODULES.map(m => <option key={m.name} value={m.name}>{m.label}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
            {ASSIGNABLE_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '10px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, background: 'linear-gradient(145deg,#D93522,#D93522)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Grant Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccessConfirm({ row, busy, onCancel, onConfirm }: { row: AccessRow; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: '#1A1A1A' }}>Remove module access?</h6>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>
          <strong style={{ color: '#1A1A1A' }}>{row.userName}</strong> will lose <strong style={{ color: '#1A1A1A' }}>{row.moduleDisplay}</strong> access immediately.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px', cursor: busy ? 'wait' : 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>
            {busy ? 'Removing…' : 'Remove Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeactivateConfirm({ userName, onCancel, onConfirm }: { userName: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 380, width: '100%', borderTop: '2px solid #f59e0b', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: '#1A1A1A' }}>Deactivate {userName}?</h6>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>They will lose access to the ERP immediately, but stay in this list as Inactive. This can be reversed by reactivating them later.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.32)', borderRadius: 9, padding: '9px', cursor: 'pointer', color: '#92400e', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>Deactivate</button>
        </div>
      </div>
    </div>
  );
}

function PermanentDeleteConfirm({ userName, onCancel, onConfirm, busy }: { userName: string; onCancel: () => void; onConfirm: () => void; busy?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: '#1A1A1A' }}>Permanently delete {userName}?</h6>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>
          This <strong>cannot be undone</strong>. Their account is removed entirely, along with anything only they created (e.g. blog posts, time entries).
          If they own protected records (QHSE incidents, risk register entries, project management roles), this will be blocked until those are reassigned — use Deactivate instead in that case.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy} style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: '9px', cursor: busy ? 'wait' : 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>
            {busy ? 'Deleting…' : 'Permanently Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { isSuperAdmin } = useAccess();
  const [tab, setTab] = useState<'users' | 'requests' | 'access'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [editingAccess, setEditingAccess] = useState<AccessRow | null>(null);
  const [addingAccess, setAddingAccess] = useState(false);
  const [deletingAccess, setDeletingAccess] = useState<AccessRow | null>(null);
  const [deletingAccessBusy, setDeletingAccessBusy] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deactivating, setDeactivating] = useState<any>(null);
  const [permanentDeleting, setPermanentDeleting] = useState<any>(null);
  const [permanentDeleteBusy, setPermanentDeleteBusy] = useState(false);
  const [busyRequestId, setBusyRequestId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeactivating, setBulkDeactivating] = useState(false);
  const [bulkPermanentDeleting, setBulkPermanentDeleting] = useState(false);
  const currentUserId = useMemo(() => getCurrentUserId(), []);

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

  // Flattened User × Module × Role rows for the Module Access tab — one row per active
  // UserModuleAccess grant, excluding Super Admins (whose access is implicit/global, not a
  // grantable row) and excluding is_active=false rows (already-revoked grants the backend
  // keeps around for audit history but that no longer mean anything for access purposes).
  const accessRows: AccessRow[] = useMemo(() => users.flatMap(u => u.is_superuser ? [] :
    (u.module_access || [])
      .filter((a: any) => a.is_active !== false)
      .map((a: any) => ({ userId: u.id, userName: u.full_name, userEmail: u.email, moduleName: a.module_name, moduleDisplay: a.module_display, role: a.role }))
  ), [users]);

  const confirmDeleteAccess = async () => {
    if (!deletingAccess) return;
    setDeletingAccessBusy(true);
    try {
      await rbacApi.revokeAccess(deletingAccess.userId, { module_name: deletingAccess.moduleName });
      toast.success('Access removed');
      setDeletingAccess(null);
      loadUsers();
    } catch (e: any) { toast.error(e.message || 'Could not remove access'); }
    finally { setDeletingAccessBusy(false); }
  };

  const confirmDeactivate = async () => {
    if (!deactivating) return;
    try {
      await rbacApi.deactivateUser(deactivating.id);
      toast.success('User deactivated');
      setDeactivating(null);
      loadUsers();
    } catch (e: any) { toast.error(e.message || 'Could not deactivate user'); }
  };

  const confirmPermanentDelete = async () => {
    if (!permanentDeleting) return;
    setPermanentDeleteBusy(true);
    try {
      await rbacApi.permanentDeleteUser(permanentDeleting.id);
      toast.success('User permanently deleted');
      setPermanentDeleting(null);
      loadUsers();
    } catch (e: any) { toast.error(e.message || 'Could not delete user'); }
    finally { setPermanentDeleteBusy(false); }
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

  // Note: the User object has no top-level `role` field (only `is_superuser` and
  // per-module `module_access[].role`), so Super Admin protection is keyed off
  // `is_superuser` rather than `u.role === 'super_admin'`.
  const isSelectable = useCallback((u: any) => !u.is_superuser && u.id !== currentUserId, [currentUserId]);
  const selectableUsers = useMemo(() => users.filter(isSelectable), [users, isSelectable]);
  const allSelected = selectableUsers.length > 0 && selectableUsers.every(u => selectedIds.includes(u.id));

  const handleBulkDeactivate = async () => {
    if (!window.confirm(`Deactivate ${selectedIds.length} user${selectedIds.length === 1 ? '' : 's'}? They'll lose ERP access but stay in this list as Inactive.`)) return;
    setBulkDeactivating(true);
    try {
      for (const id of selectedIds) {
        await rbacApi.deactivateUser(id);
      }
      toast.success(`${selectedIds.length} user${selectedIds.length === 1 ? '' : 's'} deactivated`);
    } catch (e: any) {
      toast.error(e.message || 'Some users could not be deactivated');
    } finally {
      setBulkDeactivating(false);
      setSelectedIds([]);
      loadUsers();
    }
  };

  const handleBulkPermanentDelete = async () => {
    if (!window.confirm(`Permanently delete ${selectedIds.length} user${selectedIds.length === 1 ? '' : 's'}? This cannot be undone.`)) return;
    setBulkPermanentDeleting(true);
    let failed = 0;
    try {
      for (const id of selectedIds) {
        try { await rbacApi.permanentDeleteUser(id); }
        catch { failed += 1; }
      }
      const succeeded = selectedIds.length - failed;
      if (succeeded > 0) toast.success(`${succeeded} user${succeeded === 1 ? '' : 's'} permanently deleted`);
      if (failed > 0) toast.error(`${failed} user${failed === 1 ? '' : 's'} could not be deleted (they may own protected records) — deactivate them instead`);
    } finally {
      setBulkPermanentDeleting(false);
      setSelectedIds([]);
      loadUsers();
    }
  };

  const userCols: { key: string; label: string; width?: number; render?: (row: any) => ReactNode }[] = [
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
        {(isSuperAdmin ? (['users', 'requests', 'access'] as const) : (['users', 'requests'] as const)).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
            color: tab === t ? OG : '#6B6B6B', borderBottom: tab === t ? `2px solid ${OG}` : '2px solid transparent', marginBottom: -1,
          }}>
            {t === 'users' ? 'Users' : t === 'requests' ? `Access Requests${pendingCount ? ` (${pendingCount} pending)` : ''}` : 'Module Access'}
          </button>
        ))}
      </div>

      {tab === 'users' ? (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#1a1a2e', fontSize: 15 }}>Users</h5>
            <button
              onClick={() => setShowCreate(true)}
              style={{ background: 'linear-gradient(145deg,#D93522 0%,#D93522 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '7px 14px', fontFamily: FF, fontWeight: 700, fontSize: 12, boxShadow: '0 3px 0 rgba(150,95,30,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <i className="fas fa-plus" style={{ fontSize: 10 }}></i> Add New
            </button>
          </div>

          {selectedIds.length > 0 && (
            <div style={{
              background: '#fff3e0', border: '1px solid #D93522', borderRadius: 8,
              padding: '12px 20px', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
            }}>
              <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 13, color: '#1A1A1A' }}>
                {selectedIds.length} user{selectedIds.length === 1 ? '' : 's'} selected
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={handleBulkDeactivate}
                  disabled={bulkDeactivating || bulkPermanentDeleting}
                  style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: bulkDeactivating ? 'wait' : 'pointer', fontFamily: FF, fontWeight: 700, opacity: bulkDeactivating || bulkPermanentDeleting ? 0.7 : 1 }}
                >
                  {bulkDeactivating ? 'Deactivating…' : 'Deactivate Selected'}
                </button>
                <button
                  onClick={handleBulkPermanentDelete}
                  disabled={bulkDeactivating || bulkPermanentDeleting}
                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: bulkPermanentDeleting ? 'wait' : 'pointer', fontFamily: FF, fontWeight: 700, opacity: bulkDeactivating || bulkPermanentDeleting ? 0.7 : 1 }}
                >
                  {bulkPermanentDeleting ? 'Deleting…' : 'Delete Permanently'}
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  disabled={bulkDeactivating || bulkPermanentDeleting}
                  style={{ background: '#6b7280', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: (bulkDeactivating || bulkPermanentDeleting) ? 'not-allowed' : 'pointer', fontFamily: FF, fontWeight: 700, opacity: bulkDeactivating || bulkPermanentDeleting ? 0.7 : 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {usersLoading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
              <div className="spinner-border" style={{ color: OG }} role="status"></div>
              <p>Loading Users…</p>
            </div>
          ) : users.length === 0 ? (
            <div className="erp-table-card" style={{
              textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(217,53,34,0.06)',
            }}>
              <p className="mb-0" style={{ color: '#6B6B6B', fontFamily: FF, fontSize: 13.5, fontWeight: 600 }}>No users found.</p>
            </div>
          ) : (
            <div className="erp-table-card" style={{
              background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(217,53,34,0.06)',
              overflowX: 'auto',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#fafaf8' }}>
                    <th style={{ ...TH, width: 44, minWidth: 44, textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(users.filter(isSelectable).map(u => u.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        aria-label="Select all users"
                        style={{ width: 18, height: 18, cursor: 'pointer', accentColor: OG }}
                      />
                    </th>
                    {userCols.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
                    <th style={{ ...TH, width: 110, minWidth: 110 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const selectable = isSelectable(u);
                    const selected = selectedIds.includes(u.id);
                    const disabledReason = u.is_superuser ? 'Cannot delete Super Admin' : u.id === currentUserId ? 'You cannot delete yourself' : undefined;
                    return (
                      <tr key={u.id} style={{ background: selected ? 'rgba(217,53,34,0.08)' : undefined }}>
                        <td style={{ ...TD, textAlign: 'center', overflow: 'visible' }}>
                          <label
                            title={disabledReason}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: selectable ? 'pointer' : 'not-allowed' }}
                          >
                            <input
                              type="checkbox"
                              disabled={!selectable}
                              checked={selected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds([...selectedIds, u.id]);
                                } else {
                                  setSelectedIds(selectedIds.filter(id => id !== u.id));
                                }
                              }}
                              aria-label={`Select ${u.full_name}`}
                              style={{ width: 18, height: 18, cursor: selectable ? 'pointer' : 'not-allowed', accentColor: OG }}
                            />
                          </label>
                        </td>
                        {userCols.map(c => (
                          <td key={c.key} style={TD}>{c.render ? c.render(u) : (u as any)[c.key] ?? '—'}</td>
                        ))}
                        <td style={{ ...TD, width: 110 }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button title="Edit" onClick={() => setEditing(u)}
                              style={{ background: 'rgba(217,53,34,0.08)', color: OG, border: '1px solid rgba(217,53,34,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}>
                              <i className="fas fa-pen" style={{ fontSize: 10 }}></i>
                            </button>
                            <button title="Deactivate — disables access but keeps them in this list" onClick={() => setDeactivating(u)}
                              style={{ background: 'rgba(245,158,11,0.10)', color: '#92400e', border: '1px solid rgba(245,158,11,0.28)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}>
                              <i className="fas fa-user-slash" style={{ fontSize: 10 }}></i>
                            </button>
                            <button title={disabledReason || 'Permanently delete — cannot be undone'} disabled={!selectable} onClick={() => setPermanentDeleting(u)}
                              style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: selectable ? 'pointer' : 'not-allowed', flexShrink: 0, opacity: selectable ? 1 : 0.4 }}>
                              <i className="fas fa-trash" style={{ fontSize: 10 }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : tab === 'access' && isSuperAdmin ? (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#1a1a2e', fontSize: 15 }}>Module Access</h5>
            <button
              onClick={() => setAddingAccess(true)}
              style={{ background: 'linear-gradient(145deg,#D93522 0%,#D93522 100%)', color: '#fff', border: 'none', borderRadius: 9, padding: '7px 14px', fontFamily: FF, fontWeight: 700, fontSize: 12, boxShadow: '0 3px 0 rgba(150,95,30,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <i className="fas fa-plus" style={{ fontSize: 10 }}></i> Add Access
            </button>
          </div>

          {usersLoading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
              <div className="spinner-border" style={{ color: OG }} role="status"></div>
              <p>Loading Module Access…</p>
            </div>
          ) : accessRows.length === 0 ? (
            <div className="erp-table-card" style={{
              textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(217,53,34,0.06)',
            }}>
              <p className="mb-0" style={{ color: '#6B6B6B', fontFamily: FF, fontSize: 13.5, fontWeight: 600 }}>No module access grants yet. Add one above.</p>
            </div>
          ) : (
            <div className="erp-table-card" style={{
              background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(217,53,34,0.06)',
              overflowX: 'auto',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#fafaf8' }}>
                    <th style={TH}>User</th>
                    <th style={TH}>Email</th>
                    <th style={TH}>Module</th>
                    <th style={TH}>Current Role</th>
                    <th style={{ ...TH, width: 90, minWidth: 90 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accessRows.map(row => (
                    <tr key={`${row.userId}-${row.moduleName}`}>
                      <td style={TD}>{row.userName}</td>
                      <td style={TD}>{row.userEmail}</td>
                      <td style={TD}>{row.moduleDisplay}</td>
                      <td style={TD}><Badge map={ROLE_BADGE} value={row.role} /></td>
                      <td style={{ ...TD, width: 90 }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button title="Edit role" onClick={() => setEditingAccess(row)}
                            style={{ background: 'rgba(217,53,34,0.08)', color: OG, border: '1px solid rgba(217,53,34,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}>
                            <i className="fas fa-pen" style={{ fontSize: 10 }}></i>
                          </button>
                          <button title="Remove access" onClick={() => setDeletingAccess(row)}
                            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}>
                            <i className="fas fa-trash" style={{ fontSize: 10 }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <ERPTable title="Access Requests" columns={requestCols} data={requests} loading={requestsLoading} error={null} isAdmin={false} />
      )}

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onSuccess={loadUsers} />}
      {editing && <EditAccessModal user={editing} onClose={() => setEditing(null)} onSaved={loadUsers} />}
      {editingAccess && <EditModuleRoleModal row={editingAccess} onClose={() => setEditingAccess(null)} onSaved={loadUsers} />}
      {addingAccess && <AddAccessModal users={users} onClose={() => setAddingAccess(false)} onSaved={loadUsers} />}
      {deletingAccess && (
        <DeleteAccessConfirm row={deletingAccess} busy={deletingAccessBusy} onCancel={() => setDeletingAccess(null)} onConfirm={confirmDeleteAccess} />
      )}
      {deactivating && <DeactivateConfirm userName={deactivating.full_name} onCancel={() => setDeactivating(null)} onConfirm={confirmDeactivate} />}
      {permanentDeleting && (
        <PermanentDeleteConfirm
          userName={permanentDeleting.full_name}
          busy={permanentDeleteBusy}
          onCancel={() => setPermanentDeleting(null)}
          onConfirm={confirmPermanentDelete}
        />
      )}
    </div>
  );
}
