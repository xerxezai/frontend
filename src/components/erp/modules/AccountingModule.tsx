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

const acctTypeColors: Record<string,{bg:string,color:string}> = { asset:{bg:'#dbeafe',color:'#1d4ed8'},liability:{bg:'#fee2e2',color:'#991b1b'},equity:{bg:'#d1fae5',color:'#065f46'},income:{bg:'#fef3c7',color:'#92400e'},expense:{bg:'#f3e8ff',color:'#7c3aed'} };

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

const defA  = { code:'',name:'',type:'asset',description:'',is_active:'true' };
const defJE = { date:'',description:'',reference:'',is_posted:'false' };

const AccountingModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Accounts'|'Journal Entries'>('Accounts');

  const accounts = useERPList<any>('accounting/accounts/');
  const entries  = useERPList<any>('accounting/journal-entries/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [aF,        setAF]        = useState({...defA});
  const [jF,        setJF]        = useState({...defJE});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...aF, is_active: aF.is_active==='true' };
      if (editing) { await accounts.update(editing.id, body); toast.success('Account updated'); }
      else { await accounts.create(body); toast.success('Account created'); }
      close();
    } catch (err: any) { toast.error(err.message||'Save failed'); }
  };

  const saveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...jF, is_posted: jF.is_posted==='true' };
      if (editing) { await entries.update(editing.id, body); toast.success('Entry updated'); }
      else { await entries.create(body); toast.success('Entry created'); }
      close();
    } catch (err: any) { toast.error(err.message||'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab==='Accounts') await accounts.remove(delId!);
      else                   await entries.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (err: any) { toast.error(err.message||'Delete failed'); }
  };

  const aCols = [
    { key:'code',        label:'Code' },
    { key:'name',        label:'Name' },
    { key:'type',        label:'Type',      render:(r:any)=>{ const c=acctTypeColors[r.type]||{bg:'#f1f5f9',color:'#64748b'}; return <span style={{display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,...c}}>{r.type}</span>; } },
    { key:'is_active',   label:'Active',    render:(r:any)=>r.is_active?'✅':'❌' },
    { key:'description', label:'Desc.',     render:(r:any)=>(r.description||'').substring(0,40)+(r.description?.length>40?'…':'') },
  ];
  const jCols = [
    { key:'number',      label:'#',         render:(r:any)=>r.number||r.id },
    { key:'date',        label:'Date',      render:(r:any)=>r.date||'—' },
    { key:'description', label:'Description',render:(r:any)=>(r.description||'').substring(0,50)+(r.description?.length>50?'…':'') },
    { key:'reference',   label:'Reference', render:(r:any)=>r.reference||'—' },
    { key:'is_posted',   label:'Status',    render:(r:any)=>(r.is_posted||r.posted)?<span style={{display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:'#d1fae5',color:'#065f46'}}>Posted</span>:<span style={{display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:'#fef3c7',color:'#92400e'}}>Draft</span> },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <button style={ts('Accounts')}        onClick={()=>setTab('Accounts')}>Accounts</button>
        <button style={ts('Journal Entries')} onClick={()=>setTab('Journal Entries')}>Journal Entries</button>
      </div>

      {tab==='Accounts' && <ERPTable title="Accounts" columns={aCols} data={accounts.data} loading={accounts.loading} error={accounts.error} isAdmin={isAdmin}
        onAdd={()=>{ setAF({...defA}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setAF({code:r.code||'',name:r.name||'',type:r.type||'asset',description:r.description||'',is_active:String(r.is_active??true)}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Journal Entries' && <ERPTable title="Journal Entries" columns={jCols} data={entries.data} loading={entries.loading} error={entries.error} isAdmin={isAdmin}
        onAdd={()=>{ setJF({...defJE}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setJF({date:r.date||'',description:r.description||'',reference:r.reference||'',is_posted:String(r.is_posted||r.posted||false)}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {showModal && tab==='Accounts' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Account':'Add Account'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveAccount} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Code *</label><input value={aF.code} onChange={e=>setAF(f=>({...f,code:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>Name *</label><input value={aF.name} onChange={e=>setAF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Type *</label><select value={aF.type} onChange={e=>setAF(f=>({...f,type:e.target.value}))} style={inp}><option value="asset">Asset</option><option value="liability">Liability</option><option value="equity">Equity</option><option value="income">Income</option><option value="expense">Expense</option></select></div>
                <div><label style={lbl}>Active</label><select value={aF.is_active} onChange={e=>setAF(f=>({...f,is_active:e.target.value}))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
              </div>
              <div><label style={lbl}>Description</label><textarea value={aF.description} onChange={e=>setAF(f=>({...f,description:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal && tab==='Journal Entries' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Entry':'Add Journal Entry'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveEntry} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Description *</label><input value={jF.description} onChange={e=>setJF(f=>({...f,description:e.target.value}))} style={inp} required /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Date</label><input type="date" value={jF.date} onChange={e=>setJF(f=>({...f,date:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Reference</label><input value={jF.reference} onChange={e=>setJF(f=>({...f,reference:e.target.value}))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Posted?</label><select value={jF.is_posted} onChange={e=>setJF(f=>({...f,is_posted:e.target.value}))} style={inp}><option value="false">Draft</option><option value="true">Posted</option></select></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default AccountingModule;
