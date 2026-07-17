import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, today, INSPECTION_STATUS, StatusBadge, DelDlg } from './qhseShared';

const TYPE_LABEL: Record<string, string> = {
  safety: 'Safety', quality: 'Quality', environmental: 'Environmental', process: 'Process',
  fire: 'Fire', electrical: 'Electrical', scaffold: 'Scaffold',
};

const defInspection = { title: '', inspection_type: 'safety', scheduled_date: today(), completed_date: '', location: '', status: 'scheduled', findings: '', corrective_actions: '', score: '' };

function InspectionForm({ inspection, onClose, onSaved }: { inspection?: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(inspection ? {
    title: inspection.title || '', inspection_type: inspection.inspection_type || 'safety', scheduled_date: inspection.scheduled_date || '',
    completed_date: inspection.completed_date || '', location: inspection.location || '', status: inspection.status || 'scheduled',
    findings: inspection.findings || '', corrective_actions: inspection.corrective_actions || '', score: inspection.score != null ? String(inspection.score) : '',
  } : { ...defInspection });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.scheduled_date) { toast.error('Title and scheduled date are required.'); return; }
    setSaving(true);
    try {
      const body = { ...f, completed_date: f.completed_date || null, score: f.score !== '' ? Number(f.score) : null };
      if (inspection) await erpFetch(`qhse/inspections/${inspection.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch('qhse/inspections/', { method: 'POST', body: JSON.stringify(body) });
      toast.success(inspection ? 'Inspection updated' : 'Inspection scheduled');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{inspection ? 'Edit Inspection' : 'Schedule Inspection'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Title *</label><input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} style={inp} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Type</label>
              <select value={f.inspection_type} onChange={e => setF(p => ({ ...p, inspection_type: e.target.value }))} style={inp}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Location</label><input value={f.location} onChange={e => setF(p => ({ ...p, location: e.target.value }))} style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Scheduled Date *</label><input type="date" value={f.scheduled_date} onChange={e => setF(p => ({ ...p, scheduled_date: e.target.value }))} style={inp} required /></div>
            <div><label style={lbl}>Completed Date</label><input type="date" value={f.completed_date} onChange={e => setF(p => ({ ...p, completed_date: e.target.value }))} style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Status</label>
              <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
                {Object.entries(INSPECTION_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Score (0-100)</label><input type="number" value={f.score} onChange={e => setF(p => ({ ...p, score: e.target.value }))} style={inp} min="0" max="100" /></div>
          </div>
          <div><label style={lbl}>Findings</label><textarea value={f.findings} onChange={e => setF(p => ({ ...p, findings: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} /></div>
          <div><label style={lbl}>Corrective Actions</label><textarea value={f.corrective_actions} onChange={e => setF(p => ({ ...p, corrective_actions: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>;
  const color = score >= 80 ? '#065f46' : score >= 60 ? '#92400e' : '#991b1b';
  const bg = score >= 80 ? '#d1fae5' : score >= 60 ? '#fef3c7' : '#fee2e2';
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color, fontFamily: FF }}>{score}</span>;
}

export default function InspectionList() {
  const isAdmin = isSuperUser();
  const inspections = useERPList<any>('qhse/inspections/');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inspections.data.filter((i: any) => {
      if (typeFilter !== 'all' && i.inspection_type !== typeFilter) return false;
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (!q) return true;
      return [i.title, i.location].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [inspections.data, search, typeFilter, statusFilter]);

  const confirmDel = async () => {
    try { await inspections.remove(delId!); toast.success('Inspection deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const cols = [
    { key: 'title', label: 'Title', width: 200 },
    { key: 'inspection_type', label: 'Type', render: (r: any) => TYPE_LABEL[r.inspection_type] ?? r.inspection_type },
    { key: 'scheduled_date', label: 'Scheduled' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={INSPECTION_STATUS} /> },
    { key: 'conducted_by_name', label: 'Conducted By', render: (r: any) => r.conducted_by_name || '—' },
    { key: 'score', label: 'Score', render: (r: any) => <ScoreBadge score={r.score} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, location…" style={{ ...inp, width: 230, paddingLeft: 30 }} />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...inp, width: 150 }}>
            <option value="all">All Types</option>
            {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 150 }}>
            <option value="all">All Status</option>
            {Object.entries(INSPECTION_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <ERPTable title="Inspections" columns={cols} data={filtered} loading={inspections.loading} error={inspections.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && <InspectionForm inspection={editing} onClose={() => setShowModal(false)} onSaved={() => inspections.reload()} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
