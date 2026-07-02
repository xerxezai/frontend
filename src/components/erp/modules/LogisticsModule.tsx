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

const shipColors: Record<string,{bg:string,color:string}> = { pending:{bg:'#f1f5f9',color:'#64748b'},in_transit:{bg:'#dbeafe',color:'#1d4ed8'},out_for_delivery:{bg:'#fef3c7',color:'#92400e'},delivered:{bg:'#d1fae5',color:'#065f46'},failed:{bg:'#fee2e2',color:'#991b1b'},returned:{bg:'#fce7f3',color:'#9d174d'},picked_up:{bg:'#ede9fe',color:'#6d28d9'},attempted:{bg:'#fef9c3',color:'#854d0e'},exception:{bg:'#fee2e2',color:'#7f1d1d'} };
const sbadge = (val: string) => {
  const c = shipColors[val] ?? {bg:'#f1f5f9',color:'#64748b'};
  return <span style={{display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:c.bg,color:c.color}}>{val?.replace(/_/g,' ')}</span>;
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

const defS  = { customer:'',carrier:'',tracking_number:'',status:'pending',origin:'',destination:'',estimated_delivery:'' };
const defTU = { shipment:'',status:'picked_up',location:'',notes:'',timestamp:'' };

const LogisticsModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Shipments'|'Tracking'>('Shipments');

  const shipments = useERPList<any>('logistics/shipments/');
  const tracking  = useERPList<any>('logistics/tracking-updates/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [sF,        setSF]        = useState({...defS});
  const [tF,        setTF]        = useState({...defTU});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...sF };
      if (sF.customer) body.customer = Number(sF.customer); else delete body.customer;
      if (editing) { await shipments.update(editing.id, body); toast.success('Shipment updated'); }
      else { await shipments.create(body); toast.success('Shipment created'); }
      close();
    } catch (err: any) { toast.error(err.message||'Save failed'); }
  };

  const saveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...tF };
      if (tF.shipment) body.shipment = Number(tF.shipment); else delete body.shipment;
      if (editing) { await tracking.update(editing.id, body); toast.success('Update saved'); }
      else { await tracking.create(body); toast.success('Tracking update added'); }
      close();
    } catch (err: any) { toast.error(err.message||'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab==='Shipments') await shipments.remove(delId!);
      else                    await tracking.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (err: any) { toast.error(err.message||'Delete failed'); }
  };

  const sCols = [
    { key:'tracking_number',  label:'Tracking #',    render:(r:any)=>r.tracking_number||'—' },
    { key:'customer_name',    label:'Customer',      render:(r:any)=>r.customer_name||r.customer||'—' },
    { key:'carrier',          label:'Carrier',       render:(r:any)=>r.carrier||'—' },
    { key:'status',           label:'Status',        render:(r:any)=>sbadge(r.status) },
    { key:'estimated_delivery',label:'Est. Delivery',render:(r:any)=>r.estimated_delivery||'—' },
  ];
  const tCols = [
    { key:'shipment',  label:'Shipment',  render:(r:any)=>r.shipment_tracking||r.tracking_number||r.shipment||'—' },
    { key:'status',    label:'Status',    render:(r:any)=>sbadge(r.status) },
    { key:'location',  label:'Location',  render:(r:any)=>r.location||'—' },
    { key:'timestamp', label:'Time',      render:(r:any)=>r.timestamp?new Date(r.timestamp).toLocaleString():'—' },
    { key:'notes',     label:'Notes',     render:(r:any)=>r.notes||'—' },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <button style={ts('Shipments')} onClick={()=>setTab('Shipments')}>Shipments</button>
        <button style={ts('Tracking')}  onClick={()=>setTab('Tracking')}>Tracking Updates</button>
      </div>

      {tab==='Shipments' && <ERPTable title="Shipments" columns={sCols} data={shipments.data} loading={shipments.loading} error={shipments.error} isAdmin={isAdmin}
        onAdd={()=>{ setSF({...defS}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setSF({customer:String(r.customer||''),carrier:r.carrier||'',tracking_number:r.tracking_number||'',status:r.status||'pending',origin:r.origin||'',destination:r.destination||'',estimated_delivery:r.estimated_delivery||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Tracking' && <ERPTable title="Tracking Updates" columns={tCols} data={tracking.data} loading={tracking.loading} error={tracking.error} isAdmin={isAdmin}
        onAdd={()=>{ setTF({...defTU}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setTF({shipment:String(r.shipment||''),status:r.status||'picked_up',location:r.location||'',notes:r.notes||'',timestamp:r.timestamp?r.timestamp.slice(0,16):''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {showModal && tab==='Shipments' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Shipment':'Add Shipment'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveShipment} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Customer ID</label><input type="number" value={sF.customer} onChange={e=>setSF(f=>({...f,customer:e.target.value}))} style={inp} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Carrier</label><input value={sF.carrier} onChange={e=>setSF(f=>({...f,carrier:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Tracking Number</label><input value={sF.tracking_number} onChange={e=>setSF(f=>({...f,tracking_number:e.target.value}))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Status</label><select value={sF.status} onChange={e=>setSF(f=>({...f,status:e.target.value}))} style={inp}><option value="pending">Pending</option><option value="in_transit">In Transit</option><option value="out_for_delivery">Out for Delivery</option><option value="delivered">Delivered</option><option value="failed">Failed</option><option value="returned">Returned</option></select></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Origin</label><input value={sF.origin} onChange={e=>setSF(f=>({...f,origin:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Destination</label><input value={sF.destination} onChange={e=>setSF(f=>({...f,destination:e.target.value}))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Estimated Delivery</label><input type="date" value={sF.estimated_delivery} onChange={e=>setSF(f=>({...f,estimated_delivery:e.target.value}))} style={inp} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal && tab==='Tracking' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Update':'Add Tracking Update'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveTracking} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Shipment</label><select value={tF.shipment} onChange={e=>setTF(f=>({...f,shipment:e.target.value}))} style={inp}><option value="">— Select —</option>{shipments.data.map((s:any)=><option key={s.id} value={s.id}>{s.tracking_number||`#${s.id}`}</option>)}</select></div>
              <div><label style={lbl}>Status</label><select value={tF.status} onChange={e=>setTF(f=>({...f,status:e.target.value}))} style={inp}><option value="picked_up">Picked Up</option><option value="in_transit">In Transit</option><option value="out_for_delivery">Out for Delivery</option><option value="delivered">Delivered</option><option value="attempted">Attempted</option><option value="returned">Returned</option><option value="exception">Exception</option></select></div>
              <div><label style={lbl}>Location</label><input value={tF.location} onChange={e=>setTF(f=>({...f,location:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Timestamp</label><input type="datetime-local" value={tF.timestamp} onChange={e=>setTF(f=>({...f,timestamp:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Notes</label><textarea value={tF.notes} onChange={e=>setTF(f=>({...f,notes:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default LogisticsModule;
