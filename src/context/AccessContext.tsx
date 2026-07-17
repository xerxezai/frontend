import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { erpFetch } from '../hooks/useERPApi';

/** Always visible to every logged-in user — no access control on these ever. */
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
  isLoading: boolean;
  refreshAccess: () => void;
}

const AccessContext = createContext<AccessContextType>({
  userRole: '',
  isSuperAdmin: false,
  accessibleModules: [],
  hasAccess: () => false,
  isReadOnly: () => false,
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
      setModules(data.modules || []);
    } catch (error) {
      console.error('Access fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAccess(); }, []);

  const hasAccess = (module: string): boolean => {
    if (EPC_MODULES.includes(module)) return true;
    if (isSuperAdmin) return true;
    return accessibleModules.some(m => m.name === module);
  };

  const isReadOnly = (module: string): boolean => {
    if (isSuperAdmin) return false;
    const mod = accessibleModules.find(m => m.name === module);
    return mod?.role === 'read_only';
  };

  return (
    <AccessContext.Provider value={{
      userRole, isSuperAdmin, accessibleModules, hasAccess, isReadOnly, isLoading,
      refreshAccess: fetchAccess,
    }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext);

export default AccessContext;
