import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2, Circle, ClipboardCheck, PartyPopper, Users, Clock, CircleDashed,
  Eye, Pencil, Trash2, ArrowLeft, Plus, AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch, isSuperUser } from '../../../../hooks/useERPApi';
import { useAccess } from '../../../../context/AccessContext';
import { Card3D, Skeleton, PageHead, EmptyState, OG, DARK, WHITE, CREAM, FF, inp, lbl, initials } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'pre_joining', label: 'Pre-Joining' },
  { key: 'day_1', label: 'Day 1' },
  { key: 'first_week', label: 'First Week' },
  { key: 'first_month', label: 'First Month' },
];

const STATUS_OPTIONS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

const OVERALL_META: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  not_started: { label: 'Not Started', bg: '#f1f5f9', color: '#64748b', icon: CircleDashed },
  in_progress: { label: 'In Progress', bg: '#ffedd5', color: '#c2410c', icon: Clock },
  completed: { label: 'Completed', bg: '#d1fae5', color: '#065f46', icon: CheckCircle2 },
};

const TASK_STATUS_META: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#f1f5f9', color: '#64748b' },
  in_progress: { bg: '#ffedd5', color: '#c2410c' },
  completed: { bg: '#d1fae5', color: '#065f46' },
};

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

const Avatar = ({ name, size = 30 }: { name: string; size?: number }) => (
  <span style={{ width: size, height: size, borderRadius: '50%', background: `${OG}22`, color: OG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, fontWeight: 800, fontSize: size * 0.38, flexShrink: 0 }}>
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

// ── lightweight confetti ──────────────────────────────────────────────────────
function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!; c.width = c.offsetWidth; c.height = c.offsetHeight;
    const colors = [OG, '#e8a84e', '#10b981', '#3b82f6', '#fbbf24'];
    const parts = Array.from({ length: 80 }, () => ({
      x: c.width / 2 + (Math.random() - 0.5) * 80, y: c.height * 0.35,
      vx: (Math.random() - 0.5) * 9, vy: -(Math.random() * 7 + 3),
      r: Math.random() * 5 + 2, col: colors[Math.floor(Math.random() * colors.length)], rot: Math.random() * 360, vr: (Math.random() - 0.5) * 14,
    }));
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.col; ctx.globalAlpha = Math.max(0, 1 - p.y / c.height);
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); });
      if (parts.some(p => p.y < c.height + 20)) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} />;
}

// ── Delete confirmation ───────────────────────────────────────────────────────
function DeleteDlg({ row, busy, onCancel, onConfirm }: { row: any; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1060, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 400, width: '100%', borderTop: '2px solid #ef4444', fontFamily: FF, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
        <h6 style={{ fontWeight: 800, marginBottom: 8, color: DARK }}>Delete Onboarding?</h6>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: DARK }}>{row.employee_name}</strong>'s onboarding checklist? This cannot be undone.
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

// ── Checklist view (Section 3 + 4) ───────────────────────────────────────────
function ChecklistView({ employeeId, employeeName, isAdmin, assignableUsers, onBack }: {
  employeeId: string; employeeName: string; isAdmin: boolean; assignableUsers: any[]; onBack?: () => void;
}) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [celebrate, setCelebrate] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    erpFetch(`hr/employees/${employeeId}/onboarding/`)
      .then(res => setTasks(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [employeeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startOnboarding = async () => {
    setLoading(true);
    try {
      const res = await erpFetch(`hr/employees/${employeeId}/onboarding/`, { method: 'POST', body: '{}' });
      setTasks(Array.isArray(res) ? res : []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to start onboarding');
    } finally {
      setLoading(false);
    }
  };

  const patchTask = async (id: number, body: any) => {
    setSavingId(id);
    const prevTasks = tasks;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...body } : t));
    try {
      const wasAllDone = tasks.length > 0 && tasks.every(t => t.status === 'completed');
      const updated = await erpFetch(`hr/onboarding/${id}/`, { method: 'PATCH', body: JSON.stringify(body) });
      setTasks(prev => {
        const next = prev.map(t => t.id === id ? updated : t);
        const nowAllDone = next.length > 0 && next.every(t => t.status === 'completed');
        if (!wasAllDone && nowAllDone) { setCelebrate(true); setTimeout(() => setCelebrate(false), 3200); }
        return next;
      });
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
      setTasks(prevTasks);
    } finally {
      setSavingId(null);
    }
  };

  const toggleComplete = (t: any) => patchTask(t.id, { status: t.status === 'completed' ? 'pending' : 'completed' });

  const done = tasks.filter(t => t.status === 'completed').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const barColor = progressColor(pct);
  const grouped = CATEGORIES.map(cat => ({ ...cat, items: tasks.filter(t => t.category === cat.key) })).filter(g => g.items.length > 0);

  return (
    <div style={{ position: 'relative' }}>
      {celebrate && <Confetti />}
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: OG, fontFamily: FF, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, padding: 0 }}>
          <ArrowLeft size={14} />Back to Dashboard
        </button>
      )}

      {loading ? (
        <div style={{ maxWidth: 640 }}>{[0, 1, 2, 3].map(i => <Skeleton key={i} h={48} />)}</div>
      ) : tasks.length === 0 ? (
        <EmptyState icon={ClipboardCheck} message={`No checklist yet for ${employeeName || 'this employee'}.`}
          cta={isAdmin ? <button style={{ background: OG, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 22px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer' }} onClick={startOnboarding}>Start Onboarding</button> : undefined} />
      ) : (
        <Card3D accent={pct === 100 ? '#10b981' : OG} p="22px 24px" style={{ position: 'relative', zIndex: 6, maxWidth: 780 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: DARK }}>{employeeName}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: barColor }}>{done}/{tasks.length} · {pct}%</div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 4, transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)' }} />
          </div>

          {pct === 100 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <PartyPopper size={16} color="#10b981" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>
                Onboarding complete{tasks.some(t => t.completed_at) ? ` on ${fmtDate([...tasks].sort((a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''))[0]?.completed_at)}` : ''} — welcome aboard!
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {grouped.map(group => (
              <div key={group.key}>
                <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 11.5, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                  {group.label} — {group.items.filter(t => t.status === 'completed').length}/{group.items.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {group.items.map((t: any) => {
                    const overdue = t.is_overdue;
                    const smeta = TASK_STATUS_META[t.status] ?? TASK_STATUS_META.pending;
                    return (
                      <div key={t.id} style={{ background: t.status === 'completed' ? 'rgba(16,185,129,0.05)' : '#F8F7F4', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <button onClick={() => isAdmin && toggleComplete(t)} disabled={!isAdmin || savingId === t.id}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: isAdmin ? 'pointer' : 'default', marginTop: 1 }}>
                            {t.status === 'completed'
                              ? <CheckCircle2 size={19} color="#10b981" style={{ flexShrink: 0 }} />
                              : <Circle size={19} color="#c4c4c4" style={{ flexShrink: 0 }} />}
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 13.5, fontWeight: 600, color: t.status === 'completed' ? '#059669' : DARK, textDecoration: t.status === 'completed' ? 'line-through' : 'none', fontFamily: FF }}>{t.task}</span>
                              <span style={{ padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: smeta.bg, color: smeta.color, fontFamily: FF }}>{STATUS_OPTIONS.find(s => s.key === t.status)?.label}</span>
                              {overdue && (
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
                              <div>
                                <div style={{ fontSize: 9.5, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3, fontFamily: FF }}>Status</div>
                                <select disabled={!isAdmin} value={t.status} onChange={e => patchTask(t.id, { status: e.target.value })}
                                  style={{ ...inp, padding: '5px 8px', fontSize: 11.5, width: 110 }}>
                                  {STATUS_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                                </select>
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
        </Card3D>
      )}
    </div>
  );
}

export default function HROnboardingPage() {
  const { isCompanyAdmin, isHRManager } = useAccess();
  const isAdmin = isSuperUser() || isCompanyAdmin || isHRManager;

  const employees = useERPList<any>('hr/employees/');
  const [assignableUsers, setAssignableUsers] = useState<any[]>([]);

  const [view, setView] = useState<'dashboard' | 'checklist'>(isAdmin ? 'dashboard' : 'checklist');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [starting, setStarting] = useState(false);

  const [dashboardRows, setDashboardRows] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState<{ total: number; in_progress: number; completed: number; not_started: number } | null>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [myEmployeeId, setMyEmployeeId] = useState<string | null>(null);
  useEffect(() => {
    if (isAdmin) return;
    erpFetch('hr/employees/me/').then((e: any) => { setMyEmployeeId(String(e.id)); setSelectedEmployeeId(String(e.id)); setSelectedEmployeeName(e.full_name); }).catch(() => setMyEmployeeId(null));
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    erpFetch('hr/employees/linkable-users/').then((res: any) => setAssignableUsers(Array.isArray(res) ? res : [])).catch(() => setAssignableUsers([]));
  }, [isAdmin]);

  const loadDashboard = () => {
    if (!isAdmin) return;
    setDashboardLoading(true);
    Promise.all([erpFetch('hr/onboarding/dashboard/'), erpFetch('hr/onboarding/stats/')])
      .then(([rows, s]) => { setDashboardRows(Array.isArray(rows) ? rows : []); setStats(s); })
      .catch(() => { setDashboardRows([]); setStats(null); })
      .finally(() => setDashboardLoading(false));
  };
  useEffect(() => { loadDashboard(); }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const openChecklist = (id: string, name: string) => {
    setSelectedEmployeeId(id); setSelectedEmployeeName(name); setView('checklist');
  };

  const startOnboardingFor = async (id: string) => {
    if (!id) { toast.error('Select an employee first.'); return; }
    setStarting(true);
    try {
      await erpFetch(`hr/employees/${id}/onboarding/`, { method: 'POST', body: '{}' });
      const emp = employees.data.find((e: any) => String(e.id) === id);
      toast.success('Onboarding started');
      setNewEmployeeId('');
      loadDashboard();
      openChecklist(id, emp?.full_name || '');
    } catch (e: any) {
      toast.error(e.message || 'Failed to start onboarding');
    } finally {
      setStarting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      const rows = await erpFetch(`hr/onboarding/?employee=${deleting.employee_id}`);
      const items = Array.isArray(rows) ? rows : rows.results ?? [];
      await Promise.all(items.map((t: any) => erpFetch(`hr/onboarding/${t.id}/`, { method: 'DELETE' })));
      toast.success('Onboarding checklist deleted');
      setDeleting(null);
      loadDashboard();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete onboarding checklist');
    } finally {
      setDeleteBusy(false);
    }
  };

  // Employees not already in the dashboard rows — candidates for "Start New Onboarding".
  const notOnboardedEmployees = useMemo(() => {
    const onboardingIds = new Set(dashboardRows.map(r => r.employee_id));
    return employees.data.filter((e: any) => !onboardingIds.has(e.id));
  }, [employees.data, dashboardRows]);

  if (!isAdmin) {
    return (
      <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
        <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
        <PageHead title="Onboarding" subtitle="Your onboarding checklist" />
        {myEmployeeId === null ? (
          <EmptyState icon={ClipboardCheck} message="No employee profile linked to your account." />
        ) : (
          <ChecklistView employeeId={selectedEmployeeId} employeeName={selectedEmployeeName} isAdmin={false} assignableUsers={[]} />
        )}
      </div>
    );
  }

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <PageHead title="Onboarding" subtitle="Track every new hire from offer letter to first month" />

      {view === 'checklist' ? (
        <ChecklistView employeeId={selectedEmployeeId} employeeName={selectedEmployeeName} isAdmin={isAdmin} assignableUsers={assignableUsers}
          onBack={() => setView('dashboard')} />
      ) : (
        <>
          {/* Section 1 — stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
            <StatCard label="Total Onboarding" val={stats?.total ?? 0} icon={Users} color="#3b82f6" />
            <StatCard label="In Progress" val={stats?.in_progress ?? 0} icon={Clock} color="#f97316" />
            <StatCard label="Completed" val={stats?.completed ?? 0} icon={CheckCircle2} color="#22c55e" />
            <StatCard label="Not Started" val={stats?.not_started ?? 0} icon={CircleDashed} color="#64748b" />
          </div>

          {/* Section 2 — start new onboarding */}
          <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '16px 20px', marginBottom: 22 }}>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: DARK, marginBottom: 10 }}>Start New Onboarding</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ minWidth: 260, flex: '1 1 260px' }}>
                <label style={lbl}>New Employee</label>
                <EmployeeSearchSelect employees={notOnboardedEmployees} value={newEmployeeId} onChange={setNewEmployeeId} />
              </div>
              <button onClick={() => startOnboardingFor(newEmployeeId)} disabled={starting || !newEmployeeId}
                style={{ background: 'linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: starting || !newEmployeeId ? 'default' : 'pointer', opacity: starting || !newEmployeeId ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 7 }}>
                <Plus size={15} />{starting ? 'Starting…' : 'Start Onboarding'}
              </button>
            </div>
          </div>

          {/* Onboarding employees table */}
          {dashboardLoading ? (
            <Skeleton h={240} />
          ) : dashboardRows.length === 0 ? (
            <EmptyState icon={ClipboardCheck} message="No employees currently onboarding. Start one above." />
          ) : (
            <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
                  <thead>
                    <tr style={{ background: '#fafaf9' }}>
                      {['Employee', 'Department', 'Join Date', 'Progress', 'Status', 'Assigned To', ''].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardRows.map((r: any) => {
                      const pct = r.total_tasks ? Math.round((r.completed_tasks / r.total_tasks) * 100) : 0;
                      const meta = OVERALL_META[r.status] ?? OVERALL_META.not_started;
                      const StatusIcon = meta.icon;
                      return (
                        <tr key={r.employee_id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ padding: '11px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Avatar name={r.employee_name} />
                              <span style={{ fontWeight: 600, color: DARK, whiteSpace: 'nowrap' }}>{r.employee_name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '11px 16px', color: MUTED }}>{r.department_name || '—'}</td>
                          <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{fmtDate(r.joined_on)}</td>
                          <td style={{ padding: '11px 16px', minWidth: 150 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: progressColor(pct), borderRadius: 4 }} />
                              </div>
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: MUTED, whiteSpace: 'nowrap' }}>{r.completed_tasks}/{r.total_tasks}</span>
                            </div>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.color }}>
                              <StatusIcon size={11} />{meta.label}
                            </span>
                          </td>
                          <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{r.assigned_to || 'Unassigned'}</td>
                          <td style={{ padding: '11px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => openChecklist(String(r.employee_id), r.employee_name)} title="View Checklist"
                                style={{ background: 'rgba(201,136,58,0.08)', color: OG, border: '1px solid rgba(201,136,58,0.22)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                                <Eye size={12} />
                              </button>
                              <button onClick={() => openChecklist(String(r.employee_id), r.employee_name)} title="Edit"
                                style={{ background: CREAM, color: DARK, border: `1px solid ${BORDER}`, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' }}>
                                <Pencil size={12} />
                              </button>
                              <button onClick={() => setDeleting(r)} title="Delete"
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
            </div>
          )}
        </>
      )}

      {deleting && (
        <DeleteDlg row={deleting} busy={deleteBusy} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />
      )}
    </div>
  );
}
