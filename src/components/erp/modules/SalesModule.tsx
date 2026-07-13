import { useState } from 'react';
import { useERPList, isSuperUser } from '../../../hooks/useERPApi';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:500,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };

const qColors: Record<string,{bg:string,color:string}> = { draft:{bg:'#f1f5f9',color:'#64748b'},sent:{bg:'#dbeafe',color:'#1d4ed8'},accepted:{bg:'#d1fae5',color:'#065f46'},rejected:{bg:'#fee2e2',color:'#991b1b'},expired:{bg:'#fef3c7',color:'#92400e'} };
const oColors: Record<string,{bg:string,color:string}> = { open:{bg:'#f1f5f9',color:'#64748b'},confirmed:{bg:'#dbeafe',color:'#1d4ed8'},fulfilled:{bg:'#d1fae5',color:'#065f46'},cancelled:{bg:'#fee2e2',color:'#991b1b'} };

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

const defQ = { number:'',customer:'',issue_date:'',status:'draft',valid_until:'',notes:'' };
const defO = { number:'',customer:'',order_date:'',status:'open',notes:'' };
const today = () => new Date().toISOString().slice(0,10);

/** Next sequential number for a prefix, based on the highest existing "PREFIX-NNN" in the list. */
const nextNumber = (prefix: string, existing: any[]) => {
  const max = existing.reduce((m, r) => {
    const match = /^[A-Z]+-(\d+)$/.exec(r.number || '');
    return match ? Math.max(m, parseInt(match[1], 10)) : m;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

const SalesModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Quotations'|'Orders'>('Quotations');

  const quotations = useERPList<any>('sales/quotations/');
  const orders     = useERPList<any>('sales/orders/');
  const customers  = useERPList<any>('crm/customers/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [qF,        setQF]        = useState({...defQ});
  const [oF,        setOF]        = useState({...defO});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveQuot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qF.number.trim())  { toast.error('Quotation number is required.'); return; }
    if (!qF.issue_date)     { toast.error('Issue date is required.'); return; }
    if (!qF.customer)       { toast.error('Please select a customer.'); return; }
    try {
      const body: any = {
        number: qF.number.trim(), issue_date: qF.issue_date, customer: Number(qF.customer),
        status: qF.status, valid_until: qF.valid_until || null, notes: qF.notes,
      };
      if (editing) { await quotations.update(editing.id, body); toast.success('Quotation updated'); }
      else { await quotations.create(body); toast.success('Quotation created'); }
      close();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const saveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oF.number.trim())  { toast.error('Order number is required.'); return; }
    if (!oF.order_date)     { toast.error('Order date is required.'); return; }
    if (!oF.customer)       { toast.error('Please select a customer.'); return; }
    try {
      const body: any = {
        number: oF.number.trim(), order_date: oF.order_date, customer: Number(oF.customer),
        status: oF.status, notes: oF.notes,
      };
      if (editing) { await orders.update(editing.id, body); toast.success('Order updated'); }
      else { await orders.create(body); toast.success('Order created'); }
      close();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab==='Quotations') await quotations.remove(delId!);
      else                     await orders.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (e: any) { toast.error(e.message||'Delete failed'); }
  };

  const qCols = [
    { key:'number',        label:'Number',     render:(r:any)=>r.number||r.id },
    { key:'customer_name', label:'Customer',   render:(r:any)=>r.customer_name||r.customer||'—' },
    { key:'valid_until',   label:'Valid Until',render:(r:any)=>r.valid_until||'—' },
    { key:'status',        label:'Status',     render:(r:any)=>sbadge(r.status,qColors) },
    { key:'total',         label:'Total',      render:(r:any)=>`₹${parseFloat(r.total||0).toFixed(2)}` },
  ];
  const oCols = [
    { key:'number',        label:'Number',  render:(r:any)=>r.number||r.id },
    { key:'customer_name', label:'Customer',render:(r:any)=>r.customer_name||r.customer||'—' },
    { key:'order_date',    label:'Date',    render:(r:any)=>r.order_date||'—' },
    { key:'status',        label:'Status',  render:(r:any)=>sbadge(r.status,oColors) },
    { key:'total',         label:'Total',   render:(r:any)=>`₹${parseFloat(r.total||0).toFixed(2)}` },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <button style={ts('Quotations')} onClick={()=>setTab('Quotations')}>Quotations</button>
        <button style={ts('Orders')}     onClick={()=>setTab('Orders')}>Sales Orders</button>
      </div>

      {tab==='Quotations' && <ERPTable title="Quotations" columns={qCols} data={quotations.data} loading={quotations.loading} error={quotations.error} isAdmin={isAdmin}
        onAdd={()=>{ setQF({...defQ, number:nextNumber('QT', quotations.data), issue_date:today()}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing({...r,_t:'q'}); setQF({number:r.number||'',customer:String(r.customer||''),issue_date:r.issue_date||'',status:r.status||'draft',valid_until:r.valid_until||'',notes:r.notes||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Orders' && <ERPTable title="Sales Orders" columns={oCols} data={orders.data} loading={orders.loading} error={orders.error} isAdmin={isAdmin}
        onAdd={()=>{ setOF({...defO, number:nextNumber('SO', orders.data), order_date:today()}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing({...r,_t:'o'}); setOF({number:r.number||'',customer:String(r.customer||''),status:r.status||'open',order_date:r.order_date||'',notes:r.notes||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {showModal && tab==='Quotations' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Quotation':'Add Quotation'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveQuot} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Quotation Number</label><input type="text" value={qF.number} onChange={e=>setQF(f=>({...f,number:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Customer</label><select value={qF.customer} onChange={e=>setQF(f=>({...f,customer:e.target.value}))} style={inp}>
                <option value="">— Select customer —</option>
                {customers.data.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
              <div><label style={lbl}>Issue Date</label><input type="date" value={qF.issue_date} onChange={e=>setQF(f=>({...f,issue_date:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Status</label><select value={qF.status} onChange={e=>setQF(f=>({...f,status:e.target.value}))} style={inp}><option value="draft">Draft</option><option value="sent">Sent</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="expired">Expired</option></select></div>
              <div><label style={lbl}>Valid Until</label><input type="date" value={qF.valid_until} onChange={e=>setQF(f=>({...f,valid_until:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Notes</label><textarea value={qF.notes} onChange={e=>setQF(f=>({...f,notes:e.target.value}))} style={{...inp,resize:'vertical',minHeight:80}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal && tab==='Orders' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Order':'Add Order'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveOrder} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Order Number</label><input type="text" value={oF.number} onChange={e=>setOF(f=>({...f,number:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Customer</label><select value={oF.customer} onChange={e=>setOF(f=>({...f,customer:e.target.value}))} style={inp}>
                <option value="">— Select customer —</option>
                {customers.data.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
              <div><label style={lbl}>Status</label><select value={oF.status} onChange={e=>setOF(f=>({...f,status:e.target.value}))} style={inp}><option value="open">Open</option><option value="confirmed">Confirmed</option><option value="fulfilled">Fulfilled</option><option value="cancelled">Cancelled</option></select></div>
              <div><label style={lbl}>Order Date</label><input type="date" value={oF.order_date} onChange={e=>setOF(f=>({...f,order_date:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Notes</label><textarea value={oF.notes} onChange={e=>setOF(f=>({...f,notes:e.target.value}))} style={{...inp,resize:'vertical',minHeight:80}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default SalesModule;
