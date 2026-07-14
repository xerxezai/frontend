import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, fmtINR, today, DISTRIBUTOR_STATUS, StatusBadge } from './mlmShared';

const defDist = { name: '', email: '', phone: '', sponsor: '', status: 'active', joining_date: today() };

export default function DistributorsPanel() {
  const isAdmin = isSuperUser();
  const distributors = useERPList<any>('mlm/distributors/');

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [dF, setDF] = useState({ ...defDist });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return distributors.data.filter((d: any) => {
      if (levelFilter !== 'all' && String(d.level) !== levelFilter) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (!q) return true;
      return [d.name, d.distributor_id, d.email].some(v => (v || '').toLowerCase().includes(q));
    });
  }, [distributors.data, search, levelFilter, statusFilter]);

  const sponsorLevel = useMemo(() => {
    if (!dF.sponsor) return 1;
    const sp = distributors.data.find((d: any) => String(d.id) === dF.sponsor);
    return sp ? Math.min((sp.level || 1) + 1, 3) : 1;
  }, [dF.sponsor, distributors.data]);

  const close = () => { setShowModal(false); setEditing(null); };

  const saveDistributor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dF.name.trim()) { toast.error('Please enter a name.'); return; }
    try {
      const body: any = {
        name: dF.name, email: dF.email, phone: dF.phone, status: dF.status, joining_date: dF.joining_date,
        sponsor: dF.sponsor ? Number(dF.sponsor) : null,
      };
      if (editing) { await distributors.update(editing.id, body); toast.success('Distributor updated'); }
      else { await distributors.create(body); toast.success('Distributor created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await distributors.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('mlm/distributors/export-csv/', `distributors-${today()}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'distributor_id', label: 'Distributor ID' },
    { key: 'name', label: 'Name' },
    { key: 'sponsor_name', label: 'Sponsor', render: (r: any) => r.sponsor_name ? `${r.sponsor_name} (${r.sponsor_distributor_id})` : '— Root —' },
    { key: 'level', label: 'Level', render: (r: any) => `Level ${r.level}` },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} map={DISTRIBUTOR_STATUS} /> },
    { key: 'joining_date', label: 'Joining Date' },
    { key: 'total_sales', label: 'Total Sales', render: (r: any) => fmtINR(r.total_sales) },
    { key: 'total_earnings', label: 'Total Earnings', render: (r: any) => fmtINR(r.total_earnings) },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, email…" style={{ ...inp, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={{ ...inp, width: 130 }}>
            <option value="all">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, width: 140 }}>
            <option value="all">All Status</option>
            {Object.entries(DISTRIBUTOR_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Distributors" columns={cols} data={filtered} loading={distributors.loading} error={distributors.error} isAdmin={isAdmin}
        onAdd={() => { setDF({ ...defDist }); setEditing(null); setShowModal(true); }}
        onEdit={r => {
          setEditing(r);
          setDF({ name: r.name || '', email: r.email || '', phone: r.phone || '', sponsor: r.sponsor ? String(r.sponsor) : '', status: r.status || 'active', joining_date: r.joining_date || today() });
          setShowModal(true);
        }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Distributor' : 'Add Distributor'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveDistributor} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Name *</label><input value={dF.name} onChange={e => setDF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Email</label><input type="email" value={dF.email} onChange={e => setDF(f => ({ ...f, email: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Phone</label><input value={dF.phone} onChange={e => setDF(f => ({ ...f, phone: e.target.value }))} style={inp} /></div>
              </div>
              <div>
                <label style={lbl}>Sponsor</label>
                <select value={dF.sponsor} onChange={e => setDF(f => ({ ...f, sponsor: e.target.value }))} style={inp}>
                  <option value="">— None (root/top-level) —</option>
                  {distributors.data.filter((d: any) => !editing || d.id !== editing.id).map((d: any) => (
                    <option key={d.id} value={d.id}>{d.distributor_id} — {d.name} (L{d.level})</option>
                  ))}
                </select>
                <div style={{ fontSize: 11, color: '#6B6B6B', fontFamily: FF, marginTop: 4 }}>Level will be computed automatically: Level {sponsorLevel}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Status</label>
                  <select value={dF.status} onChange={e => setDF(f => ({ ...f, status: e.target.value }))} style={inp}>
                    {Object.entries(DISTRIBUTOR_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Joining Date</label><input type="date" value={dF.joining_date} onChange={e => setDF(f => ({ ...f, joining_date: e.target.value }))} style={inp} /></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
