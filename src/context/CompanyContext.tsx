import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { erpFetch } from '../hooks/useERPApi';

const ACTIVE_COMPANY_KEY = 'xerxez_active_company_id';
/** Frontend-only default for platform admins (Danish, Tanzeem, ...) who log in with no
 * company selected yet — no database changes, this only pre-picks an entry that's already
 * in allCompanies from the "All Companies" dropdown. If no company with this name exists,
 * nothing happens and the dropdown just stays on "All Companies" as before. */
const DEFAULT_COMPANY_NAME = 'XERXEZ Solutions';

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
  // Only ever attempt the default-company auto-select once per session — otherwise every
  // fetchMyCompany() call (switchCompany() itself calls it) would re-fire this effect.
  const triedDefaultCompany = useRef(false);

  const fetchMyCompany = async () => {
    setIsLoading(true);
    try {
      const data = await erpFetch('my-company/');
      setIsPlatformAdmin(!!data.is_platform_admin);
      if (data.is_platform_admin) {
        setCurrentCompany(data.active_company || null);
        setAllCompanies(data.all_companies || []);
        setMyCompanyRole(null);

        // Superuser with no company selected yet (fresh login) — default them into
        // "XERXEZ Solutions" if it exists in their company list. They can still switch to
        // any other company via the "All Companies" dropdown afterwards; this only sets the
        // initial selection, it never locks them to it.
        if (!data.active_company && !triedDefaultCompany.current) {
          triedDefaultCompany.current = true;
          const companies: Company[] = data.all_companies || [];
          const defaultCompany = companies.find(
            (c) => c.name.trim().toLowerCase() === DEFAULT_COMPANY_NAME.toLowerCase(),
          );
          if (defaultCompany) {
            switchCompany(defaultCompany.id).catch((err) => {
              console.error('Could not auto-select default company:', err);
            });
            return;
          }
        }
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
    // Confirm the switch with the backend BEFORE touching localStorage — writing
    // the new id first (the old order) meant a failed/rejected switch still left
    // localStorage pointing at a company the server never actually activated, so
    // the X-Active-Company-Id header on every later request would keep sending
    // the wrong (unconfirmed) id. Let the caller handle/display any error.
    await erpFetch('companies/switch/', { method: 'POST', body: JSON.stringify({ company_id: id }) });
    if (id) localStorage.setItem(ACTIVE_COMPANY_KEY, String(id));
    else localStorage.removeItem(ACTIVE_COMPANY_KEY);
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
