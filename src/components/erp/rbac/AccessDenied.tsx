import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MyAccessRequest from './MyAccessRequest';

const AccessDenied = ({ module = '' }: { module?: string }) => {
  const navigate = useNavigate();
  const [showRequest, setShowRequest] = useState(false);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: 40, textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,136,58,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <i className="fas fa-lock" style={{ fontSize: 32, color: '#C9883A' }} />
      </div>
      <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 12 }}>
        Access Denied
      </h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", color: '#6B6B6B', fontSize: 15, maxWidth: 400, marginBottom: 28 }}>
        You don't have permission to access this module. Contact your administrator or request access below.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setShowRequest(true)}
          style={{
            background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14,
            fontFamily: "'DM Sans',sans-serif",
          }}>
          Request Access
        </button>
        <button
          onClick={() => navigate('/erp/dashboard')}
          style={{
            background: 'transparent', color: '#1A1A1A', border: '1px solid rgba(0,0,0,0.15)',
            padding: '12px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14,
            fontFamily: "'DM Sans',sans-serif",
          }}>
          Go to Dashboard
        </button>
      </div>
      {showRequest && (
        <MyAccessRequest defaultModule={module} onClose={() => setShowRequest(false)} />
      )}
    </div>
  );
};

export default AccessDenied;
