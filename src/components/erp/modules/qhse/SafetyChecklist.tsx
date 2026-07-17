import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, today, CHECKLIST_STATUS, StatusBadge, DelDlg } from './qhseShared';

const TYPE_LABEL: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', pre_task: 'Pre-Task',
  toolbox_talk: 'Toolbox Talk', permit_to_work: 'Permit to Work',
};

const defChecklist = { title: '', checklist_type: 'daily', date: today(), location: '', status: 'pending' };
const defItem = { question: '', answer: 'yes', remarks: '' };

function ChecklistForm({ checklist, onClose, onSaved }: { checklist?: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(checklist ? {
    title: checklist.title || '', checklist_type: checklist.checklist_type || 'daily', date: checklist.date || today(),
    location: checklist.location || '', status: checklist.status || 'pending',
  } : { ...defChecklist });
  const [items, setItems] = useState<any[]>(checklist?.items?.length ? checklist.items.map((i: any) => ({ question: i.question, answer: i.answer, remarks: i.remarks || '' })) : [{ ...defItem }]);
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems(prev => [...prev, { ...defItem }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, patch: any) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) { toast.error('Title is required.'); return; }
    const validItems = items.filter(i => i.question.trim());
    if (validItems.length === 0) { toast.error('Add at least one checklist item.'); return; }
    setSaving(true);
    try {
      const body = { ...f, items: validItems };
      if (checklist) await erpFetch(`qhse/checklists/${checklist.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch('qhse/checklists/', { method: 'POST', body: JSON.stringify(body) });
      toast.success(checklist ? 'Checklist updated' : 'Checklist created');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{checklist ? 'Edit Checklist' : 'New Checklist'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Title *</label><input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} style={inp} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Type</label>
              <select value={f.checklist_type} onChange={e => setF(p => ({ ...p, checklist_type: e.target.value }))} style={inp}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Date</label><input type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} style={inp} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Location</label><input value={f.location} onChange={e => setF(p => ({ ...p, location: e.target.value }))} style={inp} /></div>
            <div><label style={lbl}>Status</label>
              <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
                {Object.entries(CHECKLIST_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={lbl}>Checklist Items</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={it.question} onChange={e => updateItem(i, { question: e.target.value })} placeholder={`Question ${i + 1}`} style={{ ...inp, flex: 1 }} />
                  <select value={it.answer} onChange={e => updateItem(i, { answer: e.target.value })} style={{ ...inp, width: 90 }}>
                    <option value="yes">Yes</option><option value="no">No</option><option value="na">N/A</option>
                  </select>
                  <button type="button" onClick={() => removeItem(i)} disabled={items.length === 1}
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 30, height: 30, borderRadius: 6, cursor: items.length === 1 ? 'not-allowed' : 'pointer', opacity: items.length === 1 ? 0.4 : 1, flexShrink: 0 }}>
                    <i className="fas fa-trash" style={{ fontSize: 10 }} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} style={{ marginTop: 8, background: 'none', border: 'none', color: '#C9883A', fontFamily: FF, fontWeight: 700, fontSize: 12, cursor: 'pointer', padding: 0 }}>
              <i className="fas fa-plus" style={{ marginRight: 5 }} />Add item
            </button>
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

function ChecklistDetail({ checklist, onClose }: { checklist: any; onClose: () => void }) {
  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{checklist.title}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <div style={{ fontFamily: FF, fontSize: 12, color: '#6B6B6B', marginBottom: 16 }}>
          {TYPE_LABEL[checklist.checklist_type] ?? checklist.checklist_type} · {checklist.date} · {checklist.location || 'No location'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(checklist.items || []).map((it: any, i: number) => {
            const color = it.answer === 'yes' ? '#065f46' : it.answer === 'no' ? '#991b1b' : '#6B6B6B';
            const bg = it.answer === 'yes' ? '#d1fae5' : it.answer === 'no' ? '#fee2e2' : '#f1f5f9';
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: '#F8F7F4', borderRadius: 9 }}>
                <span style={{ fontFamily: FF, fontSize: 12.5, color: '#1A1A1A' }}>{it.question}</span>
                <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 11, background: bg, color, padding: '2px 10px', borderRadius: 20 }}>{it.answer.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SafetyChecklistPanel() {
  const isAdmin = isSuperUser();
  const checklists = useERPList<any>('qhse/checklists/');

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return checklists.data;
    return checklists.data.filter((c: any) => [c.title, c.location].some((v: any) => (v || '').toLowerCase().includes(q)));
  }, [checklists.data, search]);

  const confirmDel = async () => {
    try { await checklists.remove(delId!); toast.success('Checklist deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const cols = [
    { key: 'title', label: 'Title', width: 220, render: (r: any) => <span onClick={() => setViewing(r)} style={{ cursor: 'pointer', color: '#C9883A', fontWeight: 700 }}>{r.title}</span> },
    { key: 'checklist_type', label: 'Type', render: (r: any) => TYPE_LABEL[r.checklist_type] ?? r.checklist_type },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location', render: (r: any) => r.location || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={CHECKLIST_STATUS} /> },
    { key: 'created_by_name', label: 'Created By', render: (r: any) => r.created_by_name || '—' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, location…" style={{ ...inp, width: 240, paddingLeft: 30 }} />
        </div>
      </div>

      <ERPTable title="Safety Checklists" columns={cols} data={filtered} loading={checklists.loading} error={checklists.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowForm(true); }}
        onEdit={r => { setEditing(r); setShowForm(true); }}
        onDelete={id => setDelId(id)} />

      {showForm && <ChecklistForm checklist={editing} onClose={() => setShowForm(false)} onSaved={() => checklists.reload()} />}
      {viewing && <ChecklistDetail checklist={viewing} onClose={() => setViewing(null)} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
