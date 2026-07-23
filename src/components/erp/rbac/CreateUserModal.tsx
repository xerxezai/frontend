import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { rbacApi } from './rbacApi';
import CreateEmployeeProfilePrompt from '../../common/CreateEmployeeProfilePrompt';

// Super Admin removed deliberately — it can no longer be granted through this form or its
// API (both the frontend and backend block it now); use the Django admin panel instead.
const ROLES = [
  { value: 'company_admin', label: 'Company Admin' },
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

const CreateUserModal = ({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) => {
  const [form, setForm] = useState({
    full_name: '', username: '', email: '', password: '', confirm_password: '',
    // Dashboard defaults to checked — it's the landing page every user sees after
    // login, so there's rarely a reason to grant a user access without it.
    company: '', role: '', modules: ['dashboard'] as string[],
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState<{ id: number; full_name: string; email: string } | null>(null);

  useEffect(() => {
    rbacApi.getCompanies()
      .then((res: any) => setCompanies(Array.isArray(res) ? res : []))
      .catch(() => setCompanies([]));
  }, []);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleModule = (name: string) => {
    set('modules', form.modules.includes(name) ? form.modules.filter(m => m !== name) : [...form.modules, name]);
  };

  const submit = async () => {
    if (!form.full_name || !form.username || !form.email || !form.password || !form.role) {
      setError('Please fill all required fields');
      return;
    }
    if (!form.company) {
      setError('Please select a company');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (form.role !== 'company_admin' && form.modules.length === 0) {
      setError('Assign at least one module for this role');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await rbacApi.createUser({
        full_name: form.full_name, username: form.username, email: form.email, password: form.password,
        role: form.role, company_id: form.company,
        modules: form.role === 'company_admin' ? ALL_MODULES.map(m => m.name) : form.modules,
      });
      toast.success(`User created successfully! Welcome email sent to ${form.email} with login credentials.`);
      onSuccess?.();
      setCreatedUser({ id: res.user_id, full_name: form.full_name, email: form.email });
    } catch (e: any) {
      setError(e.message || 'Failed to create user');
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

  if (createdUser) {
    return (
      <CreateEmployeeProfilePrompt
        fullName={createdUser.full_name} email={createdUser.email} userId={createdUser.id}
        onClose={() => { setCreatedUser(null); onClose?.(); }}
      />
    );
  }

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
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Create New User</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Full name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Username *</label>
            <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="username" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email *</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@company.com" style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Password *</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Password" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm Password *</label>
            <input type="password" value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} placeholder="Confirm password" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Company *</label>
          <select value={form.company} onChange={e => set('company', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">Select company...</option>
            {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Role *</label>
          <select value={form.role} onChange={e => set('role', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">Select role...</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        {form.role && form.role !== 'company_admin' && (
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Assign Modules *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 14, background: '#f8f7f4', borderRadius: 8 }}>
              {ALL_MODULES.map(m => (
                <label key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                  <input type="checkbox" checked={form.modules.includes(m.name)} onChange={() => toggleModule(m.name)} style={{ accentColor: '#C9883A' }} />
                  {m.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {form.role === 'company_admin' && (
          <div style={{
            background: 'rgba(201,136,58,0.08)', border: '1px solid rgba(201,136,58,0.25)', borderRadius: 8,
            padding: 12, marginBottom: 20, fontSize: 13, color: '#8B5E1A',
          }}>
            Company Admin has access to all modules within this company automatically.
          </div>
        )}

        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none',
            padding: '13px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14,
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.75 : 1,
          }}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </div>
  );
};

export default CreateUserModal;
