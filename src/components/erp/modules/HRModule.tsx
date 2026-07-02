import { useState } from 'react';
import { useERPList, isSuperUser } from '../../../hooks/useERPApi';
import { toast } from 'react-toastify';
import ERPTable from '../ERPTable';

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:560,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };

const empStatusColors: Record<string,{bg:string,color:string}> = { active:{bg:'#d1fae5',color:'#065f46'},inactive:{bg:'#f1f5f9',color:'#64748b'},on_leave:{bg:'#fef3c7',color:'#92400e'},terminated:{bg:'#fee2e2',color:'#991b1b'} };
const leaveStatusColors: Record<string,{bg:string,color:string}> = { pending:{bg:'#fef3c7',color:'#92400e'},approved:{bg:'#d1fae5',color:'#065f46'},rejected:{bg:'#fee2e2',color:'#991b1b'},cancelled:{bg:'#f1f5f9',color:'#64748b'} };
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

const defEmp  = { full_name:'',email:'',phone:'',department:'',designation:'',status:'active',salary:'',date_joined:'' };
const defDept = { name:'',code:'',description:'' };
const defLeave = { employee:'',type:'annual',from_date:'',to_date:'',reason:'' };

const HRModule = () => {
  const isAdmin = isSuperUser();
  const [tab, setTab] = useState<'Employees'|'Departments'|'Leave Requests'>('Employees');

  const employees   = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const leaves      = useERPList<any>('hr/leave-requests/');

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [delId,     setDelId]     = useState<number|null>(null);
  const [empF,      setEmpF]      = useState({...defEmp});
  const [deptF,     setDeptF]     = useState({...defDept});
  const [leaveF,    setLeaveF]    = useState({...defLeave});

  const close = () => { setShowModal(false); setEditing(null); };

  const saveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...empF };
      if (empF.department) body.department = Number(empF.department); else delete body.department;
      if (empF.salary) body.salary = Number(empF.salary); else delete body.salary;
      if (!empF.date_joined) delete body.date_joined;
      if (editing) { await employees.update(editing.id, body); toast.success('Employee updated'); }
      else { await employees.create(body); toast.success('Employee created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const saveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await departments.update(editing.id, deptF); toast.success('Department updated'); }
      else { await departments.create(deptF); toast.success('Department created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const saveLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = { ...leaveF };
      if (leaveF.employee) body.employee = Number(leaveF.employee); else delete body.employee;
      if (editing) { await leaves.update(editing.id, body); toast.success('Leave request updated'); }
      else { await leaves.create(body); toast.success('Leave request submitted'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try {
      if (tab === 'Employees')      await employees.remove(delId!);
      else if (tab === 'Departments') await departments.remove(delId!);
      else                            await leaves.remove(delId!);
      toast.success('Deleted'); setDelId(null);
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const empCols = [
    { key:'full_name',       label:'Name' },
    { key:'email',           label:'Email',       render:(r:any)=>r.email||'—' },
    { key:'department_name', label:'Department',  render:(r:any)=>r.department_name||r.department||'—' },
    { key:'designation',     label:'Designation', render:(r:any)=>r.designation||'—' },
    { key:'status',          label:'Status',      render:(r:any)=>sbadge(r.status||'active',empStatusColors) },
    { key:'salary',          label:'Salary',      render:(r:any)=>r.salary?`$${parseFloat(r.salary).toFixed(2)}`:'—' },
  ];
  const deptCols = [
    { key:'code',            label:'Code' },
    { key:'name',            label:'Name' },
    { key:'description',     label:'Description', render:(r:any)=>(r.description||'').substring(0,50)+(r.description?.length>50?'…':'') },
  ];
  const leaveCols = [
    { key:'employee_name',   label:'Employee',    render:(r:any)=>r.employee_name||r.employee||'—' },
    { key:'type',            label:'Type',        render:(r:any)=>r.type?.replace(/_/g,' ')||'—' },
    { key:'from_date',       label:'From' },
    { key:'to_date',         label:'To' },
    { key:'days',            label:'Days',        render:(r:any)=>r.days||'—' },
    { key:'status',          label:'Status',      render:(r:any)=>sbadge(r.status||'pending',leaveStatusColors) },
  ];

  const ts = (t: string): React.CSSProperties => ({ borderRadius:8,padding:'7px 18px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'#C9883A':'transparent',color:tab===t?'#fff':'#6B6B6B',border:tab===t?'none':'1px solid rgba(0,0,0,0.10)' });

  return (
    <div>
      <style>{`@keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        <button style={ts('Employees')}     onClick={()=>setTab('Employees')}>Employees</button>
        <button style={ts('Departments')}   onClick={()=>setTab('Departments')}>Departments</button>
        <button style={ts('Leave Requests')} onClick={()=>setTab('Leave Requests')}>Leave Requests</button>
      </div>

      {tab==='Employees' && <ERPTable title="Employees" columns={empCols} data={employees.data} loading={employees.loading} error={employees.error} isAdmin={isAdmin}
        onAdd={()=>{ setEmpF({...defEmp}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setEmpF({full_name:r.full_name||'',email:r.email||'',phone:r.phone||'',department:String(r.department||''),designation:r.designation||'',status:r.status||'active',salary:r.salary?String(r.salary):'',date_joined:r.date_joined||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {tab==='Departments' && <ERPTable title="Departments" columns={deptCols} data={departments.data} loading={departments.loading} error={departments.error} isAdmin={isAdmin}
        onAdd={()=>{ setDeptF({...defDept}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setDeptF({name:r.name||'',code:r.code||'',description:r.description||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {tab==='Leave Requests' && <ERPTable title="Leave Requests" columns={leaveCols} data={leaves.data} loading={leaves.loading} error={leaves.error} isAdmin={isAdmin}
        onAdd={()=>{ setLeaveF({...defLeave}); setEditing(null); setShowModal(true); }}
        onEdit={r=>{ setEditing(r); setLeaveF({employee:String(r.employee||''),type:r.type||'annual',from_date:r.from_date||'',to_date:r.to_date||'',reason:r.reason||''}); setShowModal(true); }}
        onDelete={id=>setDelId(id)} />}

      {/* Employees modal */}
      {showModal && tab==='Employees' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Employee':'Add Employee'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveEmployee} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Full Name *</label><input value={empF.full_name} onChange={e=>setEmpF(f=>({...f,full_name:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>Email</label><input type="email" value={empF.email} onChange={e=>setEmpF(f=>({...f,email:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Phone</label><input value={empF.phone} onChange={e=>setEmpF(f=>({...f,phone:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Department</label>
                  <select value={empF.department} onChange={e=>setEmpF(f=>({...f,department:e.target.value}))} style={inp}>
                    <option value="">— Select —</option>
                    {departments.data.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Designation</label><input value={empF.designation} onChange={e=>setEmpF(f=>({...f,designation:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Status</label><select value={empF.status} onChange={e=>setEmpF(f=>({...f,status:e.target.value}))} style={inp}><option value="active">Active</option><option value="inactive">Inactive</option><option value="on_leave">On Leave</option><option value="terminated">Terminated</option></select></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Salary ($)</label><input type="number" value={empF.salary} onChange={e=>setEmpF(f=>({...f,salary:e.target.value}))} style={inp} step="0.01" min="0" /></div>
                <div><label style={lbl}>Date Joined</label><input type="date" value={empF.date_joined} onChange={e=>setEmpF(f=>({...f,date_joined:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Departments modal */}
      {showModal && tab==='Departments' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Department':'Add Department'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveDepartment} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>Name *</label><input value={deptF.name} onChange={e=>setDeptF(f=>({...f,name:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>Code *</label><input value={deptF.code} onChange={e=>setDeptF(f=>({...f,code:e.target.value.toUpperCase()}))} style={inp} required /></div>
              </div>
              <div><label style={lbl}>Description</label><textarea value={deptF.description} onChange={e=>setDeptF(f=>({...f,description:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Requests modal */}
      {showModal && tab==='Leave Requests' && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Leave Request':'Add Leave Request'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveLeave} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={lbl}>Employee</label>
                <select value={leaveF.employee} onChange={e=>setLeaveF(f=>({...f,employee:e.target.value}))} style={inp}>
                  <option value="">— Select Employee —</option>
                  {employees.data.map((emp:any)=><option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Leave Type *</label><select value={leaveF.type} onChange={e=>setLeaveF(f=>({...f,type:e.target.value}))} style={inp}><option value="annual">Annual</option><option value="sick">Sick</option><option value="casual">Casual</option><option value="maternity">Maternity</option><option value="paternity">Paternity</option><option value="unpaid">Unpaid</option><option value="other">Other</option></select></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>From Date *</label><input type="date" value={leaveF.from_date} onChange={e=>setLeaveF(f=>({...f,from_date:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>To Date *</label><input type="date" value={leaveF.to_date} onChange={e=>setLeaveF(f=>({...f,to_date:e.target.value}))} style={inp} required /></div>
              </div>
              <div><label style={lbl}>Reason</label><textarea value={leaveF.reason} onChange={e=>setLeaveF(f=>({...f,reason:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={()=>setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
};

export default HRModule;
