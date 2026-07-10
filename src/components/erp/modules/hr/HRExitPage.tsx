import { useState } from 'react';
import { DoorOpen, Plus, CheckCircle2, Clock, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch } from '../../../../hooks/useERPApi';
import {
  SlidePanel, Skeleton, PageHead, EmptyState, Card3D,
  OG, DARK, FF, inp, lbl, btnPrimary, btnGhost, fmtINR, initials,
} from './hrShared';

interface Exit {
  id: number; employee: number; employee_name: string; employee_code: string;
  reason: string; reason_label: string; last_working_day: string; notice_period_days: number;
  exit_interview_done: boolean; final_settlement_amount: string; settlement_paid: boolean; notes: string;
}

const REASONS = [
  { key: 'resignation', label: 'Resignation' }, { key: 'termination', label: 'Termination' },
  { key: 'retirement', label: 'Retirement' }, { key: 'contract_end', label: 'Contract End' },
];
const reasonColor: Record<string, string> = { resignation: '#3b82f6', termination: '#ef4444', retirement: '#8b5cf6', contract_end: OG };

export default function HRExitPage() {
  const exits = useERPList<Exit>('hr/exit/');
  const employees = useERPList<any>('hr/employees/');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employee: '', reason: 'resignation', last_working_day: '', notice_period_days: '30', final_settlement_amount: '', notes: '' });

  const submit = async () => {
    if (!form.employee) { toast.error('Select an employee'); return; }
    if (!form.last_working_day) { toast.error('Last working day is required'); return; }
    setSaving(true);
    try {
      await erpFetch('hr/exit/', { method: 'POST', body: JSON.stringify({
        ...form, employee: Number(form.employee),
        notice_period_days: Number(form.notice_period_days || 30),
        final_settlement_amount: form.final_settlement_amount || 0,
      }) });
      toast.success('Exit initiated');
      setShowAdd(false);
      setForm({ employee: '', reason: 'resignation', last_working_day: '', notice_period_days: '30', final_settlement_amount: '', notes: '' });
      exits.reload();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const markInterview = async (id: number) => {
    try { await erpFetch(`hr/exit/${id}/mark-interview-done/`, { method: 'PATCH', body: '{}' }); toast.success('Exit interview marked done'); exits.reload(); }
    catch (e: any) { toast.error(e.message || 'Failed'); }
  };
  const markPaid = async (e: Exit) => {
    try { await erpFetch(`hr/exit/${e.id}/mark-settlement-paid/`, { method: 'PATCH', body: JSON.stringify({ final_settlement_amount: e.final_settlement_amount }) }); toast.success('Settlement marked paid'); exits.reload(); }
    catch (err: any) { toast.error(err.message || 'Failed'); }
  };

  const pendingSettlement = exits.data.filter(e => !e.settlement_paid).length;

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <PageHead title="Exit Management" subtitle="Offboarding, interviews and final settlements"
        action={<button style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 7 }} onClick={() => setShowAdd(true)}><Plus size={15} /> Initiate Exit</button>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <Card3D accent="#ef4444" p="18px 20px"><div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Total Exits</div><div style={{ fontSize: 26, fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>{exits.data.length}</div></Card3D>
        <Card3D accent={OG} p="18px 20px"><div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Pending Settlement</div><div style={{ fontSize: 26, fontWeight: 900, color: OG, lineHeight: 1 }}>{pendingSettlement}</div></Card3D>
        <Card3D accent="#10b981" p="18px 20px"><div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Interviews Done</div><div style={{ fontSize: 26, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>{exits.data.filter(e => e.exit_interview_done).length}</div></Card3D>
      </div>

      {exits.loading ? (
        <div>{[0, 1, 2].map(i => <Skeleton key={i} h={56} />)}</div>
      ) : exits.data.length === 0 ? (
        <EmptyState icon={DoorOpen} message="No exits in progress." cta={<button style={btnPrimary} onClick={() => setShowAdd(true)}>Initiate Exit</button>} />
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', overflowX: 'auto', boxShadow: '0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 820 }}>
            <thead>
              <tr style={{ background: '#faf8f5', textAlign: 'left' }}>
                {['Employee', 'Reason', 'Last Day', 'Notice', 'Interview', 'Settlement', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exits.data.map(e => (
                <tr key={e.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials(e.employee_name)}</span>
                      <span style={{ fontWeight: 700, color: DARK }}>{e.employee_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: `${reasonColor[e.reason]}18`, color: reasonColor[e.reason] }}>{e.reason_label}</span></td>
                  <td style={{ padding: '11px 16px', color: '#4b4b4b', whiteSpace: 'nowrap' }}>{e.last_working_day}</td>
                  <td style={{ padding: '11px 16px', color: '#6B6B6B' }}>{e.notice_period_days}d</td>
                  <td style={{ padding: '11px 16px' }}>
                    {e.exit_interview_done
                      ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: 12, fontWeight: 700 }}><CheckCircle2 size={13} /> Done</span>
                      : <button onClick={() => markInterview(e.id)} style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>Mark Done</button>}
                  </td>
                  <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 700, color: OG }}>{fmtINR(e.final_settlement_amount)}</span>
                    {e.settlement_paid ? <span style={{ marginLeft: 8, fontSize: 11, color: '#10b981', fontWeight: 700 }}>· Paid</span> : <span style={{ marginLeft: 8, fontSize: 11, color: '#9ca3af', fontWeight: 700 }}>· Unpaid</span>}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    {!e.settlement_paid && (
                      <button onClick={() => markPaid(e)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(201,136,58,0.10)', color: OG, border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: FF, whiteSpace: 'nowrap' }}><IndianRupee size={12} /> Mark Paid</button>
                    )}
                    {e.settlement_paid && e.exit_interview_done && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#9ca3af', fontSize: 12 }}><Clock size={12} /> Complete</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <SlidePanel title="Initiate Exit" onClose={() => setShowAdd(false)}
          footer={<>
            <button style={{ ...btnGhost, flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
            <button style={{ ...btnPrimary, flex: 2, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={submit}>{saving ? 'Saving…' : 'Initiate Exit'}</button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={lbl}>Employee *</label>
              <select style={inp} value={form.employee} onChange={e => setForm(f => ({ ...f, employee: e.target.value }))}>
                <option value="">— Select employee —</option>
                {employees.data.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Reason *</label>
              <select style={inp} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}>
                {REASONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={lbl}>Last Working Day *</label><input type="date" style={inp} value={form.last_working_day} onChange={e => setForm(f => ({ ...f, last_working_day: e.target.value }))} /></div>
              <div><label style={lbl}>Notice (days)</label><input type="number" style={inp} value={form.notice_period_days} min="0" onChange={e => setForm(f => ({ ...f, notice_period_days: e.target.value }))} /></div>
            </div>
            <div><label style={lbl}>Final Settlement (₹)</label><input type="number" style={inp} value={form.final_settlement_amount} min="0" step="0.01" placeholder="0" onChange={e => setForm(f => ({ ...f, final_settlement_amount: e.target.value }))} /></div>
            <div><label style={lbl}>Notes</label><textarea style={{ ...inp, resize: 'vertical', minHeight: 70 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
        </SlidePanel>
      )}
    </div>
  );
}
