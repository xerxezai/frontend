import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { rbacApi } from './rbacApi';

interface ModuleOption { name: string; display_name: string }

const MyAccessRequest = ({ defaultModule = '', onClose }: { defaultModule?: string; onClose?: () => void }) => {
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [selectedModule, setModule] = useState(defaultModule);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    rbacApi.getModules()
      .then((res: any) => setModules(Array.isArray(res) ? res : []))
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (!selectedModule || !reason.trim()) return;
    setLoading(true);
    try {
      await rbacApi.requestAccess({ module_name: selectedModule, reason });
      setSuccess(true);
      toast.success('Access request submitted');
      setTimeout(() => onClose?.(), 1800);
    } catch (e: any) {
      toast.error(e.message || 'Could not submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Request Module Access</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>
        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <i className="fas fa-check-circle" style={{ fontSize: 40, color: '#22c55e', marginBottom: 12, display: 'block' }} />
            <p style={{ fontWeight: 600 }}>Request submitted! Admin will review shortly.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>
                Module *
              </label>
              <select
                value={selectedModule}
                onChange={e => setModule(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Select module...</option>
                {modules.map(m => <option key={m.name} value={m.name}>{m.display_name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: 6 }}>
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Why do you need access to this module?"
                rows={4}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={submit}
              disabled={loading || !selectedModule || !reason}
              style={{
                width: '100%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none',
                padding: '13px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                cursor: loading ? 'wait' : 'pointer', opacity: (!selectedModule || !reason) ? 0.6 : 1,
              }}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccessRequest;
