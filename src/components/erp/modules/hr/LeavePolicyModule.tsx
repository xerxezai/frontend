import { useState } from 'react';
import { Palmtree, Stethoscope, AlertTriangle, Baby, Wallet, FileQuestion, Pencil, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import { FF, OG, DARK, WHITE, Skeleton, EmptyState } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const LEAVE_TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  annual:    { label: 'Annual',    icon: Palmtree,      color: '#3b82f6' },
  sick:      { label: 'Sick',      icon: Stethoscope,   color: '#ef4444' },
  emergency: { label: 'Emergency', icon: AlertTriangle, color: '#f97316' },
  maternity: { label: 'Maternity', icon: Baby,          color: '#ec4899' },
  paternity: { label: 'Paternity', icon: Baby,          color: '#8b5cf6' },
  unpaid:    { label: 'Unpaid',    icon: Wallet,        color: '#6B6B6B' },
  other:     { label: 'Other',     icon: FileQuestion,  color: '#9b9690' },
};
const TYPE_ORDER = ['annual', 'sick', 'emergency', 'maternity', 'paternity', 'unpaid', 'other'];
const typeMeta = (t: string) => LEAVE_TYPE_META[t] || LEAVE_TYPE_META.other;

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:FF,fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:MUTED,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:FF };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:FF,fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:FF,fontWeight:600,fontSize:13 };

const YesNo = ({ v }: { v: boolean }) => (
  <span style={{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700, background: v ? '#d1fae5' : '#f1f5f9', color: v ? '#065f46' : '#64748b' }}>
    {v ? 'Yes' : 'No'}
  </span>
);

function EditPolicyModal({ policy, onClose, onSaved }: { policy: any; onClose: () => void; onSaved: (body: any) => Promise<void> }) {
  const meta = typeMeta(policy.leave_type);
  const [form, setForm] = useState({
    days_allowed: String(policy.days_allowed ?? 0),
    carry_forward: !!policy.carry_forward,
    max_carry_forward_days: String(policy.max_carry_forward_days ?? 0),
    is_active: policy.is_active !== false,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaved({
        days_allowed: Number(form.days_allowed) || 0,
        carry_forward: form.carry_forward,
        max_carry_forward_days: form.carry_forward ? (Number(form.max_carry_forward_days) || 0) : 0,
        is_active: form.is_active,
      });
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:420,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
          <h5 style={{ fontFamily:FF,fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0 }}>Edit {meta.label} Leave Policy</h5>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:MUTED,fontSize:22 }}>&times;</button>
        </div>
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div>
            <label style={lbl}>Days Allowed Per Year *</label>
            <input type="number" min="0" step="1" value={form.days_allowed} onChange={e=>setForm(f=>({...f,days_allowed:e.target.value}))} style={inp} required />
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', fontFamily:FF, fontSize:13, fontWeight:600, color:DARK }}>
            <input type="checkbox" checked={form.carry_forward} onChange={e=>setForm(f=>({...f,carry_forward:e.target.checked}))} style={{ accentColor:OG, width:16, height:16 }} />
            Allow carry forward to next year
          </label>
          {form.carry_forward && (
            <div>
              <label style={lbl}>Max Carry Forward Days</label>
              <input type="number" min="0" step="1" value={form.max_carry_forward_days} onChange={e=>setForm(f=>({...f,max_carry_forward_days:e.target.value}))} style={inp} />
            </div>
          )}
          <label style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', fontFamily:FF, fontSize:13, fontWeight:600, color:DARK }}>
            <input type="checkbox" checked={form.is_active} onChange={e=>setForm(f=>({...f,is_active:e.target.checked}))} style={{ accentColor:OG, width:16, height:16 }} />
            Active (counted when calculating leave balance)
          </label>
          <div style={{ display:'flex',gap:10,marginTop:4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{...SAVE, cursor: saving?'wait':'pointer', opacity: saving?0.75:1}}>{saving ? 'Saving…' : 'Save Policy'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LeavePolicyModule() {
  const { isCompanyAdmin, isHRManager } = useAccess();
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;
  const policies = useERPList<any>('hr/leave-policies/');
  const [editing, setEditing] = useState<any>(null);

  const sorted = [...policies.data].sort((a, b) => TYPE_ORDER.indexOf(a.leave_type) - TYPE_ORDER.indexOf(b.leave_type));

  const save = async (body: any) => {
    await policies.update(editing.id, body);
    setEditing(null);
    toast.success('Leave policy updated');
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:DARK, margin:0, fontFamily:FF, letterSpacing:'-0.01em' }}>Leave Policy</h2>
          <p style={{ color:MUTED, fontSize:13, margin:'4px 0 0', fontFamily:FF }}>
            {isAdmin ? 'How many days each leave type allows per year for your company' : 'Your company’s leave allowances'}
          </p>
        </div>
      </div>

      {policies.loading ? (
        <Skeleton h={280} />
      ) : sorted.length === 0 ? (
        <EmptyState icon={ShieldCheck} message="No leave policy configured yet. Contact your Super Admin." />
      ) : (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Leave Type', 'Days Allowed / Year', 'Carry Forward', 'Max Carry Forward Days', 'Active', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p: any) => {
                  const meta = typeMeta(p.leave_type);
                  const Icon = meta.icon;
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${BORDER}`, opacity: p.is_active ? 1 : 0.55 }}>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <span style={{ width:28, height:28, borderRadius:8, background:`${meta.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Icon size={13} color={meta.color} />
                          </span>
                          <span style={{ fontWeight:700, color:DARK }}>{meta.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px', fontWeight: 700, color: DARK }}>
                        {p.leave_type === 'unpaid' ? 'Unlimited' : `${p.days_allowed} day${p.days_allowed === 1 ? '' : 's'}`}
                      </td>
                      <td style={{ padding: '11px 16px' }}><YesNo v={!!p.carry_forward} /></td>
                      <td style={{ padding: '11px 16px', color: MUTED }}>{p.carry_forward ? p.max_carry_forward_days : '—'}</td>
                      <td style={{ padding: '11px 16px' }}><YesNo v={p.is_active !== false} /></td>
                      {isAdmin && (
                        <td style={{ padding: '11px 16px' }}>
                          <button onClick={()=>setEditing(p)} style={{ background:'rgba(201,136,58,0.08)', color:OG, border:'1px solid rgba(201,136,58,0.22)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, cursor:'pointer' }}>
                            <Pencil size={12} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <EditPolicyModal policy={editing} onClose={()=>setEditing(null)} onSaved={save} />
      )}
    </div>
  );
}
