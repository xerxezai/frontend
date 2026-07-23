import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, X as XIcon, Clock3, Trash2, Pencil, Users, Coffee, Timer, Calendar,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import {
  Card3D, FF, OG, OG_G, DARK, WHITE, CREAM, Skeleton, EmptyState, SlidePanel, PageHead, initials, inp, lbl,
} from '../hr/hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const SHIFT_TYPES = ['Morning', 'Evening', 'Night', 'Rotational'] as const;
const TYPE_META: Record<string, { label: string; bg: string; color: string }> = {
  Morning:    { label: 'Morning Shift',    bg: '#fef3c7', color: '#92400e' },
  Evening:    { label: 'Evening Shift',    bg: '#dbeafe', color: '#1d4ed8' },
  Night:      { label: 'Night Shift',      bg: '#ede9fe', color: '#6d28d9' },
  Rotational: { label: 'Rotational Shift', bg: '#d1fae5', color: '#065f46' },
};

const COLOR_PRESETS = [
  { name: 'Gold',   value: '#c8a84b' },
  { name: 'Blue',   value: '#3b82f6' },
  { name: 'Green',  value: '#22c55e' },
  { name: 'Red',    value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Orange', value: '#f97316' },
];

const BREAK_OPTIONS = [
  { label: 'No Break',    value: 0 },
  { label: '15 minutes',  value: 15 },
  { label: '30 minutes',  value: 30 },
  { label: '45 minutes',  value: 45 },
  { label: '1 hour',      value: 60 },
];

const GRACE_OPTIONS = [
  { label: 'No grace period', value: 0 },
  { label: '5 minutes',       value: 5 },
  { label: '10 minutes',      value: 10 },
  { label: '15 minutes',      value: 15 },
  { label: '30 minutes',      value: 30 },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBR: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

function computeTotalHours(start: string, end: string, breakMin: number): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if ([sh, sm, eh, em].some(Number.isNaN)) return 0;
  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;
  if (endMin <= startMin) endMin += 24 * 60;
  const minutes = endMin - startMin - (breakMin || 0);
  return Math.round((Math.max(minutes, 0) / 60) * 100) / 100;
}

// ── 12-hour AM/PM time helpers — the form stores/sends 24-hour "HH:MM" (what the backend
// TimeField expects); these convert to/from the 12-hour hour/minute/meridiem the UI shows,
// so the displayed format doesn't depend on the browser's native <input type="time"> locale.
type Meridiem = 'AM' | 'PM';

function to12Hour(time24: string): { hour: number; minute: number; meridiem: Meridiem } {
  if (!time24) return { hour: 9, minute: 0, meridiem: 'AM' };
  const [h, m] = time24.split(':').map(Number);
  const meridiem: Meridiem = h >= 12 ? 'PM' : 'AM';
  let hour = h % 12;
  if (hour === 0) hour = 12;
  return { hour, minute: m || 0, meridiem };
}

function to24Hour(hour: number, minute: number, meridiem: Meridiem): string {
  let h = hour % 12;
  if (meridiem === 'PM') h += 12;
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function fmt12(time24?: string): string {
  if (!time24) return '';
  const { hour, minute, meridiem } = to12Hour(time24.slice(0, 5));
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem}`;
}

const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function TimeField12({ value, onChange }: { value: string; onChange: (v24: string) => void }) {
  const { hour, minute, meridiem } = to12Hour(value);
  const set = (h: number, m: number, mer: Meridiem) => onChange(to24Hour(h, m, mer));
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <select value={hour} onChange={e => set(Number(e.target.value), minute, meridiem)} style={{ ...inp, width: 62 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
      </select>
      <select value={minute} onChange={e => set(hour, Number(e.target.value), meridiem)} style={{ ...inp, width: 62 }}>
        {MINUTE_OPTIONS.map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
      </select>
      <select value={meridiem} onChange={e => set(hour, minute, e.target.value as Meridiem)} style={{ ...inp, width: 72 }}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

const SHIFT_PRESETS = [
  { key: 'morning', label: 'Morning (9AM–6PM)', start: '09:00', end: '18:00' },
  { key: 'evening', label: 'Evening (2PM–11PM)', start: '14:00', end: '23:00' },
  { key: 'night', label: 'Night (10PM–7AM)', start: '22:00', end: '07:00' },
] as const;

const TypeBadge = ({ t }: { t: string }) => {
  const m = TYPE_META[t] ?? TYPE_META.Morning;
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, fontFamily: FF }}>
      {m.label}
    </span>
  );
};

const Avatar = ({ name, size = 26 }: { name: string; size?: number }) => (
  <span style={{ width: size, height: size, borderRadius: '50%', background: `${OG}22`, color: OG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, fontWeight: 800, fontSize: size * 0.4, flexShrink: 0, border: `1.5px solid ${WHITE}` }}>
    {initials(name)}
  </span>
);

type FormState = {
  name: string; shift_type: string; start_time: string; end_time: string;
  break_duration: number; grace_period: number; working_days: string[]; color: string;
  is_active: boolean; employee_ids: number[];
};

const defForm: FormState = {
  name: '', shift_type: 'Morning', start_time: '', end_time: '',
  break_duration: 30, grace_period: 10, working_days: [], color: '#c8a84b',
  is_active: true, employee_ids: [],
};

// ── New / Edit Shift panel ───────────────────────────────────────────────────
function ShiftFormPanel({ initial, employees, onClose, onSaved }: {
  initial?: any; employees: any[]; onClose: () => void; onSaved: (body: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(() => initial ? {
    name: initial.name, shift_type: initial.shift_type, start_time: initial.start_time?.slice(0, 5) || '',
    end_time: initial.end_time?.slice(0, 5) || '', break_duration: initial.break_duration,
    grace_period: initial.grace_period, working_days: initial.working_days || [], color: initial.color,
    is_active: initial.is_active, employee_ids: initial.employee_ids || [],
  } : { ...defForm });
  const [saving, setSaving] = useState(false);
  const [empSearch, setEmpSearch] = useState('');

  const totalHours = computeTotalHours(form.start_time, form.end_time, form.break_duration);

  const toggleDay = (day: string) => {
    setForm(f => ({
      ...f,
      working_days: f.working_days.includes(day) ? f.working_days.filter(d => d !== day) : [...f.working_days, day],
    }));
  };
  const applyPreset = (preset: 'monfri' | 'sunthu' | 'all') => {
    if (preset === 'monfri') setForm(f => ({ ...f, working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }));
    else if (preset === 'sunthu') setForm(f => ({ ...f, working_days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] }));
    else setForm(f => ({ ...f, working_days: [...DAYS] }));
  };

  const toggleEmp = (id: number) => {
    setForm(f => ({
      ...f,
      employee_ids: f.employee_ids.includes(id) ? f.employee_ids.filter(x => x !== id) : [...f.employee_ids, id],
    }));
  };

  const filteredEmployees = useMemo(
    () => employees.filter((e: any) => e.full_name.toLowerCase().includes(empSearch.toLowerCase())),
    [employees, empSearch],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.start_time || !form.end_time) { toast.error('Please fill all required fields.'); return; }
    setSaving(true);
    try {
      await onSaved(form);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save shift');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SlidePanel title={initial ? 'Edit Shift' : 'New Shift'} subtitle={initial ? initial.name : 'Define a work shift and assign employees'} width={480} onClose={onClose}
      footer={(
        <>
          <button type="button" onClick={onClose} style={{ flex: 1, background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '10px 0', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13, color: MUTED }}>Cancel</button>
          <button type="submit" form="shift-form" disabled={saving} style={{ flex: 1, background: OG_G, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 0', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Shift'}
          </button>
        </>
      )}
    >
      <form id="shift-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={lbl}>Shift Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Morning Shift" style={inp} required />
        </div>

        <div>
          <label style={lbl}>Shift Type</label>
          <select value={form.shift_type} onChange={e => setForm(f => ({ ...f, shift_type: e.target.value }))} style={inp}>
            {SHIFT_TYPES.map(t => <option key={t} value={t}>{TYPE_META[t].label}</option>)}
          </select>
        </div>

        <div>
          <label style={lbl}>Color</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COLOR_PRESETS.map(c => (
              <button key={c.value} type="button" onClick={() => setForm(f => ({ ...f, color: c.value }))} title={c.name}
                style={{
                  width: 30, height: 30, borderRadius: '50%', background: c.value, cursor: 'pointer',
                  border: form.color === c.value ? `3px solid ${DARK}` : `2px solid ${WHITE}`,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
                }} />
            ))}
          </div>
        </div>

        <div>
          <label style={lbl}>Shift Presets</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SHIFT_PRESETS.map(p => {
              const active = form.start_time === p.start && form.end_time === p.end;
              return (
                <button key={p.key} type="button" onClick={() => setForm(f => ({ ...f, start_time: p.start, end_time: p.end }))}
                  style={{
                    border: active ? `1.5px solid ${OG}` : `1px solid ${BORDER}`, borderRadius: 8, padding: '5px 12px',
                    background: active ? 'rgba(201,136,58,0.10)' : CREAM, color: active ? OG : MUTED,
                    fontFamily: FF, fontSize: 11.5, fontWeight: active ? 700 : 600, cursor: 'pointer',
                  }}>
                  {p.label}
                </button>
              );
            })}
            <button type="button" onClick={() => setForm(f => ({ ...f, start_time: '', end_time: '' }))}
              style={{
                border: !SHIFT_PRESETS.some(p => p.start === form.start_time && p.end === form.end_time) ? `1.5px solid ${OG}` : `1px solid ${BORDER}`,
                borderRadius: 8, padding: '5px 12px',
                background: !SHIFT_PRESETS.some(p => p.start === form.start_time && p.end === form.end_time) ? 'rgba(201,136,58,0.10)' : CREAM,
                color: !SHIFT_PRESETS.some(p => p.start === form.start_time && p.end === form.end_time) ? OG : MUTED,
                fontFamily: FF, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
              }}>
              Custom
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>Start Time</label>
            <TimeField12 value={form.start_time} onChange={v => setForm(f => ({ ...f, start_time: v }))} />
          </div>
          <div>
            <label style={lbl}>End Time</label>
            <TimeField12 value={form.end_time} onChange={v => setForm(f => ({ ...f, end_time: v }))} />
          </div>
        </div>
        {form.start_time && form.end_time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF, fontSize: 12.5, fontWeight: 700, color: OG, marginTop: -6 }}>
            <Timer size={13} /> Total Shift Hours: {totalHours} hours
          </div>
        )}

        <div>
          <label style={lbl}>Break Duration</label>
          <select value={form.break_duration} onChange={e => setForm(f => ({ ...f, break_duration: Number(e.target.value) }))} style={inp}>
            {BREAK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label style={lbl}>Grace Period — how many minutes late is acceptable</label>
          <select value={form.grace_period} onChange={e => setForm(f => ({ ...f, grace_period: Number(e.target.value) }))} style={inp}>
            {GRACE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label style={lbl}>Working Days</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <button type="button" onClick={() => applyPreset('monfri')} style={presetBtn}>Mon–Fri</button>
            <button type="button" onClick={() => applyPreset('sunthu')} style={presetBtn}>Sun–Thu</button>
            <button type="button" onClick={() => applyPreset('all')} style={presetBtn}>All Days</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DAYS.map(day => {
              const sel = form.working_days.includes(day);
              return (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  style={{
                    border: sel ? `1.5px solid ${OG}` : `1px solid ${BORDER}`, borderRadius: 8, padding: '5px 12px',
                    background: sel ? 'rgba(201,136,58,0.10)' : CREAM, color: sel ? OG : MUTED,
                    fontFamily: FF, fontSize: 12, fontWeight: sel ? 700 : 500, cursor: 'pointer',
                  }}>
                  {DAY_ABBR[day]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={lbl}>Assign Employees — {form.employee_ids.length} employee{form.employee_ids.length === 1 ? '' : 's'} selected</label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: 10, color: MUTED }} />
            <input value={empSearch} onChange={e => setEmpSearch(e.target.value)} placeholder="Search employees…" style={{ ...inp, paddingLeft: 30 }} />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto', border: `1px solid ${BORDER}`, borderRadius: 9, padding: 8 }}>
            {filteredEmployees.length === 0 ? (
              <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: MUTED, fontFamily: FF }}>No employees found.</div>
            ) : filteredEmployees.map((emp: any) => {
              const sel = form.employee_ids.includes(emp.id);
              return (
                <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 6px', cursor: 'pointer', borderRadius: 7, background: sel ? 'rgba(201,136,58,0.06)' : 'transparent' }}>
                  <input type="checkbox" checked={sel} onChange={() => toggleEmp(emp.id)} style={{ accentColor: OG }} />
                  <Avatar name={emp.full_name} size={22} />
                  <span style={{ fontFamily: FF, fontSize: 12.5, color: DARK }}>{emp.full_name}</span>
                  <span style={{ fontFamily: FF, fontSize: 11, color: MUTED }}>{emp.code}</span>
                </label>
              );
            })}
          </div>
        </div>
      </form>
    </SlidePanel>
  );
}

const presetBtn: React.CSSProperties = {
  background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '4px 10px',
  fontFamily: FF, fontSize: 11, fontWeight: 700, color: MUTED, cursor: 'pointer',
};

// ── Delete confirmation ───────────────────────────────────────────────────────
function DeleteShiftDlg({ shift, busy, onCancel, onConfirm }: { shift: any; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 420, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: DARK }}>Delete Shift?</h6>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: DARK }}>{shift.name}</strong>? All assigned employees will be unassigned from this shift.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={busy} style={{ flex: 1, background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 9, padding: 9, cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 13, color: MUTED }}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ flex: 1, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 9, padding: 9, cursor: busy ? 'wait' : 'pointer', color: '#ef4444', fontFamily: FF, fontWeight: 700, fontSize: 13 }}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number | string; accent: string }) => (
  <Card3D accent={accent} p="16px 18px">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={accent} />
      </div>
      <div>
        <div style={{ fontFamily: FF, fontSize: 20, fontWeight: 900, color: DARK, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  </Card3D>
);

type ViewTab = 'shifts' | 'assignments';
type TypeFilter = 'all' | typeof SHIFT_TYPES[number];
type ActiveFilter = 'all' | 'active' | 'inactive';

export default function ShiftManagementModule() {
  const { isCompanyAdmin, isHRManager } = useAccess();
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;

  const shifts = useERPList<any>('hr/shifts/');
  const employees = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');

  const [myEmployee, setMyEmployee] = useState<any>(null);
  useEffect(() => {
    if (isAdmin) return;
    erpFetch('hr/employees/me/').then(setMyEmployee).catch(() => setMyEmployee(null));
  }, [isAdmin]);

  const [tab, setTab] = useState<ViewTab>('shifts');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [deptFilter, setDeptFilter] = useState('');

  const filteredShifts = useMemo(() => shifts.data.filter((s: any) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && s.shift_type !== typeFilter) return false;
    if (activeFilter === 'active' && !s.is_active) return false;
    if (activeFilter === 'inactive' && s.is_active) return false;
    return true;
  }), [shifts.data, search, typeFilter, activeFilter]);

  const stats = useMemo(() => {
    const totalShifts = shifts.data.length;
    const activeShifts = shifts.data.filter((s: any) => s.is_active).length;
    const assignedIds = new Set<number>();
    shifts.data.forEach((s: any) => (s.employee_ids || []).forEach((id: number) => assignedIds.add(id)));
    return { totalShifts, activeShifts, totalAssigned: assignedIds.size };
  }, [shifts.data]);

  const employeeShiftMap = useMemo(() => {
    const map: Record<number, any> = {};
    shifts.data.forEach((s: any) => (s.employee_ids || []).forEach((id: number) => { map[id] = s; }));
    return map;
  }, [shifts.data]);

  const assignmentEmployees = useMemo(() => {
    if (!deptFilter) return employees.data;
    return employees.data.filter((e: any) => e.department_name === deptFilter);
  }, [employees.data, deptFilter]);

  const departmentNames = useMemo(
    () => Array.from(new Set(departments.data.map((d: any) => d.name))) as string[],
    [departments.data],
  );

  const saveShift = async (body: FormState) => {
    if (editing) await shifts.update(editing.id, body);
    else await shifts.create(body);
    toast.success(editing ? 'Shift updated' : 'Shift created');
  };

  const handleDelete = async (id: number) => {
    setBusyId(id);
    try {
      await shifts.remove(id);
      toast.success('Shift deleted');
      setDeleting(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete shift');
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (s: any) => {
    setBusyId(s.id);
    try {
      await shifts.update(s.id, { is_active: !s.is_active } as any);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update shift');
    } finally {
      setBusyId(null);
    }
  };

  const changeEmployeeShift = async (employeeId: number, newShiftId: string) => {
    const current = employeeShiftMap[employeeId];
    try {
      if (current && String(current.id) !== newShiftId) {
        await shifts.update(current.id, { employee_ids: (current.employee_ids || []).filter((id: number) => id !== employeeId) } as any);
      }
      if (newShiftId && (!current || String(current.id) !== newShiftId)) {
        const target = shifts.data.find((s: any) => String(s.id) === newShiftId);
        if (target) {
          const ids = Array.from(new Set([...(target.employee_ids || []), employeeId]));
          await shifts.update(target.id, { employee_ids: ids } as any);
        }
      }
      toast.success('Shift assignment updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update assignment');
    }
  };

  return (
    <div style={{ animation: 'smFadeUp 0.45s ease both' }}>
      <style>{`@keyframes smFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <PageHead
        title="Shift Management"
        subtitle={isAdmin ? 'Create and assign work shifts to employees' : 'Your assigned work shift'}
        action={isAdmin ? (
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            style={{
              background: OG_G, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px',
              fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: '0 3px 0 rgba(150,95,30,0.5)',
            }}>
            <Plus size={15} /> New Shift
          </button>
        ) : undefined}
      />

      {isAdmin && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
            <StatCard icon={Clock3} label="Total Shifts" value={stats.totalShifts} accent={OG} />
            <StatCard icon={Calendar} label="Active Shifts" value={stats.activeShifts} accent="#22c55e" />
            <StatCard icon={Users} label="Total Employees Assigned" value={stats.totalAssigned} accent="#3b82f6" />
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
            {(['shifts', 'assignments'] as ViewTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  background: 'none', border: 'none', borderBottom: tab === t ? `2.5px solid ${OG}` : '2.5px solid transparent',
                  padding: '10px 4px', marginRight: 18, fontFamily: FF, fontWeight: 700, fontSize: 13.5,
                  color: tab === t ? OG : MUTED, cursor: 'pointer',
                }}>
                {t === 'shifts' ? 'Shifts' : 'Shift Assignments'}
              </button>
            ))}
          </div>
        </>
      )}

      {(!isAdmin || tab === 'shifts') && (
        <>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 11, top: 11, color: MUTED }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shifts by name…" style={{ ...inp, paddingLeft: 32 }} />
              </div>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as TypeFilter)} style={{ ...inp, width: 'auto' }}>
                <option value="all">All Shifts</option>
                {SHIFT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={activeFilter} onChange={e => setActiveFilter(e.target.value as ActiveFilter)} style={{ ...inp, width: 'auto' }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          {shifts.loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[1, 2, 3].map(i => <Skeleton key={i} h={180} />)}
            </div>
          ) : filteredShifts.length === 0 ? (
            <EmptyState icon={Clock3} message={isAdmin ? 'No shifts yet. Create your first shift.' : 'No shift has been assigned to you yet.'} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {filteredShifts.map((s: any) => (
                <div key={s.id} style={{
                  background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`,
                  borderLeft: `5px solid ${s.color || OG}`, padding: '18px 20px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)', opacity: s.is_active ? 1 : 0.6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 15.5, color: DARK, marginBottom: 6 }}>{s.name}</div>
                      <TypeBadge t={s.shift_type} />
                    </div>
                    {isAdmin && (
                      <button onClick={() => toggleActive(s)} disabled={busyId === s.id}
                        title={s.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                        style={{
                          background: s.is_active ? 'rgba(34,197,94,0.10)' : 'rgba(107,107,107,0.10)',
                          color: s.is_active ? '#16a34a' : MUTED, border: 'none', borderRadius: 20,
                          padding: '3px 10px', fontFamily: FF, fontSize: 10.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                        }}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 15, color: DARK }}>{fmt12(s.start_time)} → {fmt12(s.end_time)}</span>
                    <span style={{ fontFamily: FF, fontSize: 12, color: OG, fontWeight: 700 }}>({s.total_hours}h)</span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontFamily: FF, fontSize: 11.5, color: MUTED }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Coffee size={12} /> {s.break_duration}m break</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Timer size={12} /> {s.grace_period}m grace</span>
                  </div>

                  {s.working_days?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                      {s.working_days.map((d: string) => (
                        <span key={d} style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '2px 7px', fontSize: 10.5, fontFamily: FF, color: MUTED, fontWeight: 600 }}>
                          {DAY_ABBR[d] || d}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {(s.employees_detail || []).slice(0, 4).map((e: any, i: number) => (
                        <div key={e.id} style={{ marginLeft: i === 0 ? 0 : -8 }}><Avatar name={e.full_name} /></div>
                      ))}
                      {s.employee_count > 4 && (
                        <span style={{ marginLeft: -8, width: 26, height: 26, borderRadius: '50%', background: CREAM, border: `1.5px solid ${WHITE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, fontWeight: 700, fontSize: 10, color: MUTED }}>
                          +{s.employee_count - 4}
                        </span>
                      )}
                      {s.employee_count === 0 && <span style={{ fontFamily: FF, fontSize: 11.5, color: MUTED }}>No employees assigned</span>}
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditing(s); setShowForm(true); }} title="Edit"
                          style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: DARK }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleting(s)} title="Delete"
                          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isAdmin && tab === 'assignments' && (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'flex-end' }}>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ ...inp, width: 'auto' }}>
              <option value="">All Departments</option>
              {departmentNames.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF }}>
              <thead>
                <tr style={{ background: CREAM }}>
                  {['Employee', 'Department', 'Current Shift', 'Change Shift'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignmentEmployees.map((emp: any) => {
                  const current = employeeShiftMap[emp.id];
                  return (
                    <tr key={emp.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={emp.full_name} /> <span style={{ fontSize: 13, color: DARK, fontWeight: 600 }}>{emp.full_name}</span>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12.5, color: MUTED }}>{emp.department_name || '—'}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12.5, color: current ? DARK : MUTED, fontWeight: current ? 700 : 400 }}>{current ? current.name : 'Unassigned'}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <select value={current ? String(current.id) : ''} onChange={e => changeEmployeeShift(emp.id, e.target.value)} style={{ ...inp, width: 'auto' }}>
                          <option value="">Unassigned</option>
                          {shifts.data.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {assignmentEmployees.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: MUTED, fontSize: 13 }}>No employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isAdmin && myEmployee === null && (
        <div style={{ marginTop: 12, fontFamily: FF, fontSize: 12.5, color: MUTED }}>
          <XIcon size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />No employee profile linked to your account.
        </div>
      )}

      {showForm && (
        <ShiftFormPanel
          initial={editing}
          employees={employees.data}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={saveShift}
        />
      )}

      {deleting && (
        <DeleteShiftDlg shift={deleting} busy={busyId === deleting.id} onCancel={() => setDeleting(null)} onConfirm={() => handleDelete(deleting.id)} />
      )}
    </div>
  );
}
