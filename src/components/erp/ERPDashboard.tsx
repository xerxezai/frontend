import { useERPDashboard } from '../../hooks/useERPApi';

const COLORS: Record<string, string> = {
  blue: '#3b82f6', green: '#10b981', purple: '#C9883A',
  orange: '#f59e0b', red: '#ef4444', teal: '#14b8a6',
};

const StatCard = ({ label, value, icon, color }: { label: string; value: any; icon: string; color: string }) => (
  <div className="col-6 col-sm-4 col-md-3 col-xl-2">
    <div className="bg-white rounded-3 p-3 d-flex align-items-center gap-3 h-100 shadow-sm">
      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 44, height: 44, background: COLORS[color] || '#C9883A' }}>
        <i className={`${icon} text-white`} style={{ fontSize: 16 }}></i>
      </div>
      <div className="min-w-0">
        <div className="fw-bold" style={{ fontSize: 18, color: '#1a1a2e', lineHeight: 1.2 }}>{value ?? '—'}</div>
        <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
      </div>
    </div>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className="col-12 mt-3 mb-1">
    <p className="text-uppercase fw-semibold mb-0" style={{ fontSize: 11, color: '#999', letterSpacing: '0.8px' }}>{title}</p>
  </div>
);

const ERPDashboard = () => {
  const { data, loading, error } = useERPDashboard();

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-muted">
      <div className="spinner-border text-primary" role="status"></div>
      <p>Loading dashboard...</p>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return null;

  return (
    <div>
      <h4 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>Dashboard</h4>
      <div className="row g-3">
        <SectionTitle title="CRM" />
        <StatCard label="Active Customers" value={data.crm?.total_customers} icon="fas fa-building" color="blue" />
        <StatCard label="Total Leads" value={data.crm?.total_leads} icon="fas fa-funnel-dollar" color="purple" />
        <StatCard label="New Leads (Month)" value={data.crm?.new_leads_this_month} icon="fas fa-star" color="teal" />

        <SectionTitle title="Finance" />
        <StatCard label="Total Revenue" value={`$${parseFloat(data.finance?.total_revenue || 0).toFixed(2)}`} icon="fas fa-dollar-sign" color="green" />
        <StatCard label="This Month" value={`$${parseFloat(data.finance?.month_revenue || 0).toFixed(2)}`} icon="fas fa-chart-line" color="blue" />
        <StatCard label="Outstanding" value={`$${parseFloat(data.finance?.outstanding_invoices || 0).toFixed(2)}`} icon="fas fa-exclamation-circle" color="orange" />
        <StatCard label="Overdue Invoices" value={data.finance?.overdue_invoices} icon="fas fa-clock" color="red" />

        <SectionTitle title="Operations" />
        <StatCard label="Open Orders" value={data.sales?.open_orders} icon="fas fa-shopping-cart" color="purple" />
        <StatCard label="Active Employees" value={data.hr?.total_employees} icon="fas fa-users" color="teal" />
        <StatCard label="Pending Leave" value={data.hr?.pending_leave_requests} icon="fas fa-calendar-times" color="orange" />
        <StatCard label="Active Products" value={data.inventory?.total_products} icon="fas fa-boxes" color="blue" />
        <StatCard label="Pending POs" value={data.purchases?.pending_orders} icon="fas fa-truck-loading" color="purple" />

        <SectionTitle title="MLM" />
        <StatCard label="Total Commissions" value={`$${parseFloat(data.mlm?.total_commissions || 0).toFixed(2)}`} icon="fas fa-sitemap" color="green" />
        <StatCard label="Pending Commissions" value={`$${parseFloat(data.mlm?.pending_commissions || 0).toFixed(2)}`} icon="fas fa-hourglass-half" color="orange" />
      </div>
    </div>
  );
};

export default ERPDashboard;


