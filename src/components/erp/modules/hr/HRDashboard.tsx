import { useERPList } from '../../../../hooks/useERPApi';
import { Card3D, FF } from './hrShared';

const HRDashboard = () => {
  const employees   = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const leaves      = useERPList<any>('hr/leave-requests/');

  const activeCount  = employees.data.filter((e: any) => e.status === 'active').length;
  const pendingLeave = leaves.data.filter((l: any) => l.status === 'pending').length;
  const stats = [
    { label: 'Total Employees', value: employees.data.length,   accent: '#3b82f6', color: '#3b82f6' },
    { label: 'Departments',     value: departments.data.length, accent: '#8b5cf6', color: '#8b5cf6' },
    { label: 'Active',          value: activeCount,             accent: '#10b981', color: '#10b981' },
    { label: 'Pending Leaves',  value: pendingLeave,            accent: '#C9883A', color: '#C9883A' },
  ];

  return (
    <div>
      <style>{`@keyframes hrStatUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="hr-stat-grid">
        {stats.map((s, i) => (
          <div key={s.label} style={{ animation: `hrStatUp 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both` }}>
            <Card3D accent={s.accent} p="18px 20px">
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FF, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: FF, lineHeight: 1 }}>{s.value}</div>
            </Card3D>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HRDashboard;
