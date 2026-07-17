import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, OG, BORDER, useFmtCurrency, PROJECT_STATUS, PRIORITY_BADGE, StatusBadge, ProgressBar, Card3D } from './projectsShared';
import MilestoneList from './MilestoneList';
import TaskBoard from './TaskBoard';
import BudgetTracker from './BudgetTracker';
import GanttChart from './GanttChart';

const TABS = ['Overview', 'Milestones', 'Tasks', 'Gantt', 'Budget'] as const;

/** Deep-links /erp/projects/:id/tasks and /erp/projects/:id/gantt straight to that tab —
 * both routes render this same component, so the initial tab comes from the URL suffix. */
function tabFromPath(pathname: string): typeof TABS[number] {
  if (pathname.endsWith('/tasks')) return 'Tasks';
  if (pathname.endsWith('/gantt')) return 'Gantt';
  return 'Overview';
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fmtINR = useFmtCurrency();
  const [tab, setTab] = useState<typeof TABS[number]>(() => tabFromPath(location.pathname));
  const [project, setProject] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [budget, setBudget] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);

  const loadProject = useCallback(() => {
    erpFetch(`project-management/projects/${id}/`).then(setProject).finally(() => setLoading(false));
  }, [id]);

  const loadSub = useCallback(() => {
    setSubLoading(true);
    Promise.all([
      erpFetch(`project-management/projects/${id}/milestones/`),
      erpFetch(`project-management/projects/${id}/tasks/`),
      erpFetch(`project-management/projects/${id}/budget/`),
    ]).then(([m, t, b]) => { setMilestones(m); setTasks(t); setBudget(b); }).finally(() => setSubLoading(false));
  }, [id]);

  useEffect(() => { loadProject(); loadSub(); }, [loadProject, loadSub]);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>;
  if (!project) return <div className="alert alert-danger">Project not found.</div>;

  const overdueMilestones = milestones.filter(m => m.status !== 'completed' && m.due_date < new Date().toISOString().slice(0, 10));

  return (
    <div>
      <button onClick={() => navigate('/erp/projects/list')} style={{ background: 'none', border: 'none', color: '#6B6B6B', fontFamily: FF, fontSize: 12.5, cursor: 'pointer', marginBottom: 14, padding: 0 }}>
        <i className="fas fa-arrow-left" style={{ marginRight: 6 }} />Back to Projects
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: FF, fontSize: 11.5, color: '#9ca3af', fontWeight: 700 }}>{project.project_code}</div>
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 21, color: '#1A1A1A' }}>{project.name}</div>
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#6B6B6B', marginTop: 4 }}>{project.client}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <StatusBadge status={project.status} map={PROJECT_STATUS} />
          <StatusBadge status={project.priority} map={PRIORITY_BADGE} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontFamily: FF, fontWeight: 700, fontSize: 12.5,
            color: tab === t ? OG : '#6B6B6B', borderBottom: tab === t ? `2px solid ${OG}` : '2px solid transparent', marginBottom: -1,
          }}>
            {t}
            {t === 'Milestones' && overdueMilestones.length > 0 && (
              <span style={{ marginLeft: 6, background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{overdueMilestones.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          <Card3D>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 12 }}>Project Info</div>
            {project.description && <p style={{ fontFamily: FF, fontSize: 12.5, color: '#374151', marginBottom: 14 }}>{project.description}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontFamily: FF, fontSize: 12.5 }}>
              <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{project.start_date}</div></div>
              <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{project.end_date}</div></div>
              <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Budget</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{fmtINR(project.budget)}</div></div>
              <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actual Cost</div><div style={{ fontWeight: 700, color: project.actual_cost > project.budget ? '#ef4444' : '#1A1A1A' }}>{fmtINR(project.actual_cost)}</div></div>
              <div><div style={{ color: '#9ca3af', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Manager</div><div style={{ fontWeight: 700, color: '#1A1A1A' }}>{project.manager_name || '—'}</div></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: FF, fontSize: 12 }}>
                <span style={{ color: '#6B6B6B' }}>Progress</span><span style={{ fontWeight: 700, color: OG }}>{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
          </Card3D>
          <Card3D>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13.5, color: '#1A1A1A', marginBottom: 12 }}>Team Members</div>
            {(project.team_members_detail || []).length === 0 ? (
              <div style={{ fontFamily: FF, fontSize: 12.5, color: '#9ca3af' }}>No team members assigned.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.team_members_detail.map((u: any) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF, fontSize: 12.5 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                ))}
              </div>
            )}
          </Card3D>
        </div>
      )}

      {tab === 'Milestones' && <MilestoneList projectId={Number(id)} milestones={milestones} loading={subLoading} onReload={loadSub} />}
      {tab === 'Tasks' && <TaskBoard projectId={Number(id)} tasks={tasks} milestones={milestones} loading={subLoading} onReload={loadSub} />}
      {tab === 'Gantt' && <GanttChart project={project} milestones={milestones} />}
      {tab === 'Budget' && <BudgetTracker projectId={Number(id)} entries={budget} loading={subLoading} onReload={loadSub} />}
    </div>
  );
}
