import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, Check, X as XIcon, Clock3, Eye, Download, CheckCircle2, XCircle, Clock, Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { Card3D, FF, OG, DARK, WHITE, Skeleton, EmptyState, SlidePanel, initials } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const STATUS_META: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  pending:  { label: 'Pending',  bg: '#fef3c7', color: '#92400e', icon: Clock },
  approved: { label: 'Approved', bg: '#d1fae5', color: '#065f46', icon: CheckCircle2 },
  rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b', icon: XCircle },
};

const RATE_META: Record<string, { label: string; short: string; bg: string; color: string }> = {
  '1.5x': { label: '1.5x — Standard Overtime',                 short: '1.5x', bg: '#dbeafe', color: '#1d4ed8' },
  '2x':   { label: '2x — Double Time (Weekends/Holidays)',      short: '2x',   bg: '#ede9fe', color: '#6d28d9' },
  '2.5x': { label: '2.5x — Special Overtime',                   short: '2.5x', bg: '#fef3c7', color: '#92400e' },
};
const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:FF,fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:MUTED,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:FF };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:FF,fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:FF,fontWeight:600,fontSize:13 };

const StatusBadge = ({ s }: { s: string }) => {
  const m = STATUS_META[s] ?? STATUS_META.pending;
  const Icon = m.icon;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:m.bg, color:m.color, fontFamily:FF }}>
      <Icon size={11} />{m.label}
    </span>
  );
};

const RateBadge = ({ r }: { r: string }) => {
  const m = RATE_META[r] ?? RATE_META['1.5x'];
  return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:800, background:m.bg, color:m.color, fontFamily:FF }}>{m.short}</span>;
};

const Avatar = ({ name, size = 32 }: { name: string; size?: number }) => (
  <span style={{ width:size, height:size, borderRadius:'50%', background:`${OG}22`, color:OG, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:FF, fontWeight:800, fontSize:size*0.36, flexShrink:0 }}>
    {initials(name)}
  </span>
);

const fmtDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
};
const fmtDateTime = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
};

const defForm = { employee: '', date: new Date().toISOString().slice(0, 10), extra_hours: '', reason: '', rate: '1.5x', amount: '' };

// ── Add Overtime modal — rate dropdown + manually-entered overtime amount ────
function AddOvertimeModal({ onClose, onSaved, employees, isAdmin, myEmployee, symbol }: {
  onClose: () => void; onSaved: () => void; employees: any[]; isAdmin: boolean; myEmployee: any;
  symbol: string;
}) {
  const [form, setForm] = useState({ ...defForm, employee: isAdmin ? '' : (myEmployee ? String(myEmployee.id) : '') });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employee || !form.extra_hours || !form.reason || !form.amount) { toast.error('Please fill all required fields.'); return; }
    setSaving(true);
    try {
      await erpFetch('hr/overtime/', {
        method: 'POST',
        body: JSON.stringify({ employee: Number(form.employee), date: form.date, extra_hours: form.extra_hours, reason: form.reason, rate: form.rate, amount: form.amount }),
      });
      onSaved();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add overtime entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:460,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
          <h5 style={{ fontFamily:FF,fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0 }}>Add Overtime Entry</h5>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:MUTED,fontSize:22 }}>&times;</button>
        </div>
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
          {isAdmin ? (
            <div>
              <label style={lbl}>Employee *</label>
              <select value={form.employee} onChange={e=>setForm(f=>({...f,employee:e.target.value}))} style={inp} required>
                <option value="">Select employee...</option>
                {employees.filter((e: any) => e.status === 'active').map((emp: any) => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.code})</option>)}
              </select>
            </div>
          ) : (
            <div>
              <label style={lbl}>Employee</label>
              <div style={{ ...inp, color: myEmployee ? DARK : '#ef4444', fontWeight:700 }}>
                {myEmployee ? `${myEmployee.full_name} (${myEmployee.code})` : 'No employee profile linked to your account'}
              </div>
            </div>
          )}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div><label style={lbl}>Date *</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inp} required /></div>
            <div><label style={lbl}>Extra Hours *</label><input type="number" step="0.5" min="0" value={form.extra_hours} onChange={e=>setForm(f=>({...f,extra_hours:e.target.value}))} style={inp} required /></div>
          </div>

          <div>
            <label style={lbl}>Overtime Amount *</label>
            <div style={{ display:'flex' }}>
              <span style={{ display:'flex', alignItems:'center', padding:'0 12px', background:'#F8F7F4', border:'1px solid rgba(0,0,0,0.10)', borderRight:'none', borderRadius:'9px 0 0 9px', fontFamily:FF, fontSize:13, fontWeight:700, color:MUTED, flexShrink:0 }}>{symbol}</span>
              <input
                type="number" step="0.01" min="0" placeholder="Enter overtime payment amount"
                value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
                style={{ ...inp, borderRadius:'0 9px 9px 0' }} required
              />
            </div>
          </div>

          <div>
            <label style={lbl}>Rate *</label>
            <select value={form.rate} onChange={e=>setForm(f=>({...f,rate:e.target.value}))} style={inp}>
              <option value="1.5x">1.5x — Standard Overtime</option>
              <option value="2x">2x — Double Time (Weekends/Holidays)</option>
              <option value="2.5x">2.5x — Special Overtime</option>
            </select>
          </div>
          <div><label style={lbl}>Reason *</label><textarea value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} required /></div>
          <div style={{ display:'flex',gap:10,marginTop:4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{...SAVE, cursor: saving?'wait':'pointer', opacity: saving?0.75:1}}>{saving ? 'Saving…' : 'Add Overtime'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Approve confirmation ──────────────────────────────────────────────────────
function ApproveDlg({ entry, employeeName, costLabel, onCancel, onConfirm, busy }: {
  entry: any; employeeName: string; costLabel: string; onCancel: () => void; onConfirm: () => void; busy?: boolean;
}) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1060, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:24, maxWidth:400, width:'100%', borderTop:'2px solid #10b981', fontFamily:FF, boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight:800, marginBottom:8, color:'#1A1A1A' }}>Approve Overtime?</h6>
        <p style={{ fontSize:13, color:MUTED, marginBottom:20, lineHeight:1.6 }}>
          Approve <strong style={{ color:DARK }}>{Number(entry.extra_hours).toFixed(1)} hours</strong> overtime for <strong style={{ color:DARK }}>{employeeName}</strong> on <strong style={{ color:DARK }}>{fmtDate(entry.date)}</strong>?<br />
          Cost: <strong style={{ color:'#10b981' }}>{costLabel}</strong>
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{...CNCL, flex:1}} disabled={busy}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex:1, background:'rgba(16,185,129,0.10)', border:'1px solid rgba(16,185,129,0.28)', borderRadius:9, padding:'9px', cursor: busy?'wait':'pointer', color:'#10b981', fontFamily:FF, fontWeight:700, fontSize:13 }}>
            {busy ? 'Please wait…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reject dialog — reason required ──────────────────────────────────────────
function RejectDlg({ onCancel, onConfirm, busy }: { onCancel: () => void; onConfirm: (reason: string) => void; busy?: boolean }) {
  const [reason, setReason] = useState('');
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1060, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:24, maxWidth:420, width:'100%', borderTop:'2px solid #ef4444', fontFamily:FF, boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight:800, marginBottom:8, color:'#1A1A1A' }}>Reject Overtime Request</h6>
        <p style={{ fontSize:13, color:MUTED, marginBottom:14 }}>Please provide a reason — this will be visible to the employee.</p>
        <label style={lbl}>Rejection Reason *</label>
        <textarea
          value={reason} onChange={e=>setReason(e.target.value)} placeholder="e.g. Not pre-approved by manager"
          style={{ ...inp, resize:'vertical', minHeight:80, marginBottom:16 }} autoFocus
        />
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{...CNCL, flex:1}} disabled={busy}>Cancel</button>
          <button
            onClick={()=>{ if (!reason.trim()) { toast.error('Rejection reason is required.'); return; } onConfirm(reason); }}
            disabled={busy}
            style={{ flex:1, background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:9, padding:9, cursor: busy?'wait':'pointer', color:'#ef4444', fontFamily:FF, fontWeight:700, fontSize:13 }}
          >
            {busy ? 'Rejecting…' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation ────────────────────────────────────────────────────────
function DeleteDlg({ entry, employeeName, onCancel, onConfirm, busy }: {
  entry: any; employeeName: string; onCancel: () => void; onConfirm: () => void; busy?: boolean;
}) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1060, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:24, maxWidth:400, width:'100%', borderTop:'2px solid #ef4444', fontFamily:FF, boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight:800, marginBottom:8, color:'#1A1A1A' }}>Delete Overtime Entry?</h6>
        <p style={{ fontSize:13, color:MUTED, marginBottom:20, lineHeight:1.6 }}>
          Are you sure you want to delete this overtime entry for <strong style={{ color:DARK }}>{employeeName}</strong> on <strong style={{ color:DARK }}>{fmtDate(entry.date)}</strong>? This action cannot be undone.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{...CNCL, flex:1}} disabled={busy}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex:1, background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:9, padding:'9px', cursor: busy?'wait':'pointer', color:'#ef4444', fontFamily:FF, fontWeight:700, fontSize:13 }}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail side panel ─────────────────────────────────────────────────────────
function DetailPanel({ entry, employee, formatAmount, onClose }: { entry: any; employee: any; formatAmount: (v: number) => string; onClose: () => void }) {
  const rejected = entry.status === 'rejected';
  const approved = entry.status === 'approved';
  const decided = approved || rejected;

  const steps = [
    { label: 'Submitted', sub: fmtDateTime(entry.created_at), done: true },
    { label: 'Pending Review', sub: decided ? undefined : 'Awaiting a decision', done: true },
    { label: rejected ? 'Rejected' : 'Approved', sub: decided ? fmtDateTime(entry.approved_at) : undefined, done: decided, danger: rejected },
  ];

  return (
    <SlidePanel title="Overtime Request" subtitle={`${entry.employee_name} · ${fmtDate(entry.date)}`} onClose={onClose}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <Avatar name={entry.employee_name || '?'} size={48} />
        <div>
          <div style={{ fontFamily:FF, fontWeight:800, fontSize:15, color:DARK }}>{entry.employee_name}</div>
          <div style={{ fontFamily:FF, fontSize:12, color:MUTED }}>{entry.employee_code} · {employee?.department_name || 'Unassigned'} · {employee?.designation || '—'}</div>
          {employee?.email && <div style={{ fontFamily:FF, fontSize:12, color:OG, marginTop:2 }}>{employee.email}</div>}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
        {[
          ['Date', fmtDate(entry.date)], ['Status', <StatusBadge key="s" s={entry.status} />],
          ['Extra Hours', `${Number(entry.extra_hours).toFixed(1)}h`], ['Rate', <RateBadge key="r" r={entry.rate} />],
        ].map(([label, val]) => (
          <div key={label as string}>
            <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#9b9690', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{label}</div>
            <div style={{ fontFamily:FF, fontSize:13, fontWeight:600, color:DARK }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:22 }}>
        <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#9b9690', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Reason</div>
        <p style={{ fontFamily:FF, fontSize:13, color:DARK, lineHeight:1.6, margin:0, background:'#F8F7F4', borderRadius:9, padding:'10px 14px' }}>{entry.reason || '—'}</p>
      </div>

      <div style={{ marginBottom:22, background:'#F8F7F4', borderRadius:10, padding:'14px 16px' }}>
        <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#9b9690', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Overtime Amount</div>
        <div style={{ fontFamily:FF, fontSize:18, fontWeight:800, color:'#10b981' }}>{formatAmount(entry.amount)}</div>
      </div>

      {rejected && entry.rejection_reason && (
        <div style={{ marginBottom:22, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.20)', borderRadius:9, padding:'12px 14px' }}>
          <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#991b1b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Rejection Reason</div>
          <p style={{ fontFamily:FF, fontSize:13, color:'#7f1d1d', lineHeight:1.6, margin:0 }}>{entry.rejection_reason}</p>
        </div>
      )}

      {decided && entry.approved_by_username && (
        <p style={{ fontFamily:FF, fontSize:12, color:MUTED, marginBottom:22 }}>
          {approved ? 'Approved' : 'Rejected'} by <strong style={{ color:DARK }}>{entry.approved_by_username}</strong> on {fmtDate(entry.approved_at)}
        </p>
      )}

      <div style={{ fontFamily:FF, fontSize:10.5, fontWeight:700, color:'#9b9690', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Timeline</div>
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
    </SlidePanel>
  );
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function OvertimeModule() {
  const { isCompanyAdmin, isHRManager } = useAccess();
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;
  // Deleting is a stricter bar than approve/reject — Super Admin and Company Admin only.
  // HR Manager can approve/reject (covered by isAdmin above) but not delete.
  const canDelete = isSuperUser() || isCompanyAdmin;
  const { formatAmount, symbol } = useCurrency();

  const overtime = useERPList<any>('hr/overtime/');
  const employees = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const employeeById = useMemo(() => Object.fromEntries(employees.data.map((e: any) => [e.id, e])), [employees.data]);

  const [myEmployee, setMyEmployee] = useState<any>(null);
  useEffect(() => {
    if (isAdmin) return;
    erpFetch('hr/employees/me/').then(setMyEmployee).catch(() => setMyEmployee(null));
  }, [isAdmin]);

  const [showAdd, setShowAdd] = useState(false);
  const [actioning, setActioning] = useState<number | null>(null);
  const [approving, setApproving] = useState<any>(null);
  const [rejecting, setRejecting] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);

  // Filters — "draft" input state committed to "applied" on Search click.
  const [searchInput, setSearchInput] = useState('');
  const [statusInput, setStatusInput] = useState<StatusFilter>('all');
  const [deptInput, setDeptInput] = useState('');
  const [dateFromInput, setDateFromInput] = useState('');
  const [dateToInput, setDateToInput] = useState('');
  const [applied, setApplied] = useState({ search: '', status: 'all' as StatusFilter, dept: '', dateFrom: '', dateTo: '' });

  const runSearch = () => setApplied({ search: searchInput.trim().toLowerCase(), status: statusInput, dept: deptInput, dateFrom: dateFromInput, dateTo: dateToInput });

  const filtered = useMemo(() => {
    return overtime.data.filter((o: any) => {
      if (applied.search && !(o.employee_name || '').toLowerCase().includes(applied.search)) return false;
      if (applied.status !== 'all' && o.status !== applied.status) return false;
      if (applied.dept && String(employeeById[o.employee]?.department || '') !== applied.dept) return false;
      if (applied.dateFrom && o.date < applied.dateFrom) return false;
      if (applied.dateTo && o.date > applied.dateTo) return false;
      return true;
    });
  }, [overtime.data, applied, employeeById]);

  // Stat cards — computed from the full (role-scoped) dataset, not the filtered view.
  const now = new Date();
  const isThisMonth = (iso: string) => { const d = new Date(iso); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); };
  const pendingCount = overtime.data.filter((o: any) => o.status === 'pending').length;
  const approvedThisMonth = overtime.data.filter((o: any) => o.status === 'approved' && isThisMonth(o.date)).length;
  const rejectedCount = overtime.data.filter((o: any) => o.status === 'rejected').length;
  const totalHoursThisMonth = overtime.data.filter((o: any) => isThisMonth(o.date)).reduce((s: number, o: any) => s + Number(o.extra_hours || 0), 0);
  const totalCostThisMonth = overtime.data.filter((o: any) => isThisMonth(o.date)).reduce((s: number, o: any) => s + Number(o.amount || 0), 0);

  const decide = async (id: number, action: 'approved' | 'rejected', rejection_reason?: string) => {
    setActioning(id);
    try {
      await erpFetch(`hr/overtime/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action, rejection_reason }) });
      toast.success(`Overtime ${action}`);
      overtime.reload();
      setApproving(null); setRejecting(null);
    } catch (e: any) {
      toast.error(e.message || 'Could not update this entry');
    } finally {
      setActioning(null);
    }
  };

  const handleDelete = async (id: number) => {
    setActioning(id);
    try {
      await erpFetch(`hr/overtime/${id}/`, { method: 'DELETE' });
      toast.success('Overtime entry deleted successfully');
      overtime.reload(); // list + stat cards are both derived from overtime.data, so this alone refreshes everything
      setDeleting(null);
    } catch (e: any) {
      toast.error(e.message || 'Could not delete this entry');
    } finally {
      setActioning(null);
    }
  };

  const exportExcel = () => {
    const header = ['Employee', 'Department', 'Date', 'Extra Hours', 'Rate', 'Estimated Cost', 'Status', 'Reason'];
    const rows = filtered.map((o: any) => [
      o.employee_name, employeeById[o.employee]?.department_name || '', o.date,
      Number(o.extra_hours).toFixed(1), RATE_META[o.rate]?.short || o.rate,
      formatAmount(o.amount), STATUS_META[o.status]?.label || o.status, o.reason,
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `overtime_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div>
      <style>{`@keyframes otRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:DARK, margin:0, fontFamily:FF, letterSpacing:'-0.01em' }}>Overtime</h2>
          <p style={{ color:MUTED, fontSize:13, margin:'4px 0 0', fontFamily:FF }}>Track and approve extra hours worked</p>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{ ...SAVE, display:'flex', alignItems:'center', gap:6, padding:'10px 18px' }}>
          <Plus size={14} />Add Overtime
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:22 }} className="ot-stat-grid">
        <style>{`
          @media (max-width:1100px){ .ot-stat-grid{grid-template-columns:repeat(3,1fr)} }
          @media (max-width:700px){ .ot-stat-grid{grid-template-columns:1fr 1fr} }
        `}</style>
        <Card3D accent={OG} p="16px 18px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Pending Approval</div>
          <div style={{ fontSize:24, fontWeight:900, color:OG, fontFamily:FF, lineHeight:1 }}>{pendingCount}</div>
        </Card3D>
        <Card3D accent="#10b981" p="16px 18px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Approved This Month</div>
          <div style={{ fontSize:24, fontWeight:900, color:'#10b981', fontFamily:FF, lineHeight:1 }}>{approvedThisMonth}</div>
        </Card3D>
        <Card3D accent="#ef4444" p="16px 18px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Rejected</div>
          <div style={{ fontSize:24, fontWeight:900, color:'#ef4444', fontFamily:FF, lineHeight:1 }}>{rejectedCount}</div>
        </Card3D>
        <Card3D accent="#3b82f6" p="16px 18px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Hours This Month</div>
          <div style={{ fontSize:24, fontWeight:900, color:'#3b82f6', fontFamily:FF, lineHeight:1 }}>{totalHoursThisMonth.toFixed(1)}h</div>
        </Card3D>
        <Card3D accent={OG} p="16px 18px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Cost This Month</div>
          <div style={{ fontSize:22, fontWeight:900, color:OG, fontFamily:FF, lineHeight:1 }}>{formatAmount(totalCostThisMonth)}</div>
        </Card3D>
      </div>

      {/* Filter bar */}
      <div style={{ background: WHITE, borderRadius: 12, border: `1px solid ${BORDER}`, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:4, flex:'1 1 200px', minWidth:180 }}>
            <label style={lbl}>Search Employee</label>
            <div style={{ position:'relative' }}>
              <Search size={13} color={MUTED} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)' }} />
              <input value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="Employee name…" style={{ ...inp, paddingLeft:30 }} />
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4, minWidth:150 }}>
            <label style={lbl}>Status</label>
            <select value={statusInput} onChange={e=>setStatusInput(e.target.value as StatusFilter)} style={inp}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={lbl}>From</label>
            <input type="date" value={dateFromInput} onChange={e=>setDateFromInput(e.target.value)} style={inp} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <label style={lbl}>To</label>
            <input type="date" value={dateToInput} onChange={e=>setDateToInput(e.target.value)} style={inp} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4, minWidth:170 }}>
            <label style={lbl}>Department</label>
            <select value={deptInput} onChange={e=>setDeptInput(e.target.value)} style={inp}>
              <option value="">All Departments</option>
              {departments.data.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <button onClick={runSearch} style={{ ...SAVE, display:'flex', alignItems:'center', gap:7, padding:'9px 18px' }}>
            <Search size={13} />Search
          </button>
          {filtered.length > 0 && (
            <button onClick={exportExcel} style={{ background:'#F8F7F4', color:DARK, border:`1px solid ${BORDER}`, borderRadius:9, padding:'9px 16px', fontFamily:FF, fontWeight:600, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
              <Download size={13} />Export to Excel
            </button>
          )}
        </div>
      </div>

      {overtime.loading ? (
        <Skeleton h={240} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Clock} message={overtime.data.length === 0 ? 'No overtime entries yet.' : 'No entries match your filters.'} cta={overtime.data.length === 0 ? <button style={SAVE} onClick={()=>setShowAdd(true)}>Add Overtime</button> : undefined} />
      ) : (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Employee', 'Department', 'Date', 'Hours', 'Rate', 'Cost', 'Reason', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}`, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o: any, i: number) => {
                  const emp = employeeById[o.employee];
                  const statusBg = STATUS_META[o.status]?.bg;
                  return (
                    <tr key={o.id} style={{ borderBottom: `1px solid ${BORDER}`, background: statusBg ? `${statusBg}55` : undefined, animation: `otRowIn 0.25s ease ${i*0.02}s both` }}>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <Avatar name={o.employee_name || '?'} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>{o.employee_name}</div>
                            <div style={{ fontSize:11, color:'#9b9690' }}>{o.employee_code}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px', color: MUTED, whiteSpace:'nowrap' }}>{emp?.department_name || '—'}</td>
                      <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{fmtDate(o.date)}</td>
                      <td style={{ padding: '11px 16px', fontWeight: 700 }}>{Number(o.extra_hours).toFixed(1)}h</td>
                      <td style={{ padding: '11px 16px' }}><RateBadge r={o.rate} /></td>
                      <td style={{ padding: '11px 16px', fontWeight: 700, color: OG, whiteSpace:'nowrap' }}>{formatAmount(o.amount)}</td>
                      <td style={{ padding: '11px 16px', color: MUTED, maxWidth: 160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={o.reason}>{o.reason}</td>
                      <td style={{ padding: '11px 16px' }}><StatusBadge s={o.status} /></td>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={()=>setViewing(o)} title="View" style={{ background:'rgba(0,0,0,0.04)', color:MUTED, border:'1px solid rgba(0,0,0,0.08)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor:'pointer', flexShrink:0 }}>
                            <Eye size={12} />
                          </button>
                          {isAdmin && o.status === 'pending' && (
                            <>
                              <button onClick={()=>setApproving(o)} disabled={actioning===o.id} title="Approve" style={{ background:'rgba(16,185,129,0.10)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor: actioning===o.id?'wait':'pointer', flexShrink:0 }}>
                                <Check size={12} />
                              </button>
                              <button onClick={()=>setRejecting(o)} disabled={actioning===o.id} title="Reject" style={{ background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.22)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor: actioning===o.id?'wait':'pointer', flexShrink:0 }}>
                                <XIcon size={12} />
                              </button>
                            </>
                          )}
                          {o.status !== 'pending' && (
                            <span style={{ color: '#9ca3af', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, marginLeft: 2 }}>
                              <Clock3 size={11} />{o.approved_by_username ? `by ${o.approved_by_username}` : '—'}
                            </span>
                          )}
                          {canDelete && (
                            <button onClick={()=>setDeleting(o)} disabled={actioning===o.id} title="Delete" style={{ background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.22)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, cursor: actioning===o.id?'wait':'pointer', flexShrink:0 }}>
                              <Trash2 size={12} />
                            </button>
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

      {showAdd && (
        <AddOvertimeModal
          onClose={()=>setShowAdd(false)}
          onSaved={()=>{ setShowAdd(false); overtime.reload(); toast.success('Overtime entry added'); }}
          employees={employees.data} isAdmin={isAdmin} myEmployee={myEmployee}
          symbol={symbol}
        />
      )}

      {approving && (
        <ApproveDlg
          entry={approving} employeeName={approving.employee_name} costLabel={formatAmount(approving.amount)}
          busy={actioning===approving.id}
          onCancel={()=>setApproving(null)} onConfirm={()=>decide(approving.id, 'approved')}
        />
      )}
      {rejecting && (
        <RejectDlg busy={actioning===rejecting.id} onCancel={()=>setRejecting(null)} onConfirm={(reason)=>decide(rejecting.id, 'rejected', reason)} />
      )}
      {viewing && (
        <DetailPanel entry={viewing} employee={employeeById[viewing.employee]} formatAmount={formatAmount} onClose={()=>setViewing(null)} />
      )}
      {deleting && (
        <DeleteDlg
          entry={deleting} employeeName={deleting.employee_name}
          busy={actioning===deleting.id}
          onCancel={()=>setDeleting(null)} onConfirm={()=>handleDelete(deleting.id)}
        />
      )}
    </div>
  );
}
