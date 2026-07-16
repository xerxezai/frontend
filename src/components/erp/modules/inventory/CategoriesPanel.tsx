import { useState } from 'react';
import { toast } from 'react-toastify';
import { useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency } from './inventoryShared';

const defCat = { name: '', description: '' };

export default function CategoriesPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const categories = useERPList<any>('inventory/categories/');

  const [modal, setModal] = useState<'none' | 'add' | 'edit'>('none');
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [catF, setCatF] = useState({ ...defCat });

  const closeModal = () => { setModal('none'); setEditing(null); };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { name: catF.name, description: catF.description };
      if (editing) { await categories.update(editing.id, body); toast.success('Category updated'); }
      else { await categories.create(body); toast.success('Category created'); }
      closeModal();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await categories.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed — remove or reassign its products first.'); }
  };

  const cols = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', render: (r: any) => (r.description || '').substring(0, 60) + (r.description?.length > 60 ? '…' : '') },
    { key: 'product_count', label: 'Products', render: (r: any) => r.product_count ?? 0 },
    { key: 'total_stock_value', label: 'Stock Value', render: (r: any) => fmtINR(r.total_stock_value) },
  ];

  return (
    <div>
      <ERPTable title="Categories" columns={cols} data={categories.data} loading={categories.loading} error={categories.error} isAdmin={isAdmin}
        onAdd={() => { setCatF({ ...defCat }); setEditing(null); setModal('add'); }}
        onEdit={r => { setEditing(r); setCatF({ name: r.name || '', description: r.description || '' }); setModal('edit'); }}
        onDelete={id => setDelId(id)} />

      {(modal === 'add' || modal === 'edit') && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Category' : 'Add Category'}</h5>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveCategory} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Name *</label><input value={catF.name} onChange={e => setCatF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
              <div><label style={lbl}>Description</label><textarea value={catF.description} onChange={e => setCatF(f => ({ ...f, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 70 }} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={closeModal} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
