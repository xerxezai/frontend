import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock3, CalendarDays, Wallet, Star, CheckCircle2, XCircle, Clock, ArrowRight,
  Umbrella, FileText,
} from 'lucide-react';
import {
  useAttendanceTodayStatus, useMyAttendance, useMyLeaves, useMyPayslips, erpFetch,
} from '../../../../hooks/useERPApi';
import { Card3D, FF, OG, OG_G, DARK, WHITE, Skeleton, MONTHS } from './hrShared';

const MUTED = '#6B6B6B';
const BORDER = 'rgba(0,0,0,0.07)';

const STATUS_COLORS: Record<string, string> = {
  present: '#10b981', late: '#eab308', half_day: '#f97316', absent: '#ef4444',
};

const fmtTime = (iso?: string | null) => iso ? new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

function greetingFor(hour: number) {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const StatTile = ({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub?: string; color: string }) => (
  <Card3D accent={color} p="16px 18px">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FF }}>{label}</div>
      <span style={{ width: 30, height: 30, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} color={color} />
      </span>
    </div>
    <div style={{ fontSize: 19, fontWeight: 900, color: DARK, fontFamily: FF, lineHeight: 1.15 }}>{value}</div>
    {sub && <div style={{ fontSize: 11.5, color: MUTED, fontFamily: FF, marginTop: 3 }}>{sub}</div>}
  </Card3D>
);

export default function MyDashboard() {
  const navigate = useNavigate();
  const today = useAttendanceTodayStatus();
  const records = useMyAttendance();
  const leaves = useMyLeaves();
  const payslips = useMyPayslips();

  const [actionLoading, setActionLoading] = useState(false);
  const [actionErr, setActionErr] = useState('');
  const [leaveBalance, setLeaveBalance] = useState<{ remaining: number; allowance: number } | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    erpFetch('hr/employees/me/')
      .then((emp: any) => erpFetch(`hr/leave-requests/balance/?employee=${emp.id}&leave_type=annual`))
      .then((res: any) => setLeaveBalance(res.unlimited ? null : { remaining: res.remaining, allowance: res.allowance }))
      .catch(() => setLeaveBalance(null));
    erpFetch('hr/reviews/')
      .then((res: any) => {
        const rows = Array.isArray(res) ? res : res.results ?? [];
        if (rows.length) setAvgRating(rows.reduce((s: number, r: any) => s + r.rating, 0) / rows.length);
      })
      .catch(() => {});
  }, []);

  const handleClock = async (action: 'in' | 'out') => {
    setActionLoading(true);
    setActionErr('');
    try {
      if (action === 'in') await today.clockIn();
      else await today.clockOut();
    } catch (e: any) {
      setActionErr(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const now = new Date();
  const employeeName = localStorage.getItem('xerxez_name') || 'there';
  const firstName = employeeName.split(' ')[0];
  const todayData = today.data;
  const isClockedIn = todayData?.clocked_in ?? false;
  const isClockedOut = todayData?.clocked_out ?? false;

  const nextPayslip = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastPayslip = payslips.data[0];

  const pendingLeaves = leaves.data.filter((l: any) => l.status === 'pending');
  const recentAttendance = records.data.slice(0, 5);

  return (
    <div>
      <style>{`@keyframes myDashFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Hero — greeting + live clock-in/out widget, deliberately lighter than the full
          My Attendance page (no particle canvas) since this is meant to be a quick summary. */}
      <div style={{
        borderRadius: 18, padding: '26px 28px', marginBottom: 22,
        background: 'linear-gradient(135deg, #1a1208 0%, #2d1e08 50%, #0f0a05 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)', animation: 'myDashFadeUp 0.4s ease both',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ color: '#fff', fontFamily: FF, fontWeight: 800, fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>
              {greetingFor(now.getHours())}, {firstName}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: FF, margin: '6px 0 0' }}>
              {now.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: FF, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Clock In</div>
              <div style={{ color: '#e8a84e', fontFamily: FF, fontWeight: 700, fontSize: 17 }}>{fmtTime(todayData?.check_in)}</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: FF, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Clock Out</div>
              <div style={{ color: '#a78bfa', fontFamily: FF, fontWeight: 700, fontSize: 17 }}>{fmtTime(todayData?.check_out)}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleClock('in')}
                disabled={actionLoading || isClockedIn}
                style={{
                  border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: FF, fontWeight: 700, fontSize: 13,
                  cursor: actionLoading || isClockedIn ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                  background: isClockedIn ? 'rgba(255,255,255,0.06)' : '#10b981',
                  color: isClockedIn ? 'rgba(255,255,255,0.28)' : '#fff',
                }}
              >
                <Clock3 size={13} />Clock In
              </button>
              <button
                onClick={() => handleClock('out')}
                disabled={actionLoading || !isClockedIn || isClockedOut}
                style={{
                  border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: FF, fontWeight: 700, fontSize: 13,
                  cursor: actionLoading || !isClockedIn || isClockedOut ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                  background: isClockedIn && !isClockedOut ? '#ef4444' : 'rgba(255,255,255,0.06)',
                  color: isClockedIn && !isClockedOut ? '#fff' : 'rgba(255,255,255,0.28)',
                }}
              >
                <Clock3 size={13} />Clock Out
              </button>
            </div>
          </div>
        </div>
        {actionErr && (
          <div style={{ marginTop: 12, color: '#f87171', fontSize: 13, fontFamily: FF }}>{actionErr}</div>
        )}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }} className="my-dash-stats">
        <style>{`@media(max-width:900px){.my-dash-stats{grid-template-columns:1fr 1fr!important}}`}</style>
        <StatTile
          icon={isClockedIn && !isClockedOut ? CheckCircle2 : isClockedOut ? Clock : XCircle}
          label="Today's Status"
          value={isClockedIn && !isClockedOut ? 'Present' : isClockedOut ? 'Clocked Out' : 'Absent'}
          color={isClockedIn ? '#10b981' : '#ef4444'}
        />
        <StatTile
          icon={Umbrella}
          label="Leave Balance"
          value={leaveBalance ? `${leaveBalance.remaining} days` : '—'}
          sub={leaveBalance ? `of ${leaveBalance.allowance} annual` : 'No data yet'}
          color="#3b82f6"
        />
        <StatTile
          icon={Wallet}
          label="Next Payslip"
          value={nextPayslip.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          sub={lastPayslip ? `Last: ${MONTHS[lastPayslip.month - 1]} ${lastPayslip.year}` : 'Estimated'}
          color={OG}
        />
        <StatTile
          icon={Star}
          label="Performance Score"
          value={avgRating ? `${avgRating.toFixed(1)} / 5` : '—'}
          sub={avgRating ? 'Average rating' : 'No reviews yet'}
          color="#eab308"
        />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <button onClick={() => navigate('/erp/hr/leave')} style={{ background: OG_G, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Umbrella size={14} />Apply for Leave
        </button>
        <button onClick={() => navigate('/erp/payroll-reports')} style={{ background: WHITE, color: DARK, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 20px', fontFamily: FF, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={14} />View My Payslips
        </button>
      </div>

      {/* Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }} className="my-dash-activity">
        <style>{`@media(max-width:900px){.my-dash-activity{grid-template-columns:1fr!important}}`}</style>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: DARK }}>Recent Attendance</span>
            <button onClick={() => navigate('/erp/attendance')} style={{ background: 'none', border: 'none', color: OG, fontFamily: FF, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all<ArrowRight size={12} />
            </button>
          </div>
          {records.loading ? (
            <div style={{ padding: 18 }}><Skeleton h={120} /></div>
          ) : recentAttendance.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontFamily: FF, fontSize: 13 }}>No attendance records yet.</div>
          ) : (
            <div>
              {recentAttendance.map((r: any) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontFamily: FF, fontSize: 13, color: DARK, fontWeight: 600 }}>{fmtDay(r.date)}</span>
                  <span style={{ fontFamily: FF, fontSize: 12, color: MUTED }}>{fmtTime(r.check_in)} – {fmtTime(r.check_out)}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 9px', borderRadius: 20, background: `${STATUS_COLORS[r.status] ?? MUTED}18`, color: STATUS_COLORS[r.status] ?? MUTED, fontSize: 10.5, fontWeight: 700, fontFamily: FF, textTransform: 'capitalize' }}>
                    {(r.status || 'present').replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: DARK }}>Pending Leave Requests</span>
          </div>
          {leaves.loading ? (
            <div style={{ padding: 18 }}><Skeleton h={80} /></div>
          ) : pendingLeaves.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontFamily: FF, fontSize: 13 }}>
              <CalendarDays size={26} color="#d1d5db" style={{ margin: '0 auto 10px', display: 'block' }} />
              No pending requests.
            </div>
          ) : (
            <div>
              {pendingLeaves.map((l: any) => (
                <div key={l.id} style={{ padding: '10px 18px', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: DARK, textTransform: 'capitalize' }}>{l.type} leave</span>
                    <span style={{ fontFamily: FF, fontSize: 10.5, fontWeight: 700, color: '#92400e', background: '#fef3c7', padding: '2px 9px', borderRadius: 20 }}>Pending</span>
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 11.5, color: MUTED, marginTop: 3 }}>{l.from_date} – {l.to_date} ({l.days} day{l.days === 1 ? '' : 's'})</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
