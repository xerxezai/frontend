import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD } from './projectsShared';

const defProject = {
  name: '', client: '', description: '', status: 'planning', priority: 'medium',
  start_date: '', end_date: '', budget: '', manager: '', team_members: [] as string[],
  progress: '0',
};

export default function ProjectForm({ project, onClose, onSaved }: { project?: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ ...defProject });
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    erpFetch('sales/orders/salespeople/')
      .then((res: any) => setUsers((Array.isArray(res) ? res : []).filter((p: any) => p.type === 'user')))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (project) {
      setF({
        name: project.name || '', client: project.client || '', description: project.description || '',
        status: project.status || 'planning', priority: project.priority || 'medium',
        start_date: project.start_date || '', end_date: project.end_date || '', budget: String(project.budget ?? ''),
        manager: String(project.manager || ''), team_members: (project.team_members || []).map((id: number) => String(id)),
        progress: String(project.progress ?? '0'),
      });
    }
  }, [project]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) { toast.error('Project name is required.'); return; }
    if (!f.client.trim()) { toast.error('Client is required.'); return; }
    if (!f.manager) { toast.error('Please select a project manager.'); return; }
    if (!f.start_date || !f.end_date) { toast.error('Start and end dates are required.'); return; }
    if (!f.budget || Number(f.budget) <= 0) { toast.error('Budget must be greater than 0.'); return; }
    setSaving(true);
    try {
      const body = {
        name: f.name, client: f.client, description: f.description, status: f.status, priority: f.priority,
        start_date: f.start_date, end_date: f.end_date, budget: Number(f.budget), manager: Number(f.manager),
        team_members: f.team_members.map(Number), progress: Math.max(0, Math.min(100, Number(f.progress) || 0)),
      };
      if (project) {
        await erpFetch(`project-management/projects/${project.id}/`, { method: 'PUT', body: JSON.stringify(body) });
        toast.success('Project updated');
      } else {
        await erpFetch('project-management/projects/', { method: 'POST', body: JSON.stringify(body) });
        toast.success('Project created');
      }
      onSaved();
      onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const toggleTeamMember = (id: string) => {
    setF(prev => ({
      ...prev,
      team_members: prev.team_members.includes(id) ? prev.team_members.filter(m => m !== id) : [...prev.team_members, id],
    }));
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={CRD}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{project ? 'Edit Project' : 'Add Project'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Project Name *</label><input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>Client *</label><input value={f.client} onChange={e => setF(p => ({ ...p, client: e.target.value }))} style={inp} required /></div>
          </div>
          <div><label style={lbl}>Description</label><textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Status</label>
              <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
                <option value="planning">Planning</option><option value="active">Active</option>
                <option value="on_hold">On Hold</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div><label style={lbl}>Priority</label>
              <select value={f.priority} onChange={e => setF(p => ({ ...p, priority: e.target.value }))} style={inp}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Start Date *</label><input type="date" value={f.start_date} onChange={e => setF(p => ({ ...p, start_date: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>End Date *</label><input type="date" value={f.end_date} onChange={e => setF(p => ({ ...p, end_date: e.target.value }))} style={inp} required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Budget *</label><input type="number" value={f.budget} onChange={e => setF(p => ({ ...p, budget: e.target.value }))} style={inp} step="0.01" min="0.01" required /></div>
            <div><label style={lbl}>Progress (%)</label><input type="number" value={f.progress} onChange={e => setF(p => ({ ...p, progress: e.target.value }))} style={inp} min="0" max="100" /></div>
          </div>
          <div><label style={lbl}>Project Manager *</label>
            <select value={f.manager} onChange={e => setF(p => ({ ...p, manager: e.target.value }))} style={inp} required>
              <option value="">— Select manager —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Team Members</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: 10, maxHeight: 120, overflowY: 'auto' }}>
              {users.length === 0 && <span style={{ fontFamily: FF, fontSize: 12, color: '#9ca3af' }}>No users available</span>}
              {users.map(u => {
                const id = String(u.id);
                const active = f.team_members.includes(id);
                return (
                  <button type="button" key={u.id} onClick={() => toggleTeamMember(id)}
                    style={{
                      fontFamily: FF, fontSize: 11.5, fontWeight: 700, padding: '5px 10px', borderRadius: 20, cursor: 'pointer',
                      background: active ? 'rgba(201,136,58,0.14)' : '#fff', color: active ? '#C9883A' : '#6B6B6B',
                      border: active ? '1px solid rgba(201,136,58,0.35)' : '1px solid rgba(0,0,0,0.10)',
                    }}>
                    {active && <i className="fas fa-check" style={{ fontSize: 9, marginRight: 5 }} />}{u.name}
                  </button>
                );
              })}
            </div>
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
