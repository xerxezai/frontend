import { useState } from 'react';
import { Plus, Clock, Check, X as XIcon, Clock3 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, isSuperUser } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import { Card3D, FF, OG, DARK, WHITE, Skeleton, EmptyState } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  pending:  { label: 'Pending',  bg: '#fef3c7', color: '#92400e' },
  approved: { label: 'Approved', bg: '#d1fae5', color: '#065f46' },
  rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
};

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:FF,fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:MUTED,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:FF };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:FF,fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:FF,fontWeight:600,fontSize:13 };

const StatusBadge = ({ s }: { s: string }) => {
  const m = STATUS_META[s] ?? STATUS_META.pending;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF }}>{m.label}</span>;
};

const defForm = { employee: '', date: new Date().toISOString().slice(0, 10), extra_hours: '', reason: '', rate: '1.5x' };

function AddOvertimeModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const employees = useERPList<any>('hr/employees/');
  const activeEmployees = employees.data.filter((e: any) => e.status === 'active');
  const [form, setForm] = useState({ ...defForm });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employee || !form.extra_hours || !form.reason) { toast.error('Please fill all required fields.'); return; }
    setSaving(true);
    try {
      await erpFetch('hr/overtime/', {
        method: 'POST',
        body: JSON.stringify({ employee: Number(form.employee), date: form.date, extra_hours: form.extra_hours, reason: form.reason, rate: form.rate }),
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
          <div>
            <label style={lbl}>Employee *</label>
            <select value={form.employee} onChange={e=>setForm(f=>({...f,employee:e.target.value}))} style={inp} required>
              <option value="">Select employee...</option>
              {activeEmployees.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.code})</option>)}
            </select>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div><label style={lbl}>Date *</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inp} required /></div>
            <div><label style={lbl}>Extra Hours *</label><input type="number" step="0.5" min="0" value={form.extra_hours} onChange={e=>setForm(f=>({...f,extra_hours:e.target.value}))} style={inp} required /></div>
          </div>
          <div>
            <label style={lbl}>Rate *</label>
            <select value={form.rate} onChange={e=>setForm(f=>({...f,rate:e.target.value}))} style={inp}>
              <option value="1.5x">1.5x</option>
              <option value="2x">2x</option>
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

export default function OvertimeModule() {
  const isAdmin = isSuperUser();
  const { formatAmount } = useCurrency();
  const overtime = useERPList<any>('hr/overtime/');
  const [showAdd, setShowAdd] = useState(false);
  const [actioning, setActioning] = useState<number | null>(null);

  const totalHours = overtime.data.reduce((sum: number, o: any) => sum + Number(o.extra_hours || 0), 0);
  const totalCost = overtime.data.reduce((sum: number, o: any) => sum + Number(o.cost || 0), 0);
  const pendingCount = overtime.data.filter((o: any) => o.status === 'pending').length;

  const decide = async (id: number, action: 'approved' | 'rejected') => {
    setActioning(id);
    try {
      await erpFetch(`hr/overtime/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({ action }) });
      toast.success(`Overtime ${action}`);
      overtime.reload();
    } catch (e: any) {
      toast.error(e.message || 'Could not update this entry');
    } finally {
      setActioning(null);
    }
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:DARK, margin:0, fontFamily:FF, letterSpacing:'-0.01em' }}>Overtime</h2>
          <p style={{ color:MUTED, fontSize:13, margin:'4px 0 0', fontFamily:FF }}>Track and approve extra hours worked</p>
        </div>
        {isAdmin && (
          <button onClick={()=>setShowAdd(true)} style={{ ...SAVE, display:'flex', alignItems:'center', gap:6, padding:'10px 18px' }}>
            <Plus size={14} />Add Overtime
          </button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }} className="ot-stat-grid">
        <style>{`@media (max-width:700px){ .ot-stat-grid{grid-template-columns:1fr} }`}</style>
        <Card3D accent={OG} p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Pending Approval</div>
          <div style={{ fontSize:26, fontWeight:900, color:OG, fontFamily:FF, lineHeight:1 }}>{pendingCount}</div>
        </Card3D>
        <Card3D accent="#3b82f6" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Total Overtime Hours</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#3b82f6', fontFamily:FF, lineHeight:1 }}>{totalHours.toFixed(1)}h</div>
        </Card3D>
        <Card3D accent="#10b981" p="18px 20px">
          <div style={{ fontSize:11, fontWeight:700, color:MUTED, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:FF, marginBottom:8 }}>Total Overtime Cost</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#10b981', fontFamily:FF, lineHeight:1 }}>{formatAmount(totalCost)}</div>
        </Card3D>
      </div>

      {overtime.loading ? (
        <Skeleton h={240} />
      ) : overtime.data.length === 0 ? (
        <EmptyState icon={Clock} message="No overtime entries yet." cta={isAdmin ? <button style={SAVE} onClick={()=>setShowAdd(true)}>Add Overtime</button> : undefined} />
      ) : (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Employee', 'Date', 'Hours', 'Rate', 'Cost', 'Reason', 'Status', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overtime.data.map((o: any) => (
                  <tr key={o.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: DARK, whiteSpace: 'nowrap' }}>{o.employee_name}</td>
                    <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 700 }}>{Number(o.extra_hours).toFixed(1)}h</td>
                    <td style={{ padding: '11px 16px', color: MUTED }}>{o.rate}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: OG }}>{formatAmount(o.cost)}</td>
                    <td style={{ padding: '11px 16px', color: MUTED, maxWidth: 200 }}>{o.reason}</td>
                    <td style={{ padding: '11px 16px' }}><StatusBadge s={o.status} /></td>
                    {isAdmin && (
                      <td style={{ padding: '11px 16px' }}>
                        {o.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button onClick={()=>decide(o.id,'approved')} disabled={actioning===o.id} style={{ background:'rgba(16,185,129,0.10)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)', borderRadius:7, padding:'6px 12px', fontSize:12, fontWeight:700, fontFamily:FF, cursor: actioning===o.id?'wait':'pointer', display:'flex', alignItems:'center', gap:5 }}><Check size={12} />Approve</button>
                            <button onClick={()=>decide(o.id,'rejected')} disabled={actioning===o.id} style={{ background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.22)', borderRadius:7, padding:'6px 12px', fontSize:12, fontWeight:700, fontFamily:FF, cursor: actioning===o.id?'wait':'pointer', display:'flex', alignItems:'center', gap:5 }}><XIcon size={12} />Reject</button>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 5 }}><Clock3 size={11} />{o.approved_by_username ? `by ${o.approved_by_username}` : '—'}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <AddOvertimeModal onClose={()=>setShowAdd(false)} onSaved={()=>{ setShowAdd(false); overtime.reload(); toast.success('Overtime entry added'); }} />
      )}
    </div>
  );
}
