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

const leadStatusColors: Record<string,{bg:string,color:string}> = { new:{bg:'#dbeafe',color:'#1d4ed8'},contacted:{bg:'#fef3c7',color:'#92400e'},qualified:{bg:'#ede9fe',color:'#6d28d9'},won:{bg:'#d1fae5',color:'#065f46'},lost:{bg:'#fee2e2',color:'#991b1b'} };
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

const defCust = { name:'',company:'',email:'',phone:'',industry:'',is_active:'true' };
const defLead = { name:'',company:'',email:'',source:'website',status:'new',estimated_value:'' };
const defAct  = { type:'call',summary:'',occurred_at:'' };

const CRMModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Customers'|'Leads'|'Activities'>('Customers');

  const customers  = useERPList<any>('crm/customers/');
  const leads      = useERPList<any>('crm/leads/');
  const activities = useERPList<any>('crm/activities/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [custF,     setCustF]     = useState({...defCust});
  const [leadF,     setLeadF]     = useState({...defLead});
  const [actF,      setActF]      = useState({...defAct});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...custF, is_active: custF.is_active === 'true' };
      if (editing) { await customers.update(editing.id, body); toast.success('Customer updated'); }
      else { await customers.create(body); toast.success('Customer created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const saveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...leadF };
      if (leadF.estimated_value) body.estimated_value = Number(leadF.estimated_value);
      else delete body.estimated_value;
      if (editing) { await leads.update(editing.id, body); toast.success('Lead updated'); }
      else { await leads.create(body); toast.success('Lead created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const saveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await activities.update(editing.id, actF); toast.success('Activity updated'); }
      else { await activities.create(actF); toast.success('Activity created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab === 'Customers')  await customers.remove(delId!);
      else if (tab === 'Leads') await leads.remove(delId!);
      else                      await activities.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const custCols = [
    { key:'name',      label:'Name' },
    { key:'company',   label:'Company',  render:(r:any)=>r.company||'—' },
    { key:'email',     label:'Email',    render:(r:any)=>r.email||'—' },
    { key:'phone',     label:'Phone',    render:(r:any)=>r.phone||'—' },
    { key:'industry',  label:'Industry', render:(r:any)=>r.industry||'—' },
    { key:'is_active', label:'Active',   render:(r:any)=>r.is_active?'✅':'❌' },
  ];
  const leadCols = [
    { key:'name',            label:'Name' },
    { key:'company',         label:'Company',  render:(r:any)=>r.company||'—' },
    { key:'email',           label:'Email',    render:(r:any)=>r.email||'—' },
    { key:'source',          label:'Source',   render:(r:any)=>r.source||'—' },
    { key:'status',          label:'Status',   render:(r:any)=>sbadge(r.status||'new',leadStatusColors) },
    { key:'estimated_value', label:'Value',    render:(r:any)=>r.estimated_value?`$${parseFloat(r.estimated_value).toFixed(2)}`:'—' },
  ];
  const actCols = [
    { key:'type',        label:'Type',    render:(r:any)=>r.type||'—' },
    { key:'summary',     label:'Summary', render:(r:any)=>(r.summary||'').substring(0,60)+(r.summary?.length>60?'…':'') },
    { key:'occurred_at', label:'Date',    render:(r:any)=>r.occurred_at?new Date(r.occurred_at).toLocaleString():'—' },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        <button style={ts('Customers')}  onClick={()=>setTab('Customers')}>Customers</button>
        <button style={ts('Leads')}      onClick={()=>setTab('Leads')}>Leads</button>
        <button style={ts('Activities')} onClick={()=>setTab('Activities')}>Activities</button>
      </div>

      {tab==='Customers' && <ERPTable title="Customers" columns={custCols} data={customers.data} loading={customers.loading} error={customers.error} isAdmin={isAdmin}
        onAdd={()=>{ setCustF({...defCust}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setCustF({name:r.name||'',company:r.company||'',email:r.email||'',phone:r.phone||'',industry:r.industry||'',is_active:String(r.is_active??true)}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {tab==='Leads' && <ERPTable title="Leads" columns={leadCols} data={leads.data} loading={leads.loading} error={leads.error} isAdmin={isAdmin}
        onAdd={()=>{ setLeadF({...defLead}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setLeadF({name:r.name||'',company:r.company||'',email:r.email||'',source:r.source||'website',status:r.status||'new',estimated_value:r.estimated_value?String(r.estimated_value):''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {tab==='Activities' && <ERPTable title="Activities" columns={actCols} data={activities.data} loading={activities.loading} error={activities.error} isAdmin={isAdmin}
        onAdd={()=>{ setActF({...defAct}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setActF({type:r.type||'call',summary:r.summary||'',occurred_at:r.occurred_at?r.occurred_at.slice(0,16):''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {showModal && tab==='Customers' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Customer':'Add Customer'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveCustomer} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Name *</label><input value={custF.name} onChange={e=>setCustF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>Company</label><input value={custF.company} onChange={e=>setCustF(f=>({...f,company:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Email</label><input type="email" value={custF.email} onChange={e=>setCustF(f=>({...f,email:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Phone</label><input value={custF.phone} onChange={e=>setCustF(f=>({...f,phone:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Industry</label><input value={custF.industry} onChange={e=>setCustF(f=>({...f,industry:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Active</label><select value={custF.is_active} onChange={e=>setCustF(f=>({...f,is_active:e.target.value}))} style={inp}><option value="true">Yes</option><option value="false">No</option></select></div>
              </div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal && tab==='Leads' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Lead':'Add Lead'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveLead} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Name *</label><input value={leadF.name} onChange={e=>setLeadF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>Company</label><input value={leadF.company} onChange={e=>setLeadF(f=>({...f,company:e.target.value}))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Email</label><input type="email" value={leadF.email} onChange={e=>setLeadF(f=>({...f,email:e.target.value}))} style={inp} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Source</label><select value={leadF.source} onChange={e=>setLeadF(f=>({...f,source:e.target.value}))} style={inp}><option value="website">Website</option><option value="referral">Referral</option><option value="social">Social</option><option value="cold_call">Cold Call</option><option value="event">Event</option><option value="other">Other</option></select></div>
                <div><label style={lbl}>Status</label><select value={leadF.status} onChange={e=>setLeadF(f=>({...f,status:e.target.value}))} style={inp}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="won">Won</option><option value="lost">Lost</option></select></div>
              </div>
              <div><label style={lbl}>Estimated Value ($)</label><input type="number" value={leadF.estimated_value} onChange={e=>setLeadF(f=>({...f,estimated_value:e.target.value}))} style={inp} step="0.01" min="0" /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal && tab==='Activities' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Activity':'Add Activity'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveActivity} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Type *</label><select value={actF.type} onChange={e=>setActF(f=>({...f,type:e.target.value}))} style={inp}><option value="call">Call</option><option value="email">Email</option><option value="meeting">Meeting</option><option value="note">Note</option><option value="task">Task</option></select></div>
                <div><label style={lbl}>Date &amp; Time</label><input type="datetime-local" value={actF.occurred_at} onChange={e=>setActF(f=>({...f,occurred_at:e.target.value}))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Summary *</label><textarea value={actF.summary} onChange={e=>setActF(f=>({...f,summary:e.target.value}))} style={{...inp,resize:'vertical',minHeight:80}} required /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default CRMModule;
