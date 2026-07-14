import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useERPList, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, StarRating, StarRatingInput } from './procurementShared';

const defSupplier = { name: '', email: '', phone: '', address: '', city: '', country: '', payment_terms: '', rating: 0, is_active: 'true' };

export default function SuppliersPanel() {
  const isAdmin = isSuperUser();
  const suppliers = useERPList<any>('procurement/suppliers/');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [sF, setSF] = useState({ ...defSupplier });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return suppliers.data.filter((s: any) => {
      if (statusFilter === 'active' && !s.is_active) return false;
      if (statusFilter === 'inactive' && s.is_active) return false;
      if (!q) return true;
      return [s.name, s.email, s.phone, s.city].some(v => (v || '').toLowerCase().includes(q));
    });
  }, [suppliers.data, search, statusFilter]);

  const close = () => { setShowModal(false); setEditing(null); };

  const saveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sF.name.trim()) { toast.error('Supplier name is required.'); return; }
    try {
      const body = { ...sF, rating: Number(sF.rating), is_active: sF.is_active === 'true' };
      if (editing) { await suppliers.update(editing.id, body); toast.success('Supplier updated'); }
      else { await suppliers.create(body); toast.success('Supplier created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await suppliers.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const exportCSV = async () => {
    try { await erpDownload('procurement/suppliers/export-csv/', `suppliers-${new Date().toISOString().slice(0, 10)}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const cols = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: (r: any) => r.email || '—' },
    { key: 'phone', label: 'Phone', render: (r: any) => r.phone || '—' },
    { key: 'city', label: 'City', render: (r: any) => r.city || '—' },
    { key: 'payment_terms', label: 'Payment Terms', render: (r: any) => r.payment_terms || '—' },
    { key: 'rating', label: 'Rating', render: (r: any) => <StarRating value={r.rating || 0} /> },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers…" style={{ ...inp, width: 220, paddingLeft: 30 }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{ ...inp, width: 140 }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Suppliers" columns={cols} data={filtered} loading={suppliers.loading} error={suppliers.error} isAdmin={isAdmin}
        onAdd={() => { setSF({ ...defSupplier }); setEditing(null); setShowModal(true); }}
        onEdit={r => { setEditing(r); setSF({ name: r.name || '', email: r.email || '', phone: r.phone || '', address: r.address || '', city: r.city || '', country: r.country || '', payment_terms: r.payment_terms || '', rating: r.rating || 0, is_active: String(r.is_active ?? true) }); setShowModal(true); }}
        onDelete={id => setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Supplier' : 'Add Supplier'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveSupplier} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Name *</label><input value={sF.name} onChange={e => setSF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Email</label><input type="email" value={sF.email} onChange={e => setSF(f => ({ ...f, email: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Phone</label><input value={sF.phone} onChange={e => setSF(f => ({ ...f, phone: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Address</label><textarea value={sF.address} onChange={e => setSF(f => ({ ...f, address: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 60 }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>City</label><input value={sF.city} onChange={e => setSF(f => ({ ...f, city: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Country</label><input value={sF.country} onChange={e => setSF(f => ({ ...f, country: e.target.value }))} style={inp} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Payment Terms</label><input value={sF.payment_terms} onChange={e => setSF(f => ({ ...f, payment_terms: e.target.value }))} style={inp} placeholder="e.g. Net 30" /></div>
                <div><label style={lbl}>Active</label><select value={sF.is_active} onChange={e => setSF(f => ({ ...f, is_active: e.target.value }))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
              </div>
              <div><label style={lbl}>Rating</label><StarRatingInput value={Number(sF.rating)} onChange={n => setSF(f => ({ ...f, rating: n }))} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
