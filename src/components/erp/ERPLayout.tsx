import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/erp/dashboard', icon: 'fas fa-th-large', label: 'Dashboard' },
  { to: '/erp/crm', icon: 'fas fa-users', label: 'CRM' },
  { to: '/erp/hr', icon: 'fas fa-user-tie', label: 'HR' },
  { to: '/erp/inventory', icon: 'fas fa-boxes', label: 'Inventory' },
  { to: '/erp/sales', icon: 'fas fa-shopping-cart', label: 'Sales' },
  { to: '/erp/invoicing', icon: 'fas fa-file-invoice-dollar', label: 'Invoicing' },
  { to: '/erp/purchases', icon: 'fas fa-truck-loading', label: 'Purchases' },
  { to: '/erp/logistics', icon: 'fas fa-shipping-fast', label: 'Logistics' },
  { to: '/erp/accounting', icon: 'fas fa-book', label: 'Accounting' },
  { to: '/erp/mlm', icon: 'fas fa-sitemap', label: 'MLM' },
];

interface Props {
  children: React.ReactNode;
}

const ERPLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_tokens');
    navigate('/erp');
  };

  return (
    <div className="erp-shell">
      <aside className={`erp-sidebar${collapsed ? ' collapsed' : ''}`}>
        <div className="erp-sidebar-brand">
          {!collapsed && <span>XERXEZ ERP</span>}
          <button className="erp-collapse-btn" onClick={() => setCollapsed(c => !c)}>
            <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
        <nav className="erp-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `erp-nav-item${isActive ? ' active' : ''}`}
              title={item.label}
            >
              <i className={item.icon}></i>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="erp-nav-item erp-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>
      <main className="erp-main">
        <header className="erp-topbar">
          <div className="erp-topbar-left">
            <img src="/assets/img/logo/black-logo.svg" alt="Xerxez" height={32} />
          </div>
          <div className="erp-topbar-right">
            <i className="fas fa-user-circle"></i>
            <span>Admin</span>
          </div>
        </header>
        <div className="erp-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ERPLayout;
