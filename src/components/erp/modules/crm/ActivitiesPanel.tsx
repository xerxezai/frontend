import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList, isSuperUser } from '../../../../hooks/useERPApi';
import ERPTable from '../../ERPTable';
import { OG, FF, inp, lbl, SAVE, CNCL, OVR, CRD, DelDlg, ACTIVITY_TYPES, activityTypeMeta, today } from './crmShared';

const defAct = { type: 'call', summary: '', occurred_at: '', due_date: '', linkType: 'customer', customer: '', lead: '' };

function MonthCalendar({ activities, selectedDate, onSelectDate }: { activities: any[]; selectedDate: string; onSelectDate: (d: string) => void }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = today();

  const countsByDay = useMemo(() => {
    const m = new Map<string, number>();
    activities.forEach(a => { if (a.due_date) m.set(a.due_date, (m.get(a.due_date) || 0) + 1); });
    return m;
  }, [activities]);

  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}><i className="fas fa-chevron-left" /></button>
        <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: '#1A1A1A' }}>{cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}><i className="fas fa-chevron-right" /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: '#9ca3af', fontFamily: FF, padding: '4px 0' }}>{d}</div>)}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const count = countsByDay.get(dateStr) || 0;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          return (
            <button key={i} onClick={() => onSelectDate(isSelected ? '' : dateStr)}
              style={{
                aspectRatio: '1', border: isSelected ? `1.5px solid ${OG}` : '1px solid transparent', borderRadius: 8, cursor: 'pointer',
                background: isSelected ? 'rgba(201,136,58,0.10)' : isToday ? 'rgba(201,136,58,0.05)' : 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontFamily: FF,
              }}>
              <span style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isToday ? OG : '#1A1A1A' }}>{day}</span>
              {count > 0 && <span style={{ width: 5, height: 5, borderRadius: '50%', background: OG }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ActivitiesPanel() {
  const isAdmin = isSuperUser();
  const activities = useERPList<any>('crm/activities/');
  const customers = useERPList<any>('crm/customers/');
  const leads = useERPList<any>('crm/leads/');

  const [modal, setModal] = useState<'none' | 'add' | 'edit'>('none');
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] = useState<number | null>(null);
  const [actF, setActF] = useState({ ...defAct });
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState('');

  const [typeFilter, setTypeFilter] = useState('');
  const [completedFilter, setCompletedFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const close = () => { setModal('none'); setEditing(null); };
  const todayStr = today();

  const saveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: any = {
        type: actF.type, summary: actF.summary, occurred_at: actF.occurred_at || new Date().toISOString(),
        due_date: actF.due_date || null,
        customer: actF.linkType === 'customer' && actF.customer ? Number(actF.customer) : null,
        lead: actF.linkType === 'lead' && actF.lead ? Number(actF.lead) : null,
      };
      if (editing) { await activities.update(editing.id, body); toast.success('Activity updated'); }
      else { await activities.create(body); toast.success('Activity created'); }
      close();
    } catch (err: any) { toast.error(err.message || 'Save failed'); }
  };

  const confirmDel = async () => {
    try { await activities.remove(delId!); toast.success('Deleted'); setDelId(null); }
    catch (err: any) { toast.error(err.message || 'Delete failed'); }
  };

  const markComplete = async (id: number) => {
    try {
      await erpFetch(`crm/activities/${id}/complete/`, { method: 'PUT' });
      toast.success('Marked complete');
      activities.reload();
    } catch (err: any) { toast.error(err.message || 'Could not mark complete'); }
  };

  const filtered = useMemo(() => activities.data.filter((a: any) => {
    if (typeFilter && a.type !== typeFilter) return false;
    if (completedFilter && String(a.completed) !== completedFilter) return false;
    const d = a.due_date;
    if (dateFrom && (!d || d < dateFrom)) return false;
    if (dateTo && (!d || d > dateTo)) return false;
    if (view === 'calendar' && selectedDate && d !== selectedDate) return false;
    return true;
  }), [activities.data, typeFilter, completedFilter, dateFrom, dateTo, view, selectedDate]);

  const todayItems = useMemo(() => activities.data.filter((a: any) => a.due_date === todayStr), [activities.data, todayStr]);
  const overdueItems = useMemo(() => activities.data.filter((a: any) => a.due_date && a.due_date < todayStr && !a.completed), [activities.data, todayStr]);

  const cols = [
    {
      key: 'type', label: 'Type', render: (r: any) => {
        const m = activityTypeMeta(r.type);
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: m.color, background: m.bg, padding: '3px 10px', borderRadius: 999, fontFamily: FF }}><i className={m.icon} style={{ fontSize: 10 }} />{m.label}</span>;
      },
    },
    { key: 'summary', label: 'Summary', render: (r: any) => (r.summary || '').substring(0, 60) + (r.summary?.length > 60 ? '…' : '') },
    { key: 'customer', label: 'Linked To', render: (r: any) => r.customer ? (customers.data.find((c: any) => c.id === r.customer)?.name ?? '—') : r.lead ? (leads.data.find((l: any) => l.id === r.lead)?.name ?? '—') : '—' },
    {
      key: 'due_date', label: 'Due', render: (r: any) => {
        if (!r.due_date) return '—';
        const overdue = r.due_date < todayStr && !r.completed;
        return <span style={{ color: overdue ? '#ef4444' : '#141413', fontWeight: overdue ? 700 : 500, fontSize: 12, fontFamily: FF }}>{overdue && <i className="fas fa-triangle-exclamation" style={{ marginRight: 4 }} />}{new Date(r.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>;
      },
    },
    { key: 'occurred_at', label: 'Logged', render: (r: any) => r.occurred_at ? new Date(r.occurred_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—' },
    {
      key: 'completed', label: 'Status', render: (r: any) => r.completed
        ? <span style={{ fontSize: 11, fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '2px 10px', borderRadius: 20, fontFamily: FF }}>Completed</span>
        : r.due_date ? (
          <button onClick={() => markComplete(r.id)} style={{ fontSize: 11, fontWeight: 700, color: OG, background: 'rgba(201,136,58,0.10)', border: '1px solid rgba(201,136,58,0.28)', padding: '3px 10px', borderRadius: 20, fontFamily: FF, cursor: 'pointer' }}>Mark Complete</button>
        ) : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>,
    },
  ];

  return (
    <div>
      {overdueItems.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '12px 16px' }}>
          <i className="fas fa-triangle-exclamation" style={{ color: '#991b1b', fontSize: 15 }} />
          <div style={{ fontFamily: FF, fontSize: 12.5, color: '#7f1d1d' }}>
            <strong>{overdueItems.length} overdue activit{overdueItems.length > 1 ? 'ies' : 'y'}:</strong> {overdueItems.slice(0, 5).map((a: any) => a.summary).join(', ')}{overdueItems.length > 5 ? `, +${overdueItems.length - 5} more` : ''}
          </div>
        </div>
      )}

      {todayItems.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 13, color: '#1A1A1A', marginBottom: 10 }}>Today's Activities ({todayItems.length})</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {todayItems.map((a: any) => {
              const m = activityTypeMeta(a.type);
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${m.color}33`, borderRadius: 10, padding: '8px 14px' }}>
                  <i className={m.icon} style={{ color: m.color, fontSize: 12 }} />
                  <span style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 600, color: '#1A1A1A' }}>{a.summary}</span>
                  {!a.completed && <button onClick={() => markComplete(a.id)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }} title="Mark complete"><i className="fas fa-check-circle" /></button>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 3, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: 3 }}>
          {(['list', 'calendar'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: FF, fontWeight: 700, fontSize: 12, textTransform: 'capitalize', background: view === v ? OG : 'transparent', color: view === v ? '#fff' : '#6B6B6B' }}>{v}</button>
          ))}
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...inp, maxWidth: 150 }}>
          <option value="">All Types</option>
          {ACTIVITY_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <select value={completedFilter} onChange={e => setCompletedFilter(e.target.value)} style={{ ...inp, maxWidth: 160 }}>
          <option value="">All</option><option value="true">Completed</option><option value="false">Not Completed</option>
        </select>
        {view === 'list' && (
          <>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ ...inp, maxWidth: 150 }} />
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ ...inp, maxWidth: 150 }} />
          </>
        )}
      </div>

      {view === 'calendar' && <MonthCalendar activities={activities.data} selectedDate={selectedDate} onSelectDate={setSelectedDate} />}

      <ERPTable title="Activities" columns={cols} data={filtered} loading={activities.loading} error={activities.error} isAdmin={isAdmin}
        onAdd={() => { setActF({ ...defAct, occurred_at: new Date().toISOString().slice(0, 16) }); setEditing(null); setModal('add'); }}
        onEdit={r => { setEditing(r); setActF({ type: r.type || 'call', summary: r.summary || '', occurred_at: r.occurred_at ? r.occurred_at.slice(0, 16) : '', due_date: r.due_date || '', linkType: r.customer ? 'customer' : 'lead', customer: r.customer ? String(r.customer) : '', lead: r.lead ? String(r.lead) : '' }); setModal('edit'); }}
        onDelete={id => setDelId(id)} />

      {(modal === 'add' || modal === 'edit') && (
        <div style={OVR} onClick={close}>
          <div onClick={e => e.stopPropagation()} style={CRD}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{editing ? 'Edit Activity' : 'Add Activity'}</h5>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 22 }}>&times;</button>
            </div>
            <form onSubmit={saveActivity} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Type *</label><select value={actF.type} onChange={e => setActF(f => ({ ...f, type: e.target.value }))} style={inp}>
                  {ACTIVITY_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select></div>
                <div><label style={lbl}>Date &amp; Time</label><input type="datetime-local" value={actF.occurred_at} onChange={e => setActF(f => ({ ...f, occurred_at: e.target.value }))} style={inp} /></div>
              </div>
              <div><label style={lbl}>Summary *</label><textarea value={actF.summary} onChange={e => setActF(f => ({ ...f, summary: e.target.value }))} style={{ ...inp, resize: 'vertical', minHeight: 70 }} required /></div>
              <div><label style={lbl}>Due Date (for tasks/follow-ups)</label><input type="date" value={actF.due_date} onChange={e => setActF(f => ({ ...f, due_date: e.target.value }))} style={inp} /></div>
              <div>
                <label style={lbl}>Link to</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {(['customer', 'lead'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setActF(f => ({ ...f, linkType: t }))}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', fontFamily: FF, fontSize: 12.5, fontWeight: 700, textTransform: 'capitalize', border: actF.linkType === t ? `1.5px solid ${OG}` : '1px solid rgba(0,0,0,0.10)', background: actF.linkType === t ? 'rgba(201,136,58,0.08)' : '#fff', color: actF.linkType === t ? OG : '#6B6B6B' }}>
                      {t}
                    </button>
                  ))}
                </div>
                {actF.linkType === 'customer' ? (
                  <select style={inp} value={actF.customer} onChange={e => setActF(f => ({ ...f, customer: e.target.value }))}>
                    <option value="">— None —</option>
                    {customers.data.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : (
                  <select style={inp} value={actF.lead} onChange={e => setActF(f => ({ ...f, lead: e.target.value }))}>
                    <option value="">— None —</option>
                    {leads.data.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}><button type="button" onClick={close} style={CNCL}>Cancel</button><button type="submit" style={SAVE}>{editing ? 'Update' : 'Save'}</button></div>
            </form>
          </div>
        </div>
      )}

      {delId !== null && <DelDlg onCancel={() => setDelId(null)} onConfirm={confirmDel} />}
    </div>
  );
}
