import { useState } from 'react';
import {
  Briefcase, Users, Cpu, DollarSign, Megaphone, ShoppingCart, Truck, HeartPulse,
  ShieldCheck, Package, Building2, Wrench, Scale, GraduationCap,
  Search, Pencil, Trash2, Plus, UserCog,
} from 'lucide-react';
import { useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import { toast } from 'react-toastify';
import { Card3D, FF, OG, DARK, WHITE, Skeleton, EmptyState } from './hrShared';

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:520,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };
const BORDER = 'rgba(0,0,0,0.07)';
const MUTED = '#6B6B6B';

const ICON_MAP: Record<string, React.ElementType> = {
  briefcase: Briefcase, users: Users, cpu: Cpu, 'dollar-sign': DollarSign, megaphone: Megaphone,
  'shopping-cart': ShoppingCart, truck: Truck, 'heart-pulse': HeartPulse, shield: ShieldCheck,
  package: Package, building: Building2, wrench: Wrench, scale: Scale, 'graduation-cap': GraduationCap,
};
const getDeptIcon = (name?: string) => ICON_MAP[name || ''] || Briefcase;

const deriveCode = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  if (words.length === 1) return words[0].slice(0, 5).toUpperCase();
  return words.map(w => w[0]).join('').slice(0, 6).toUpperCase();
};

function DelDlg({ onCancel, onConfirm }: { onCancel:()=>void; onConfirm:()=>void }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:1060,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:14,padding:'24px',maxWidth:380,width:'100%',borderTop:'2px solid #ef4444',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 20px 50px rgba(0,0,0,0.18)'}}>
        <h6 style={{fontWeight:800,marginBottom:8,color:'#1A1A1A'}}>Delete Department?</h6>
        <p style={{fontSize:13,color:'#6B6B6B',marginBottom:20}}>This cannot be undone. Employees in this department will become unassigned.</p>
        <div style={{display:'flex',gap:10}}>
          <button onClick={onCancel} style={{...CNCL,flex:1}}>Cancel</button>
          <button onClick={onConfirm} style={{flex:1,background:'rgba(239,68,68,0.10)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:9,padding:'9px',cursor:'pointer',color:'#ef4444',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13}}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const defDept = { name:'', code:'', description:'', color:'#c8a84b', head:'' };
type FilterMode = 'all' | 'with' | 'empty';

export default function DepartmentsPanel() {
  const isAdmin = isSuperUser();
  const departments = useERPList<any>('hr/departments/');
  const employees   = useERPList<any>('hr/employees/');
  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');

  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState<any>(null);
  const [delId,      setDelId]      = useState<number|null>(null);
  const [deptF,      setDeptF]      = useState({...defDept});
  const [codeTouched, setCodeTouched] = useState(false);
  const [query,  setQuery]  = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const close = () => { setShowModal(false); setEditing(null); };

  const openAdd = () => { setDeptF({...defDept}); setEditing(null); setCodeTouched(false); setShowModal(true); };
  const openEdit = (r: any) => {
    setEditing(r);
    setDeptF({ name:r.name||'', code:r.code||'', description:r.description||'', color:r.color||'#c8a84b', head:r.head?String(r.head):'' });
    setCodeTouched(true);
    setShowModal(true);
  };

  const onNameChange = (v: string) => setDeptF(f => ({ ...f, name: v, code: codeTouched ? f.code : deriveCode(v) }));
  const onCodeChange = (v: string) => { setCodeTouched(true); setDeptF(f => ({ ...f, code: v.toUpperCase() })); };

  const saveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { name: deptF.name, code: deptF.code, description: deptF.description, color: deptF.color };
      body.head = deptF.head ? Number(deptF.head) : null;
      if (editing) { await departments.update(editing.id, body); toast.success('Department updated'); }
      else { await departments.create(body); toast.success('Department created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await departments.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const totalDepartments = departments.data.length;
  const totalEmployees   = departments.data.reduce((sum: number, d: any) => sum + (d.employee_count || 0), 0);
  const emptyDeptCount   = departments.data.filter((d: any) => !(d.employee_count > 0)).length;

  const filtered = departments.data.filter((d: any) => {
    const q = query.trim().toLowerCase();
    if (q && !d.name?.toLowerCase().includes(q) && !d.code?.toLowerCase().includes(q)) return false;
    if (filter === 'with' && !(d.employee_count > 0)) return false;
    if (filter === 'empty' && d.employee_count > 0) return false;
    return true;
  });

  return (
    <div>
      <style>{`
        @keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes deptCardIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dept-stat-grid{grid-template-columns:repeat(3,1fr)}
        .dept-card-grid{grid-template-columns:1fr 1fr}
        @media (max-width:820px){
          .dept-stat-grid{grid-template-columns:1fr}
          .dept-card-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:DARK, margin:0, fontFamily:FF, letterSpacing:'-0.01em' }}>Departments</h2>
          <p style={{ color:MUTED, fontSize:13, margin:'4px 0 0', fontFamily:FF }}>Organize your teams and see headcount at a glance</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} style={{ ...SAVE, display:'flex', alignItems:'center', gap:6, padding:'10px 18px' }}>
            <Plus size={14} />Add Department
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gap:14, marginBottom:22 }} className="dept-stat-grid">
        <Card3D accent="#3b82f6" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Total Departments</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#3b82f6', fontFamily:FF, lineHeight:1 }}>{totalDepartments}</div>
        </Card3D>
        <Card3D accent="#10b981" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Total Employees</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#10b981', fontFamily:FF, lineHeight:1 }}>{totalEmployees}</div>
        </Card3D>
        <Card3D accent={OG} p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Empty Departments</div>
          <div style={{ fontSize:26, fontWeight:900, color:OG, fontFamily:FF, lineHeight:1 }}>{emptyDeptCount}</div>
        </Card3D>
      </div>

      {/* Search + filter */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:18 }}>
        <div style={{ position:'relative', flex:'1 1 220px', minWidth:200 }}>
          <Search size={14} color={MUTED} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
          <input
            value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search departments by name or code…"
            style={{ ...inp, paddingLeft:34 }}
          />
        </div>
        <div style={{ display:'flex', gap:4, background:WHITE, borderRadius:10, padding:4, border:`1px solid ${BORDER}` }}>
          {([['all','All'],['with','With Employees'],['empty','Empty']] as [FilterMode,string][]).map(([val,label]) => (
            <button key={val} onClick={()=>setFilter(val)} style={{
              border:'none', borderRadius:7, padding:'7px 14px', fontFamily:FF, fontWeight:700, fontSize:12.5,
              cursor:'pointer', whiteSpace:'nowrap',
              background: filter===val ? 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)' : 'transparent',
              color: filter===val ? '#fff' : MUTED,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      {departments.loading ? (
        <div style={{ display:'grid', gap:16 }} className="dept-card-grid"><Skeleton h={140} /><Skeleton h={140} /></div>
      ) : departments.error ? (
        <div className="alert alert-danger">{departments.error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          message={departments.data.length === 0 ? 'No departments yet.' : 'No departments match your search.'}
          cta={isAdmin && departments.data.length === 0 ? <button style={SAVE} onClick={openAdd}>Add Department</button> : undefined}
        />
      ) : (
        <div style={{ display:'grid', gap:16 }} className="dept-card-grid">
          {filtered.map((d: any, i: number) => {
            const Icon = getDeptIcon(d.icon);
            const accent = d.color || OG;
            return (
              <div key={d.id} style={{ animation: `deptCardIn 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s both` }}>
                <Card3D accent={accent} p="18px 20px">
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
                      <span style={{ width:42, height:42, borderRadius:11, background:`${accent}1c`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={19} color={accent} />
                      </span>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontFamily:FF, fontWeight:800, fontSize:15, color:DARK, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.name}</div>
                        <div style={{ fontFamily:FF, fontSize:11.5, color:'#9b9690', fontWeight:700, letterSpacing:'0.04em' }}>{d.code}</div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                        <button onClick={()=>openEdit(d)} title="Edit" style={{ background:'rgba(201,136,58,0.08)', color:OG, border:'1px solid rgba(201,136,58,0.22)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor:'pointer' }}>
                          <Pencil size={12} />
                        </button>
                        <button onClick={()=>setDelId(d.id)} title="Delete" style={{ background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.20)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor:'pointer' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily:FF, fontSize:12.5, color:MUTED, lineHeight:1.55, margin:'0 0 14px', minHeight:20 }}>
                    {d.description || 'No description yet.'}
                  </p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, paddingTop:12, borderTop:`1px solid ${BORDER}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:FF, fontSize:12, color:MUTED, minWidth:0 }}>
                      <UserCog size={13} color="#9b9690" style={{ flexShrink:0 }} />
                      <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.head_name || 'No head assigned'}</span>
                    </div>
                    <span style={{ fontFamily:FF, fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:20, background:`${accent}1c`, color:accent, flexShrink:0, whiteSpace:'nowrap' }}>
                      {d.employee_count ?? 0} {d.employee_count === 1 ? 'Employee' : 'Employees'}
                    </span>
                  </div>
                </Card3D>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:FF,fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Department':'Add Department'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveDepartment} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Name *</label><input value={deptF.name} onChange={e=>onNameChange(e.target.value)} style={inp} required /></div>
                <div><label style={lbl}>Code *</label><input value={deptF.code} onChange={e=>onCodeChange(e.target.value)} style={inp} required maxLength={20} /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div>
                  <label style={lbl}>Color</label>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <input type="color" value={deptF.color} onChange={e=>setDeptF(f=>({...f,color:e.target.value}))} style={{width:44,height:38,padding:2,border:'1px solid rgba(0,0,0,0.10)',borderRadius:8,cursor:'pointer',background:'#fff'}} />
                    <span style={{fontFamily:FF,fontSize:12.5,color:MUTED,fontWeight:600}}>{deptF.color}</span>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Department Head</label>
                  <select value={deptF.head} onChange={e=>setDeptF(f=>({...f,head:e.target.value}))} style={inp}>
                    <option value="">— No head assigned —</option>
                    {activeEmployees.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.code})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>Description *</label>
                <textarea value={deptF.description} onChange={e=>setDeptF(f=>({...f,description:e.target.value}))} placeholder="What does this department do?" required style={{...inp,resize:'vertical',minHeight:70,fontFamily:FF}} />
              </div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
