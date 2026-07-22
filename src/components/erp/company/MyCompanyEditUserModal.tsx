import { useState } from 'react';
import { companiesApi } from './companiesApi';

const ROLES = [
  { value: 'module_admin', label: 'Module Admin' },
  { value: 'regular_user', label: 'Regular User' },
  { value: 'read_only', label: 'Read Only' },
];

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

interface Props {
  user: { user_id: number; full_name: string; username: string; email: string; role: string; modules: string[] };
  onClose: () => void;
  onSuccess: () => void;
}

const MyCompanyEditUserModal = ({ user, onClose, onSuccess }: Props) => {
  const [role, setRole] = useState(user.role);
  const [modules, setModules] = useState<string[]>(user.modules || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleModule = (name: string) => {
    setModules(m => m.includes(name) ? m.filter(x => x !== name) : [...m, name]);
  };

  const submit = async () => {
    if (modules.length === 0) { setError('Assign at least one module for this role'); return; }
    setLoading(true);
    setError('');
    try {
      await companiesApi.updateMyCompanyUser(user.user_id, { role, modules });
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.06em', color: '#666', marginBottom: 6,
  };
  const readOnlyStyle: React.CSSProperties = { ...inputStyle, background: '#f1f5f9', color: '#6B6B6B', cursor: 'not-allowed' };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 9999, overflow: 'auto', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Edit User — {user.full_name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Username</label>
            <input value={user.username} disabled style={readOnlyStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={user.email} disabled style={readOnlyStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Role *</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Assign Modules *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 14, background: '#f8f7f4', borderRadius: 8 }}>
            {ALL_MODULES.map(m => (
              <label key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                <input type="checkbox" checked={modules.includes(m.name)} onChange={() => toggleModule(m.name)} style={{ accentColor: '#C9883A' }} />
                {m.label}
              </label>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none',
            padding: '13px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14,
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.75 : 1,
          }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default MyCompanyEditUserModal;
