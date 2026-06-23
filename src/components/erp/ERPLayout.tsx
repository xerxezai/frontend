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

interface Props { children: React.ReactNode; }

const ERPLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_tokens');
    navigate('/erp');
  };

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Inject responsive margin so main content clears the fixed sidebar */}
      <style>{`@media (min-width: 992px) { .erp-main { margin-left: ${sidebarWidth}px !important; transition: margin-left 0.2s; } }`}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth,
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 200,
        transition: 'width 0.2s, transform 0.2s',
        transform: mobileOpen ? 'translateX(0)' : undefined,
      }}
      className={mobileOpen ? 'd-flex' : 'd-none d-lg-flex'}
      >
        {/* Brand */}
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-secondary">
          {!collapsed && <span className="text-white fw-bold" style={{ fontSize: 15 }}>XERXEZ ERP</span>}
          <button
            className="btn btn-sm p-0 border-0 ms-auto"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'none' }}
            onClick={() => setCollapsed(c => !c)}
          >
            <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-grow-1 overflow-auto py-2">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 text-decoration-none erp-nav-item${isActive ? ' erp-nav-active' : ''}`
              }
            >
              <i className={`${item.icon}`} style={{ width: 18, textAlign: 'center', fontSize: 15 }}></i>
              {!collapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="d-flex align-items-center gap-2 px-3 py-3 w-100 border-0 border-top border-secondary"
          style={{ background: 'none', color: 'rgba(255,87,87,0.8)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          <i className="fas fa-sign-out-alt" style={{ width: 18, textAlign: 'center' }}></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main content area â€” offset by sidebar width on large screens */}
      <div className="erp-main d-flex flex-column" style={{ minHeight: '100vh' }}>

        {/* Topbar */}
        <header className="bg-white border-bottom px-3 px-md-4 py-2 d-flex align-items-center justify-content-between sticky-top" style={{ zIndex: 100 }}>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm d-lg-none border-0 p-1"
              onClick={() => setMobileOpen(o => !o)}
            >
              <i className="fas fa-bars" style={{ fontSize: 18 }}></i>
            </button>
            <img src="/assets/img/logo/black-logo.svg" alt="Xerxez" height={30} />
          </div>
          <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 14 }}>
            <i className="fas fa-user-circle" style={{ fontSize: 20, color: '#6c57d2' }}></i>
            <span className="d-none d-sm-inline">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-3 p-md-4" style={{ flex: 1 }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default ERPLayout;

