import { useState } from 'react';
import { useERPList, erpFetch } from '../../../../hooks/useERPApi';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444', cancelled: '#6B6B6B',
};

const Badge = ({ s }: { s: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20,
    background: `${STATUS_COLORS[s] ?? C.muted}18`, color: STATUS_COLORS[s] ?? C.muted,
    fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize',
  }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
    {s}
  </span>
);

export default function LeaveApprovalsModule() {
  const [tab, setTab] = useState<'pending' | 'history'>('pending');
  const all     = useERPList<any>('hr/leave-requests/');
  const pending = all.data.filter((r: any) => r.status === 'pending');
  const history = all.data.filter((r: any) => r.status !== 'pending');

  const [actioning, setActioning] = useState<number | null>(null);
  const [toast, setToast]         = useState('');

  const decide = async (id: number, action: 'approved' | 'rejected') => {
    setActioning(id);
    try {
      await erpFetch(`hr/leave-requests/${id}/approve/`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
      setToast(`Leave ${action} successfully`);
      await all.reload();
      setTimeout(() => setToast(''), 3000);
    } catch (e: any) {
      setToast(e.message);
    } finally {
      setActioning(null);
    }
  };

  const cols = ['Employee', 'Type', 'From', 'To', 'Days', 'Reason', 'Status'];

  return (
    <div style={{ animation: 'laFadeUp 0.45s ease both' }}>
      <style>{`@keyframes laFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: '#1a1208', color: '#fff', padding: '12px 20px', borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
          boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
          animation: 'laFadeUp 0.3s ease both',
        }}>
          <i className="fas fa-check-circle" style={{ marginRight: 8, color: C.orange }} />{toast}
        </div>
      )}

      <div style={{ marginBottom: 22 }}>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, margin: 0 }}>Leave Approvals</h4>
        <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0' }}>
          Review and action pending leave requests
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: C.white, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, width: 'fit-content' }}>
        {(['pending', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              border: 'none', borderRadius: 7, padding: '8px 20px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
              cursor: 'pointer', transition: 'background 0.18s, color 0.18s',
              background: tab === t ? C.orangeGrad : 'transparent',
              color: tab === t ? '#fff' : C.muted,
            }}>
            {t === 'pending' ? `Pending (${pending.length})` : 'History'}
          </button>
        ))}
      </div>

      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {all.loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {[...cols, tab === 'pending' ? 'Actions' : ''].filter(Boolean).map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(tab === 'pending' ? pending : history).map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td style={{ padding: '11px 16px', fontWeight: 600, color: C.dark }}>{r.employee_name}</td>
                    <td style={{ padding: '11px 16px', color: C.muted, textTransform: 'capitalize' }}>{r.type}</td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.from_date}</td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.to_date}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 600 }}>{r.days}</td>
                    <td style={{ padding: '11px 16px', color: C.muted, maxWidth: 180 }}>{r.reason || '—'}</td>
                    <td style={{ padding: '11px 16px' }}><Badge s={r.status} /></td>
                    {tab === 'pending' && (
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => decide(r.id, 'approved')}
                            disabled={actioning === r.id}
                            style={{
                              background: 'rgba(16,185,129,0.10)', color: '#10b981',
                              border: '1px solid rgba(16,185,129,0.25)', borderRadius: 7,
                              padding: '5px 12px', fontSize: 12, fontWeight: 700,
                              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 5,
                            }}>
                            {actioning === r.id ? <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} /> : <i className="fas fa-check" />}
                            Approve
                          </button>
                          <button
                            onClick={() => decide(r.id, 'rejected')}
                            disabled={actioning === r.id}
                            style={{
                              background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                              border: '1px solid rgba(239,68,68,0.22)', borderRadius: 7,
                              padding: '5px 12px', fontSize: 12, fontWeight: 700,
                              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 5,
                            }}>
                            <i className="fas fa-times" />Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {(tab === 'pending' ? pending : history).length === 0 && (
                  <tr>
                    <td colSpan={tab === 'pending' ? 8 : 7} style={{ padding: 48, textAlign: 'center', color: C.muted }}>
                      {tab === 'pending' ? 'No pending leave requests.' : 'No history yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
