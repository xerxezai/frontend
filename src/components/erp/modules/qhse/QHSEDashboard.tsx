import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, OG, WHITE, BORDER, KpiCard, SEVERITY_BADGE, INSPECTION_STATUS, StatusBadge, safetyScoreColor } from './qhseShared';

interface DashboardData {
  open_incidents: number;
  incidents_this_month: number;
  high_critical_risks: number;
  scheduled_inspections: number;
  overdue_compliance: number;
  safety_score: number;
  recent_incidents: any[];
  upcoming_inspections: any[];
}

export default function QHSEDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    erpFetch('qhse/dashboard/').then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;

  const scoreColor = safetyScoreColor(data?.safety_score ?? 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 22 }}>
        <KpiCard icon="fas fa-exclamation-circle" label="Open Incidents" value={String(data?.open_incidents ?? 0)} accent="#ef4444" />
        <KpiCard icon="fas fa-calendar-day" label="This Month" value={String(data?.incidents_this_month ?? 0)} accent="#f59e0b" />
        <KpiCard icon="fas fa-shield-alt" label="High Risk Items" value={String(data?.high_critical_risks ?? 0)} accent="#7f1d1d" />
        <KpiCard icon="fas fa-clipboard-list" label="Scheduled Inspections" value={String(data?.scheduled_inspections ?? 0)} accent="#1d4ed8" />
        <KpiCard icon="fas fa-file-signature" label="Overdue Compliance" value={String(data?.overdue_compliance ?? 0)} accent="#c2410c" />
        <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, borderTop: `3px solid ${scoreColor}`, padding: '16px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: FF, fontSize: 10.5, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Safety Score</div>
          <div style={{ fontFamily: FF, fontWeight: 900, fontSize: 30, color: scoreColor, lineHeight: 1.3 }}>{data?.safety_score ?? 100}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 12 }}>Recent Incidents</div>
          {(data?.recent_incidents ?? []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No incidents reported.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data!.recent_incidents.map(i => (
                <div key={i.id} onClick={() => navigate('/erp/qhse/incidents')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: '#F8F7F4' }}>
                  <div>
                    <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: '#1A1A1A' }}>{i.incident_number} — {i.title}</div>
                    <div style={{ fontFamily: FF, fontSize: 11, color: '#9ca3af' }}>{i.date} · {i.location}</div>
                  </div>
                  <StatusBadge status={i.severity} map={SEVERITY_BADGE} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 12 }}>Upcoming Inspections</div>
          {(data?.upcoming_inspections ?? []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>Nothing scheduled.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data!.upcoming_inspections.map(i => (
                <div key={i.id} onClick={() => navigate('/erp/qhse/inspections')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: '#F8F7F4' }}>
                  <div>
                    <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: '#1A1A1A' }}>{i.title}</div>
                    <div style={{ fontFamily: FF, fontSize: 11, color: '#9ca3af' }}>{i.scheduled_date}</div>
                  </div>
                  <StatusBadge status={i.status} map={INSPECTION_STATUS} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px' }}>
        <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 4 }}>Risk Matrix</div>
        <div style={{ fontFamily: FF, fontSize: 11, color: '#9ca3af', marginBottom: 14 }}>Likelihood (rows) × Consequence (columns) — go to Risk Register to plot actual risks here.</div>
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(5, 44px)', gap: 3 }}>
          {[5, 4, 3, 2, 1].map(likelihood => (
            [1, 2, 3, 4, 5].map(consequence => {
              const score = likelihood * consequence;
              const bg = score >= 16 ? '#fee2e2' : score >= 10 ? '#ffedd5' : score >= 5 ? '#fef3c7' : '#d1fae5';
              const color = score >= 16 ? '#991b1b' : score >= 10 ? '#c2410c' : score >= 5 ? '#92400e' : '#065f46';
              return (
                <div key={`${likelihood}-${consequence}`} style={{ width: 44, height: 44, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF, fontWeight: 800, fontSize: 13, borderRadius: 6 }}>
                  {score}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
}
