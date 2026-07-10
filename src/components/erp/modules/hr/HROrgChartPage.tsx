import { useState, useMemo } from 'react';
import { Network, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { useERPList } from '../../../../hooks/useERPApi';
import { Skeleton, PageHead, EmptyState, OG, DARK, FF, initials } from './hrShared';

interface Emp { id: number; full_name: string; designation?: string; email?: string; status?: string; department: number | null; department_name?: string; }
interface Dept { id: number; name: string; code: string; }

const Avatar = ({ name, size = 40, tip }: { name: string; size?: number; tip?: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(145deg,#e8a84e,#C9883A)', color: '#fff', fontWeight: 800, fontSize: size * 0.36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(201,136,58,0.30)' }}>
        {initials(name)}
      </div>
      {tip && hover && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: DARK, color: '#fff', fontSize: 11.5, padding: '7px 11px', borderRadius: 8, whiteSpace: 'nowrap', zIndex: 20, fontFamily: FF, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
          {tip}
          <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${DARK}` }} />
        </div>
      )}
    </div>
  );
};

export default function HROrgChartPage() {
  const employees = useERPList<Emp>('hr/employees/');
  const departments = useERPList<Dept>('hr/departments/');
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const byDept = useMemo(() => {
    const map = new Map<number, Emp[]>();
    employees.data.forEach(e => { if (e.department == null) return; const a = map.get(e.department) ?? []; a.push(e); map.set(e.department, a); });
    return map;
  }, [employees.data]);
  const unassigned = employees.data.filter(e => e.department == null);

  const loading = employees.loading || departments.loading;
  const toggle = (id: number) => setCollapsed(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div style={{ animation: 'hrFadeIn 0.3s ease both', fontFamily: FF }}>
      <style>{`@keyframes hrFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <PageHead title="Org Chart" subtitle="Company structure by department" />

      {loading ? (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>{[0, 1, 2].map(i => <Skeleton key={i} h={140} r={16} mb={0} />)}</div>
      ) : departments.data.length === 0 && employees.data.length === 0 ? (
        <EmptyState icon={Network} message="No departments or employees to chart yet." />
      ) : (
        <div style={{ overflowX: 'auto', paddingBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'fit-content', padding: '8px 4px' }}>
            {/* root */}
            <div style={{ background: `linear-gradient(135deg,${DARK},#2d1c0a)`, color: '#fff', padding: '16px 32px', borderRadius: 14, textAlign: 'center', boxShadow: '0 8px 28px rgba(0,0,0,0.22)', position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.02em' }}>XERXEZ</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{employees.data.length} employees · {departments.data.length} departments</div>
            </div>
            {/* connector down */}
            <div style={{ width: 2, height: 24, background: 'rgba(201,136,58,0.35)' }} />

            {/* departments row */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
              {departments.data.map(dept => {
                const emps = byDept.get(dept.id) ?? [];
                const isCollapsed = collapsed.has(dept.id);
                return (
                  <div key={dept.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => toggle(dept.id)}
                      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderTop: `3px solid ${OG}`, borderRadius: 12, padding: '12px 18px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10, minWidth: 180, fontFamily: FF }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(201,136,58,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Users size={16} color={OG} /></div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: DARK }}>{dept.name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{emps.length} member{emps.length === 1 ? '' : 's'}</div>
                      </div>
                      {isCollapsed ? <ChevronRight size={15} color="#9ca3af" /> : <ChevronDown size={15} color="#9ca3af" />}
                    </button>
                    {!isCollapsed && emps.length > 0 && (
                      <>
                        <div style={{ width: 2, height: 18, background: 'rgba(201,136,58,0.30)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#F8F7F4', borderRadius: 12, padding: '14px 12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                          {emps.map(e => (
                            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 10, padding: '8px 12px', minWidth: 190, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                              <Avatar name={e.full_name} size={34} tip={`${e.designation || 'Employee'}${e.email ? ' · ' + e.email : ''}`} />
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 700, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.full_name}</div>
                                <div style={{ fontSize: 10.5, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.designation || '—'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {unassigned.length > 0 && (
              <div style={{ marginTop: 24, background: '#fff', border: '1px dashed rgba(0,0,0,0.14)', borderRadius: 12, padding: '14px 18px', maxWidth: 640 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Unassigned ({unassigned.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {unassigned.map(e => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={e.full_name} size={30} tip={e.designation || 'Employee'} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{e.full_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
