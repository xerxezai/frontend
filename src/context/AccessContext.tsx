import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { erpFetch } from '../hooks/useERPApi';

/** EPC modules are visible to Super Admins only. */
const EPC_MODULES = ['document_management', 'project_management', 'asset_management', 'qhse'];

interface ModuleAccess {
  name: string;
  display_name: string;
  role: string;
  icon: string;
}

interface AccessContextType {
  userRole: string;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  accessibleModules: ModuleAccess[];
  companyName: string;
  maxUsers: number;
  currentUsers: number;
  hasAccess: (module: string) => boolean;
  isReadOnly: (module: string) => boolean;
  canWrite: (module: string) => boolean;
  /** "HR Manager" — module_admin scoped to the hr module specifically. Used (alongside
   * isSuperAdmin/isCompanyAdmin) to gate full company-wide visibility of Attendance/Leave/
   * Payroll data, as opposed to a regular employee who only sees their own records. */
  isHRManager: boolean;
  isLoading: boolean;
  refreshAccess: () => void;
}

const AccessContext = createContext<AccessContextType>({
  userRole: '',
  isSuperAdmin: false,
  isCompanyAdmin: false,
  accessibleModules: [],
  companyName: '',
  maxUsers: 0,
  currentUsers: 0,
  hasAccess: () => false,
  isReadOnly: () => false,
  canWrite: () => false,
  isHRManager: false,
  isLoading: true,
  refreshAccess: () => {},
});

export const AccessProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [accessibleModules, setModules] = useState<ModuleAccess[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [maxUsers, setMaxUsers] = useState(0);
  const [currentUsers, setCurrentUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isCompanyAdmin = userRole === 'company_admin';
  const isHRManager = accessibleModules.some(m => m.name === 'hr' && m.role === 'module_admin');

  const fetchAccess = async () => {
    setIsLoading(true);
    try {
      const data = await erpFetch('rbac/my-access/');
      setUserRole(data.role);
      setIsSuperAdmin(data.is_super_admin);
      if (data.role === 'company_admin') {
        // Company Admin is a company-wide role — always full access to every real module,
        // even if their individual UserModuleAccess grants are incomplete (belt-and-suspenders;
        // the backend now also auto-grants all 8 on creation/edit, see apps.rbac.views).
        const allModules = ['dashboard', 'crm', 'sales', 'procurement', 'logistics', 'accounting', 'mlm', 'hr']
          .map(name => ({ name, role: 'company_admin', display_name: name, icon: '' }));
        setModules(allModules);

        try {
          const stats = await erpFetch('my-company/stats/');
          setCompanyName(stats.company_name || '');
          setMaxUsers(stats.max_users || 0);
          setCurrentUsers(stats.current_users || 0);
        } catch {
          // Non-fatal — the sidebar/page just won't show the usage bar until this succeeds.
        }
      } else {
        setModules(data.modules || []);
      }
    } catch (error) {
      console.error('Access fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAccess(); }, []);

  const hasAccess = (module: string): boolean => {
    // EPC modules only for super admin
    if (EPC_MODULES.includes(module)) return isSuperAdmin;
    if (isSuperAdmin) return true;
    return accessibleModules.some(m => m.name === module);
  };

  const isReadOnly = (module: string): boolean => {
    if (isSuperAdmin) return false;
    const mod = accessibleModules.find(m => m.name === module);
    return mod?.role === 'read_only';
  };

  /** Every role except Read Only can add/edit/delete within a module they have access to.
   * Data-level scope (own records vs. all company records) is enforced server-side. */
  const canWrite = (module: string): boolean => {
    if (isSuperAdmin) return true;
    const mod = accessibleModules.find(m => m.name === module);
    if (!mod) return false;
    if (mod.role === 'read_only') return false;
    return ['company_admin', 'module_admin', 'regular_user'].includes(mod.role);
  };

  return (
    <AccessContext.Provider value={{
      userRole, isSuperAdmin, isCompanyAdmin, accessibleModules, companyName, maxUsers, currentUsers,
      hasAccess, isReadOnly, canWrite, isHRManager, isLoading,
      refreshAccess: fetchAccess,
    }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext);

export default AccessContext;
