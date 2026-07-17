import { useState } from 'react';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, SEVERITY_BADGE } from './qhseShared';

const defIncident = {
  title: '', incident_type: 'near_miss', severity: 'low', date: new Date().toISOString().slice(0, 10), time: '',
  location: '', injured_person: '', description: '', immediate_action: '', root_cause: '', corrective_action: '',
  status: 'open', closed_date: '',
};

const TYPE_LABEL: Record<string, string> = {
  near_miss: 'Near Miss', first_aid: 'First Aid', medical_treatment: 'Medical Treatment', lost_time: 'Lost Time',
  fatality: 'Fatality', environmental: 'Environmental', property_damage: 'Property Damage', security: 'Security',
};

export default function IncidentForm({ incident, onClose, onSaved }: { incident?: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(incident ? {
    title: incident.title || '', incident_type: incident.incident_type || 'near_miss', severity: incident.severity || 'low',
    date: incident.date || '', time: incident.time || '', location: incident.location || '', injured_person: incident.injured_person || '',
    description: incident.description || '', immediate_action: incident.immediate_action || '', root_cause: incident.root_cause || '',
    corrective_action: incident.corrective_action || '', status: incident.status || 'open', closed_date: incident.closed_date || '',
  } : { ...defIncident });
  const [saving, setSaving] = useState(false);
  const sev = SEVERITY_BADGE[f.severity] ?? SEVERITY_BADGE.low;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.location.trim() || !f.description.trim()) { toast.error('Title, location and description are required.'); return; }
    setSaving(true);
    try {
      const body = { ...f, time: f.time || null, closed_date: f.closed_date || null };
      if (incident) await erpFetch(`qhse/incidents/${incident.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch('qhse/incidents/', { method: 'POST', body: JSON.stringify(body) });
      toast.success(incident ? 'Incident updated' : 'Incident reported');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={CRD}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{incident ? 'Edit Incident' : 'Report Incident'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Title *</label><input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} style={inp} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Type</label>
              <select value={f.incident_type} onChange={e => setF(p => ({ ...p, incident_type: e.target.value }))} style={inp}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Severity</label>
              <select value={f.severity} onChange={e => setF(p => ({ ...p, severity: e.target.value }))}
                style={{ ...inp, background: sev.bg, color: sev.color, fontWeight: 700 }}>
                {Object.entries(SEVERITY_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Date *</label><input type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>Time</label><input type="time" value={f.time} onChange={e => setF(p => ({ ...p, time: e.target.value }))} style={inp} /></div>
            <div><label style={lbl}>Location *</label><input value={f.location} onChange={e => setF(p => ({ ...p, location: e.target.value }))} style={inp} required /></div>
          </div>
          <div><label style={lbl}>Injured Person</label><input value={f.injured_person} onChange={e => setF(p => ({ ...p, injured_person: e.target.value }))} style={inp} /></div>
          <div><label style={lbl}>Description *</label><textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} required /></div>
          <div><label style={lbl}>Immediate Action</label><textarea value={f.immediate_action} onChange={e => setF(p => ({ ...p, immediate_action: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 50 }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Root Cause</label><textarea value={f.root_cause} onChange={e => setF(p => ({ ...p, root_cause: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 50 }} /></div>
            <div><label style={lbl}>Corrective Action</label><textarea value={f.corrective_action} onChange={e => setF(p => ({ ...p, corrective_action: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 50 }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Status</label>
              <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
                <option value="open">Open</option><option value="investigating">Investigating</option>
                <option value="action_required">Action Required</option><option value="closed">Closed</option><option value="resolved">Resolved</option>
              </select>
            </div>
            <div><label style={lbl}>Closed Date</label><input type="date" value={f.closed_date} onChange={e => setF(p => ({ ...p, closed_date: e.target.value }))} style={inp} /></div>
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
