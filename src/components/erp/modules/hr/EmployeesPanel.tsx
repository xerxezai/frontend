import { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { useERPList, erpUpload, isSuperUser } from '../../../../hooks/useERPApi';
import { toast } from 'react-toastify';
import ERPTable from '../../ERPTable';
import { useCurrency } from '../../../../context/CurrencyContext';
import PhoneInput from '../../../common/PhoneInput';

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:560,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };

const empStatusColors: Record<string,{bg:string,color:string}> = { active:{bg:'#d1fae5',color:'#065f46'},inactive:{bg:'#f1f5f9',color:'#64748b'},on_leave:{bg:'#fef3c7',color:'#92400e'},terminated:{bg:'#fee2e2',color:'#991b1b'} };
const sbadge = (val: string, map: Record<string,{bg:string,color:string}>) => {
  const c = map[val] ?? {bg:'#f1f5f9',color:'#64748b'};
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

const defEmp = {
  full_name:'',email:'',phone:'',department:'',designation:'',status:'active',salary:'',joined_on:'',user:'',
  date_of_birth:'',gender:'',address:'',emergency_contact_name:'',emergency_contact_phone:'',
};

export default function EmployeesPanel() {
  const isAdmin = isSuperUser();
  const { formatAmount, symbol, selectedCurrency } = useCurrency();
  const employees   = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const users       = useERPList<any>('hr/employees/linkable-users/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [empF,      setEmpF]      = useState({...defEmp});
  const [photoFile,    setPhotoFile]    = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const close = () => { setShowModal(false); setEditing(null); setPhotoFile(null); setPhotoPreview(''); };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const saveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fields: Record<string, any> = {
        full_name: empF.full_name, email: empF.email, phone: empF.phone, designation: empF.designation, status: empF.status,
        gender: empF.gender, address: empF.address,
        emergency_contact_name: empF.emergency_contact_name, emergency_contact_phone: empF.emergency_contact_phone,
        salary_currency: selectedCurrency,
      };
      if (empF.department) fields.department = Number(empF.department);
      if (empF.salary) fields.salary = Number(empF.salary);
      if (empF.joined_on) fields.joined_on = empF.joined_on;
      if (empF.date_of_birth) fields.date_of_birth = empF.date_of_birth;

      if (photoFile) {
        const formData = new FormData();
        Object.entries(fields).forEach(([k, v]) => formData.append(k, String(v)));
        if (empF.user) formData.append('user', String(Number(empF.user)));
        formData.append('profile_photo', photoFile);
        if (editing) await erpUpload(`hr/employees/${editing.id}/`, formData, 'PATCH');
        else await erpUpload('hr/employees/', formData, 'POST');
        await employees.reload();
      } else {
        const body = { ...fields, user: empF.user ? Number(empF.user) : null };
        if (editing) await employees.update(editing.id, body);
        else await employees.create(body);
      }
      toast.success(editing ? 'Employee updated' : 'Employee created');
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await employees.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const empCols = [
    { key:'code',            label:'EMP ID',      render:(r:any)=>r.code||'—' },
    { key:'full_name',       label:'Name' },
    { key:'email',           label:'Email',       render:(r:any)=>r.email||'—' },
    { key:'department_name', label:'Department',  render:(r:any)=>r.department_name||r.department||'—' },
    { key:'designation',     label:'Designation', render:(r:any)=>r.designation||'—' },
    { key:'status',          label:'Status',      render:(r:any)=>sbadge(r.status||'active',empStatusColors) },
    { key:'salary',          label:'Salary',      render:(r:any)=>r.salary?formatAmount(r.salary):'—' },
  ];

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <ERPTable title="Employees" columns={empCols} data={employees.data} loading={employees.loading} error={employees.error} isAdmin={isAdmin}
        onAdd={()=>{ setEmpF({...defEmp}); setEditing(null); setPhotoFile(null); setPhotoPreview(''); setShowModal(true); }}
        onEdit={r=>{
          setEditing(r);
          setEmpF({
            full_name:r.full_name||'',email:r.email||'',phone:r.phone||'',department:String(r.department||''),designation:r.designation||'',
            status:r.status||'active',salary:r.salary?String(r.salary):'',joined_on:r.joined_on||'',user:r.user?String(r.user):'',
            date_of_birth:r.date_of_birth||'',gender:r.gender||'',address:r.address||'',
            emergency_contact_name:r.emergency_contact_name||'',emergency_contact_phone:r.emergency_contact_phone||'',
          });
          setPhotoFile(null);
          setPhotoPreview(r.profile_photo||'');
          setShowModal(true);
        }}
        onDelete={id=>setDelId(id)} />

      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Employee':'Add Employee'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveEmployee} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'flex',justifyContent:'center',marginBottom:2}}>
                <div style={{position:'relative',width:88,height:88}}>
                  <div style={{width:88,height:88,borderRadius:'50%',overflow:'hidden',background:'#F8F7F4',border:'2px solid rgba(0,0,0,0.08)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {photoPreview
                      ? <img src={photoPreview} alt="Profile" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      : <User size={34} color="#C0BBB2" />}
                  </div>
                  <label htmlFor="emp-photo-input" style={{
                    position:'absolute',bottom:-2,right:-2,width:30,height:30,borderRadius:'50%',
                    background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',display:'flex',alignItems:'center',justifyContent:'center',
                    cursor:'pointer',border:'2px solid #fff',boxShadow:'0 2px 6px rgba(0,0,0,0.18)',
                  }}>
                    <Camera size={13} color="#fff" />
                  </label>
                  <input id="emp-photo-input" type="file" accept="image/png,image/jpeg,image/jpg,image/gif" onChange={onPhotoChange} style={{display:'none'}} />
                </div>
              </div>
              <div>
                <label style={lbl}>Employee ID</label>
                <input value={editing?.code || 'Auto-generated on save'} readOnly disabled style={{...inp,background:'#EFEBE4',color:'#9b9690',cursor:'not-allowed'}} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Full Name *</label><input value={empF.full_name} onChange={e=>setEmpF(f=>({...f,full_name:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>Email</label><input type="email" value={empF.email} onChange={e=>setEmpF(f=>({...f,email:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Phone</label><PhoneInput value={empF.phone} onChange={v=>setEmpF(f=>({...f,phone:v}))} /></div>
                <div><label style={lbl}>Department</label>
                  <select value={empF.department} onChange={e=>setEmpF(f=>({...f,department:e.target.value}))} style={inp}>
                    <option value="">— Select —</option>
                    {departments.data.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Designation</label><input value={empF.designation} onChange={e=>setEmpF(f=>({...f,designation:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Status</label><select value={empF.status} onChange={e=>setEmpF(f=>({...f,status:e.target.value}))} style={inp}><option value="active">Active</option><option value="on_leave">On Leave</option><option value="resigned">Resigned</option><option value="terminated">Terminated</option></select></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Salary</label>
                  <div style={{display:'flex'}}>
                    <span style={{display:'flex',alignItems:'center',padding:'0 12px',height:44,background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRight:'none',borderRadius:'9px 0 0 9px',fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:'#6B6B6B',flexShrink:0}}>{symbol}</span>
                    <input type="number" value={empF.salary} onChange={e=>setEmpF(f=>({...f,salary:e.target.value}))} style={{...inp,borderRadius:'0 9px 9px 0'}} step="0.01" min="0" />
                  </div>
                </div>
                <div><label style={lbl}>Date Joined</label><input type="date" value={empF.joined_on} onChange={e=>setEmpF(f=>({...f,joined_on:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Date of Birth</label><input type="date" value={empF.date_of_birth} onChange={e=>setEmpF(f=>({...f,date_of_birth:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Gender</label>
                  <select value={empF.gender} onChange={e=>setEmpF(f=>({...f,gender:e.target.value}))} style={inp}>
                    <option value="">— Select —</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>Address</label>
                <textarea value={empF.address} onChange={e=>setEmpF(f=>({...f,address:e.target.value}))} placeholder="Enter full address" rows={2} style={{...inp,resize:'vertical',fontFamily:"'DM Sans',sans-serif"}} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Emergency Contact Name</label><input value={empF.emergency_contact_name} onChange={e=>setEmpF(f=>({...f,emergency_contact_name:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Emergency Contact Phone</label><PhoneInput value={empF.emergency_contact_phone} onChange={v=>setEmpF(f=>({...f,emergency_contact_phone:v}))} /></div>
              </div>
              <div>
                <label style={lbl}>Link User Account</label>
                <select value={empF.user} onChange={e=>setEmpF(f=>({...f,user:e.target.value}))} style={inp}>
                  <option value="">— Not linked —</option>
                  {users.data.map((u:any)=>(
                    <option key={u.id} value={u.id}>{u.username}{u.email?` — ${u.email}`:''}</option>
                  ))}
                </select>
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
