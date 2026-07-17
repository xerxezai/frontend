import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, COMPLIANCE_STATUS, StatusBadge, DelDlg } from './qhseShared';

const TYPE_LABEL: Record<string, string> = {
  legal: 'Legal', regulatory: 'Regulatory', iso: 'ISO', company_policy: 'Company Policy', client_requirement: 'Client Requirement',
};

const defRecord = { title: '', compliance_type: 'legal', description: '', due_date: '', status: 'under_review', responsible_person: '', evidence: '', notes: '' };

function ComplianceForm({ record, users, onClose, onSaved }: { record?: any; users: { id: number; name: string }[]; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(record ? {
    title: record.title || '', compliance_type: record.compliance_type || 'legal', description: record.description || '',
    due_date: record.due_date || '', status: record.status || 'under_review', responsible_person: String(record.responsible_person || ''),
    evidence: record.evidence || '', notes: record.notes || '',
  } : { ...defRecord });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.description.trim() || !f.due_date || !f.responsible_person) { toast.error('Please fill in all required fields.'); return; }
    setSaving(true);
    try {
      const body = { ...f, responsible_person: Number(f.responsible_person) };
      if (record) await erpFetch(`qhse/compliance/${record.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch('qhse/compliance/', { method: 'POST', body: JSON.stringify(body) });
      toast.success(record ? 'Compliance item updated' : 'Compliance item added');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{record ? 'Edit Compliance Item' : 'Add Compliance Item'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Title *</label><input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} style={inp} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Type</label>
              <select value={f.compliance_type} onChange={e => setF(p => ({ ...p, compliance_type: e.target.value }))} style={inp}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Due Date *</label><input type="date" value={f.due_date} onChange={e => setF(p => ({ ...p, due_date: e.target.value }))} style={inp} required /></div>
          </div>
          <div><label style={lbl}>Description *</label><textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Status</label>
              <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
                {Object.entries(COMPLIANCE_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Responsible Person *</label>
              <select value={f.responsible_person} onChange={e => setF(p => ({ ...p, responsible_person: e.target.value }))} style={inp} required>
                <option value="">— Select person —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div><label style={lbl}>Evidence</label><textarea value={f.evidence} onChange={e => setF(p => ({ ...p, evidence: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 50 }} placeholder="Links, document references…" /></div>
          <div><label style={lbl}>Notes</label><textarea value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 50 }} /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ComplianceTracker() {
  const isAdmin = isSuperUser();
  const records = useERPList<any>('qhse/compliance/');
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);

  useEffect(() => {
    erpFetch('sales/orders/salespeople/')
      .then((res: any) => setUsers((Array.isArray(res) ? res : []).filter((p: any) => p.type === 'user')))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.data.filter((r: any) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      return (r.title || '').toLowerCase().includes(q);
    });
  }, [records.data, search, statusFilter]);

  const confirmDel = async () => {
    try { await records.remove(delId!); toast.success('Compliance item deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const cols = [
    { key: 'title', label: 'Title', width: 220, render: (r: any) => (
      <span style={{ color: r.is_overdue ? '#ef4444' : undefined, fontWeight: r.is_overdue ? 700 : undefined }}>
        {r.is_overdue && <i className="fas fa-exclamation-triangle" style={{ marginRight: 5 }} />}{r.title}
      </span>
    ) },
    { key: 'compliance_type', label: 'Type', render: (r: any) => TYPE_LABEL[r.compliance_type] ?? r.compliance_type },
    { key: 'due_date', label: 'Due Date', render: (r: any) => <span style={{ color: r.is_overdue ? '#ef4444' : undefined, fontWeight: r.is_overdue ? 700 : undefined }}>{r.due_date}</span> },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={COMPLIANCE_STATUS} /> },
    { key: 'responsible_person_name', label: 'Responsible', render: (r: any) => r.responsible_person_name || '—' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title…" style={{ ...inp, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 170 }}>
            <option value="all">All Status</option>
            {Object.entries(COMPLIANCE_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <ERPTable title="Compliance Tracker" columns={cols} data={filtered} loading={records.loading} error={records.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && <ComplianceForm record={editing} users={users} onClose={() => setShowModal(false)} onSaved={() => records.reload()} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
