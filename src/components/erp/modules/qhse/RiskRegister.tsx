import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, lbl, inp, SAVE, CNCL, OVR, CRD, RISK_LEVEL_BADGE, RISK_STATUS, StatusBadge, DelDlg } from './qhseShared';

const CATEGORY_LABEL: Record<string, string> = {
  safety: 'Safety', environmental: 'Environmental', quality: 'Quality', operational: 'Operational', financial: 'Financial', legal: 'Legal',
};

const defRisk = { title: '', description: '', category: 'safety', likelihood: '3', consequence: '3', mitigation: '', owner: '', status: 'open', review_date: '' };

function RiskForm({ risk, users, onClose, onSaved }: { risk?: any; users: { id: number; name: string }[]; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(risk ? {
    title: risk.title || '', description: risk.description || '', category: risk.category || 'safety',
    likelihood: String(risk.likelihood ?? '3'), consequence: String(risk.consequence ?? '3'), mitigation: risk.mitigation || '',
    owner: String(risk.owner || ''), status: risk.status || 'open', review_date: risk.review_date || '',
  } : { ...defRisk });
  const [saving, setSaving] = useState(false);
  const score = Number(f.likelihood) * Number(f.consequence);
  const level = score >= 16 ? 'critical' : score >= 10 ? 'high' : score >= 5 ? 'medium' : 'low';

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.description.trim() || !f.mitigation.trim() || !f.owner || !f.review_date) { toast.error('Please fill in all required fields.'); return; }
    setSaving(true);
    try {
      const body = { ...f, likelihood: Number(f.likelihood), consequence: Number(f.consequence), owner: Number(f.owner) };
      if (risk) await erpFetch(`qhse/risks/${risk.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch('qhse/risks/', { method: 'POST', body: JSON.stringify(body) });
      toast.success(risk ? 'Risk updated' : 'Risk added');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{risk ? 'Edit Risk' : 'Add Risk'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Title *</label><input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} style={inp} required /></div>
          <div><label style={lbl}>Description *</label><textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} required /></div>
          <div><label style={lbl}>Category</label>
            <select value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))} style={inp}>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Likelihood (1-5)</label>
              <select value={f.likelihood} onChange={e => setF(p => ({ ...p, likelihood: e.target.value }))} style={inp}>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Consequence (1-5)</label>
              <select value={f.consequence} onChange={e => setF(p => ({ ...p, consequence: e.target.value }))} style={inp}>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div style={{ background: RISK_LEVEL_BADGE[level].bg, color: RISK_LEVEL_BADGE[level].color, borderRadius: 9, padding: '9px 14px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, textAlign: 'center' }}>
            Risk Score: {score} — {RISK_LEVEL_BADGE[level].label}
          </div>
          <div><label style={lbl}>Mitigation *</label><textarea value={f.mitigation} onChange={e => setF(p => ({ ...p, mitigation: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Owner *</label>
              <select value={f.owner} onChange={e => setF(p => ({ ...p, owner: e.target.value }))} style={inp} required>
                <option value="">— Select owner —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Review Date *</label><input type="date" value={f.review_date} onChange={e => setF(p => ({ ...p, review_date: e.target.value }))} style={inp} required /></div>
          </div>
          <div><label style={lbl}>Status</label>
            <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
              {Object.entries(RISK_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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

export default function RiskRegisterPanel() {
  const isAdmin = isSuperUser();
  const risks = useERPList<any>('qhse/risks/');
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
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
    return risks.data.filter((r: any) => {
      if (levelFilter !== 'all' && r.risk_level !== levelFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.risk_id, r.title].some((v: any) => (v || '').toLowerCase().includes(q));
    });
  }, [risks.data, search, levelFilter, statusFilter]);

  const confirmDel = async () => {
    try { await risks.remove(delId!); toast.success('Risk deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const matrixCounts = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((r: any) => { const key = `${r.likelihood}-${r.consequence}`; map[key] = (map[key] || 0) + 1; });
    return map;
  }, [filtered]);

  const cols = [
    { key: 'risk_id', label: 'ID', width: 80 },
    { key: 'title', label: 'Title', width: 180 },
    { key: 'category', label: 'Category', render: (r: any) => CATEGORY_LABEL[r.category] ?? r.category },
    { key: 'likelihood', label: 'L' },
    { key: 'consequence', label: 'C' },
    { key: 'risk_score', label: 'Score', render: (r: any) => <strong>{r.risk_score}</strong> },
    { key: 'risk_level', label: 'Level', render: (r: any) => <StatusBadge status={r.risk_level} map={RISK_LEVEL_BADGE} /> },
    { key: 'owner_name', label: 'Owner', render: (r: any) => r.owner_name || '—' },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={RISK_STATUS} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, title…" style={{ ...inp, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={{ ...inp, width: 140 }}>
            <option value="all">All Levels</option>
            {Object.entries(RISK_LEVEL_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 140 }}>
            <option value="all">All Status</option>
            {Object.entries(RISK_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 4 }}>Risk Matrix</div>
        <div style={{ fontFamily: FF, fontSize: 11, color: '#9ca3af', marginBottom: 14 }}>Number of risks at each likelihood × consequence combination</div>
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(5, 46px)', gap: 3 }}>
          {[5, 4, 3, 2, 1].map(likelihood => (
            [1, 2, 3, 4, 5].map(consequence => {
              const score = likelihood * consequence;
              const count = matrixCounts[`${likelihood}-${consequence}`] || 0;
              const bg = score >= 16 ? '#fee2e2' : score >= 10 ? '#ffedd5' : score >= 5 ? '#fef3c7' : '#d1fae5';
              const color = score >= 16 ? '#991b1b' : score >= 10 ? '#c2410c' : score >= 5 ? '#92400e' : '#065f46';
              return (
                <div key={`${likelihood}-${consequence}`} title={`Likelihood ${likelihood} × Consequence ${consequence} = ${score}`}
                  style={{ width: 46, height: 46, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, fontWeight: 800, fontSize: count ? 15 : 11, borderRadius: 6, opacity: count ? 1 : 0.45 }}>
                  {count || score}
                </div>
              );
            })
          ))}
        </div>
      </div>

      <ERPTable title="Risk Register" columns={cols} data={filtered} loading={risks.loading} error={risks.error} isAdmin={isAdmin}
        onAdd={() => { setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && <RiskForm risk={editing} users={users} onClose={() => setShowModal(false)} onSaved={() => risks.reload()} />}
      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
