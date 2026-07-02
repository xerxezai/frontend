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

const iColors: Record<string,{bg:string,color:string}> = { draft:{bg:'#f1f5f9',color:'#64748b'},sent:{bg:'#dbeafe',color:'#1d4ed8'},paid:{bg:'#d1fae5',color:'#065f46'},overdue:{bg:'#fee2e2',color:'#991b1b'},cancelled:{bg:'#fef9c3',color:'#854d0e'} };
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

const defI = { customer:'',issue_date:'',due_date:'',status:'draft',tax_rate:'',notes:'' };
const defP = { invoice:'',amount:'',method:'cash',payment_date:'',notes:'' };

const InvoicingModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Invoices'|'Payments'>('Invoices');

  const invoices = useERPList<any>('invoicing/invoices/');
  const payments = useERPList<any>('invoicing/payments/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [iF,        setIF]        = useState({...defI});
  const [pF,        setPF]        = useState({...defP});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveInv = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...iF };
      if (iF.customer)  body.customer  = Number(iF.customer);  else delete body.customer;
      if (iF.tax_rate)  body.tax_rate  = Number(iF.tax_rate);  else delete body.tax_rate;
      if (editing) { await invoices.update(editing.id, body); toast.success('Invoice updated'); }
      else { await invoices.create(body); toast.success('Invoice created'); }
      close();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const savePay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...pF };
      if (pF.invoice) body.invoice = Number(pF.invoice); else delete body.invoice;
      body.amount = Number(pF.amount);
      if (editing) { await payments.update(editing.id, body); toast.success('Payment updated'); }
      else { await payments.create(body); toast.success('Payment recorded'); }
      close();
    } catch (e: any) { toast.error(e.message||'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab==='Invoices') await invoices.remove(delId!);
      else                   await payments.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (e: any) { toast.error(e.message||'Delete failed'); }
  };

  const iCols = [
    { key:'number',        label:'Number',   render:(r:any)=>r.number||r.id },
    { key:'customer_name', label:'Customer', render:(r:any)=>r.customer_name||r.customer||'—' },
    { key:'issue_date',    label:'Issued',   render:(r:any)=>r.issue_date||'—' },
    { key:'due_date',      label:'Due',      render:(r:any)=>r.due_date||'—' },
    { key:'status',        label:'Status',   render:(r:any)=>sbadge(r.status,iColors) },
    { key:'total',         label:'Total',    render:(r:any)=>`$${parseFloat(r.total||0).toFixed(2)}` },
  ];
  const pCols = [
    { key:'invoice',       label:'Invoice',  render:(r:any)=>r.invoice_number||r.invoice||'—' },
    { key:'amount',        label:'Amount',   render:(r:any)=>`$${parseFloat(r.amount||0).toFixed(2)}` },
    { key:'method',        label:'Method',   render:(r:any)=>r.method||'—' },
    { key:'payment_date',  label:'Date',     render:(r:any)=>r.payment_date||r.paid_at||'—' },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <button style={ts('Invoices')} onClick={()=>setTab('Invoices')}>Invoices</button>
        <button style={ts('Payments')} onClick={()=>setTab('Payments')}>Payments</button>
      </div>

      {tab==='Invoices' && <ERPTable title="Invoices" columns={iCols} data={invoices.data} loading={invoices.loading} error={invoices.error} isAdmin={isAdmin}
        onAdd={()=>{ setIF({...defI}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setIF({customer:String(r.customer||''),issue_date:r.issue_date||'',due_date:r.due_date||'',status:r.status||'draft',tax_rate:String(r.tax_rate||''),notes:r.notes||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Payments' && <ERPTable title="Payments" columns={pCols} data={payments.data} loading={payments.loading} error={payments.error} isAdmin={isAdmin}
        onAdd={()=>{ setPF({...defP}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setPF({invoice:String(r.invoice||''),amount:String(r.amount||''),method:r.method||'cash',payment_date:r.payment_date||r.paid_at||'',notes:r.notes||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {showModal && tab==='Invoices' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Invoice':'Add Invoice'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveInv} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Customer ID</label><input type="number" value={iF.customer} onChange={e=>setIF(f=>({...f,customer:e.target.value}))} style={inp} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Issue Date</label><input type="date" value={iF.issue_date} onChange={e=>setIF(f=>({...f,issue_date:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Due Date</label><input type="date" value={iF.due_date} onChange={e=>setIF(f=>({...f,due_date:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Status</label><select value={iF.status} onChange={e=>setIF(f=>({...f,status:e.target.value}))} style={inp}><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option></select></div>
                <div><label style={lbl}>Tax Rate %</label><input type="number" value={iF.tax_rate} onChange={e=>setIF(f=>({...f,tax_rate:e.target.value}))} style={inp} step="0.01" min="0" /></div>
              </div>
              <div><label style={lbl}>Notes</label><textarea value={iF.notes} onChange={e=>setIF(f=>({...f,notes:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal && tab==='Payments' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Payment':'Record Payment'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={savePay} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Invoice ID</label><input type="number" value={pF.invoice} onChange={e=>setPF(f=>({...f,invoice:e.target.value}))} style={inp} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Amount *</label><input type="number" value={pF.amount} onChange={e=>setPF(f=>({...f,amount:e.target.value}))} style={inp} required step="0.01" min="0" /></div>
                <div><label style={lbl}>Method</label><select value={pF.method} onChange={e=>setPF(f=>({...f,method:e.target.value}))} style={inp}><option value="cash">Cash</option><option value="bank_transfer">Bank Transfer</option><option value="credit_card">Credit Card</option><option value="cheque">Cheque</option><option value="online">Online</option></select></div>
              </div>
              <div><label style={lbl}>Payment Date</label><input type="date" value={pF.payment_date} onChange={e=>setPF(f=>({...f,payment_date:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Notes</label><textarea value={pF.notes} onChange={e=>setPF(f=>({...f,notes:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default InvoicingModule;
