import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const C = {
  orange:     "#C9883A",
  orangeGrad: "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
  warmDark:   "#1a1208",
  warmDarker: "#0f0a05",
  cream:      "#F8F7F4",
  white:      "#FFFFFF",
  muted:      "#6B6B6B",
  border:     "rgba(0,0,0,0.07)",
};

type NavItem =
  | { to: string; icon: string; label: string; adminOnly?: boolean }
  | { group: string };

const NAV: NavItem[] = [
  { to: '/erp/dashboard', icon: 'fas fa-th-large',            label: 'Dashboard' },
  { to: '/erp/crm',       icon: 'fas fa-users',               label: 'CRM' },
  { to: '/erp/hr',        icon: 'fas fa-user-tie',            label: 'HR Overview' },
  { to: '/erp/inventory', icon: 'fas fa-boxes',               label: 'Inventory' },
  { to: '/erp/sales',     icon: 'fas fa-shopping-cart',       label: 'Sales' },
  { to: '/erp/invoicing', icon: 'fas fa-file-invoice-dollar', label: 'Invoicing' },
  { to: '/erp/purchases', icon: 'fas fa-truck-loading',       label: 'Purchases' },
  { to: '/erp/logistics', icon: 'fas fa-shipping-fast',       label: 'Logistics' },
  { to: '/erp/accounting',icon: 'fas fa-book',                label: 'Accounting' },
  { to: '/erp/mlm',       icon: 'fas fa-sitemap',             label: 'MLM' },

  { group: 'HR & PAYROLL' },

  { to: '/erp/attendance',          icon: 'fas fa-clock',                 label: 'Attendance' },
  { to: '/erp/my-attendance',       icon: 'fas fa-calendar-check',        label: 'My Attendance' },
  { to: '/erp/leave',               icon: 'fas fa-calendar-minus',        label: 'Leave' },
  { to: '/erp/all-attendance',      icon: 'fas fa-users-cog',             label: 'All Attendance',   adminOnly: true },
  { to: '/erp/leave-approvals',     icon: 'fas fa-check-circle',          label: 'Leave Approvals',  adminOnly: true },
  { to: '/erp/shifts',              icon: 'fas fa-exchange-alt',          label: 'Shifts',           adminOnly: true },
  { to: '/erp/salary-structures',   icon: 'fas fa-money-bill-wave',       label: 'Salary Setup',     adminOnly: true },
  { to: '/erp/payroll-generate',    icon: 'fas fa-cogs',                  label: 'Generate Payroll', adminOnly: true },
  { to: '/erp/payroll-reports',     icon: 'fas fa-chart-bar',             label: 'Payroll Reports',  adminOnly: true },
  { to: '/erp/my-payslips',         icon: 'fas fa-file-alt',              label: 'My Payslips' },
];

function isAdminUser(): boolean {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const payload = JSON.parse(atob(JSON.parse(stored).access.split('.')[1]));
      if (payload.is_staff === true || payload.is_superuser === true) return true;
    }
  } catch {}
  const role = localStorage.getItem('xerxez_role') || '';
  return role === 'admin' || role === 'super_admin' || role === 'superuser';
}

interface Props { children: React.ReactNode; }

const ERPLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  const adminName = localStorage.getItem('xerxez_name') || 'Admin';
  const initial   = adminName.charAt(0).toUpperCase();
  const isAdmin   = isAdminUser();

  const handleLogout = () => {
    ['auth_tokens', 'xerxez_token', 'xerxez_role', 'xerxez_name'].forEach(k =>
      localStorage.removeItem(k)
    );
    navigate('/');
  };

  const sidebarW = collapsed ? 68 : 240;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0c0804',
        '--sidebar-w': `${sidebarW}px`,
      } as React.CSSProperties}
    >
      <style>{`
        @media (min-width: 992px) {
          .erp-main {
            margin-left: var(--sidebar-w) !important;
            transition: margin-left 0.28s cubic-bezier(0.22,1,0.36,1);
          }
        }

        .erp-nav-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 13px;
          margin: 2px 0;
          border-left: 3px solid transparent;
          border-radius: 0 10px 10px 0;
          text-decoration: none;
          color: rgba(255,255,255,0.50);
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.22s, background 0.22s, transform 0.22s;
          white-space: nowrap;
          overflow: hidden;
        }
        .erp-nav-item:hover {
          color: rgba(255,255,255,0.88);
          background: rgba(201,136,58,0.09);
          transform: translateX(3px);
        }
        .erp-nav-active {
          color: #C9883A !important;
          background: rgba(201,136,58,0.13) !important;
          border-left-color: #C9883A !important;
          font-weight: 700 !important;
        }

        .erp-icon-badge {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 12px;
          background: rgba(255,255,255,0.07);
          transition: background 0.22s, box-shadow 0.22s;
        }
        .erp-nav-active .erp-icon-badge {
          background: linear-gradient(145deg, #e8a84e 0%, #C9883A 100%);
          box-shadow: 0 3px 0 rgba(150,95,30,0.50), 0 4px 10px rgba(201,136,58,0.28);
        }
        .erp-nav-item:hover .erp-icon-badge {
          background: rgba(201,136,58,0.18);
        }

        .erp-nav-group-label {
          padding: 14px 16px 4px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(201,136,58,0.55);
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .erp-nav-group-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(201,136,58,0.25), transparent);
        }

        .erp-nav-slide {
          animation: erpNavIn 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes erpNavIn {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .erp-search {
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 9px;
          padding: 7px 14px 7px 34px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          outline: none;
          width: 200px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .erp-search:focus {
          border-color: #C9883A;
          box-shadow: 0 0 0 3px rgba(201,136,58,0.15);
        }
        .erp-search::placeholder { color: rgba(255,255,255,0.28); }

        .erp-bell {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.09);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative;
          transition: background 0.2s, border-color 0.2s;
        }
        .erp-bell:hover { background: rgba(201,136,58,0.14); border-color: rgba(201,136,58,0.36); }

        .erp-logout {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.16);
          border-radius: 10px;
          padding: 9px 13px;
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          cursor: pointer;
          color: rgba(248,113,113,0.85);
          font-size: 13.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, color 0.2s;
        }
        .erp-logout:hover { background: rgba(239,68,68,0.14); color: #f87171; }

        @media (prefers-reduced-motion: reduce) {
          .erp-nav-slide { animation: none !important; }
          .erp-nav-item  { transition: none !important; }
        }
      `}</style>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.52)',
            zIndex: 199,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* sidebar */}
      <aside
        className={mobileOpen ? 'd-flex' : 'd-none d-lg-flex'}
        style={{
          width: sidebarW,
          background: `linear-gradient(180deg, ${C.warmDark} 0%, ${C.warmDarker} 100%)`,
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 200,
          transition: 'width 0.28s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: '4px 0 28px rgba(0,0,0,0.22)',
          overflow: 'hidden',
        }}
      >
        {/* brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '18px 12px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          minHeight: 68,
          flexShrink: 0,
        }}>
          {!collapsed ? (
            <img src="/assets/img/logo/xerxez_logo.png" alt="Xerxez"
              style={{ height: 44, width: 'auto', display: 'block', objectFit: 'contain' }} />
          ) : (
            <img src="/assets/img/logo/icon-logo.svg" alt="Xerxez"
              style={{ height: 32, width: 32, display: 'block', objectFit: 'contain' }} />
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '5px 6px', borderRadius: 6, flexShrink: 0,
              color: 'rgba(255,255,255,0.28)',
              transition: 'color 0.2s',
              marginLeft: collapsed ? 0 : 8,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
          >
            <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`} style={{ fontSize: 11 }}></i>
          </button>
        </div>

        {/* nav */}
        <nav style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 10, paddingBottom: 10 }}>
          {NAV.map((item, idx) => {
            if ('group' in item) {
              if (collapsed) return (
                <div key={idx} style={{ height: 1, margin: '8px 0', background: 'rgba(201,136,58,0.18)' }} />
              );
              return (
                <div key={idx} className="erp-nav-group-label">
                  {item.group}
                </div>
              );
            }
            if (item.adminOnly && !isAdmin) return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/erp/hr'}
                title={item.label}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `erp-nav-item erp-nav-slide${isActive ? ' erp-nav-active' : ''}`
                }
                style={{ animationDelay: `${idx * 0.028}s` }}
              >
                <span className="erp-icon-badge">
                  <i className={item.icon} style={{ color: 'inherit', fontSize: 12 }}></i>
                </span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* logout */}
        <div style={{ padding: 10, flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="erp-logout"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <i className="fas fa-sign-out-alt" style={{ fontSize: 13, flexShrink: 0 }}></i>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* main */}
      <div className="erp-main d-flex flex-column" style={{ minHeight: '100vh' }}>

        {/* header */}
        <header style={{
          background: 'linear-gradient(90deg, #1a1208 0%, #0f0a05 100%)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.06), 0 2px 16px rgba(0,0,0,0.40)',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="d-lg-none"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Open menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.70)' }}
            >
              <i className="fas fa-bars" style={{ fontSize: 18 }}></i>
            </button>
            <img src="/assets/img/logo/xerxez_logo.png" alt="Xerxez"
              style={{ height: 70, width: 'auto', display: 'block' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="d-none d-md-block" style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{
                position: 'absolute', left: 11,
                top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.28)', fontSize: 12, pointerEvents: 'none',
              }}></i>
              <input
                className="erp-search"
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                aria-label="Search"
              />
            </div>

            <button className="erp-bell" aria-label="Notifications">
              <i className="fas fa-bell" style={{ color: 'rgba(255,255,255,0.60)', fontSize: 14 }}></i>
              <span style={{
                position: 'absolute', top: 8, right: 8,
                width: 7, height: 7, borderRadius: '50%',
                background: C.orange, border: '1.5px solid #1a1208',
                display: 'block',
              }}></span>
            </button>

            {/* ── Profile button + dropdown ── */}
            <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                aria-expanded={profileOpen}
                aria-label="User menu"
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  background: profileOpen ? 'rgba(201,136,58,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${profileOpen ? 'rgba(201,136,58,0.36)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, padding: '5px 11px 5px 5px',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {/* avatar ring */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: C.orangeGrad,
                  boxShadow: `0 0 0 2px #1a1208, 0 0 0 3px ${C.orange}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{initial}</span>
                </div>
                {/* name + role — hidden on small screens */}
                <div className="d-none d-md-block" style={{ textAlign: 'left' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2, whiteSpace: 'nowrap' }}>{adminName}</div>
                  <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10.5, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>{isAdmin ? 'super_admin' : 'user'}</div>
                </div>
                <i
                  className={`fas fa-chevron-${profileOpen ? 'up' : 'down'}`}
                  style={{ color: 'rgba(255,255,255,0.30)', fontSize: 9, transition: 'transform 0.2s' }}
                />
              </button>

              {/* ── Dropdown ── */}
              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 230,
                  background: 'linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: '2px solid #C9883A',
                  borderRadius: 14,
                  boxShadow: '0 6px 0 rgba(0,0,0,0.45),0 20px 48px rgba(0,0,0,0.60)',
                  overflow: 'hidden',
                  zIndex: 400,
                }}>

                  {/* user header — compact */}
                  <div style={{
                    padding: '14px 16px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(201,136,58,0.04)',
                    display: 'flex', alignItems: 'center', gap: 11,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: C.orangeGrad,
                      boxShadow: `0 0 0 2px #1a1208, 0 0 0 3px ${C.orange}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>{initial}</span>
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>{adminName}</div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4,
                        background: 'rgba(201,136,58,0.12)',
                        border: '1px solid rgba(201,136,58,0.28)',
                        color: C.orange, fontSize: 9, fontWeight: 700,
                        padding: '2px 7px', borderRadius: 20,
                        letterSpacing: '0.10em', textTransform: 'uppercase',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 5px rgba(74,222,128,0.75)', flexShrink: 0 }} />
                        {isAdmin ? 'Super Admin' : 'User'}
                      </span>
                    </div>
                  </div>

                  {/* menu items — no desc, single-line */}
                  {([
                    { icon: 'fas fa-user-circle', label: 'My Profile',       to: '/erp/profile' },
                    { icon: 'fas fa-edit',         label: 'Edit Profile',     to: '/erp/profile/edit' },
                    { icon: 'fas fa-cog',          label: 'Account Settings', to: '/erp/settings/account' },
                    { icon: 'fas fa-lock',         label: 'Privacy Settings', to: '/erp/settings/privacy' },
                  ] as const).map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setProfileOpen(false); navigate(item.to); }}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        padding: '10px 16px',
                        display: 'flex', alignItems: 'center', gap: 11,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.16s',
                        minHeight: 44,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,136,58,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                        background: 'rgba(201,136,58,0.08)',
                        border: '1px solid rgba(201,136,58,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className={item.icon} style={{ color: C.orange, fontSize: 12 }} />
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
                        {item.label}
                      </span>
                      <i className="fas fa-chevron-right" style={{ color: 'rgba(255,255,255,0.16)', fontSize: 9, flexShrink: 0 }} />
                    </button>
                  ))}

                  {/* sign out */}
                  <div style={{ padding: '9px 12px 12px' }}>
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        background: 'rgba(239,68,68,0.07)',
                        border: '1px solid rgba(239,68,68,0.16)',
                        borderRadius: 9, padding: '9px 14px',
                        cursor: 'pointer', color: '#f87171',
                        fontSize: 13, fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'background 0.18s, color 0.18s',
                        minHeight: 40,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; e.currentTarget.style.color = '#fca5a5'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#f87171'; }}
                    >
                      <i className="fas fa-sign-out-alt" style={{ fontSize: 12 }} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* content */}
        <div style={{ flex: 1, padding: '24px 28px', background: 'transparent' }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default ERPLayout;
