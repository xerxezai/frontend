import { useRef, useEffect, useState } from 'react';
import { useMyPayslips, useERPList } from '../../../../hooks/useERPApi';
import { useCurrency } from '../../../../context/CurrencyContext';
import { downloadPayslipPDF } from './payslipPdf';

const C = {
  orange: '#C9883A', orangeGrad: 'linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)',
  cream: '#F8F7F4', white: '#FFFFFF', dark: '#1A1A1A', muted: '#6B6B6B',
  border: 'rgba(0,0,0,0.07)',
};

// Animated gradient orbs hero
function OrbHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const W = c.width; const H = c.height;
    let t = 0;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      [[0.3,0.5,90,'rgba(201,136,58,0.12)'],[0.7,0.4,70,'rgba(99,102,241,0.09)'],[0.5,0.7,80,'rgba(16,185,129,0.07)']].forEach(([fx, fy, r, clr], i) => {
        const x = (fx as number) * W + Math.sin(t * 0.5 + i * 2) * 30;
        const y = (fy as number) * H + Math.cos(t * 0.4 + i) * 20;
        const g = ctx!.createRadialGradient(x, y, 0, x, y, r as number);
        g.addColorStop(0, clr as string);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, W, H);
      });
      t += 0.012;
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/** Spec only distinguishes Paid vs Pending — draft/approved are both "awaiting payment". */
function payBadge(status: string) {
  return status === 'paid'
    ? { label: 'Paid', bg: '#d1fae5', color: '#065f46' }
    : { label: 'Pending', bg: '#fef3c7', color: '#92400e' };
}

// ── Professional payslip detail view ────────────────────────────────────────────
function PayslipDetailModal({ row, salaryStructure, formatAmount, onClose }: {
  row: any; salaryStructure: any; formatAmount: (v: number | string) => string; onClose: () => void;
}) {
  const allowances: Record<string, number> = salaryStructure?.allowances || {};
  const deductions: Record<string, number> = salaryStructure?.deductions || {};
  const badge = payBadge(row.status);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', boxShadow: '0 24px 70px rgba(0,0,0,0.22)', overflow: 'hidden', margin: '24px 0' }}>
        {/* Header — company name + brand mark */}
        <div style={{ background: 'linear-gradient(135deg, #1a1208 0%, #2d1e08 60%, #0f0a05 100%)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: C.orange, fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: '0.02em' }}>XERXEZ</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, marginTop: 2 }}>{row.company_name || 'Payslip'}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.10)', border: 'none', borderRadius: 8, width: 32, height: 32, color: '#fff', cursor: 'pointer', fontSize: 16 }}>&times;</button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Employee details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
            {[
              { label: 'Employee', val: row.employee_name },
              { label: 'Employee ID', val: row.employee_code },
              { label: 'Department', val: row.department_name || '—' },
              { label: 'Designation', val: row.employee_designation || '—' },
              { label: 'Pay Period', val: `${MONTHS[row.month - 1]} ${row.year}` },
              { label: 'Working / Present Days', val: `${row.present_days} / ${row.working_days}` },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: C.dark, fontWeight: 600, marginTop: 2 }}>{f.val}</div>
              </div>
            ))}
          </div>

          {/* Earnings / deductions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Earnings</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: '5px 0', color: C.dark }}>
                <span>Basic Salary</span><span style={{ fontWeight: 700 }}>{formatAmount(row.basic)}</span>
              </div>
              {Object.entries(allowances).map(([name, amt]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", padding: '5px 0', color: '#3b82f6' }}>
                  <span>{name}</span><span>+{formatAmount(amt)}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Deductions</div>
              {Object.keys(deductions).length === 0 ? (
                <div style={{ fontSize: 12.5, color: C.muted, fontFamily: "'DM Sans', sans-serif", padding: '5px 0' }}>None</div>
              ) : Object.entries(deductions).map(([name, amt]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", padding: '5px 0', color: '#ef4444' }}>
                  <span>{name}</span><span>-{formatAmount(amt)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Net salary */}
          <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Net Salary</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{badge.label}</span>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 26, color: '#059669' }}>{formatAmount(row.net_salary)}</div>
          </div>

          <div style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
            {row.paid_at ? `Paid on ${new Date(row.paid_at).toLocaleDateString()}` : 'Payment pending'}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 9, padding: '10px 0', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: C.muted }}>Close</button>
            <button onClick={() => downloadPayslipPDF(row, salaryStructure, formatAmount)}
              style={{ flex: 1, background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 0', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <i className="fas fa-download" style={{ fontSize: 12 }} />Download as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyPayslipsModule() {
  const { data, loading, error } = useMyPayslips();
  const { formatAmount } = useCurrency();
  const salaryStructures = useERPList<any>('hr/salary-structures/');
  const mySalaryStructure = salaryStructures.data[0];
  const [viewing, setViewing] = useState<any>(null);

  return (
    <div style={{ animation: 'mpFadeUp 0.45s ease both' }}>
      <style>{`@keyframes mpFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero */}
      <div style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 28,
        background: 'linear-gradient(135deg, #1a1208 0%, #2d1e08 50%, #0f0a05 100%)',
        padding: '26px 32px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <OrbHero />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.orangeGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 rgba(150,95,30,0.5)' }}>
              <i className="fas fa-file-alt" style={{ color: '#fff', fontSize: 13 }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>My Payslips</span>
          </div>
          <h2 style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Payslip History</h2>
          <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: '6px 0 0' }}>
            Download your monthly payslips — real data from the payroll system
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total Payslips</div>
              <div style={{ color: '#e8a84e', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22 }}>{data.length}</div>
            </div>
            {data.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Latest Net Salary</div>
                <div style={{ color: '#34d399', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22 }}>
                  {formatAmount(data[0].net_salary || 0)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payslip cards grid */}
      {loading ? (
        <div style={{ padding: 64, textAlign: 'center' }}><div className="spinner-border" style={{ color: C.orange }} /></div>
      ) : error ? (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 12, padding: '14px 18px', color: '#ef4444', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>
      ) : data.length === 0 ? (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 64, textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
          <i className="fas fa-file-invoice-dollar" style={{ fontSize: 36, display: 'block', marginBottom: 14, color: '#ddd' }} />
          No payslips yet. Your payslips will appear here once HR generates the monthly payroll.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {data.map((r: any, idx: number) => {
            const badge = payBadge(r.status);
            return (
              <div key={r.id}
                style={{
                  background: C.white, borderRadius: 16, border: `1px solid ${C.border}`,
                  overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'transform 0.22s, box-shadow 0.22s',
                  animation: `mpFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${idx * 0.06}s both`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.11)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}
              >
                {/* Card header */}
                <div style={{ background: `linear-gradient(135deg, #1a1208, #2d1e08)`, padding: '16px 20px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        {MONTHS[r.month - 1]} {r.year}
                      </div>
                      <div style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20, marginTop: 2 }}>
                        {formatAmount(r.net_salary || 0)}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>Net Salary</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: C.orangeGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(201,136,58,0.35)' }}>
                      <i className="fas fa-file-alt" style={{ color: '#fff', fontSize: 15 }} />
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />{badge.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setViewing(r)}
                      style={{ flex: 1, background: C.cream, color: C.dark, border: `1px solid ${C.border}`, borderRadius: 9, padding: '8px 0', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <i className="fas fa-eye" style={{ fontSize: 11 }} />View Details
                    </button>
                    <button onClick={() => downloadPayslipPDF(r, mySalaryStructure, formatAmount)}
                      style={{ flex: 1, background: C.orangeGrad, color: '#fff', border: 'none', borderRadius: 9, padding: '8px 0', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 0 rgba(150,95,30,0.5)' }}>
                      <i className="fas fa-download" style={{ fontSize: 11 }} />PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewing && (
        <PayslipDetailModal row={viewing} salaryStructure={mySalaryStructure} formatAmount={formatAmount} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}
