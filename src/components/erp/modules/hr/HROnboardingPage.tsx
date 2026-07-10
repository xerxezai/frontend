import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, Circle, ClipboardCheck, PartyPopper } from 'lucide-react';
import { toast } from 'react-toastify';
import { useERPList, erpFetch } from '../../../../hooks/useERPApi';
import { Card3D, Skeleton, PageHead, EmptyState, OG, DARK, FF, inp, lbl } from './hrShared';

interface Task { id: number; task: string; completed: boolean; completed_at: string | null; order: number; }

const daysSince = (iso?: string | null) => iso ? (Date.now() - new Date(iso).getTime()) / 86400000 : Infinity;

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

export default function HROnboardingPage() {
  const employees = useERPList<any>('hr/employees/');
  const [empId, setEmpId] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const load = useCallback((seed = false) => {
    if (!empId) { setTasks([]); return; }
    setLoading(true);
    erpFetch(`hr/employees/${empId}/onboarding/`, seed ? { method: 'POST', body: '{}' } : {})
      .then(res => setTasks(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [empId]);
  useEffect(() => { load(); }, [load]);

  const toggle = async (t: Task) => {
    setTasks(prev => prev.map(x => x.id === t.id ? { ...x, completed: !x.completed } : x));
    try {
      await erpFetch(`hr/onboarding/${t.id}/toggle/`, { method: 'PATCH', body: '{}' });
      const done = tasks.filter(x => x.id === t.id ? !x.completed : x.completed).length;
      if (done === tasks.length && tasks.length > 0) { setCelebrate(true); setTimeout(() => setCelebrate(false), 3200); }
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
      setTasks(prev => prev.map(x => x.id === t.id ? { ...x, completed: t.completed } : x));
    }
  };

  const done = tasks.filter(t => t.completed).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const empName = employees.data.find((e: any) => String(e.id) === empId)?.full_name;

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}@keyframes hrPop{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      <PageHead title="Onboarding" subtitle="Track each new hire's first-week checklist" />

      <div style={{ maxWidth: 380, marginBottom: 22 }}>
        <label style={lbl}>New Employee</label>
        <select style={inp} value={empId} onChange={e => setEmpId(e.target.value)}>
          <option value="">— Select employee —</option>
          {employees.data.map((e: any) => (
            <option key={e.id} value={e.id}>{e.full_name}{daysSince(e.joined_on) < 30 ? ' · new' : ''}</option>
          ))}
        </select>
      </div>

      {!empId ? (
        <EmptyState icon={ClipboardCheck} message="Select an employee to view or start their onboarding checklist." />
      ) : loading ? (
        <div style={{ maxWidth: 560 }}>{[0, 1, 2, 3].map(i => <Skeleton key={i} h={48} />)}</div>
      ) : tasks.length === 0 ? (
        <EmptyState icon={ClipboardCheck} message={`No checklist yet for ${empName || 'this employee'}.`}
          cta={<button style={{ background: OG, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 22px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer' }} onClick={() => load(true)}>Start Onboarding</button>} />
      ) : (
        <div style={{ maxWidth: 640, position: 'relative' }}>
          {celebrate && <Confetti />}
          <Card3D accent={pct === 100 ? '#10b981' : OG} p="22px 24px" style={{ position: 'relative', zIndex: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: DARK }}>{empName}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: pct === 100 ? '#10b981' : OG }}>{done}/{tasks.length}</div>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'linear-gradient(90deg,#34d399,#10b981)' : 'linear-gradient(90deg,#e8a84e,#C9883A)', borderRadius: 4, transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)' }} />
            </div>

            {pct === 100 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, animation: 'hrPop 0.4s ease both' }}>
                <PartyPopper size={16} color="#10b981" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>Onboarding complete — welcome aboard!</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tasks.map(t => (
                <button key={t.id} onClick={() => toggle(t)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: t.completed ? 'rgba(16,185,129,0.06)' : '#F8F7F4', textAlign: 'left', transition: 'background 0.18s ease', fontFamily: FF }}>
                  {t.completed
                    ? <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, animation: 'hrPop 0.3s ease both' }} />
                    : <Circle size={20} color="#c4c4c4" style={{ flexShrink: 0 }} />}
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: t.completed ? '#059669' : DARK, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.task}</span>
                </button>
              ))}
            </div>
          </Card3D>
        </div>
      )}
    </div>
  );
}
