import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FF, WHITE, BORDER, MILESTONE_STATUS } from './projectsShared';

const STATUS_COLOR: Record<string, string> = {
  pending: '#94a3b8', in_progress: '#1d4ed8', completed: '#10b981', delayed: '#ef4444',
};

/** Simplified Gantt: each milestone is a horizontal bar from the project start date to its
 * own due date (milestones only carry a due date, not a separate start), colored by status —
 * a day-count timeline rather than a true multi-track Gantt. */
export default function GanttChart({ project, milestones }: { project: any; milestones: any[] }) {
  if (!project?.start_date || milestones.length === 0) {
    return <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B6B6B', fontFamily: FF, fontSize: 13 }}>No milestones to chart yet.</div>;
  }

  const start = new Date(project.start_date).getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const data = [...milestones]
    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
    .map(m => ({
      name: m.title.length > 22 ? `${m.title.slice(0, 22)}…` : m.title,
      days: Math.max(1, Math.round((new Date(m.due_date).getTime() - start) / dayMs)),
      status: m.status,
      due_date: m.due_date,
    }));

  return (
    <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '18px 20px' }}>
      <div style={{ fontFamily: FF, fontSize: 11.5, color: '#6B6B6B', marginBottom: 14 }}>
        Days from project start ({project.start_date}) to each milestone's due date
      </div>
      <ResponsiveContainer width="100%" height={Math.max(160, data.length * 44)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24 }}>
          <XAxis type="number" tick={{ fontSize: 11, fontFamily: FF }} label={{ value: 'Days', position: 'insideBottom', offset: -4, fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11.5, fontFamily: FF }} />
          <Tooltip
            formatter={(value: any, _key: any, item: any) => [`${value} days (due ${item.payload.due_date})`, MILESTONE_STATUS[item.payload.status]?.label ?? item.payload.status]}
            contentStyle={{ fontFamily: FF, fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="days" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((d, i) => <Cell key={i} fill={STATUS_COLOR[d.status] ?? '#94a3b8'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
        {Object.entries(MILESTONE_STATUS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF, fontSize: 11, color: '#6B6B6B' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_COLOR[k] }} />{v.label}
          </div>
        ))}
      </div>
    </div>
  );
}
