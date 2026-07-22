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
  accessibleModules: ModuleAccess[];
  hasAccess: (module: string) => boolean;
  isReadOnly: (module: string) => boolean;
  canWrite: (module: string) => boolean;
  isLoading: boolean;
  refreshAccess: () => void;
}

const AccessContext = createContext<AccessContextType>({
  userRole: '',
  isSuperAdmin: false,
  accessibleModules: [],
  hasAccess: () => false,
  isReadOnly: () => false,
  canWrite: () => false,
  isLoading: true,
  refreshAccess: () => {},
});

export const AccessProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [accessibleModules, setModules] = useState<ModuleAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      userRole, isSuperAdmin, accessibleModules, hasAccess, isReadOnly, canWrite, isLoading,
      refreshAccess: fetchAccess,
    }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext);

export default AccessContext;
