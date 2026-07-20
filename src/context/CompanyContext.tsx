import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { erpFetch } from '../hooks/useERPApi';

const ACTIVE_COMPANY_KEY = 'xerxez_active_company_id';

export interface Company {
  id: number;
  name: string;
  slug: string;
  industry: string;
  status: string;
  plan?: string;
  country?: string;
  city?: string;
  phone?: string;
  email?: string;
  user_count?: number;
  created_at?: string;
}

interface CompanyContextType {
  isPlatformAdmin: boolean;
  currentCompany: Company | null;
  allCompanies: Company[];
  myCompanyRole: string | null;
  switchCompany: (id: number | null) => Promise<void>;
  isLoading: boolean;
  refresh: () => void;
}

const CompanyContext = createContext<CompanyContextType>({
  isPlatformAdmin: false,
  currentCompany: null,
  allCompanies: [],
  myCompanyRole: null,
  switchCompany: async () => {},
  isLoading: true,
  refresh: () => {},
});

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [myCompanyRole, setMyCompanyRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyCompany = async () => {
    setIsLoading(true);
    try {
      const data = await erpFetch('my-company/');
      setIsPlatformAdmin(!!data.is_platform_admin);
      if (data.is_platform_admin) {
        setCurrentCompany(data.active_company || null);
        setAllCompanies(data.all_companies || []);
        setMyCompanyRole(null);
      } else {
        setCurrentCompany(data.company || null);
        setAllCompanies([]);
        setMyCompanyRole(data.role || null);
      }
    } catch (error) {
      console.error('my-company fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMyCompany(); }, []);

  const switchCompany = async (id: number | null) => {
    if (id) localStorage.setItem(ACTIVE_COMPANY_KEY, String(id));
    else localStorage.removeItem(ACTIVE_COMPANY_KEY);
    await erpFetch('companies/switch/', { method: 'POST', body: JSON.stringify({ company_id: id }) });
    await fetchMyCompany();
  };

  return (
    <CompanyContext.Provider value={{
      isPlatformAdmin, currentCompany, allCompanies, myCompanyRole, switchCompany, isLoading,
      refresh: fetchMyCompany,
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);

export default CompanyContext;
