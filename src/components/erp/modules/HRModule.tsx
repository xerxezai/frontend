import { useState } from 'react';
import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const tabs = ['Employees', 'Departments', 'Leave Requests'];

const HRModule = () => {
  const [tab, setTab] = useState('Employees');
  const employees = useERPList<any>('hr/employees/');
  const departments = useERPList<any>('hr/departments/');
  const leaves = useERPList<any>('hr/leave-requests/');

  const empCols = [
    { key: 'code', label: 'Code' },
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department_name', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
    { key: 'salary', label: 'Salary', render: (r: any) => `$${parseFloat(r.salary || 0).toFixed(2)}` },
  ];

  const deptCols = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'manager_username', label: 'Manager' },
  ];

  const leaveCols = [
    { key: 'employee_name', label: 'Employee' },
    { key: 'type', label: 'Type' },
    { key: 'from_date', label: 'From' },
    { key: 'to_date', label: 'To' },
    { key: 'days', label: 'Days' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
  ];

  return (
    <div>
      <div className="erp-tabs">
        {tabs.map(t => (
          <button key={t} className={`erp-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'Employees' && <ERPTable title="Employees" columns={empCols} {...employees} onDelete={employees.remove} />}
      {tab === 'Departments' && <ERPTable title="Departments" columns={deptCols} {...departments} onDelete={departments.remove} />}
      {tab === 'Leave Requests' && <ERPTable title="Leave Requests" columns={leaveCols} {...leaves} onDelete={leaves.remove} />}
    </div>
  );
};

export default HRModule;
