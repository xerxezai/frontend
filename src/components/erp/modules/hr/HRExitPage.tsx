import { useEffect, useMemo, useState } from 'react';
import {
  DoorOpen, Plus, CheckCircle2, Clock, IndianRupee, ClipboardCheck,
  Eye, Trash2, ArrowLeft, AlertTriangle, Circle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import {
  SlidePanel, Skeleton, PageHead, EmptyState, Card3D,
  OG, DARK, CREAM, FF, inp, lbl, btnPrimary, btnGhost, useFmtCurrency, initials,
} from './hrShared';
import { useCurrency } from '../../../../context/CurrencyContext';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const EXIT_TYPES = [
  { key: 'resignation', label: 'Resignation', color: '#3b82f6' },
  { key: 'termination', label: 'Termination', color: '#ef4444' },
  { key: 'retirement', label: 'Retirement', color: '#8b5cf6' },
  { key: 'absconding', label: 'Absconding', color: '#f97316' },
  { key: 'contract_end', label: 'End of Contract', color: OG },
];
const exitTypeMeta = (key: string) => EXIT_TYPES.find(r => r.key === key) || EXIT_TYPES[0];

const OVERALL_META: Record<string, { label: string; bg: string; color: string }> = {
  notice_period: { label: 'Notice Period', bg: '#dbeafe', color: '#1d4ed8' },
  clearance_pending: { label: 'Clearance Pending', bg: '#ffedd5', color: '#c2410c' },
  completed: { label: 'Completed', bg: '#d1fae5', color: '#065f46' },
};

const CHECKLIST_CATEGORIES = [
  { key: 'before_last_day', label: 'Before Last Day' },
  { key: 'it_access', label: 'IT & Access' },
  { key: 'hr_finance', label: 'HR & Finance' },
];

const STATUS_OPTIONS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];
const TASK_STATUS_META: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#f1f5f9', color: '#64748b' },
  in_progress: { bg: '#ffedd5', color: '#c2410c' },
  completed: { bg: '#d1fae5', color: '#065f46' },
};

const PAYMENT_MODES = [
  { key: 'bank_transfer', label: 'Bank Transfer' },
  { key: 'cheque', label: 'Cheque' },
  { key: 'cash', label: 'Cash' },
];

const fmtDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

function progressColor(pct: number) {
  if (pct <= 30) return '#ef4444';
  if (pct <= 70) return '#f97316';
  return '#10b981';
}

function StatCard({ label, val, icon: Icon, color }: { label: string; val: number; icon: React.ElementType; color: string }) {
  return (
    <Card3D accent={color} p="16px 18px">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={17} color={color} />
        </div>
        <div>
          <div style={{ fontFamily: FF, fontSize: 20, fontWeight: 900, color: DARK, lineHeight: 1.1 }}>{val}</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, fontWeight: 600, marginTop: 2 }}>{label}</div>
        </div>
      </div>
    </Card3D>
  );
}

const Avatar = ({ name, size = 28 }: { name: string; size?: number }) => (
  <span style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', fontSize: size * 0.38, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: FF }}>
    {initials(name)}
  </span>
);

// ── Searchable employee combobox ─────────────────────────────────────────────
function EmployeeSearchSelect({ employees, value, onChange, placeholder }: {
  employees: any[]; value: string; onChange: (id: string) => void; placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selected = employees.find((e: any) => String(e.id) === value);
  const filtered = useMemo(
    () => employees.filter((e: any) => e.full_name.toLowerCase().includes(query.toLowerCase())),
    [employees, query],
  );

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={open ? query : (selected ? selected.full_name : '')}
        onFocus={() => { setOpen(true); setQuery(''); }}
        onChange={e => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder || 'Search employee by name…'}
        style={inp}
      />
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 9, maxHeight: 220, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', marginTop: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: 12, color: MUTED, fontFamily: FF }}>No employees match.</div>
          ) : filtered.map((e: any) => (
            <div key={e.id} onMouseDown={() => { onChange(String(e.id)); setOpen(false); }}
              style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 12.5, fontFamily: FF, color: DARK, borderBottom: `1px solid ${BORDER}` }}>
              {e.full_name} <span style={{ color: MUTED }}>({e.code})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Settlement breakdown display ─────────────────────────────────────────────
function SettlementBreakdown({ breakdown, formatAmount }: { breakdown: any; formatAmount: (v: number | string) => string }) {
  if (!breakdown) return null;
  const rows = [
    ['Pending Salary', breakdown.pending_salary_amount, `${breakdown.pending_salary_days} day(s)`],
    ['Leave Encashment', breakdown.leave_encashment_amount, `${breakdown.pending_leaves} day(s) pending`],
    ['Gratuity', breakdown.gratuity_amount, breakdown.gratuity_amount > 0 ? '5+ years served' : 'Not eligible (< 5 years)'],
    ['Deductions', -breakdown.deductions_amount, ''],
  ] as [string, number, string][];
  return (
    <div style={{ background: CREAM, borderRadius: 10, padding: '12px 14px', fontFamily: FF }}>
      {rows.map(([label, amount, hint]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0' }}>
          <div>
            <span style={{ fontSize: 12.5, color: DARK }}>{label}</span>
            {hint && <span style={{ fontSize: 10.5, color: MUTED, marginLeft: 6 }}>({hint})</span>}
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: amount < 0 ? '#ef4444' : DARK }}>{amount < 0 ? '-' : ''}{formatAmount(Math.abs(amount))}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, marginTop: 6, borderTop: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: DARK }}>Total</span>
        <span style={{ fontSize: 16, fontWeight: 900, color: '#059669' }}>{formatAmount(breakdown.final_settlement_amount)}</span>
      </div>
    </div>
  );
}

// ── Initiate Exit panel ───────────────────────────────────────────────────────
function InitiateExitPanel({ employees, onClose, onSaved }: { employees: any[]; onClose: () => void; onSaved: () => void }) {
  const { symbol } = useCurrency();
  const fmtCurrency = useFmtCurrency();
  const [form, setForm] = useState({
    employee: '', reason: 'resignation', last_working_day: '', notice_period_days: '30',
    exit_interview_scheduled: false, exit_interview_date: '', interviewer_name: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const noticeStartDate = form.last_working_day && form.notice_period_days
    ? new Date(new Date(form.last_working_day).getTime() - Number(form.notice_period_days) * 86400000).toISOString().slice(0, 10)
    : '';

  useEffect(() => {
    if (!form.employee || !form.last_working_day) { setPreview(null); setPreviewError(''); return; }
    let cancelled = false;
    setPreviewLoading(true);
    setPreviewError('');
    erpFetch(`hr/exit/preview-settlement/?employee=${form.employee}&last_working_day=${form.last_working_day}`)
      .then(res => { if (!cancelled) setPreview(res); })
      .catch((e: any) => { if (!cancelled) { setPreview(null); setPreviewError(e.message || 'Could not calculate the settlement.'); } })
      .finally(() => { if (!cancelled) setPreviewLoading(false); });
    return () => { cancelled = true; };
  }, [form.employee, form.last_working_day]);

  const submit = async () => {
    if (!form.employee) { toast.error('Select an employee'); return; }
    if (!form.last_working_day) { toast.error('Last working day is required'); return; }
    setSaving(true);
    try {
      await erpFetch('hr/exit/', {
        method: 'POST',
        body: JSON.stringify({
          employee: Number(form.employee), reason: form.reason, last_working_day: form.last_working_day,
          notice_period_days: Number(form.notice_period_days || 30),
          exit_interview_scheduled: form.exit_interview_scheduled,
          exit_interview_date: form.exit_interview_scheduled ? (form.exit_interview_date || null) : null,
          interviewer_name: form.exit_interview_scheduled ? form.interviewer_name : '',
          notes: form.notes,
        }),
      });
      toast.success('Exit initiated');
      onSaved();
      onClose();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <SlidePanel title="Initiate Exit" width={480} onClose={onClose}
      footer={<>
        <button style={{ ...btnGhost, flex: 1 }} onClick={onClose}>Cancel</button>
        <button style={{ ...btnPrimary, flex: 2, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={submit}>{saving ? 'Saving…' : 'Initiate Exit'}</button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={lbl}>Employee *</label>
          <EmployeeSearchSelect employees={employees} value={form.employee} onChange={v => setForm(f => ({ ...f, employee: v }))} />
        </div>
        <div><label style={lbl}>Exit Type *</label>
          <select style={inp} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}>
            {EXIT_TYPES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><label style={lbl}>Last Working Day *</label><input type="date" style={inp} value={form.last_working_day} onChange={e => setForm(f => ({ ...f, last_working_day: e.target.value }))} /></div>
          <div><label style={lbl}>Notice (days)</label><input type="number" style={inp} value={form.notice_period_days} min="0" onChange={e => setForm(f => ({ ...f, notice_period_days: e.target.value }))} /></div>
        </div>
        {noticeStartDate && (
          <div><label style={lbl}>Notice Period Start Date</label><input style={{ ...inp, color: MUTED }} value={fmtDate(noticeStartDate)} disabled /></div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: FF, fontSize: 13, color: DARK, fontWeight: 600 }}>
          <input type="checkbox" checked={form.exit_interview_scheduled} onChange={e => setForm(f => ({ ...f, exit_interview_scheduled: e.target.checked }))} style={{ accentColor: OG, width: 15, height: 15 }} />
          Exit Interview Scheduled
        </label>
        {form.exit_interview_scheduled && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Exit Interview Date</label><input type="date" style={inp} value={form.exit_interview_date} onChange={e => setForm(f => ({ ...f, exit_interview_date: e.target.value }))} /></div>
            <div><label style={lbl}>Interviewer Name</label><input style={inp} value={form.interviewer_name} onChange={e => setForm(f => ({ ...f, interviewer_name: e.target.value }))} /></div>
          </div>
        )}

        <div><label style={lbl}>Notes</label><textarea style={{ ...inp, resize: 'vertical', minHeight: 60 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>

        {form.employee && form.last_working_day && (
          <div>
            <label style={lbl}>Final Settlement ({symbol}) — auto-calculated</label>
            {previewLoading ? <Skeleton h={120} /> : previewError ? (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '10px 14px', color: '#ef4444', fontSize: 12.5, fontFamily: FF }}>
                Couldn't calculate the settlement: {previewError}
              </div>
            ) : <SettlementBreakdown breakdown={preview} formatAmount={fmtCurrency} />}
          </div>
        )}
      </div>
    </SlidePanel>
  );
}

// ── Mark as Paid modal ────────────────────────────────────────────────────────
function MarkPaidModal({ exitRecord, onClose, onSaved }: { exitRecord: any; onClose: () => void; onSaved: () => void }) {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMode, setPaymentMode] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await erpFetch(`hr/exit/${exitRecord.id}/mark-settlement-paid/`, {
        method: 'PATCH',
        body: JSON.stringify({ payment_date: paymentDate, payment_mode: paymentMode, reference_number: reference }),
      });
      toast.success('Settlement marked paid');
      onSaved();
      onClose();
    } catch (e: any) { toast.error(e.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 420, width: '100%', borderTop: `2px solid ${OG}`, fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 14, color: DARK }}>Mark Settlement as Paid</h6>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={lbl}>Payment Date</label><input type="date" style={inp} value={paymentDate} onChange={e => setPaymentDate(e.target.value)} /></div>
          <div><label style={lbl}>Payment Mode</label>
            <select style={inp} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
              {PAYMENT_MODES.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Reference Number</label><input style={inp} value={reference} onChange={e => setReference(e.target.value)} placeholder="Transaction / cheque number" /></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button style={{ ...btnGhost, flex: 1 }} onClick={onClose}>Cancel</button>
          <button style={{ ...btnPrimary, flex: 1, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={submit}>{saving ? 'Saving…' : 'Confirm Paid'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────────────
function DeleteDlg({ row, busy, onCancel, onConfirm }: { row: any; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: DARK }}>Delete Exit Record?</h6>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: DARK }}>{row.employee_name}</strong>'s exit record and checklist? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy} style={{ ...btnGhost, flex: 1 }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: 9, cursor: busy ? 'wait' : 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Exit Interview form ───────────────────────────────────────────────────────
function ExitInterviewModal({ exitRecord, isAdmin, onClose, onSaved }: { exitRecord: any; isAdmin: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({
    interview_date: '', interviewer_name: '', reason_for_leaving: '', job_satisfaction_rating: '',
    management_rating: '', work_environment_rating: '', would_recommend: '', liked_most: '',
    could_improve: '', suggestions: '', interview_notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    erpFetch(`hr/exit/${exitRecord.id}/interview/`)
      .then((res: any) => { if (res) setForm((f: any) => ({ ...f, ...res, would_recommend: res.would_recommend === null ? '' : String(res.would_recommend) })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [exitRecord.id]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await erpFetch(`hr/exit/${exitRecord.id}/interview/`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...form,
          job_satisfaction_rating: form.job_satisfaction_rating || null,
          management_rating: form.management_rating || null,
          work_environment_rating: form.work_environment_rating || null,
          would_recommend: form.would_recommend === '' ? null : form.would_recommend === 'true',
        }),
      });
      toast.success('Exit interview saved');
      onSaved();
      onClose();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const RatingButtons = ({ field }: { field: string }) => (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" disabled={!isAdmin} onClick={() => set(field, n)}
          style={{
            width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${Number(form[field]) === n ? OG : BORDER}`,
            background: Number(form[field]) === n ? 'rgba(201,136,58,0.12)' : '#fff', color: Number(form[field]) === n ? OG : MUTED,
            fontWeight: 800, fontSize: 13, cursor: isAdmin ? 'pointer' : 'default', fontFamily: FF,
          }}>{n}</button>
      ))}
    </div>
  );

  return (
    <SlidePanel title="Exit Interview" subtitle={exitRecord.employee_name} width={520} onClose={onClose}
      footer={isAdmin ? <>
        <button style={{ ...btnGhost, flex: 1 }} onClick={onClose}>Cancel</button>
        <button style={{ ...btnPrimary, flex: 2, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={submit}>{saving ? 'Saving…' : 'Save Interview'}</button>
      </> : <button style={{ ...btnGhost, flex: 1 }} onClick={onClose}>Close</button>}>
      {loading ? <Skeleton h={300} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Interview Date</label><input disabled={!isAdmin} type="date" style={inp} value={form.interview_date || ''} onChange={e => set('interview_date', e.target.value)} /></div>
            <div><label style={lbl}>Interviewer Name</label><input disabled={!isAdmin} style={inp} value={form.interviewer_name || ''} onChange={e => set('interviewer_name', e.target.value)} /></div>
          </div>
          <div><label style={lbl}>Reason for Leaving</label><textarea disabled={!isAdmin} style={{ ...inp, resize: 'vertical', minHeight: 60 }} value={form.reason_for_leaving || ''} onChange={e => set('reason_for_leaving', e.target.value)} /></div>
          <div><label style={lbl}>Job Satisfaction (1–5)</label><RatingButtons field="job_satisfaction_rating" /></div>
          <div><label style={lbl}>Management (1–5)</label><RatingButtons field="management_rating" /></div>
          <div><label style={lbl}>Work Environment (1–5)</label><RatingButtons field="work_environment_rating" /></div>
          <div>
            <label style={lbl}>Would you recommend XERXEZ?</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['true', 'Yes'], ['false', 'No']].map(([val, label]) => (
                <button key={val} type="button" disabled={!isAdmin} onClick={() => set('would_recommend', val)}
                  style={{ padding: '7px 18px', borderRadius: 8, border: `1.5px solid ${form.would_recommend === val ? OG : BORDER}`, background: form.would_recommend === val ? 'rgba(201,136,58,0.12)' : '#fff', color: form.would_recommend === val ? OG : MUTED, fontWeight: 700, fontSize: 12.5, cursor: isAdmin ? 'pointer' : 'default', fontFamily: FF }}>{label}</button>
              ))}
            </div>
          </div>
          <div><label style={lbl}>What did you like most?</label><textarea disabled={!isAdmin} style={{ ...inp, resize: 'vertical', minHeight: 50 }} value={form.liked_most || ''} onChange={e => set('liked_most', e.target.value)} /></div>
          <div><label style={lbl}>What could be improved?</label><textarea disabled={!isAdmin} style={{ ...inp, resize: 'vertical', minHeight: 50 }} value={form.could_improve || ''} onChange={e => set('could_improve', e.target.value)} /></div>
          <div><label style={lbl}>Suggestions for the company</label><textarea disabled={!isAdmin} style={{ ...inp, resize: 'vertical', minHeight: 50 }} value={form.suggestions || ''} onChange={e => set('suggestions', e.target.value)} /></div>
          <div><label style={lbl}>Interview Notes</label><textarea disabled={!isAdmin} style={{ ...inp, resize: 'vertical', minHeight: 50 }} value={form.interview_notes || ''} onChange={e => set('interview_notes', e.target.value)} /></div>
        </div>
      )}
    </SlidePanel>
  );
}

// ── Exit detail view (notice tracker + settlement + checklist) ──────────────
function ExitDetailView({ exitRecord, isAdmin, assignableUsers, formatAmount, onBack, onRefresh, onOpenInterview, onOpenMarkPaid }: {
  exitRecord: any; isAdmin: boolean; assignableUsers: any[]; formatAmount: (v: number | string) => string;
  onBack?: () => void; onRefresh: () => void; onOpenInterview: () => void; onOpenMarkPaid: () => void;
}) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    erpFetch(`hr/exit-checklist/?exit=${exitRecord.id}`)
      .then((res: any) => setTasks(Array.isArray(res) ? res : res.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [exitRecord.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const patchTask = async (id: number, body: any) => {
    setSavingId(id);
    const prev = tasks;
    setTasks(t => t.map(x => x.id === id ? { ...x, ...body } : x));
    try {
      const updated = await erpFetch(`hr/exit-checklist/${id}/`, { method: 'PATCH', body: JSON.stringify(body) });
      setTasks(t => t.map(x => x.id === id ? updated : x));
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
      setTasks(prev);
    } finally { setSavingId(null); }
  };

  const done = tasks.filter(t => t.status === 'completed').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const grouped = CHECKLIST_CATEGORIES.map(c => ({ ...c, items: tasks.filter(t => t.category === c.key) })).filter(g => g.items.length > 0);

  const noticeDaysRemaining = exitRecord.notice_days_remaining;
  const noticePct = exitRecord.notice_period_progress_pct ?? 0;
  const overall = OVERALL_META[exitRecord.overall_status] ?? OVERALL_META.notice_period;
  const typeMeta = exitTypeMeta(exitRecord.reason);

  return (
    <div>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: OG, fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, padding: 0 }}>
          <ArrowLeft size={14} />Back to Exits
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={exitRecord.employee_name} size={38} />
          <div>
            <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: DARK }}>{exitRecord.employee_name}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: `${typeMeta.color}18`, color: typeMeta.color, fontFamily: FF }}>{exitRecord.reason_label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: overall.bg, color: overall.color, fontFamily: FF }}>{overall.label}</span>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onOpenInterview} style={{ ...btnGhost, padding: '9px 16px' }}>Exit Interview</button>
            {!exitRecord.settlement_paid && <button onClick={onOpenMarkPaid} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 6 }}><IndianRupee size={14} />Mark Paid</button>}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
        {/* Notice period tracker */}
        <Card3D accent={OG} p="18px 20px">
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK, marginBottom: 10 }}>Notice Period</div>
          <div style={{ fontFamily: FF, fontSize: 20, fontWeight: 900, color: noticeDaysRemaining < 0 ? '#ef4444' : OG, marginBottom: 8 }}>
            {noticeDaysRemaining < 0 ? `${Math.abs(noticeDaysRemaining)} days overdue` : `${noticeDaysRemaining} days remaining`}
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${noticePct}%`, background: progressColor(noticePct), borderRadius: 4 }} />
          </div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED }}>Last working day: {fmtDate(exitRecord.last_working_day)}</div>
        </Card3D>

        {/* Settlement */}
        <Card3D accent="#10b981" p="18px 20px">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: DARK }}>Final Settlement</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: exitRecord.settlement_paid ? '#10b981' : MUTED }}>{exitRecord.settlement_paid ? 'Paid' : 'Pending'}</span>
          </div>
          <SettlementBreakdown breakdown={exitRecord} formatAmount={formatAmount} />
          {exitRecord.settlement_paid && (
            <div style={{ fontFamily: FF, fontSize: 11, color: MUTED, marginTop: 8 }}>
              Paid on {fmtDate(exitRecord.settlement_paid_date)} · {exitRecord.settlement_payment_mode_label} · Ref: {exitRecord.settlement_reference_number || '—'}
            </div>
          )}
        </Card3D>
      </div>

      {/* Checklist */}
      <Card3D accent={pct === 100 ? '#10b981' : OG} p="20px 22px">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: DARK }}>Offboarding Checklist</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: progressColor(pct) }}>{done}/{tasks.length} · {pct}%</div>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: progressColor(pct), borderRadius: 4, transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>

        {loading ? <Skeleton h={200} /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {grouped.map(group => (
              <div key={group.key}>
                <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 11.5, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                  {group.label} — {group.items.filter(t => t.status === 'completed').length}/{group.items.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {group.items.map((t: any) => {
                    const smeta = TASK_STATUS_META[t.status] ?? TASK_STATUS_META.pending;
                    return (
                      <div key={t.id} style={{ background: t.status === 'completed' ? 'rgba(16,185,129,0.05)' : '#F8F7F4', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <button onClick={() => isAdmin && patchTask(t.id, { status: t.status === 'completed' ? 'pending' : 'completed' })} disabled={!isAdmin || savingId === t.id}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: isAdmin ? 'pointer' : 'default', marginTop: 1 }}>
                            {t.status === 'completed'
                              ? <CheckCircle2 size={19} color="#10b981" style={{ flexShrink: 0 }} />
                              : <Circle size={19} color="#c4c4c4" style={{ flexShrink: 0 }} />}
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 13.5, fontWeight: 600, color: t.status === 'completed' ? '#059669' : DARK, textDecoration: t.status === 'completed' ? 'line-through' : 'none', fontFamily: FF }}>{t.task}</span>
                              <span style={{ padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: smeta.bg, color: smeta.color, fontFamily: FF }}>{STATUS_OPTIONS.find(s => s.key === t.status)?.label}</span>
                              {t.is_overdue && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 800, background: '#fee2e2', color: '#991b1b', fontFamily: FF }}>
                                  <AlertTriangle size={9} />Overdue
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                              <div>
                                <div style={{ fontSize: 9.5, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3, fontFamily: FF }}>Assigned To</div>
                                <select disabled={!isAdmin} value={t.assigned_to || ''} onChange={e => patchTask(t.id, { assigned_to: e.target.value || null })}
                                  style={{ ...inp, padding: '5px 8px', fontSize: 11.5, width: 140 }}>
                                  <option value="">Unassigned</option>
                                  {assignableUsers.map((u: any) => <option key={u.id} value={u.id}>{u.first_name ? `${u.first_name} ${u.last_name}`.trim() : u.username}</option>)}
                                </select>
                              </div>
                              <div>
                                <div style={{ fontSize: 9.5, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3, fontFamily: FF }}>Due Date</div>
                                <input disabled={!isAdmin} type="date" value={t.due_date || ''} onChange={e => patchTask(t.id, { due_date: e.target.value || null })}
                                  style={{ ...inp, padding: '5px 8px', fontSize: 11.5, width: 130 }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 160 }}>
                                <div style={{ fontSize: 9.5, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3, fontFamily: FF }}>Notes</div>
                                <input disabled={!isAdmin} defaultValue={t.notes || ''} onBlur={e => { if (e.target.value !== (t.notes || '')) patchTask(t.id, { notes: e.target.value }); }}
                                  placeholder="Add a note…" style={{ ...inp, padding: '5px 8px', fontSize: 11.5, width: '100%' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card3D>

      {isAdmin && !exitRecord.completed_at && (
        <div style={{ marginTop: 18, textAlign: 'right' }}>
          <button onClick={async () => { try { await erpFetch(`hr/exit/${exitRecord.id}/mark-complete/`, { method: 'PATCH', body: '{}' }); toast.success('Exit marked complete'); onRefresh(); } catch (e: any) { toast.error(e.message || 'Failed'); } }}
            style={{ ...btnPrimary, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <CheckCircle2 size={15} />Mark Complete
          </button>
        </div>
      )}
    </div>
  );
}

export default function HRExitPage() {
  const fmtCurrency = useFmtCurrency();
  const { isCompanyAdmin, isHRManager } = useAccess();
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;

  const exits = useERPList<any>('hr/exit/');
  const employees = useERPList<any>('hr/employees/');
  const [assignableUsers, setAssignableUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const [interviewing, setInterviewing] = useState<any>(null);
  const [markingPaid, setMarkingPaid] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const loadStats = () => erpFetch('hr/exit/stats/').then(setStats).catch(() => setStats(null));
  useEffect(() => { if (isAdmin) loadStats(); }, [isAdmin, exits.data.length]);

  useEffect(() => {
    if (!isAdmin) return;
    erpFetch('hr/employees/linkable-users/').then((res: any) => setAssignableUsers(Array.isArray(res) ? res : [])).catch(() => setAssignableUsers([]));
  }, [isAdmin]);

  const refreshAll = () => { exits.reload(); loadStats(); };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      await exits.remove(deleting.id);
      toast.success('Exit record deleted');
      setDeleting(null);
      if (viewing?.id === deleting.id) setViewing(null);
    } catch (e: any) { toast.error(e.message || 'Delete failed'); }
    finally { setDeleteBusy(false); }
  };

  // Non-admins land straight on their own (single) exit record, if any.
  if (!isAdmin) {
    return (
      <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
        <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
        <PageHead title="Exit Management" subtitle="Your exit details and checklist" />
        {exits.loading ? <Skeleton h={200} /> : exits.data.length === 0 ? (
          <EmptyState icon={DoorOpen} message="No exit is currently on record for you." />
        ) : (
          <ExitDetailView exitRecord={exits.data[0]} isAdmin={false} assignableUsers={[]} formatAmount={fmtCurrency}
            onRefresh={refreshAll} onOpenInterview={() => setInterviewing(exits.data[0])} onOpenMarkPaid={() => {}} />
        )}
        {interviewing && <ExitInterviewModal exitRecord={interviewing} isAdmin={false} onClose={() => setInterviewing(null)} onSaved={refreshAll} />}
      </div>
    );
  }

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <PageHead title="Exit Management" subtitle="Offboarding, interviews and final settlements"
        action={!viewing ? <button style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 7 }} onClick={() => setShowAdd(true)}><Plus size={15} /> Initiate Exit</button> : undefined} />

      {viewing ? (
        <ExitDetailView exitRecord={exits.data.find((e: any) => e.id === viewing.id) || viewing} isAdmin={isAdmin} assignableUsers={assignableUsers} formatAmount={fmtCurrency}
          onBack={() => setViewing(null)} onRefresh={refreshAll}
          onOpenInterview={() => setInterviewing(viewing)} onOpenMarkPaid={() => setMarkingPaid(viewing)} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 22 }}>
            <StatCard label="Total Exits" val={stats?.total ?? 0} icon={DoorOpen} color="#ef4444" />
            <StatCard label="Pending Settlement" val={stats?.pending_settlement ?? 0} icon={IndianRupee} color={OG} />
            <StatCard label="Interviews Done" val={stats?.interviews_done ?? 0} icon={CheckCircle2} color="#10b981" />
            <StatCard label="Notice Period Active" val={stats?.notice_period_active ?? 0} icon={Clock} color="#3b82f6" />
            <StatCard label="Completed Exits" val={stats?.completed_exits ?? 0} icon={ClipboardCheck} color="#8b5cf6" />
          </div>

          {exits.loading ? (
            <div>{[0, 1, 2].map(i => <Skeleton key={i} h={56} />)}</div>
          ) : exits.data.length === 0 ? (
            <EmptyState icon={DoorOpen} message="No exits in progress." cta={<button style={btnPrimary} onClick={() => setShowAdd(true)}>Initiate Exit</button>} />
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BORDER}`, overflowX: 'auto', boxShadow: '0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 1000 }}>
                <thead>
                  <tr style={{ background: '#faf8f5', textAlign: 'left' }}>
                    {['Employee', 'Department', 'Exit Type', 'Last Day', 'Notice', 'Settlement', 'Interview', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTED, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exits.data.map((e: any) => {
                    const typeMeta = exitTypeMeta(e.reason);
                    const overall = OVERALL_META[e.overall_status] ?? OVERALL_META.notice_period;
                    return (
                      <tr key={e.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '11px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <Avatar name={e.employee_name} />
                            <span style={{ fontWeight: 700, color: DARK }}>{e.employee_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 16px', color: MUTED }}>{e.department_name || '—'}</td>
                        <td style={{ padding: '11px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: `${typeMeta.color}18`, color: typeMeta.color }}>{e.reason_label}</span></td>
                        <td style={{ padding: '11px 16px', color: '#4b4b4b', whiteSpace: 'nowrap' }}>{fmtDate(e.last_working_day)}</td>
                        <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{e.notice_days_remaining < 0 ? `${Math.abs(e.notice_days_remaining)}d overdue` : `${e.notice_days_remaining}d left`}</td>
                        <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 700, color: OG }}>{fmtCurrency(e.final_settlement_amount)}</span>
                          {e.settlement_paid ? <span style={{ marginLeft: 8, fontSize: 11, color: '#10b981', fontWeight: 700 }}>· Paid</span> : <span style={{ marginLeft: 8, fontSize: 11, color: '#9ca3af', fontWeight: 700 }}>· Pending</span>}
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          {e.exit_interview_done
                            ? <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700 }}>Done</span>
                            : e.exit_interview_scheduled
                              ? <span style={{ color: OG, fontSize: 12, fontWeight: 700 }}>Scheduled</span>
                              : <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700 }}>Not Required</span>}
                        </td>
                        <td style={{ padding: '11px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: overall.bg, color: overall.color }}>{overall.label}</span></td>
                        <td style={{ padding: '11px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setViewing(e)} title="View Details"
                              style={{ background: 'rgba(201,136,58,0.08)', color: OG, border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                              <Eye size={12} />
                            </button>
                            {!e.settlement_paid && (
                              <button onClick={() => setMarkingPaid(e)} title="Mark Paid"
                                style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                                <IndianRupee size={12} />
                              </button>
                            )}
                            {!e.completed_at && (
                              <button onClick={async () => { try { await erpFetch(`hr/exit/${e.id}/mark-complete/`, { method: 'PATCH', body: '{}' }); toast.success('Exit marked complete'); refreshAll(); } catch (err: any) { toast.error(err.message || 'Failed'); } }} title="Mark Complete"
                                style={{ background: CREAM, color: DARK, border: `1px solid ${BORDER}`, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                                <CheckCircle2 size={12} />
                              </button>
                            )}
                            <button onClick={() => setDeleting(e)} title="Delete"
                              style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.20)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showAdd && <InitiateExitPanel employees={employees.data} onClose={() => setShowAdd(false)} onSaved={refreshAll} />}
      {interviewing && <ExitInterviewModal exitRecord={interviewing} isAdmin={isAdmin} onClose={() => setInterviewing(null)} onSaved={refreshAll} />}
      {markingPaid && <MarkPaidModal exitRecord={markingPaid} onClose={() => setMarkingPaid(null)} onSaved={refreshAll} />}
      {deleting && <DeleteDlg row={deleting} busy={deleteBusy} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
    </div>
  );
}
