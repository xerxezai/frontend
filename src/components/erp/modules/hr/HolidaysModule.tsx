import { useState } from 'react';
import { Plus, Calendar, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import { FF, OG, DARK, WHITE, Skeleton, EmptyState } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const TYPE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  public:   { label: 'Public',   bg: '#dbeafe', color: '#1d4ed8' },
  company:  { label: 'Company',  bg: '#fde68a', color: '#92400e' },
  optional: { label: 'Optional', bg: '#f1f5f9', color: '#64748b' },
};

const inp: React.CSSProperties = { width:'100%',padding:'9px 12px',borderRadius:9,border:'1px solid rgba(0,0,0,0.10)',background:'#F8F7F4',fontFamily:FF,fontSize:13,outline:'none',boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block',fontSize:11,fontWeight:700,color:MUTED,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5,fontFamily:FF };
const SAVE: React.CSSProperties = { background:'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)',color:'#fff',border:'none',borderRadius:9,padding:'9px 20px',fontFamily:FF,fontWeight:700,fontSize:13,cursor:'pointer' };
const CNCL: React.CSSProperties = { background:'#F8F7F4',border:'1px solid rgba(0,0,0,0.10)',borderRadius:9,padding:'9px 20px',cursor:'pointer',fontFamily:FF,fontWeight:600,fontSize:13 };

const defHoliday = { name: '', date: '', holiday_type: 'public', description: '' };
const todayISO = () => new Date().toISOString().slice(0, 10);

function HolidayModal({ editing, onClose, onSaved, save }: { editing: any; onClose: () => void; onSaved: () => void; save: (id: number | null, body: any) => Promise<void> }) {
  const [form, setForm] = useState(editing ? { name: editing.name, date: editing.date, holiday_type: editing.holiday_type, description: editing.description || '' } : { ...defHoliday });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await save(editing?.id ?? null, form);
      onSaved();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1050,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff',borderRadius:14,padding:'28px 24px 24px',maxWidth:460,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.16)',borderTop:'3px solid #C9883A' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
          <h5 style={{ fontFamily:FF,fontWeight:800,fontSize:16,color:'#1A1A1A',margin:0 }}>{editing ? 'Edit Holiday' : 'Add Holiday'}</h5>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:MUTED,fontSize:22 }}>&times;</button>
        </div>
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <div><label style={lbl}>Holiday Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp} required /></div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div><label style={lbl}>Date *</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inp} required /></div>
            <div><label style={lbl}>Type *</label>
              <select value={form.holiday_type} onChange={e=>setForm(f=>({...f,holiday_type:e.target.value}))} style={inp}>
                <option value="public">Public</option>
                <option value="company">Company</option>
                <option value="optional">Optional</option>
              </select>
            </div>
          </div>
          <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{...inp,resize:'vertical',minHeight:70}} /></div>
          <div style={{ display:'flex',gap:10,marginTop:4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{...SAVE, cursor: saving?'wait':'pointer', opacity: saving?0.75:1}}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Holiday'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HolidaysModule() {
  const isAdmin = isSuperUser();
  const holidays = useERPList<any>('hr/holidays/');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);

  const sorted = [...holidays.data].sort((a, b) => a.date.localeCompare(b.date));
  const today = todayISO();

  const save = async (id: number | null, body: any) => {
    if (id) await holidays.update(id, body);
    else await holidays.create(body);
  };

  const confirmDel = async () => {
    try { await holidays.remove(delId!); toast.success('Holiday deleted'); setDelId(null); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:DARK, margin:0, fontFamily:FF, letterSpacing:'-0.01em' }}>Holidays</h2>
          <p style={{ color:MUTED, fontSize:13, margin:'4px 0 0', fontFamily:FF }}>Company holiday calendar for the year</p>
        </div>
        {isAdmin && (
          <button onClick={()=>{ setEditing(null); setShowModal(true); }} style={{ ...SAVE, display:'flex', alignItems:'center', gap:6, padding:'10px 18px' }}>
            <Plus size={14} />Add Holiday
          </button>
        )}
      </div>

      {holidays.loading ? (
        <Skeleton h={240} />
      ) : sorted.length === 0 ? (
        <EmptyState icon={Calendar} message="No holidays added yet." cta={isAdmin ? <button style={SAVE} onClick={()=>{ setEditing(null); setShowModal(true); }}>Add Holiday</button> : undefined} />
      ) : (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
            <thead>
              <tr style={{ background: '#fafaf9' }}>
                {['Holiday', 'Date', 'Type', 'Description', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((h: any) => {
                const upcoming = h.date >= today;
                const meta = TYPE_BADGE[h.holiday_type] ?? TYPE_BADGE.optional;
                return (
                  <tr key={h.id} style={{ borderBottom: `1px solid ${BORDER}`, background: upcoming ? `${OG}08` : undefined }}>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: DARK }}>{h.name}{upcoming && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, color: OG, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Upcoming</span>}</td>
                    <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{new Date(h.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '11px 16px' }}><span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.color }}>{meta.label}</span></td>
                    <td style={{ padding: '11px 16px', color: MUTED, maxWidth: 260 }}>{h.description || '—'}</td>
                    {isAdmin && (
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={()=>{ setEditing(h); setShowModal(true); }} style={{ background:'rgba(201,136,58,0.08)', color:OG, border:'1px solid rgba(201,136,58,0.22)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, cursor:'pointer' }}><Pencil size={12} /></button>
                          <button onClick={()=>setDelId(h.id)} style={{ background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.20)', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, cursor:'pointer' }}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <HolidayModal editing={editing} save={save} onClose={()=>setShowModal(false)} onSaved={()=>{ setShowModal(false); toast.success(editing ? 'Holiday updated' : 'Holiday added'); }} />
      )}
      {delId !== null && (
        <div style={{ position:'fixed', inset:0, zIndex:1060, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={()=>setDelId(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:24, maxWidth:380, width:'100%', borderTop:'2px solid #ef4444', fontFamily:FF, boxShadow:'0 20px 50px rgba(0,0,0,0.18)' }}>
            <h6 style={{ fontWeight:800, marginBottom:8, color:'#1A1A1A' }}>Delete Holiday?</h6>
            <p style={{ fontSize:13, color:MUTED, marginBottom:20 }}>This cannot be undone.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setDelId(null)} style={{...CNCL, flex:1}}>Cancel</button>
              <button onClick={confirmDel} style={{ flex:1, background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:9, padding:'9px', cursor:'pointer', color:'#ef4444', fontFamily:FF, fontWeight:700, fontSize:13 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
