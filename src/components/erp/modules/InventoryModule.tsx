import { useState, useMemo } from 'react';
import { useERPList, isSuperUser } from '../../../hooks/useERPApi';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';
import { Card3D } from './hr/hrShared';

const fmtINR = (v: string | number) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:520,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };

const movColors: Record<string,{bg:string,color:string}> = {
  in:       { bg:'#d1fae5', color:'#065f46' },
  out:      { bg:'#fee2e2', color:'#991b1b' },
  transfer: { bg:'#ede9fe', color:'#6d28d9' },
  adjust:   { bg:'#dbeafe', color:'#1d4ed8' },
};

function DelDlg({ onCancel, onConfirm }: { onCancel:()=>void; onConfirm:()=>void }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:1060,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:14,padding:'24px',maxWidth:380,width:'100%',borderTop:'2px solid #ef4444',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 20px 50px rgba(0,0,0,0.18)'}}>
        <h6 style={{fontWeight:800,marginBottom:8,color:'#1A1A1A'}}>Delete Record?</h6>
        <p style={{fontSize:13,color:'#6B6B6B',marginBottom:20}}>This cannot be undone.</p>
        <div style={{display:'flex',gap:10}}>
          <button onClick={onCancel} style={{...CNCL,flex:1}}>Cancel</button>
          <button onClick={onConfirm} style={{flex:1,background:'rgba(239,68,68,0.10)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:9,padding:'9px',cursor:'pointer',color:'#ef4444',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13}}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const defP   = { name:'',code:'',category:'',unit:'pcs',cost_price:'',sale_price:'',is_active:'true',min_stock_level:'0',initial_quantity:'',warehouse:'' };
const defW   = { name:'',location:'',is_active:'true' };
const defM   = { product:'',warehouse:'',type:'in',quantity:'',notes:'' };
const defCat = { name:'',description:'' };

const InventoryModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Products'|'Warehouses'|'Categories'|'Movements'>('Products');

  const products   = useERPList<any>('inventory/products/');
  const warehouses = useERPList<any>('inventory/warehouses/');
  const movements  = useERPList<any>('inventory/stock-movements/');
  const categories = useERPList<any>('inventory/categories/');

  const [modal,    setModal]    = useState<'none'|'addP'|'editP'|'addW'|'editW'|'addM'|'addCat'|'editCat'>('none');
  const [editing,  setEditing]  = useState<any>(null);
  const [delId,    setDelId]    = useState<number|null>(null);
  const [pF,       setPF]       = useState({...defP});
  const [wF,       setWF]       = useState({...defW});
  const [mF,       setMF]       = useState({...defM});
  const [catF,     setCatF]     = useState({...defCat});

  const [pSearch,   setPSearch]   = useState('');
  const [pCatFilter,setPCatFilter]= useState('');
  const [pStatusFilter,setPStatusFilter] = useState('');

  const closeModal = () => { setModal('none'); setEditing(null); };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { name: pF.name, unit: pF.unit, is_active: pF.is_active==='true', cost_price: Number(pF.cost_price)||0, sale_price: Number(pF.sale_price)||0, min_stock_level: Number(pF.min_stock_level)||0 };
      if (pF.code) body.code = pF.code;
      if (pF.category) body.category = Number(pF.category);
      if (editing) {
        await products.update(editing.id, body);
        toast.success('Product updated');
      } else {
        const created = await products.create(body);
        const qty = Number(pF.initial_quantity) || 0;
        if (qty > 0 && pF.warehouse) {
          await movements.create({ type:'in', product: created.id, warehouse: Number(pF.warehouse), quantity: qty, occurred_at: new Date().toISOString(), notes: 'Initial stock' });
        }
        toast.success('Product created');
      }
      closeModal();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { name: catF.name, description: catF.description };
      if (editing) { await categories.update(editing.id, body); toast.success('Category updated'); }
      else { await categories.create(body); toast.success('Category created'); }
      closeModal();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const saveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { name: wF.name, location: wF.location, is_active: wF.is_active==='true' };
      if (editing) { await warehouses.update(editing.id, body); toast.success('Warehouse updated'); }
      else { await warehouses.create(body); toast.success('Warehouse created'); }
      closeModal();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const saveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { type: mF.type, quantity: Number(mF.quantity), notes: mF.notes, occurred_at: new Date().toISOString() };
      if (mF.product)   body.product   = Number(mF.product);
      if (mF.warehouse) body.warehouse = Number(mF.warehouse);
      await movements.create(body);
      toast.success('Movement recorded');
      closeModal();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab==='Products')        await products.remove(delId!);
      else if (tab==='Warehouses') await warehouses.remove(delId!);
      else if (tab==='Categories') await categories.remove(delId!);
      else                          await movements.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (e: any) { toast.error(e.message||'Delete failed'); }
  };

  const pCols = [
    { key:'code',       label:'SKU' },
    { key:'name',       label:'Name' },
    { key:'category',   label:'Category',  render:(r:any)=>r.category_name||r.category||'—' },
    { key:'unit',       label:'Unit' },
    { key:'cost_price', label:'Cost',      render:(r:any)=>`₹${parseFloat(r.cost_price||0).toFixed(2)}` },
    { key:'sale_price', label:'Price',     render:(r:any)=>`₹${parseFloat(r.sale_price||0).toFixed(2)}` },
    { key:'current_stock', label:'Stock',  render:(r:any)=>(
        <span style={{display:'flex',alignItems:'center',gap:6}}>
          {r.current_stock ?? 0}
          {r.is_low_stock && <span style={{display:'inline-block',padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700,background:'#fee2e2',color:'#991b1b'}}>Low Stock</span>}
        </span>
      ) },
    { key:'is_active',  label:'Active',    render:(r:any)=>r.is_active?'✅':'❌' },
  ];
  const wCols = [
    { key:'code',      label:'Code' },
    { key:'name',      label:'Name' },
    { key:'location',  label:'Location',  render:(r:any)=>r.location||'—' },
    { key:'is_active', label:'Active',    render:(r:any)=>r.is_active?'✅':'❌' },
  ];
  const catCols = [
    { key:'code',        label:'Code' },
    { key:'name',        label:'Name' },
    { key:'description', label:'Description', render:(r:any)=>(r.description||'').substring(0,60)+(r.description?.length>60?'…':'') },
  ];
  const mCols = [
    { key:'product',   label:'Product',   render:(r:any)=>r.product_name||r.product||'—' },
    { key:'warehouse', label:'Warehouse', render:(r:any)=>r.warehouse_name||r.warehouse||'—' },
    { key:'type',      label:'Type',      render:(r:any)=>{ const c=movColors[r.type]||{bg:'#f1f5f9',color:'#64748b'}; return <span style={{display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,...c}}>{r.type}</span>; } },
    { key:'quantity',  label:'Qty' },
    { key:'date',      label:'Date',      render:(r:any)=>r.date||r.occurred_at?new Date(r.date||r.occurred_at).toLocaleDateString():'—' },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s', background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  const lowStockCount = useMemo(()=>products.data.filter((p:any)=>p.is_low_stock).length, [products.data]);
  const totalInventoryValue = useMemo(()=>products.data
    .filter((p:any)=>p.is_active)
    .reduce((sum:number,p:any)=>sum + (Number(p.cost_price)||0) * (Number(p.current_stock)||0), 0), [products.data]);

  const filteredProducts = useMemo(()=>products.data.filter((p:any)=>{
    if (pSearch) {
      const q = pSearch.toLowerCase();
      if (!(p.name||'').toLowerCase().includes(q) && !(p.code||'').toLowerCase().includes(q)) return false;
    }
    if (pCatFilter && String(p.category||'') !== pCatFilter) return false;
    if (pStatusFilter && String(p.is_active) !== pStatusFilter) return false;
    return true;
  }), [products.data, pSearch, pCatFilter, pStatusFilter]);

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:22 }} className="inv-stat-grid">
        <Card3D accent="#C9883A" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:'#6B6B6B', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", marginBottom:8 }}>Total Inventory Value</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#C9883A', fontFamily:"'DM Sans',sans-serif", lineHeight:1 }}>{fmtINR(Math.round(totalInventoryValue))}</div>
        </Card3D>
        <Card3D accent={lowStockCount>0?'#ef4444':'#10b981'} p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:'#6B6B6B', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", marginBottom:8 }}>Low Stock Items</div>
          <div style={{ fontSize:26, fontWeight:900, color:lowStockCount>0?'#ef4444':'#10b981', fontFamily:"'DM Sans',sans-serif", lineHeight:1 }}>{lowStockCount}</div>
        </Card3D>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        <button style={ts('Products')}   onClick={()=>setTab('Products')}>Products</button>
        <button style={ts('Warehouses')} onClick={()=>setTab('Warehouses')}>Warehouses</button>
        <button style={ts('Categories')} onClick={()=>setTab('Categories')}>Categories</button>
        <button style={ts('Movements')}  onClick={()=>setTab('Movements')}>Stock Movements</button>
      </div>

      {tab==='Products' && (
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <input value={pSearch} onChange={e=>setPSearch(e.target.value)} placeholder="Search by name or SKU…" style={{...inp,maxWidth:260}} />
          <select value={pCatFilter} onChange={e=>setPCatFilter(e.target.value)} style={{...inp,maxWidth:200}}>
            <option value="">All Categories</option>
            {categories.data.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={pStatusFilter} onChange={e=>setPStatusFilter(e.target.value)} style={{...inp,maxWidth:160}}>
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}

      {tab==='Products' && <ERPTable title="Products" columns={pCols} data={filteredProducts} loading={products.loading} error={products.error} isAdmin={isAdmin}
        onAdd={()=>{ setPF({...defP}); setEditing(null); setModal('addP'); }}
        onEdit={r=>{ setEditing(r); setPF({name:r.name||'',code:r.code||'',category:String(r.category||''),unit:r.unit||'pcs',cost_price:String(r.cost_price||''),sale_price:String(r.sale_price||''),is_active:String(r.is_active??true),min_stock_level:String(r.min_stock_level??'0'),initial_quantity:'',warehouse:''}); setModal('editP'); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Categories' && <ERPTable title="Categories" columns={catCols} data={categories.data} loading={categories.loading} error={categories.error} isAdmin={isAdmin}
        onAdd={()=>{ setCatF({...defCat}); setEditing(null); setModal('addCat'); }}
        onEdit={r=>{ setEditing(r); setCatF({name:r.name||'',description:r.description||''}); setModal('editCat'); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Warehouses' && <ERPTable title="Warehouses" columns={wCols} data={warehouses.data} loading={warehouses.loading} error={warehouses.error} isAdmin={isAdmin}
        onAdd={()=>{ setWF({...defW}); setEditing(null); setModal('addW'); }}
        onEdit={r=>{ setEditing(r); setWF({name:r.name||'',location:r.location||'',is_active:String(r.is_active??true)}); setModal('editW'); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Movements' && <ERPTable title="Stock Movements" columns={mCols} data={movements.data} loading={movements.loading} error={movements.error} isAdmin={isAdmin}
        onAdd={()=>{ setMF({...defM}); setEditing(null); setModal('addM'); }}
        onDelete={id=>setDelId(id)} />}

      {/* Product Modal */}
      {(modal==='addP'||modal==='editP') && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Product':'Add Product'}</h5>
              <button onClick={closeModal} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveProduct} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Name *</label><input value={pF.name} onChange={e=>setPF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>SKU / Product Code</label><input value={pF.code} onChange={e=>setPF(f=>({...f,code:e.target.value}))} style={inp} placeholder="auto-generated if blank" /></div>
                <div><label style={lbl}>Category</label>
                  <select value={pF.category} onChange={e=>setPF(f=>({...f,category:e.target.value}))} style={inp}>
                    <option value="">— None —</option>
                    {categories.data.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Unit</label><select value={pF.unit} onChange={e=>setPF(f=>({...f,unit:e.target.value}))} style={inp}><option value="pcs">Pieces</option><option value="kg">Kilogram</option><option value="lt">Litre</option><option value="hr">Hour</option><option value="lic">License</option><option value="sub">Subscription</option></select></div>
                <div><label style={lbl}>Cost Price</label><input type="number" value={pF.cost_price} onChange={e=>setPF(f=>({...f,cost_price:e.target.value}))} style={inp} step="0.01" min="0" /></div>
                <div><label style={lbl}>Sale Price</label><input type="number" value={pF.sale_price} onChange={e=>setPF(f=>({...f,sale_price:e.target.value}))} style={inp} step="0.01" min="0" /></div>
                <div><label style={lbl}>Active</label><select value={pF.is_active} onChange={e=>setPF(f=>({...f,is_active:e.target.value}))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
                <div><label style={lbl}>Min Stock Level</label><input type="number" value={pF.min_stock_level} onChange={e=>setPF(f=>({...f,min_stock_level:e.target.value}))} style={inp} step="0.01" min="0" /></div>
                {!editing && <div><label style={lbl}>Initial Quantity</label><input type="number" value={pF.initial_quantity} onChange={e=>setPF(f=>({...f,initial_quantity:e.target.value}))} style={inp} step="0.01" min="0" placeholder="0" /></div>}
                {!editing && <div><label style={lbl}>Warehouse{Number(pF.initial_quantity)>0?' *':''}</label>
                  <select value={pF.warehouse} onChange={e=>setPF(f=>({...f,warehouse:e.target.value}))} style={inp} required={Number(pF.initial_quantity)>0}>
                    <option value="">— Select —</option>
                    {warehouses.data.map((w:any)=><option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>}
              </div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={closeModal} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Warehouse Modal */}
      {(modal==='addW'||modal==='editW') && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Warehouse':'Add Warehouse'}</h5>
              <button onClick={closeModal} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveWarehouse} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Name *</label><input value={wF.name} onChange={e=>setWF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
              <div><label style={lbl}>Location</label><input value={wF.location} onChange={e=>setWF(f=>({...f,location:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Active</label><select value={wF.is_active} onChange={e=>setWF(f=>({...f,is_active:e.target.value}))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={closeModal} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {(modal==='addCat'||modal==='editCat') && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Category':'Add Category'}</h5>
              <button onClick={closeModal} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveCategory} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Name *</label><input value={catF.name} onChange={e=>setCatF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
              <div><label style={lbl}>Description</label><textarea value={catF.description} onChange={e=>setCatF(f=>({...f,description:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={closeModal} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      {modal==='addM' && (
        <div style={OVR} onClick={closeModal}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>Record Stock Movement</h5>
              <button onClick={closeModal} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveMovement} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Product</label><select value={mF.product} onChange={e=>setMF(f=>({...f,product:e.target.value}))} style={inp}><option value="">— Select —</option>{products.data.map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div><label style={lbl}>Warehouse</label><select value={mF.warehouse} onChange={e=>setMF(f=>({...f,warehouse:e.target.value}))} style={inp}><option value="">— Select —</option>{warehouses.data.map((w:any)=><option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Type</label><select value={mF.type} onChange={e=>setMF(f=>({...f,type:e.target.value}))} style={inp}><option value="in">Receipt (In)</option><option value="out">Issue (Out)</option><option value="transfer">Transfer</option><option value="adjust">Adjustment</option></select></div>
                <div><label style={lbl}>Quantity *</label><input type="number" value={mF.quantity} onChange={e=>setMF(f=>({...f,quantity:e.target.value}))} style={inp} required min="1" /></div>
              </div>
              <div><label style={lbl}>Notes</label><input value={mF.notes} onChange={e=>setMF(f=>({...f,notes:e.target.value}))} style={inp} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={closeModal} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>Record</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default InventoryModule;
