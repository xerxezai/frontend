import { useNavigate } from 'react-router-dom';

interface Props {
  fullName: string;
  email: string;
  userId: number;
  onClose: () => void;
}

/** Shown right after a new ERP user account is created (Super Admin's User Management or
 * Company Admin's My Company Users) — offers to jump straight to Employees with an Add
 * Employee form pre-filled and the new account pre-selected in "Link User Account", since
 * a user with no linked Employee record can't clock in, apply for leave, or view payslips. */
export default function CreateEmployeeProfilePrompt({ fullName, email, userId, onClose }: Props) {
  const navigate = useNavigate();
  const firstName = fullName.split(' ')[0] || fullName;

  const yes = () => {
    navigate('/erp/hr/employees', { state: { prefillEmployee: { full_name: fullName, email, user: userId } } });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'DM Sans',sans-serif", textAlign: 'center' }}
      >
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <i className="fas fa-check" style={{ color: '#10b981', fontSize: 20 }} />
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: '#1a1208' }}>User created successfully!</h3>
        <p style={{ margin: '0 0 22px', fontSize: 14, color: '#6B6B6B', lineHeight: 1.5 }}>
          Would you like to create an employee profile for <strong>{firstName}</strong> now?
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '11px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13.5, color: '#6B6B6B' }}
          >
            Skip for now
          </button>
          <button
            onClick={yes}
            style={{ flex: 1.4, background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13.5 }}
          >
            Yes, Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}
