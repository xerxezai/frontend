import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { FF, OG, WHITE, BORDER, KpiCard, ProgressBar, useFmtCurrency } from './projectsShared';

interface DashboardData {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  on_hold_projects: number;
  total_budget: number;
  total_actual_cost: number;
  overdue_milestones: number;
  tasks_due_today: number;
}

export default function ProjectDashboard() {
  const navigate = useNavigate();
  const fmtINR = useFmtCurrency();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const projects = useERPList<any>('project-management/projects/');

  useEffect(() => {
    erpFetch('project-management/projects/dashboard/')
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const activeProjects = projects.data.filter((p: any) => p.status === 'active');

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border" style={{ color: OG }} role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <KpiCard icon="fas fa-project-diagram" label="Total Projects" value={String(data?.total_projects ?? 0)} accent={OG} />
        <KpiCard icon="fas fa-play-circle" label="Active" value={String(data?.active_projects ?? 0)} accent="#10b981" />
        <KpiCard icon="fas fa-check-circle" label="Completed" value={String(data?.completed_projects ?? 0)} accent="#1d4ed8" />
        <KpiCard icon="fas fa-pause-circle" label="On Hold" value={String(data?.on_hold_projects ?? 0)} accent="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 16, marginBottom: 22 }}>
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 14 }}>Budget Overview</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FF, fontSize: 12.5, marginBottom: 8 }}>
            <span style={{ color: '#6B6B6B' }}>Total Budget</span>
            <span style={{ fontWeight: 700, color: '#1A1A1A' }}>{fmtINR(data?.total_budget ?? 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FF, fontSize: 12.5, marginBottom: 10 }}>
            <span style={{ color: '#6B6B6B' }}>Actual Cost</span>
            <span style={{ fontWeight: 700, color: (data?.total_actual_cost ?? 0) > (data?.total_budget ?? 0) ? '#ef4444' : '#1A1A1A' }}>{fmtINR(data?.total_actual_cost ?? 0)}</span>
          </div>
          <ProgressBar value={data && data.total_budget > 0 ? (data.total_actual_cost / data.total_budget) * 100 : 0} />
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 4 }}>Overdue Milestones</div>
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 28, color: (data?.overdue_milestones ?? 0) > 0 ? '#ef4444' : '#10b981' }}>{data?.overdue_milestones ?? 0}</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginTop: 4 }}>past due date, not completed</div>
        </div>

        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 4 }}>Tasks Due Today</div>
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 28, color: (data?.tasks_due_today ?? 0) > 0 ? '#f59e0b' : '#10b981' }}>{data?.tasks_due_today ?? 0}</div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginTop: 4 }}>not yet marked done</div>
        </div>
      </div>

      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 14 }}>Active Project Progress</div>
        {activeProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No active projects.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activeProjects.map((p: any) => (
              <div key={p.id} onClick={() => navigate(`/erp/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontFamily: FF }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1A1A' }}>{p.project_code} — {p.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: OG }}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
