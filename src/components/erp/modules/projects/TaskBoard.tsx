import { useState, useEffect, useCallback, useMemo } from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'react-toastify';
import { erpFetch } from '../../../../hooks/useERPApi';
import { FF, OG, lbl, inp, SAVE, CNCL, OVR, CRD, TASK_COLUMNS, PRIORITY_BADGE, initials } from './projectsShared';

const defTask = { title: '', description: '', status: 'todo', priority: 'medium', due_date: '', milestone: '', assigned_to: '', estimated_hours: '', actual_hours: '' };

function TaskForm({ projectId, task, milestones, users, defaultStatus, onClose, onSaved }: {
  projectId: number; task?: any; milestones: any[]; users: { id: number; name: string }[]; defaultStatus?: string;
  onClose: () => void; onSaved: () => void;
}) {
  const [f, setF] = useState(task ? {
    title: task.title || '', description: task.description || '', status: task.status || 'todo', priority: task.priority || 'medium',
    due_date: task.due_date || '', milestone: String(task.milestone || ''), assigned_to: String(task.assigned_to || ''),
    estimated_hours: task.estimated_hours != null ? String(task.estimated_hours) : '', actual_hours: task.actual_hours != null ? String(task.actual_hours) : '',
  } : { ...defTask, status: defaultStatus || 'todo' });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) { toast.error('Task title is required.'); return; }
    setSaving(true);
    try {
      const body: any = {
        title: f.title, description: f.description, status: f.status, priority: f.priority,
        due_date: f.due_date || null, milestone: f.milestone ? Number(f.milestone) : null,
        assigned_to: f.assigned_to ? Number(f.assigned_to) : null,
        estimated_hours: f.estimated_hours ? Number(f.estimated_hours) : null,
        actual_hours: f.actual_hours ? Number(f.actual_hours) : null,
        project: projectId,
      };
      if (task) await erpFetch(`project-management/tasks/${task.id}/`, { method: 'PUT', body: JSON.stringify(body) });
      else await erpFetch(`project-management/projects/${projectId}/tasks/`, { method: 'POST', body: JSON.stringify(body) });
      toast.success(task ? 'Task updated' : 'Task added');
      onSaved(); onClose();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={OVR} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ ...CRD, maxWidth: 460 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{task ? 'Edit Task' : 'Add Task'}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
        </div>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Title *</label><input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} style={inp} required /></div>
          <div><label style={lbl}>Description</label><textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 55 }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Status</label>
              <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value }))} style={inp}>
                {TASK_COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Priority</label>
              <select value={f.priority} onChange={e => setF(p => ({ ...p, priority: e.target.value }))} style={inp}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Due Date</label><input type="date" value={f.due_date} onChange={e => setF(p => ({ ...p, due_date: e.target.value }))} style={inp} /></div>
            <div><label style={lbl}>Milestone</label>
              <select value={f.milestone} onChange={e => setF(p => ({ ...p, milestone: e.target.value }))} style={inp}>
                <option value="">— None —</option>
                {milestones.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
          </div>
          <div><label style={lbl}>Assigned To</label>
            <select value={f.assigned_to} onChange={e => setF(p => ({ ...p, assigned_to: e.target.value }))} style={inp}>
              <option value="">— Unassigned —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={lbl}>Estimated Hours</label><input type="number" value={f.estimated_hours} onChange={e => setF(p => ({ ...p, estimated_hours: e.target.value }))} style={inp} step="0.5" min="0" /></div>
            <div><label style={lbl}>Actual Hours</label><input type="number" value={f.actual_hours} onChange={e => setF(p => ({ ...p, actual_hours: e.target.value }))} style={inp} step="0.5" min="0" /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={CNCL}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...SAVE, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const TaskCard = ({ task, onClick }: { task: any; onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const meta = PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE.medium;
  return (
    <div
      ref={setNodeRef} {...listeners} {...attributes} onClick={onClick}
      style={{
        background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.07)', borderLeft: `3px solid ${meta.color}`,
        padding: '10px 12px', marginBottom: 8, cursor: 'grab', touchAction: 'none',
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging && transform ? `translate3d(${transform.x}px,${transform.y}px,0) scale(1.03)` : undefined,
        boxShadow: isDragging ? '0 14px 32px rgba(0,0,0,0.18)' : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 12.5, color: '#1A1A1A', marginBottom: 6 }}>{task.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: meta.bg, color: meta.color }}>{meta.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {task.due_date && <span style={{ fontFamily: FF, fontSize: 10.5, color: '#9ca3af' }}>{new Date(task.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>}
          {task.assigned_to_name && (
            <div title={task.assigned_to_name} style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', fontSize: 8.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials(task.assigned_to_name)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Column = ({ col, tasks, onAdd, onTaskClick }: { col: { key: string; label: string }; tasks: any[]; onAdd: () => void; onTaskClick: (t: any) => void }) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div ref={setNodeRef} style={{
      background: isOver ? 'rgba(201,136,58,0.06)' : '#F8F7F4', borderRadius: 12, padding: 10,
      minWidth: 250, width: 250, flexShrink: 0, display: 'flex', flexDirection: 'column', maxHeight: '100%',
      boxShadow: isOver ? '0 0 0 1.5px rgba(201,136,58,0.4)' : 'none', transition: 'box-shadow 0.2s ease, background 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '2px 2px' }}>
        <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 12.5, color: '#1A1A1A' }}>{col.label} <span style={{ color: '#9ca3af', fontWeight: 700 }}>({tasks.length})</span></span>
        <button onClick={onAdd} title={`Add task to ${col.label}`} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.10)', width: 22, height: 22, borderRadius: 6, cursor: 'pointer', color: OG }}>
          <i className="fas fa-plus" style={{ fontSize: 10 }} />
        </button>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 40 }}>
        {tasks.map(t => <TaskCard key={t.id} task={t} onClick={() => onTaskClick(t)} />)}
        {tasks.length === 0 && <div style={{ textAlign: 'center', padding: '16px 4px', fontSize: 11.5, color: '#b0aca4', fontFamily: FF }}>No tasks</div>}
      </div>
    </div>
  );
};

export default function TaskBoard({ projectId, tasks, milestones, loading, onReload }: {
  projectId: number; tasks: any[]; milestones: any[]; loading: boolean; onReload: () => void;
}) {
  const [localTasks, setLocalTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [addStatus, setAddStatus] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => { setLocalTasks(tasks); }, [tasks]);
  useEffect(() => {
    erpFetch('sales/orders/salespeople/')
      .then((res: any) => setUsers((Array.isArray(res) ? res : []).filter((p: any) => p.type === 'user')))
      .catch(() => {});
  }, []);

  const byStatus = useMemo(() => {
    const map: Record<string, any[]> = { todo: [], in_progress: [], review: [], done: [] };
    localTasks.forEach(t => { if (map[t.status]) map[t.status].push(t); });
    return map;
  }, [localTasks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const handleDragStart = (e: DragStartEvent) => setActiveId(Number(e.active.id));

  const changeStatus = useCallback((taskId: number, newStatus: string) => {
    const task = localTasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;
    const prevStatus = task.status;
    setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    erpFetch(`project-management/tasks/${taskId}/`, { method: 'PUT', body: JSON.stringify({ ...task, status: newStatus, project: projectId }) })
      .catch(() => { setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: prevStatus } : t)); toast.error('Could not move task'); });
  }, [localTasks, projectId]);

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    changeStatus(Number(active.id), over.id as string);
  };

  const activeTask = activeId ? localTasks.find(t => t.id === activeId) ?? null : null;

  if (loading) return <div className="d-flex justify-content-center py-4"><div className="spinner-border" style={{ color: OG }} /></div>;

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' }}>
          {TASK_COLUMNS.map(col => (
            <Column key={col.key} col={col} tasks={byStatus[col.key]} onAdd={() => setAddStatus(col.key)} onTaskClick={setEditing} />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <div style={{ width: 220, transform: 'rotate(2deg)' }}><TaskCard task={activeTask} onClick={() => {}} /></div> : null}
        </DragOverlay>
      </DndContext>

      {addStatus && (
        <TaskForm projectId={projectId} milestones={milestones} users={users} defaultStatus={addStatus}
          onClose={() => setAddStatus(null)} onSaved={onReload} />
      )}
      {editing && (
        <TaskForm projectId={projectId} task={editing} milestones={milestones} users={users}
          onClose={() => setEditing(null)} onSaved={onReload} />
      )}
    </div>
  );
}
