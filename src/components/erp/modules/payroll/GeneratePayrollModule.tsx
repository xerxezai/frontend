import { useRef, useEffect, useState } from 'react';
import { useERPList, erpFetch } from '../../../../hooks/useERPApi';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

// Geometric floating shapes hero (GSAP-free, pure RAF)
function GeometricHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const W = c.width; const H = c.height;
    type Sh = { x: number; y: number; vx: number; vy: number; size: number; rot: number; vr: number; sides: number; alpha: number };
    const shapes: Sh[] = Array.from({ length: window.innerWidth < 600 ? 6 : 12 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      size: 16 + Math.random() * 28, rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.006, sides: [3, 4, 6][Math.floor(Math.random() * 3)],
      alpha: 0.06 + Math.random() * 0.10,
    }));
    function polygon(cx: number, cy: number, r: number, sides: number, rot: number) {
      ctx!.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = rot + (i / sides) * Math.PI * 2;
        i === 0 ? ctx!.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
                : ctx!.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx!.closePath();
    }
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      shapes.forEach(s => {
        polygon(s.x, s.y, s.size, s.sides, s.rot);
        ctx!.strokeStyle = `rgba(201,136,58,${s.alpha})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        s.x += s.vx; s.y += s.vy; s.rot += s.vr;
        if (s.x < -s.size) s.x = W + s.size;
        if (s.x > W + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = H + s.size;
        if (s.y > H + s.size) s.y = -s.size;
      });
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

const STATUS_COLORS: Record<string, string> = { draft: '#f59e0b', approved: '#10b981', paid: '#6366f1' };
const Badge = ({ s }: { s: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, background: `${STATUS_COLORS[s] ?? C.muted}18`, color: STATUS_COLORS[s] ?? C.muted, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize' }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
    {s}
  </span>
);

export default function GeneratePayrollModule() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [year,  setYear]  = useState(String(now.getFullYear()));
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview]       = useState<any[]>([]);
  const [genErr, setGenErr]         = useState('');
  const [generated, setGenerated]   = useState(false);

  const payrolls = useERPList<any>(`hr/payroll/?month=${month}&year=${year}`);
  const [actioning, setActioning] = useState<number | null>(null);

  const handleGenerate = async () => {
    setGenerating(true); setGenErr(''); setGenerated(false);
    try {
      const res = await erpFetch('hr/payroll/generate/', {
        method: 'POST',
        body: JSON.stringify({ month: parseInt(month), year: parseInt(year) }),
      });
      setPreview(res.payrolls ?? []);
      setGenerated(true);
      await payrolls.reload();
    } catch (e: any) { setGenErr(e.message); }
    finally { setGenerating(false); }
  };

  const approvePayroll = async (id: number) => {
    setActioning(id);
    try {
      await erpFetch(`hr/payroll/${id}/approve/`, { method: 'PATCH', body: JSON.stringify({}) });
      await payrolls.reload();
    } catch {}
    finally { setActioning(null); }
  };

  const markPaid = async (id: number) => {
    setActioning(id);
    try {
      await erpFetch(`hr/payroll/${id}/mark-paid/`, { method: 'PATCH', body: JSON.stringify({}) });
      await payrolls.reload();
    } catch {}
    finally { setActioning(null); }
  };

  const rows = payrolls.data;
  const totalGross = rows.reduce((a: number, r: any) => a + parseFloat(r.gross), 0);
  const totalNet   = rows.reduce((a: number, r: any) => a + parseFloat(r.net_salary), 0);

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div style={{ animation: 'gpFadeUp 0.45s ease both' }}>
      <style>{`@keyframes gpFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <div style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 28,
        background: 'linear-gradient(135deg, #1a1208 0%, #2d1e08 60%, #0f0a05 100%)',
        padding: '28px 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <GeometricHero />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: C.orangeGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 rgba(150,95,30,0.5)' }}>
                <i className="fas fa-cogs" style={{ color: '#fff', fontSize: 13 }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Payroll</span>
            </div>
            <h2 style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Generate Payroll</h2>
            <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '6px 0 0' }}>
              Auto-calculate from attendance records → preview → approve → mark paid
            </p>
          </div>
          {/* Month/year selector */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.40)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>Month</label>
              <select value={month} onChange={e => setMonth(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 9, padding: '9px 14px', color: '#fff', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none' }}>
                {MONTHS.map((m, i) => <option key={i} value={String(i+1).padStart(2,'0')} style={{ background: '#1a1208' }}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.40)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>Year</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} min="2020" max="2040"
                style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 9, padding: '9px 14px', color: '#fff', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 90 }} />
            </div>
            <button onClick={handleGenerate} disabled={generating}
              style={{
                background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px 22px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
                cursor: generating ? 'default' : 'pointer', opacity: generating ? 0.7 : 1,
                boxShadow: '0 3px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.28)',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
              {generating ? <span className="spinner-border spinner-border-sm" /> : <i className="fas fa-bolt" />}
              Generate
            </button>
          </div>
        </div>
      </div>

      {genErr && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 10, padding: '12px 16px', marginBottom: 18, color: '#ef4444', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{genErr}</div>}
      {generated && preview.length > 0 && (
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 10, padding: '12px 16px', marginBottom: 18, color: '#059669', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
          <i className="fas fa-check-circle" style={{ marginRight: 7 }} />{preview.length} payroll record(s) generated for {MONTHS[parseInt(month)-1]} {year}.
        </div>
      )}

      {/* Summary strip */}
      {rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Total Employees', val: String(rows.length), icon: 'fas fa-users', color: '#3b82f6' },
            { label: 'Gross Payroll', val: `$${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: 'fas fa-dollar-sign', color: '#10b981' },
            { label: 'Net Payroll', val: `$${totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: 'fas fa-hand-holding-usd', color: C.orange },
          ].map((s, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, borderTop: `2px solid ${s.color}`, padding: '16px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <i className={s.icon} style={{ color: s.color, fontSize: 13 }} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20, color: C.dark }}>{s.val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: C.muted, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Payroll table */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.dark }}>
            Payroll — {MONTHS[parseInt(month)-1]} {year}
          </span>
        </div>
        {payrolls.loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            <i className="fas fa-file-invoice-dollar" style={{ fontSize: 32, display: 'block', marginBottom: 12, color: '#ddd' }} />
            No payroll for this period. Click Generate to create records.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#fafaf9' }}>
                  {['Employee', 'Days', 'Present', 'Basic', 'Allowances', 'Deductions', 'Gross', 'Net', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', color: C.muted, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafaf8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td style={{ padding: '11px 14px', fontWeight: 600, color: C.dark, whiteSpace: 'nowrap' }}>{r.employee_name}</td>
                    <td style={{ padding: '11px 14px', color: C.muted }}>{r.working_days}</td>
                    <td style={{ padding: '11px 14px', color: C.muted }}>{r.present_days}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 600 }}>${parseFloat(r.basic).toLocaleString()}</td>
                    <td style={{ padding: '11px 14px', color: '#3b82f6' }}>+${parseFloat(r.allowances).toLocaleString()}</td>
                    <td style={{ padding: '11px 14px', color: '#ef4444' }}>-${parseFloat(r.deductions).toLocaleString()}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 700 }}>${parseFloat(r.gross).toLocaleString()}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 800, color: '#10b981' }}>${parseFloat(r.net_salary).toLocaleString()}</td>
                    <td style={{ padding: '11px 14px' }}><Badge s={r.status} /></td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.status === 'draft' && (
                          <button onClick={() => approvePayroll(r.id)} disabled={actioning === r.id}
                            style={{ background: 'rgba(16,185,129,0.10)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {actioning === r.id ? <span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10 }} /> : <i className="fas fa-check" style={{ marginRight: 4 }} />}
                            Approve
                          </button>
                        )}
                        {r.status === 'approved' && (
                          <button onClick={() => markPaid(r.id)} disabled={actioning === r.id}
                            style={{ background: 'rgba(99,102,241,0.10)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {actioning === r.id ? <span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10 }} /> : <i className="fas fa-money-bill" style={{ marginRight: 4 }} />}
                            Mark Paid
                          </button>
                        )}
                        {r.status === 'paid' && <span style={{ color: C.muted, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>—</span>}
                      </div>
                    </td>
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
