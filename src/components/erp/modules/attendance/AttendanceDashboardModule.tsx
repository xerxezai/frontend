import { useEffect, useRef, useState } from 'react';
import { useAttendanceTodayStatus, useMyAttendance } from '../../../../hooks/useERPApi';

const C = {
  orange:     '#C9883A',
  orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream:      '#F8F7F4',
  white:      '#FFFFFF',
  dark:       '#1A1A1A',
  muted:      '#6B6B6B',
  border:     'rgba(0,0,0,0.07)',
};

// ── Particle canvas hero ──────────────────────────────────────────────────────
function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const COUNT = window.innerWidth < 768 ? 22 : 48;
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 2 + Math.random() * 2,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201,136,58,${0.18 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      pts.forEach(p => {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grad.addColorStop(0, 'rgba(232,168,78,0.85)');
        grad.addColorStop(1, 'rgba(201,136,58,0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Count-up ──────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return val;
}

// ── Stat mini-card ────────────────────────────────────────────────────────────
interface MiniCardProps { label: string; value: number; icon: string; color: string; idx: number; }
const MiniCard = ({ label, value, icon, color, idx }: MiniCardProps) => {
  const [hovered, setHovered] = useState(false);
  const counted = useCountUp(value);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${color}`,
        padding: '16px 14px',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 2px 4px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.10), 0 20px 40px ${color}22`
          : '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(201,136,58,0.06)',
        transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1)',
        animation: `attFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${idx * 0.08}s both`,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: `linear-gradient(145deg, ${color}, ${color}dd)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
        boxShadow: `0 4px 0 ${color}66, 0 6px 16px ${color}4d`,
        transform: hovered ? 'scale(1.08) rotate(-4deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <i className={icon} style={{ color: '#fff', fontSize: 15 }}></i>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.dark, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
        {counted}
      </div>
      <div style={{ fontSize: 11.5, color: C.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
};

// ── Status badge ─────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  present:  '#10b981',
  late:     '#f59e0b',
  half_day: '#6366f1',
  absent:   '#ef4444',
};

const Badge = ({ s }: { s: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 9px', borderRadius: 20,
    background: `${STATUS_COLORS[s] ?? C.muted}18`,
    color: STATUS_COLORS[s] ?? C.muted,
    fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
    textTransform: 'capitalize',
  }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
    {s.replace('_', ' ')}
  </span>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AttendanceDashboardModule() {
  const today = useAttendanceTodayStatus();
  const records = useMyAttendance();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErr, setActionErr] = useState('');
  const [actionOk, setActionOk] = useState('');

  const thisWeek = records.data.slice(0, 7);
  const present  = thisWeek.filter(r => r.status === 'present').length;
  const late     = thisWeek.filter(r => r.status === 'late').length;
  const halfDay  = thisWeek.filter(r => r.status === 'half_day').length;
  const absent   = thisWeek.filter(r => r.status === 'absent').length;

  const handle = async (action: 'in' | 'out') => {
    setActionLoading(true);
    setActionErr('');
    setActionOk('');
    try {
      if (action === 'in') await today.clockIn();
      else await today.clockOut();
      setActionOk(action === 'in' ? 'Clocked in successfully!' : 'Clocked out successfully!');
    } catch (e: any) {
      setActionErr(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const todayData = today.data;
  const isClockedIn  = todayData?.clocked_in ?? false;
  const isClockedOut = todayData?.clocked_out ?? false;

  return (
    <div>
      <style>{`
        @keyframes attFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes attPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,136,58,0.35), 0 4px 20px rgba(201,136,58,0.25); }
          50%     { box-shadow: 0 0 0 12px rgba(201,136,58,0), 0 4px 20px rgba(201,136,58,0.25); }
        }
        .att-clock-btn {
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 14px; border-radius: 12px;
          padding: 13px 28px; transition: transform 0.18s, box-shadow 0.18s;
          display: inline-flex; align-items: center; gap: 9px;
        }
        .att-clock-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .att-clock-btn:disabled { opacity: 0.55; cursor: default; }
        .att-mini-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
        }
        @media(max-width:900px) { .att-mini-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:480px) { .att-mini-grid { grid-template-columns: 1fr 1fr; } }
        @media(prefers-reduced-motion:reduce) { .att-clock-btn,.att-mini-grid * { transition:none!important; animation:none!important; } }
      `}</style>

      {/* Hero */}
      <div style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 28,
        background: 'linear-gradient(135deg, #1a1208 0%, #2d1e08 50%, #0f0a05 100%)',
        padding: '32px 32px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        animation: 'attFadeUp 0.5s ease both',
      }}>
        <ParticleHero />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: C.orangeGrad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 3px 0 rgba(150,95,30,0.5)',
                }}>
                  <i className="fas fa-clock" style={{ color: '#fff', fontSize: 13 }}></i>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                  Attendance
                </span>
              </div>
              <h2 style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 26, margin: 0, letterSpacing: '-0.02em' }}>
                Today's Dashboard
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '6px 0 0' }}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Status pill */}
            {todayData && (
              <div style={{
                background: isClockedIn && !isClockedOut
                  ? 'rgba(16,185,129,0.15)' : isClockedOut
                  ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.08)',
                border: isClockedIn && !isClockedOut
                  ? '1px solid rgba(16,185,129,0.35)' : isClockedOut
                  ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: 30, padding: '8px 18px',
                display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isClockedIn && !isClockedOut ? '#10b981' : isClockedOut ? '#6366f1' : '#6B6B6B',
                  animation: isClockedIn && !isClockedOut ? 'attPulse 2s infinite' : 'none',
                  display: 'block',
                }} />
                <span style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
                  {isClockedOut ? 'Shift Complete' : isClockedIn ? 'Currently In' : 'Not Clocked In'}
                </span>
              </div>
            )}
          </div>

          {/* Time info row */}
          {todayData && (isClockedIn || isClockedOut) && (
            <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
              {todayData.check_in && (
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Clock In</div>
                  <div style={{ color: '#e8a84e', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    {new Date(todayData.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
              {todayData.check_out && (
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Clock Out</div>
                  <div style={{ color: '#a78bfa', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    {new Date(todayData.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
              {todayData.hours && (
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Hours</div>
                  <div style={{ color: '#34d399', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    {parseFloat(todayData.hours).toFixed(2)}h
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
            <button
              className="att-clock-btn"
              onClick={() => handle('in')}
              disabled={actionLoading || isClockedIn}
              style={{
                background: isClockedIn ? 'rgba(255,255,255,0.06)' : C.orangeGrad,
                color: isClockedIn ? 'rgba(255,255,255,0.28)' : '#fff',
                boxShadow: isClockedIn ? 'none' : '0 3px 0 rgba(150,95,30,0.5), 0 6px 20px rgba(201,136,58,0.28)',
                animation: !isClockedIn && !isClockedOut ? 'attPulse 2s infinite' : 'none',
              }}
            >
              {actionLoading ? <span className="spinner-border spinner-border-sm" /> : <i className="fas fa-sign-in-alt" />}
              Clock In
            </button>
            <button
              className="att-clock-btn"
              onClick={() => handle('out')}
              disabled={actionLoading || !isClockedIn || isClockedOut}
              style={{
                background: isClockedIn && !isClockedOut ? 'rgba(99,102,241,0.85)' : 'rgba(255,255,255,0.06)',
                color: isClockedIn && !isClockedOut ? '#fff' : 'rgba(255,255,255,0.28)',
                boxShadow: isClockedIn && !isClockedOut ? '0 3px 12px rgba(99,102,241,0.35)' : 'none',
              }}
            >
              {actionLoading ? <span className="spinner-border spinner-border-sm" /> : <i className="fas fa-sign-out-alt" />}
              Clock Out
            </button>
          </div>

          {actionErr && (
            <div style={{ marginTop: 12, color: '#f87171', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: 6 }} />{actionErr}
            </div>
          )}
          {actionOk && (
            <div style={{ marginTop: 12, color: '#34d399', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <i className="fas fa-check-circle" style={{ marginRight: 6 }} />{actionOk}
            </div>
          )}
        </div>
      </div>

      {/* Mini stat cards — week summary */}
      <div className="att-mini-grid" style={{ marginBottom: 28 }}>
        <MiniCard label="Present This Week" value={present} icon="fas fa-check"       color="#10b981" idx={0} />
        <MiniCard label="Late Arrivals"      value={late}    icon="fas fa-hourglass"   color="#f59e0b" idx={1} />
        <MiniCard label="Half Days"          value={halfDay} icon="fas fa-adjust"       color="#6366f1" idx={2} />
        <MiniCard label="Absent"             value={absent}  icon="fas fa-times-circle" color="#ef4444" idx={3} />
      </div>

      {/* Recent records */}
      <div style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.border}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        animation: 'attFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.18s both',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.dark }}>Recent Attendance</span>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Last 10 days</span>
        </div>
        {records.loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div className="spinner-border" style={{ color: C.orange, width: 24, height: 24 }} />
          </div>
        ) : records.data.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
            No attendance records yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Date', 'Clock In', 'Clock Out', 'Hours', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.data.slice(0, 10).map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '11px 16px', color: C.dark, fontWeight: 600 }}>{r.date}</td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.check_in ? new Date(r.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.check_out ? new Date(r.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td style={{ padding: '11px 16px', color: C.muted }}>{r.hours ? `${parseFloat(r.hours).toFixed(2)}h` : '—'}</td>
                    <td style={{ padding: '11px 16px' }}><Badge s={r.status || 'present'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
