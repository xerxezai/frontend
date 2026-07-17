import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, MILESTONE_STATUS, StatusBadge, DelDlg } from './projectsShared';

const defMilestone = { title: '', description: '', due_date: '', completion_date: '', status: 'pending' };

function MilestoneForm({ projectId, milestone, onClose, onSaved }: { projectId: number; milestone?: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(milestone ? {
    title: milestone.title || '', description: milestone.description || '', due_date: milestone.due_date || '',
    completion_date: milestone.completion_date || '', status: milestone.status || 'pending',
  } : { ...defMilestone });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.due_date) { toast.error('Title and due date are required.'); return; }
    setSaving(true);
    try {
      const body = { ...f, completion_date: f.completion_date || null, project: projectId };
      if (milestone) await erpFetch(`project-management/milestones/${milestone.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch(`project-management/projects/${projectId}/milestones/`, { method: 'POST', body: JSON.stringify(body) });
      toast.success(milestone ? 'Milestone updated' : 'Milestone added');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{milestone ? 'Edit Milestone' : 'Add Milestone'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Title *</label><input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} style={inp} required /></div>
          <div><label style={lbl}>Description</label><textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Due Date *</label><input type="date" value={f.due_date} onChange={e => setF(p => ({ ...p, due_date: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>Completion Date</label><input type="date" value={f.completion_date} onChange={e => setF(p => ({ ...p, completion_date: e.target.value }))} style={inp} /></div>
          </div>
          <div><label style={lbl}>Status</label>
            <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
              {Object.entries(MILESTONE_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MilestoneList({ projectId, milestones, loading, onReload }: { projectId: number; milestones: any[]; loading: boolean; onReload: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  const remove = async () => {
    try { await erpFetch(`project-management/milestones/${delId}/`, { method: 'DELETE' }); toast.success('Milestone deleted'); setDelId(null); onReload(); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  if (loading) return <div className="d-flex justify-content-center py-4"><div className="spinner-border" style={{ color: '#C9883A' }} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button onClick={() => { setEditing(null); setShowForm(true); }} style={{ background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
          <i className="fas fa-plus" style={{ marginRight: 6 }} />Add Milestone
        </button>
      </div>
      {milestones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No milestones yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {milestones.map(m => {
            const delayed = m.status !== 'completed' && m.due_date < todayStr;
            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                background: delayed ? '#fef2f2' : '#fff', border: `1px solid ${delayed ? '#fecaca' : 'rgba(0,0,0,0.07)'}`,
                borderRadius: 12, padding: '14px 16px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: delayed ? '#991b1b' : '#1A1A1A' }}>{m.title}</div>
                  {m.description && <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', marginTop: 3 }}>{m.description}</div>}
                  <div style={{ fontFamily: FF, fontSize: 11.5, color: delayed ? '#dc2626' : '#9ca3af', marginTop: 4 }}>
                    Due {m.due_date}{m.completion_date ? ` · Completed ${m.completion_date}` : ''}{delayed ? ' · Overdue' : ''}
                  </div>
                </div>
                <StatusBadge status={m.status} map={MILESTONE_STATUS} />
                <div style={{ display: 'flex', gap: 5 }}>
                  <button onClick={() => { setEditing(m); setShowForm(true); }} title="Edit"
                    style={{ background: 'rgba(201,136,58,0.08)', color: '#C9883A', border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, borderRadius: 6, cursor: 'pointer' }}>
                    <i className="fas fa-pen" style={{ fontSize: 10 }} />
                  </button>
                  <button onClick={() => setDelId(m.id)} title="Delete"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, borderRadius: 6, cursor: 'pointer' }}>
                    <i className="fas fa-trash" style={{ fontSize: 10 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showForm && <MilestoneForm projectId={projectId} milestone={editing} onClose={() => setShowForm(false)} onSaved={onReload} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={remove} />}
    </div>
  );
}
