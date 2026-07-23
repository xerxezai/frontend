import { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, Eye, Check, X as XIcon, Clock, CheckCircle2, XCircle, Ban,
  Palmtree, Stethoscope, AlertTriangle, Baby, Wallet, FileQuestion, Calendar,
} from 'lucide-react';
import { useERPList, erpFetch, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import { toast } from 'react-toastify';
import { Card3D, FF, OG, DARK, WHITE, Skeleton, EmptyState, SlidePanel, initials } from './hrShared';

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:'#6B6B6B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:"'DM Sans',sans-serif" };
const OVR: React.CSSProperties = { position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 };
const CRD: React.CSSProperties = { background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:560,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A',maxHeight:'85vh',overflowY:'auto' };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13 };
const BORDER = 'rgba(0,0,0,0.07)';
const MUTED = '#6B6B6B';

const LEAVE_TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  annual:    { label: 'Annual',    icon: Palmtree,      color: '#3b82f6' },
  sick:      { label: 'Sick',      icon: Stethoscope,   color: '#ef4444' },
  emergency: { label: 'Emergency', icon: AlertTriangle, color: '#f97316' },
  maternity: { label: 'Maternity', icon: Baby,          color: '#ec4899' },
  paternity: { label: 'Paternity', icon: Baby,          color: '#8b5cf6' },
  unpaid:    { label: 'Unpaid',    icon: Wallet,        color: '#6B6B6B' },
  other:     { label: 'Other',     icon: FileQuestion,  color: '#9b9690' },
};
const typeMeta = (t: string) => LEAVE_TYPE_META[t] || LEAVE_TYPE_META.other;

const STATUS_META: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   bg: '#fef3c7', color: '#92400e', icon: Clock },
  approved:  { label: 'Approved',  bg: '#d1fae5', color: '#065f46', icon: CheckCircle2 },
  rejected:  { label: 'Rejected',  bg: '#fee2e2', color: '#991b1b', icon: XCircle },
  cancelled: { label: 'Cancelled', bg: '#f1f5f9', color: '#64748b', icon: Ban },
};
const statusMeta = (s: string) => STATUS_META[s] || STATUS_META.pending;

const StatusBadge = ({ status }: { status: string }) => {
  const m = statusMeta(status);
  const Icon = m.icon;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, background:m.bg, color:m.color, fontSize:11, fontWeight:700, fontFamily:FF }}>
      <Icon size={11} />{m.label}
    </span>
  );
};

const Avatar = ({ photo, name, size = 32 }: { photo?: string; name: string; size?: number }) =>
  photo ? (
    <img src={photo} alt={name} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
  ) : (
    <span style={{ width:size, height:size, borderRadius:'50%', background:`${OG}22`, color:OG, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:FF, fontWeight:800, fontSize:size*0.36, flexShrink:0 }}>
      {initials(name)}
    </span>
  );

function ConfirmDlg({ title, message, confirmLabel, confirmColor, onCancel, onConfirm, busy }: {
  title: string; message: string; confirmLabel: string; confirmColor: string;
  onCancel: () => void; onConfirm: () => void; busy?: boolean;
}) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1060, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:24, maxWidth:380, width:'100%', borderTop:`2px solid ${confirmColor}`, fontFamily:FF, boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight:800, marginBottom:8, color:'#1A1A1A' }}>{title}</h6>
        <p style={{ fontSize:13, color:MUTED, marginBottom:20 }}>{message}</p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ ...CNCL, flex:1 }} disabled={busy}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex:1, background:`${confirmColor}18`, border:`1px solid ${confirmColor}48`, borderRadius:9, padding:9, cursor: busy ? 'wait' : 'pointer', color:confirmColor, fontFamily:FF, fontWeight:700, fontSize:13 }}>
            {busy ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectDlg({ onCancel, onConfirm, busy }: { onCancel: () => void; onConfirm: (reason: string) => void; busy?: boolean }) {
  const [reason, setReason] = useState('');
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1060, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:24, maxWidth:420, width:'100%', borderTop:'2px solid #ef4444', fontFamily:FF, boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight:800, marginBottom:8, color:'#1A1A1A' }}>Reject Leave Request</h6>
        <p style={{ fontSize:13, color:MUTED, marginBottom:14 }}>Let the employee know why — this is included in their notification email.</p>
        <textarea
          value={reason} onChange={e=>setReason(e.target.value)} placeholder="e.g. Team is short-staffed that week"
          style={{ ...inp, resize:'vertical', minHeight:80, marginBottom:16 }} autoFocus
        />
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ ...CNCL, flex:1 }} disabled={busy}>Cancel</button>
          <button onClick={()=>onConfirm(reason)} disabled={busy} style={{ flex:1, background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:9, padding:9, cursor: busy ? 'wait' : 'pointer', color:'#ef4444', fontFamily:FF, fontWeight:700, fontSize:13 }}>
            {busy ? 'Rejecting…' : 'Reject Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LeaveTimeline({ leave }: { leave: any }) {
  const rejected = leave.status === 'rejected';
  const decided = leave.status === 'approved' || rejected;
  const steps = [
    { label: 'Applied', sub: fmtDateTime(leave.created_at), done: true },
    { label: 'Pending Review', sub: decided ? undefined : 'Awaiting a decision', done: true },
    { label: rejected ? 'Rejected' : 'Approved', sub: decided ? fmtDateTime(leave.decided_at) : undefined, done: decided, danger: rejected },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ display:'flex', gap:12 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
            <span style={{
              width:12, height:12, borderRadius:'50%', flexShrink:0,
              background: s.done ? (s.danger ? '#ef4444' : OG) : '#e5e0d8',
              boxShadow: s.done ? `0 0 0 3px ${s.danger ? '#ef444422' : `${OG}22`}` : 'none',
            }} />
            {i < steps.length - 1 && <span style={{ width:2, flex:1, minHeight:28, background: steps[i+1].done ? (s.danger ? '#ef4444' : OG) : '#e5e0d8' }} />}
          </div>
          <div style={{ paddingBottom:22 }}>
            <div style={{ fontFamily:FF, fontWeight:700, fontSize:13, color: s.done ? DARK : '#c0bbb2' }}>{s.label}</div>
            {s.sub && <div style={{ fontFamily:FF, fontSize:11.5, color:MUTED, marginTop:2 }}>{s.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function fmtDateTime(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
const todayISO = () => new Date().toISOString().slice(0, 10);
const dayCount = (from: string, to: string) => {
  if (!from || !to) return null;
  const a = new Date(from), b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return null;
  return Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
};

const defLeave = { employee:'', type:'annual', from_date:'', to_date:'', reason:'' };
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function LeaveRequestsPanel() {
  const { isCompanyAdmin, isHRManager } = useAccess();
  // Super Admin / Company Admin / HR Manager manage everyone's leave; a regular employee
  // can still file their own request (self-service, see myEmployee below) but can't pick
  // who it's for, and can't approve/reject — the backend enforces both regardless of this
  // flag, this just keeps the UI honest about what will actually be allowed.
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;
  const [myEmployee, setMyEmployee] = useState<any>(null);
  useEffect(() => {
    if (isAdmin) return;
    erpFetch('hr/employees/me/').then(setMyEmployee).catch(() => setMyEmployee(null));
  }, [isAdmin]);
  const employees = useERPList<any>('hr/employees/');
  const employeeById = useMemo(() => Object.fromEntries(employees.data.map((e: any) => [e.id, e])), [employees.data]);
  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');

  // stat cards always reflect the true totals, independent of the table's active filters
  const allLeaves = useERPList<any>('hr/leave-requests/');

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => { const t = setTimeout(() => setQuery(queryInput), 350); return () => clearTimeout(t); }, [queryInput]);

  const leavesPath = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (query.trim()) params.set('search', query.trim());
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    const qs = params.toString();
    return `hr/leave-requests/${qs ? `?${qs}` : ''}`;
  }, [statusFilter, query, dateFrom, dateTo]);
  const leaves = useERPList<any>(leavesPath);

  const reloadAll = () => { leaves.reload(); allLeaves.reload(); };

  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [leaveF,    setLeaveF]    = useState({ ...defLeave });
  const [balance,   setBalance]   = useState<any>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [selected,   setSelected]   = useState<any>(null);
  const [approving,  setApproving]  = useState<any>(null);
  const [rejecting,  setRejecting]  = useState<any>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const close = () => { setShowModal(false); setEditing(null); };
  const openAdd = () => { setLeaveF({ ...defLeave, employee: isAdmin ? '' : String(myEmployee?.id ?? '') }); setEditing(null); setShowModal(true); };

  useEffect(() => {
    if (!showModal || !leaveF.employee || !leaveF.type) { setBalance(null); return; }
    setBalanceLoading(true);
    erpFetch(`hr/leave-requests/balance/?employee=${leaveF.employee}&leave_type=${leaveF.type}`)
      .then(setBalance)
      .catch(() => setBalance(null))
      .finally(() => setBalanceLoading(false));
  }, [showModal, leaveF.employee, leaveF.type]);

  const saveLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dayCount(leaveF.from_date, leaveF.to_date) === null) { toast.error('To date must be on or after the from date.'); return; }
    try {
      const body: any = { type: leaveF.type, from_date: leaveF.from_date, to_date: leaveF.to_date, reason: leaveF.reason };
      if (leaveF.employee) body.employee = Number(leaveF.employee);
      if (editing) await leaves.update(editing.id, body);
      else await leaves.create(body);
      toast.success(editing ? 'Leave request updated' : 'Leave request submitted');
      reloadAll();
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const doApprove = async () => {
    setActionBusy(true);
    try {
      await erpFetch(`hr/leave-requests/${approving.id}/approve/`, { method:'PATCH', body: JSON.stringify({ action:'approved' }) });
      toast.success('Leave approved — employee notified by email');
      setApproving(null); setSelected(null);
      reloadAll();
    } catch (err: any) { toast.error(err.message || 'Could not approve this request'); }
    finally { setActionBusy(false); }
  };

  const doReject = async (reason: string) => {
    setActionBusy(true);
    try {
      await erpFetch(`hr/leave-requests/${rejecting.id}/approve/`, { method:'PATCH', body: JSON.stringify({ action:'rejected', rejection_reason: reason }) });
      toast.success('Leave rejected — employee notified by email');
      setRejecting(null); setSelected(null);
      reloadAll();
    } catch (err: any) { toast.error(err.message || 'Could not reject this request'); }
    finally { setActionBusy(false); }
  };

  const totalCount    = allLeaves.data.length;
  const pendingCount  = allLeaves.data.filter((l: any) => l.status === 'pending').length;
  const approvedCount = allLeaves.data.filter((l: any) => l.status === 'approved').length;
  const rejectedCount = allLeaves.data.filter((l: any) => l.status === 'rejected').length;

  const formDays = dayCount(leaveF.from_date, leaveF.to_date);

  return (
    <div>
      <style>{`
        @keyframes erpModalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lrRowIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .lr-stat-grid{grid-template-columns:repeat(4,1fr)}
        @media (max-width:700px){ .lr-stat-grid{grid-template-columns:1fr 1fr} }
        .lr-filter-bar{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
      `}</style>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:DARK, margin:0, fontFamily:FF, letterSpacing:'-0.01em' }}>Leave Requests</h2>
          <p style={{ color:MUTED, fontSize:13, margin:'4px 0 0', fontFamily:FF }}>
            {isAdmin ? 'Review, approve and track time-off requests' : 'Your submitted leave requests'}
          </p>
        </div>
        <button onClick={openAdd} style={{ ...SAVE, display:'flex', alignItems:'center', gap:6, padding:'10px 18px' }}>
          <Plus size={14} />Add Leave Request
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gap:14, marginBottom:22 }} className="lr-stat-grid">
        <Card3D accent="#3b82f6" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Total Requests</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#3b82f6', fontFamily:FF, lineHeight:1 }}>{totalCount}</div>
        </Card3D>
        <Card3D accent={OG} p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Pending Approval</div>
          <div style={{ fontSize:26, fontWeight:900, color:OG, fontFamily:FF, lineHeight:1 }}>{pendingCount}</div>
        </Card3D>
        <Card3D accent="#10b981" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Approved</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#10b981', fontFamily:FF, lineHeight:1 }}>{approvedCount}</div>
        </Card3D>
        <Card3D accent="#ef4444" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Rejected</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#ef4444', fontFamily:FF, lineHeight:1 }}>{rejectedCount}</div>
        </Card3D>
      </div>

      {/* Filters */}
      <div className="lr-filter-bar" style={{ marginBottom:18 }}>
        <div style={{ position:'relative', flex:'1 1 220px', minWidth:200 }}>
          <Search size={14} color={MUTED} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
          <input value={queryInput} onChange={e=>setQueryInput(e.target.value)} placeholder="Search by employee name…" style={{ ...inp, paddingLeft:34 }} />
        </div>
        <div style={{ display:'flex', gap:4, background:WHITE, borderRadius:10, padding:4, border:`1px solid ${BORDER}` }}>
          {([['all','All'],['pending','Pending'],['approved','Approved'],['rejected','Rejected']] as [StatusFilter,string][]).map(([val,label]) => (
            <button key={val} onClick={()=>setStatusFilter(val)} style={{
              border:'none', borderRadius:7, padding:'7px 14px', fontFamily:FF, fontWeight:700, fontSize:12.5, cursor:'pointer', whiteSpace:'nowrap',
              background: statusFilter===val ? 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)' : 'transparent',
              color: statusFilter===val ? '#fff' : MUTED,
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <Calendar size={14} color={MUTED} />
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ ...inp, width:140 }} title="From" />
          <span style={{ color:MUTED, fontSize:12 }}>to</span>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ ...inp, width:140 }} title="To" />
          {(dateFrom || dateTo) && (
            <button onClick={()=>{setDateFrom('');setDateTo('');}} style={{ background:'none', border:'none', color:OG, fontFamily:FF, fontSize:12, fontWeight:700, cursor:'pointer' }}>Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      {leaves.loading ? (
        <div style={{ padding:20 }}><Skeleton h={280} /></div>
      ) : leaves.error ? (
        <div className="alert alert-danger">{leaves.error}</div>
      ) : leaves.data.length === 0 ? (
        <EmptyState icon={Clock} message="No leave requests match your filters." />
      ) : (
        <div style={{ background:WHITE, borderRadius:14, border:`1px solid ${BORDER}`, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, fontFamily:FF }}>
              <thead>
                <tr style={{ background:'#fafaf9' }}>
                  {['Employee','Type','From','To','Days','Reason','Status','Applied On',''].map(h => (
                    <th key={h} style={{ padding:'11px 16px', textAlign:'left', color:MUTED, fontWeight:700, fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', borderBottom:`1px solid ${BORDER}`, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaves.data.map((r: any, i: number) => {
                  const emp = employeeById[r.employee];
                  const tMeta = typeMeta(r.type);
                  const TIcon = tMeta.icon;
                  return (
                    <tr key={r.id} style={{ borderBottom:`1px solid ${BORDER}`, animation:`lrRowIn 0.3s ease ${i*0.02}s both` }}>
                      <td style={{ padding:'10px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <Avatar photo={emp?.profile_photo} name={r.employee_name || '?'} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>{r.employee_name || '—'}</div>
                            <div style={{ fontSize:11, color:'#9b9690' }}>{r.employee_code}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'10px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, background:`${tMeta.color}18`, color:tMeta.color, fontSize:11, fontWeight:700 }}>
                          <TIcon size={11} />{tMeta.label}
                        </span>
                      </td>
                      <td style={{ padding:'10px 16px', color:MUTED, whiteSpace:'nowrap' }}>{fmtDate(r.from_date)}</td>
                      <td style={{ padding:'10px 16px', color:MUTED, whiteSpace:'nowrap' }}>{fmtDate(r.to_date)}</td>
                      <td style={{ padding:'10px 16px', fontWeight:700, color:DARK }}>{r.days}</td>
                      <td style={{ padding:'10px 16px', color:MUTED, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={r.reason || ''}>{r.reason || '—'}</td>
                      <td style={{ padding:'10px 16px' }}><StatusBadge status={r.status} /></td>
                      <td style={{ padding:'10px 16px', color:MUTED, whiteSpace:'nowrap' }}>{fmtDate(r.created_at)}</td>
                      <td style={{ padding:'10px 16px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          <button onClick={()=>setSelected(r)} title="View" style={{ background:'rgba(0,0,0,0.04)', color:MUTED, border:'1px solid rgba(0,0,0,0.08)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor:'pointer', flexShrink:0 }}>
                            <Eye size={12} />
                          </button>
                          {isAdmin && r.status === 'pending' && (
                            <>
                              <button onClick={()=>setApproving(r)} title="Approve" style={{ background:'rgba(16,185,129,0.10)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor:'pointer', flexShrink:0 }}>
                                <Check size={12} />
                              </button>
                              <button onClick={()=>setRejecting(r)} title="Reject" style={{ background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.20)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor:'pointer', flexShrink:0 }}>
                                <XIcon size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit form */}
      {showModal && (
        <div style={OVR} onClick={close}>
          <div onClick={e=>e.stopPropagation()} style={{...CRD,animation:'erpModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h5 style={{fontFamily:FF,fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0}}>{editing?'Edit Leave Request':'Add Leave Request'}</h5>
              <button onClick={close} style={{background:'none',border:'none',cursor:'pointer',color:'#6B6B6B',fontSize:22}}>&times;</button>
            </div>
            <form onSubmit={saveLeave} style={{display:'flex',flexDirection:'column',gap:14}}>
              {isAdmin ? (
                <div>
                  <label style={lbl}>Employee *</label>
                  <select value={leaveF.employee} onChange={e=>setLeaveF(f=>({...f,employee:e.target.value}))} style={inp} required>
                    <option value="">— Select Employee —</option>
                    {activeEmployees.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.code})</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={lbl}>Employee</label>
                  <div style={{ ...inp, display:'flex', alignItems:'center', color: myEmployee ? DARK : '#ef4444', fontWeight:700 }}>
                    {myEmployee ? `${myEmployee.full_name} (${myEmployee.code})` : 'No employee profile linked to your account'}
                  </div>
                </div>
              )}

              <div>
                <label style={lbl}>Leave Type *</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {Object.entries(LEAVE_TYPE_META).map(([val, m]) => {
                    const TIcon = m.icon;
                    const active = leaveF.type === val;
                    return (
                      <button key={val} type="button" onClick={()=>setLeaveF(f=>({...f,type:val}))} style={{
                        display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'9px 6px',
                        borderRadius:9, cursor:'pointer', fontFamily:FF, fontSize:10.5, fontWeight:700,
                        border: active ? `1.5px solid ${m.color}` : '1px solid rgba(0,0,0,0.10)',
                        background: active ? `${m.color}14` : '#F8F7F4', color: active ? m.color : MUTED,
                      }}>
                        <TIcon size={15} />{m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {leaveF.employee && (
                <div style={{ background: balance?.no_policy ? 'rgba(239,68,68,0.06)' : '#F8F7F4', borderRadius:9, padding:'10px 14px', fontFamily:FF, fontSize:12, color: balance?.no_policy ? '#991b1b' : MUTED }}>
                  {balanceLoading ? 'Checking leave balance…' : balance?.no_policy
                    ? 'Leave policy not configured — contact HR'
                    : balance?.unlimited
                      ? <><strong style={{color:DARK}}>{typeMeta(leaveF.type).label}</strong> leave has no fixed yearly cap.</>
                      : balance
                        ? <><strong style={{color: balance.remaining > 0 ? DARK : '#ef4444'}}>{balance.remaining}</strong> of {balance.allowance} {typeMeta(leaveF.type).label.toLowerCase()} day{balance.allowance===1?'':'s'} remaining this year.</>
                        : 'Leave balance unavailable.'}
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div><label style={lbl}>From Date *</label><input type="date" min={todayISO()} value={leaveF.from_date} onChange={e=>setLeaveF(f=>({...f,from_date:e.target.value}))} style={inp} required /></div>
                <div><label style={lbl}>To Date *</label><input type="date" min={leaveF.from_date || todayISO()} value={leaveF.to_date} onChange={e=>setLeaveF(f=>({...f,to_date:e.target.value}))} style={inp} required /></div>
              </div>
              {leaveF.from_date && leaveF.to_date && (
                <div style={{ fontFamily:FF, fontSize:12.5, fontWeight:700, color: formDays===null ? '#ef4444' : OG }}>
                  {formDays===null ? 'To date must be on or after the from date.' : `${formDays} day${formDays===1?'':'s'} total`}
                </div>
              )}

              <div><label style={lbl}>Reason *</label><textarea value={leaveF.reason} onChange={e=>setLeaveF(f=>({...f,reason:e.target.value}))} placeholder="What's this leave for?" required style={{...inp,resize:'vertical',minHeight:70}} /></div>
              <div style={{display:'flex',gap:10,marginTop:4}}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing?'Update':'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selected && (() => {
        const emp = employeeById[selected.employee];
        const tMeta = typeMeta(selected.type);
        return (
          <SlidePanel title="Leave Request" subtitle={`${selected.employee_name} · ${tMeta.label}`} onClose={()=>setSelected(null)}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
              <Avatar photo={emp?.profile_photo} name={selected.employee_name || '?'} size={48} />
              <div>
                <div style={{ fontFamily:FF, fontWeight:800, fontSize:15, color:DARK }}>{selected.employee_name}</div>
                <div style={{ fontFamily:FF, fontSize:12, color:MUTED }}>{selected.employee_code} · {emp?.department_name || 'Unassigned'} · {emp?.designation || '—'}</div>
                {emp?.email && <div style={{ fontFamily:FF, fontSize:12, color:OG, marginTop:2 }}>{emp.email}</div>}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
              {[
                ['Leave Type', tMeta.label], ['Status', <StatusBadge key="s" status={selected.status} />],
                ['From', fmtDate(selected.from_date)], ['To', fmtDate(selected.to_date)],
                ['Total Days', String(selected.days)], ['Applied On', fmtDate(selected.created_at)],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#9b9690', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{label}</div>
                  <div style={{ fontFamily:FF, fontSize:13, fontWeight:600, color:DARK }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:22 }}>
              <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#9b9690', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Reason</div>
              <p style={{ fontFamily:FF, fontSize:13, color:DARK, lineHeight:1.6, margin:0, background:'#F8F7F4', borderRadius:9, padding:'10px 14px' }}>{selected.reason || 'No reason provided.'}</p>
            </div>

            {selected.status === 'rejected' && selected.rejection_reason && (
              <div style={{ marginBottom:22, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.20)', borderRadius:9, padding:'12px 14px' }}>
                <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#991b1b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Rejection Reason</div>
                <p style={{ fontFamily:FF, fontSize:13, color:'#7f1d1d', lineHeight:1.6, margin:0 }}>{selected.rejection_reason}</p>
              </div>
            )}

            {(selected.status === 'approved' || selected.status === 'rejected') && selected.decided_by_name && (
              <p style={{ fontFamily:FF, fontSize:12, color:MUTED, marginBottom:22 }}>
                {selected.status === 'approved' ? 'Approved' : 'Rejected'} by <strong style={{color:DARK}}>{selected.decided_by_name}</strong> on {fmtDate(selected.decided_at)}
              </p>
            )}

            <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#9b9690', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Timeline</div>
            <LeaveTimeline leave={selected} />

            {isAdmin && selected.status === 'pending' && (
              <div style={{ display:'flex', gap:10, marginTop:10 }}>
                <button onClick={()=>setApproving(selected)} style={{ flex:1, background:'rgba(16,185,129,0.10)', border:'1px solid rgba(16,185,129,0.28)', borderRadius:9, padding:'10px', cursor:'pointer', color:'#10b981', fontFamily:FF, fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <Check size={14} />Approve
                </button>
                <button onClick={()=>setRejecting(selected)} style={{ flex:1, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.24)', borderRadius:9, padding:'10px', cursor:'pointer', color:'#ef4444', fontFamily:FF, fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <XIcon size={14} />Reject
                </button>
              </div>
            )}
          </SlidePanel>
        );
      })()}

      {approving && (
        <ConfirmDlg
          title="Approve Leave Request?"
          message={`${approving.employee_name} will be notified by email that their ${typeMeta(approving.type).label.toLowerCase()} leave (${approving.days} day${approving.days===1?'':'s'}) has been approved.`}
          confirmLabel="Approve" confirmColor="#10b981" busy={actionBusy}
          onCancel={()=>setApproving(null)} onConfirm={doApprove}
        />
      )}
      {rejecting && (
        <RejectDlg onCancel={()=>setRejecting(null)} onConfirm={doReject} busy={actionBusy} />
      )}
    </div>
  );
}
