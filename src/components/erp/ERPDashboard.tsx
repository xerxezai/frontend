import { useERPDashboard } from '../../hooks/useERPApi';

const StatCard = ({ label, value, icon, color }: { label: string; value: any; icon: string; color: string }) => (
  <div className={`erp-stat-card erp-stat-${color}`}>
    <div className="erp-stat-icon"><i className={icon}></i></div>
    <div className="erp-stat-body">
      <span className="erp-stat-value">{value ?? '—'}</span>
      <span className="erp-stat-label">{label}</span>
    </div>
  </div>
);

const ERPDashboard = () => {
  const { data, loading, error } = useERPDashboard();

  if (loading) return <div className="erp-loading"><div className="erp-spinner"></div><p>Loading dashboard...</p></div>;
  if (error) return <div className="erp-alert erp-alert-error">{error}</div>;
  if (!data) return null;

  return (
    <div className="erp-dashboard">
      <h2 className="erp-page-title">Dashboard</h2>

      <h4 className="erp-section-title">CRM</h4>
      <div className="erp-stats-grid">
        <StatCard label="Active Customers" value={data.crm?.total_customers} icon="fas fa-building" color="blue" />
        <StatCard label="Total Leads" value={data.crm?.total_leads} icon="fas fa-funnel-dollar" color="purple" />
        <StatCard label="New Leads (Month)" value={data.crm?.new_leads_this_month} icon="fas fa-star" color="teal" />
      </div>

      <h4 className="erp-section-title">Finance</h4>
      <div className="erp-stats-grid">
        <StatCard label="Total Revenue" value={`$${parseFloat(data.finance?.total_revenue || 0).toFixed(2)}`} icon="fas fa-dollar-sign" color="green" />
        <StatCard label="This Month" value={`$${parseFloat(data.finance?.month_revenue || 0).toFixed(2)}`} icon="fas fa-chart-line" color="blue" />
        <StatCard label="Outstanding" value={`$${parseFloat(data.finance?.outstanding_invoices || 0).toFixed(2)}`} icon="fas fa-exclamation-circle" color="orange" />
        <StatCard label="Overdue Invoices" value={data.finance?.overdue_invoices} icon="fas fa-clock" color="red" />
      </div>

      <h4 className="erp-section-title">Operations</h4>
      <div className="erp-stats-grid">
        <StatCard label="Open Orders" value={data.sales?.open_orders} icon="fas fa-shopping-cart" color="purple" />
        <StatCard label="Active Employees" value={data.hr?.total_employees} icon="fas fa-users" color="teal" />
        <StatCard label="Pending Leave" value={data.hr?.pending_leave_requests} icon="fas fa-calendar-times" color="orange" />
        <StatCard label="Active Products" value={data.inventory?.total_products} icon="fas fa-boxes" color="blue" />
        <StatCard label="Pending POs" value={data.purchases?.pending_orders} icon="fas fa-truck-loading" color="purple" />
      </div>

      <h4 className="erp-section-title">MLM</h4>
      <div className="erp-stats-grid">
        <StatCard label="Total Commissions" value={`$${parseFloat(data.mlm?.total_commissions || 0).toFixed(2)}`} icon="fas fa-sitemap" color="green" />
        <StatCard label="Pending Commissions" value={`$${parseFloat(data.mlm?.pending_commissions || 0).toFixed(2)}`} icon="fas fa-hourglass-half" color="orange" />
      </div>
    </div>
  );
};

export default ERPDashboard;
