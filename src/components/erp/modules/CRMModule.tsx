import { useState } from 'react';
import { LayoutDashboard, Users, Target, Activity, LayoutGrid } from 'lucide-react';
import { useERPList } from '../../../hooks/useERPApi';
import CRMDashboard from './crm/CRMDashboard';
import CustomersPanel from './crm/CustomersPanel';
import LeadsPanel from './crm/LeadsPanel';
import ActivitiesPanel from './crm/ActivitiesPanel';
import CRMPipeline from './crm/CRMPipeline';
import { FF } from './crm/crmShared';

type Tab = 'Dashboard' | 'Customers' | 'Leads' | 'Activities' | 'Pipeline';

const CRMModule = () => {
  const [tab, setTab] = useState<Tab>('Dashboard');

  const customers  = useERPList<any>('crm/customers/');
  const leads      = useERPList<any>('crm/leads/');
  const activities = useERPList<any>('crm/activities/');
  const deals       = useERPList<any>('crm/deals/');

  const TAB_META: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'Dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
    { key: 'Customers',  label: 'Customers',  icon: Users,      count: customers.data.length },
    { key: 'Leads',      label: 'Leads',      icon: Target,     count: leads.data.length },
    { key: 'Activities', label: 'Activities', icon: Activity,   count: activities.data.length },
    { key: 'Pipeline',   label: 'Pipeline',   icon: LayoutGrid, count: deals.data.length },
  ];

  return (
    <div>
      {/* premium segmented tab bar */}
      <div style={{
        display: 'inline-flex', flexWrap: 'wrap', gap: 3, marginBottom: 22,
        background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: 5,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.05)',
      }}>
        {TAB_META.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: FF, fontWeight: 700, fontSize: 13,
                background: active ? 'linear-gradient(135deg,#e8a84e,#C9883A)' : 'transparent',
                color: active ? '#fff' : '#6B6B6B',
                boxShadow: active ? '0 3px 10px rgba(201,136,58,0.30)' : 'none',
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#C9883A'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#6B6B6B'; }}
            >
              <t.icon size={15} />
              {t.label}
              {t.count !== undefined && (
                <span style={{
                  fontSize: 10.5, fontWeight: 800, padding: '1px 7px', borderRadius: 999, lineHeight: 1.5,
                  background: active ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.06)',
                  color: active ? '#fff' : '#9ca3af',
                }}>{t.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {tab === 'Dashboard'  && <CRMDashboard />}
      {tab === 'Customers'  && <CustomersPanel />}
      {tab === 'Leads'      && <LeadsPanel />}
      {tab === 'Activities' && <ActivitiesPanel />}
      {tab === 'Pipeline'   && <CRMPipeline />}
    </div>
  );
};

export default CRMModule;
