import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const MLMModule = () => {
  const commissions = useERPList<any>('mlm/commissions/');

  const cols = [
    { key: 'earner_username', label: 'Earner' },
    { key: 'source_username', label: 'From' },
    { key: 'level', label: 'Level', render: (r: any) => `Level ${r.level}` },
    { key: 'commission_rate', label: 'Rate', render: (r: any) => `${r.commission_rate}%` },
    { key: 'amount', label: 'Amount', render: (r: any) => `$${parseFloat(r.amount).toFixed(2)}` },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
    { key: 'created_at', label: 'Date', render: (r: any) => new Date(r.created_at).toLocaleDateString() },
  ];

  return <ERPTable title="MLM Commissions" columns={cols} {...commissions} />;
};

export default MLMModule;

