import { useERPList } from '../../../hooks/useERPApi';
import ERPTable from '../ERPTable';

const LogisticsModule = () => {
  const shipments = useERPList<any>('logistics/shipments/');

  const cols = [
    { key: 'tracking_number', label: 'Tracking No.' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'carrier', label: 'Carrier' },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`erp-badge erp-badge-${r.status}`}>{r.status}</span> },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'estimated_delivery', label: 'Est. Delivery' },
  ];

  return <ERPTable title="Shipments" columns={cols} {...shipments} />;
};

export default LogisticsModule;
