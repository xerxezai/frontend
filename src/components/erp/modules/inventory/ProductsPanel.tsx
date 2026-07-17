import { useState, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { useERPList, erpUpload, erpDownload, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, useFmtCurrency } from './inventoryShared';

const defP = { name:'',code:'',category:'',unit:'pcs',cost_price:'',sale_price:'',is_active:'true',min_stock_level:'0',barcode:'',initial_quantity:'',warehouse:'' };

export default function ProductsPanel() {
  const isAdmin = isSuperUser();
  const fmtINR = useFmtCurrency();
  const products   = useERPList<any>('inventory/products/');
  const warehouses  = useERPList<any>('inventory/warehouses/');
  const categories = useERPList<any>('inventory/categories/');
  const movements   = useERPList<any>('inventory/stock-movements/');

  const [modal, setModal] = useState<'none' | 'add' | 'edit' | 'import'>('none');
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [pF, setPF] = useState({ ...defP });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const closeModal = () => { setModal('none'); setEditing(null); setImageFile(null); setImportFile(null); setImportResult(null); };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', pF.name);
      if (pF.code) fd.append('code', pF.code);
      if (pF.category) fd.append('category', pF.category);
      fd.append('unit', pF.unit);
      fd.append('cost_price', String(Number(pF.cost_price) || 0));
      fd.append('sale_price', String(Number(pF.sale_price) || 0));
      fd.append('is_active', pF.is_active);
      fd.append('min_stock_level', String(Number(pF.min_stock_level) || 0));
      fd.append('barcode', pF.barcode);
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await erpUpload(`inventory/products/${editing.id}/`, fd, 'PATCH');
        toast.success('Product updated');
      } else {
        const created = await erpUpload('inventory/products/', fd, 'POST');
        const qty = Number(pF.initial_quantity) || 0;
        if (qty > 0 && pF.warehouse) {
          await movements.create({ type: 'in', product: created.id, warehouse: Number(pF.warehouse), quantity: qty, occurred_at: new Date().toISOString(), reason: 'Initial stock' });
        }
        toast.success('Product created');
      }
      products.reload();
      closeModal();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const confirmDel = async () => {
    try { await products.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const runImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('file', importFile);
      const res = await erpUpload('inventory/products/bulk-import/', fd, 'POST');
      setImportResult(res);
      products.reload();
      if (res.created_count > 0) toast.success(`Imported ${res.created_count} product(s)`);
      if (res.errors?.length) toast.error(`${res.errors.length} row(s) had errors — see details below`);
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const exportCSV = async () => {
    try { await erpDownload('inventory/reports/export-csv/', `products-${new Date().toISOString().slice(0,10)}.csv`); }
    catch (err: any) { toast.error(err.message || 'Export failed'); }
  };

  const filtered = useMemo(() => products.data.filter((p: any) => {
    if (search) {
      const q = search.toLowerCase();
      if (!(p.name || '').toLowerCase().includes(q) && !(p.code || '').toLowerCase().includes(q) && !(p.barcode || '').toLowerCase().includes(q)) return false;
    }
    if (catFilter && String(p.category || '') !== catFilter) return false;
    if (statusFilter && String(p.is_active) !== statusFilter) return false;
    return true;
  }), [products.data, search, catFilter, statusFilter]);

  const cols = [
    {
      key: 'name', label: 'Product', render: (r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {r.image ? (
            <img src={r.image} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 26, height: 26, borderRadius: 6, background: '#F0EBE4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-box" style={{ fontSize: 10, color: '#b8b2ab' }} />
            </div>
          )}
          <span>{r.name}</span>
        </div>
      ),
    },
    { key: 'code', label: 'SKU' },
    { key: 'category', label: 'Category', render: (r: any) => r.category_name || '—' },
    { key: 'unit', label: 'Unit' },
    { key: 'cost_price', label: 'Cost', render: (r: any) => fmtINR(r.cost_price) },
    { key: 'sale_price', label: 'Price', render: (r: any) => fmtINR(r.sale_price) },
    {
      key: 'current_stock', label: 'Stock', render: (r: any) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {r.current_stock ?? 0}
          {r.is_low_stock && <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: '#fee2e2', color: '#991b1b' }}>Low Stock</span>}
        </span>
      ),
    },
    { key: 'is_active', label: 'Active', render: (r: any) => r.is_active ? '✅' : '❌' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU or barcode…" style={{ ...inp, maxWidth: 260 }} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inp, maxWidth: 200 }}>
          <option value="">All Categories</option>
          {categories.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp, maxWidth: 160 }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <div style={{ flex: 1 }} />
        {isAdmin && (
          <button onClick={() => setModal('import')} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
            <i className="fas fa-file-import" style={{ marginRight: 6, color: '#C9883A' }} />Bulk Import
          </button>
        )}
        <button onClick={exportCSV} style={{ background: '#F8F7F4', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 9, padding: '9px 16px', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12.5, cursor: 'pointer', color: '#1A1A1A' }}>
          <i className="fas fa-file-csv" style={{ marginRight: 6, color: '#C9883A' }} />Export CSV
        </button>
      </div>

      <ERPTable title="Products" columns={cols} data={filtered} loading={products.loading} error={products.error} isAdmin={isAdmin}
        onAdd={() => { setPF({ ...defP }); setEditing(null); setImageFile(null); setModal('add'); }}
        onEdit={r => {
          setEditing(r);
          setPF({ name: r.name || '', code: r.code || '', category: String(r.category || ''), unit: r.unit || 'pcs', cost_price: String(r.cost_price || ''), sale_price: String(r.sale_price || ''), is_active: String(r.is_active ?? true), min_stock_level: String(r.min_stock_level ?? '0'), barcode: r.barcode || '', initial_quantity: '', warehouse: '' });
          setImageFile(null);
          setModal('edit');
        }}
        onDelete={id => setDelId(id)} />

      {(modal === 'add' || modal === 'edit') && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={CRD}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Product' : 'Add Product'}</h5>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveProduct} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Name *</label><input value={pF.name} onChange={e => setPF(f => ({ ...f, name: e.target.value }))} style={inp} required /></div>
                <div><label style={lbl}>SKU / Product Code</label><input value={pF.code} onChange={e => setPF(f => ({ ...f, code: e.target.value }))} style={inp} placeholder="auto-generated if blank" /></div>
                <div><label style={lbl}>Category</label>
                  <select value={pF.category} onChange={e => setPF(f => ({ ...f, category: e.target.value }))} style={inp}>
                    <option value="">— None —</option>
                    {categories.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Unit</label><select value={pF.unit} onChange={e => setPF(f => ({ ...f, unit: e.target.value }))} style={inp}><option value="pcs">Pieces</option><option value="kg">Kilogram</option><option value="lt">Litre</option><option value="hr">Hour</option><option value="lic">License</option><option value="sub">Subscription</option></select></div>
                <div><label style={lbl}>Cost Price</label><input type="number" value={pF.cost_price} onChange={e => setPF(f => ({ ...f, cost_price: e.target.value }))} style={inp} step="0.01" min="0" /></div>
                <div><label style={lbl}>Sale Price</label><input type="number" value={pF.sale_price} onChange={e => setPF(f => ({ ...f, sale_price: e.target.value }))} style={inp} step="0.01" min="0" /></div>
                <div><label style={lbl}>Active</label><select value={pF.is_active} onChange={e => setPF(f => ({ ...f, is_active: e.target.value }))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
                <div><label style={lbl}>Min Stock Level</label><input type="number" value={pF.min_stock_level} onChange={e => setPF(f => ({ ...f, min_stock_level: e.target.value }))} style={inp} step="0.01" min="0" /></div>
                <div><label style={lbl}>Barcode</label><input value={pF.barcode} onChange={e => setPF(f => ({ ...f, barcode: e.target.value }))} style={inp} placeholder="e.g. 8901234567890" /></div>
                <div>
                  <label style={lbl}>Product Image</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} style={{ ...inp, padding: '6px 10px' }} />
                  {!imageFile && (
                    <div style={{ marginTop: 6 }}>
                      {editing?.image ? (
                        <img src={editing.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F0EBE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="No image uploaded">
                          <i className="fas fa-image" style={{ fontSize: 14, color: '#b8b2ab' }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!editing && <div><label style={lbl}>Initial Quantity</label><input type="number" value={pF.initial_quantity} onChange={e => setPF(f => ({ ...f, initial_quantity: e.target.value }))} style={inp} step="0.01" min="0" placeholder="0" /></div>}
                {!editing && <div><label style={lbl}>Warehouse{Number(pF.initial_quantity) > 0 ? ' *' : ''}</label>
                  <select value={pF.warehouse} onChange={e => setPF(f => ({ ...f, warehouse: e.target.value }))} style={inp} required={Number(pF.initial_quantity) > 0}>
                    <option value="">— Select —</option>
                    {warehouses.data.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={closeModal} style={CNCL}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : editing ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === 'import' && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>Bulk Import Products</h5>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <p style={{ fontSize: 12.5, color: '#6B6B6B', fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>
              CSV columns: <code>name, code, category, unit, cost_price, sale_price, min_stock_level, barcode</code>. Only <strong>name</strong> is required per row; <em>category</em> must match an existing category name exactly.
            </p>
            <input type="file" accept=".csv,text/csv" onChange={e => { setImportFile(e.target.files?.[0] ?? null); setImportResult(null); }} style={{ ...inp, padding: '6px 10px', marginBottom: 14 }} />
            {importResult && (
              <div style={{ background: '#F8F7F4', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 12.5, fontFamily: "'DM Sans',sans-serif", maxHeight: 180, overflowY: 'auto' }}>
                <div style={{ fontWeight: 700, color: '#065f46', marginBottom: 6 }}>{importResult.created_count} product(s) created</div>
                {importResult.errors?.length > 0 && (
                  <>
                    <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>{importResult.errors.length} error(s):</div>
                    {importResult.errors.map((e: any, i: number) => <div key={i} style={{ color: '#991b1b' }}>Row {e.row}: {e.error}</div>)}
                  </>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={closeModal} style={CNCL}>Close</button>
              <button type="button" onClick={runImport} disabled={!importFile || importing} style={{ ...SAVE, opacity: (!importFile || importing) ? 0.6 : 1, cursor: (!importFile || importing) ? 'not-allowed' : 'pointer' }}>
                {importing ? 'Importing…' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
