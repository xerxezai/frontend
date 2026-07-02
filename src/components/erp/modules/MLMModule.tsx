import { useState } from 'react';
import { useERPList, isSuperUser } from '../../../hooks/useERPApi';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:440,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };

const commColors: Record<string,{bg:string,color:string}> = { pending:{bg:'#fef3c7',color:'#92400e'},paid:{bg:'#d1fae5',color:'#065f46'},cancelled:{bg:'#fee2e2',color:'#991b1b'} };
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

const defCS = { level:'',percentage:'',description:'' };

const MLMModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Structures'|'Commissions'|'Profiles'>('Structures');

  const structures  = useERPList<any>('mlm/commission-structures/');
  const commissions = useERPList<any>('mlm/commissions/');
  const profiles    = useERPList<any>('mlm/profiles/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [csF,       setCsF]       = useState({...defCS});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { level: Number(csF.level), percentage: Number(csF.percentage), description: csF.description };
      if (editing) { await structures.update(editing.id, body); toast.success('Structure updated'); }
      else { await structures.create(body); toast.success('Structure created'); }
      close();
    } catch (err: any) { toast.error(err.message||'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      await structures.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (err: any) { toast.error(err.message||'Delete failed'); }
  };

  const csCols = [
    { key:'level',       label:'Level',      render:(r:any)=>`Level ${r.level}` },
    { key:'percentage',  label:'Commission', render:(r:any)=>`${r.percentage}%` },
    { key:'description', label:'Description',render:(r:any)=>r.description||'—' },
  ];
  const commCols = [
    { key:'earner_username', label:'Earner',   render:(r:any)=>r.earner_username||r.earner||'—' },
    { key:'source_username', label:'From',     render:(r:any)=>r.source_username||r.source_user||'—' },
    { key:'level',           label:'Level',    render:(r:any)=>`Level ${r.level}` },
    { key:'commission_rate', label:'Rate',     render:(r:any)=>`${r.commission_rate||0}%` },
    { key:'amount',          label:'Amount',   render:(r:any)=>`$${parseFloat(r.amount||0).toFixed(2)}` },
    { key:'status',          label:'Status',   render:(r:any)=>sbadge(r.status,commColors) },
    { key:'created_at',      label:'Date',     render:(r:any)=>r.created_at?new Date(r.created_at).toLocaleDateString():'—' },
  ];
  const profCols = [
    { key:'user_username',   label:'User',         render:(r:any)=>r.user_username||r.user||'—' },
    { key:'referral_code',   label:'Referral Code',render:(r:any)=>r.referral_code||'—' },
    { key:'total_referrals', label:'Referrals',    render:(r:any)=>r.total_referrals||0 },
    { key:'total_earnings',  label:'Earnings',     render:(r:any)=>`$${parseFloat(r.total_earnings||0).toFixed(2)}` },
    { key:'is_active',       label:'Active',       render:(r:any)=>r.is_active?'✅':'❌' },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        <button style={ts('Structures')}  onClick={()=>setTab('Structures')}>Commission Structures</button>
        <button style={ts('Commissions')} onClick={()=>setTab('Commissions')}>Commissions</button>
        <button style={ts('Profiles')}    onClick={()=>setTab('Profiles')}>MLM Profiles</button>
      </div>

      {tab==='Structures' && <ERPTable title="Commission Structures" columns={csCols} data={structures.data} loading={structures.loading} error={structures.error} isAdmin={isAdmin}
        onAdd={()=>{ setCsF({...defCS}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setCsF({level:String(r.level||''),percentage:String(r.percentage||''),description:r.description||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}
      {tab==='Commissions' && <ERPTable title="Commissions"  columns={commCols} data={commissions.data} loading={commissions.loading} error={commissions.error} isAdmin={false} />}
      {tab==='Profiles'    && <ERPTable title="MLM Profiles" columns={profCols}  data={profiles.data}   loading={profiles.loading}   error={profiles.error}   isAdmin={false} />}

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Structure':'Add Commission Structure'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveStructure} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Level (1–10) *</label><input type="number" value={csF.level} onChange={e=>setCsF(f=>({...f,level:e.target.value}))} style={inp} required min="1" max="10" /></div>
                <div><label style={lbl}>Commission % *</label><input type="number" value={csF.percentage} onChange={e=>setCsF(f=>({...f,percentage:e.target.value}))} style={inp} required step="0.01" min="0" max="100" /></div>
              </div>
              <div><label style={lbl}>Description</label><input value={csF.description} onChange={e=>setCsF(f=>({...f,description:e.target.value}))} style={inp} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default MLMModule;
