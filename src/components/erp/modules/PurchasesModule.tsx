import { useState } from 'react';
import { useERPList, isSuperUser } from '../../../hooks/useERPApi';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:520,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };

const poColors: Record<string,{bg:string,color:string}> = { draft:{bg:'#f1f5f9',color:'#64748b'},sent:{bg:'#dbeafe',color:'#1d4ed8'},confirmed:{bg:'#fef3c7',color:'#92400e'},received:{bg:'#d1fae5',color:'#065f46'},cancelled:{bg:'#fee2e2',color:'#991b1b'} };
const sbadge = (val: string, map: Record<string,{bg:string,color:string}>) => {
  const c = map[val] ?? {bg:'#f1f5f9',color:'#64748b'};
  return <span style={{display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:c.bg,color:c.color}}>{val}</span>;
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

const defV  = { name:'',email:'',phone:'',address:'',is_active:'true' };
const defPO = { vendor:'',status:'draft',order_date:'',expected_date:'',notes:'' };

const PurchasesModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Vendors'|'Purchase Orders'>('Vendors');

  const vendors = useERPList<any>('purchases/vendors/');
  const pos     = useERPList<any>('purchases/purchase-orders/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [vF,        setVF]        = useState({...defV});
  const [poF,       setPOF]       = useState({...defPO});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...vF, is_active: vF.is_active==='true' };
      if (editing) { await vendors.update(editing.id, body); toast.success('Vendor updated'); }
      else { await vendors.create(body); toast.success('Vendor created'); }
      close();
    } catch (err: any) { toast.error(err.message||'Save failed'); }
  };

  const savePO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...poF };
      if (poF.vendor) body.vendor = Number(poF.vendor); else delete body.vendor;
      if (editing) { await pos.update(editing.id, body); toast.success('Purchase order updated'); }
      else { await pos.create(body); toast.success('Purchase order created'); }
      close();
    } catch (err: any) { toast.error(err.message||'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab==='Vendors') await vendors.remove(delId!);
      else                  await pos.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (err: any) { toast.error(err.message||'Delete failed'); }
  };

  const vCols = [
    { key:'code',      label:'Code',   render:(r:any)=>r.code||'—' },
    { key:'name',      label:'Name' },
    { key:'email',     label:'Email',  render:(r:any)=>r.email||'—' },
    { key:'phone',     label:'Phone',  render:(r:any)=>r.phone||'—' },
    { key:'is_active', label:'Active', render:(r:any)=>r.is_active?'✅':'❌' },
  ];
  const poCols = [
    { key:'number',       label:'PO #',      render:(r:any)=>r.number||r.id },
    { key:'vendor_name',  label:'Vendor',    render:(r:any)=>r.vendor_name||r.vendor||'—' },
    { key:'order_date',   label:'Date',      render:(r:any)=>r.order_date||'—' },
    { key:'expected_date',label:'Expected',  render:(r:any)=>r.expected_date||'—' },
    { key:'status',       label:'Status',    render:(r:any)=>sbadge(r.status,poColors) },
    { key:'total',        label:'Total',     render:(r:any)=>`₹${parseFloat(r.total||0).toFixed(2)}` },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <button style={ts('Vendors')}         onClick={()=>setTab('Vendors')}>Vendors</button>
        <button style={ts('Purchase Orders')} onClick={()=>setTab('Purchase Orders')}>Purchase Orders</button>
      </div>

      {tab==='Vendors' && <ERPTable title="Vendors" columns={vCols} data={vendors.data} loading={vendors.loading} error={vendors.error} isAdmin={isAdmin}
        onAdd={()=>{ setVF({...defV}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setVF({name:r.name||'',email:r.email||'',phone:r.phone||'',address:r.address||'',is_active:String(r.is_active??true)}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Purchase Orders' && <ERPTable title="Purchase Orders" columns={poCols} data={pos.data} loading={pos.loading} error={pos.error} isAdmin={isAdmin}
        onAdd={()=>{ setPOF({...defPO}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setPOF({vendor:String(r.vendor||''),status:r.status||'draft',order_date:r.order_date||'',expected_date:r.expected_date||'',notes:r.notes||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {showModal && tab==='Vendors' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Vendor':'Add Vendor'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveVendor} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Name *</label><input value={vF.name} onChange={e=>setVF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Email</label><input type="email" value={vF.email} onChange={e=>setVF(f=>({...f,email:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Phone</label><input value={vF.phone} onChange={e=>setVF(f=>({...f,phone:e.target.value}))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Address</label><textarea value={vF.address} onChange={e=>setVF(f=>({...f,address:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div><label style={lbl}>Active</label><select value={vF.is_active} onChange={e=>setVF(f=>({...f,is_active:e.target.value}))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal && tab==='Purchase Orders' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Purchase Order':'Create Purchase Order'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={savePO} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Vendor</label><select value={poF.vendor} onChange={e=>setPOF(f=>({...f,vendor:e.target.value}))} style={inp}><option value="">— Select Vendor —</option>{vendors.data.map((v:any)=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
              <div><label style={lbl}>Status</label><select value={poF.status} onChange={e=>setPOF(f=>({...f,status:e.target.value}))} style={inp}><option value="draft">Draft</option><option value="sent">Sent</option><option value="confirmed">Confirmed</option><option value="received">Received</option><option value="cancelled">Cancelled</option></select></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Order Date</label><input type="date" value={poF.order_date} onChange={e=>setPOF(f=>({...f,order_date:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Expected Delivery</label><input type="date" value={poF.expected_date} onChange={e=>setPOF(f=>({...f,expected_date:e.target.value}))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Notes</label><textarea value={poF.notes} onChange={e=>setPOF(f=>({...f,notes:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default PurchasesModule;
