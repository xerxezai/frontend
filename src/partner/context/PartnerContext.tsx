import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { partnerApi, getStoredPartner, setStoredPartner, type PartnerProfile } from '../api/partnerApi';

interface Ctx {
  partner: PartnerProfile | null;
  loading: boolean;
  refresh: () => void;
}

const PartnerContext = createContext<Ctx>({ partner: null, loading: true, refresh: () => {} });

export const usePartner = () => useContext(PartnerContext);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState<PartnerProfile | null>(getStoredPartner());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    partnerApi.me()
      .then(p => { setPartner(p); setStoredPartner(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return <PartnerContext.Provider value={{ partner, loading, refresh }}>{children}</PartnerContext.Provider>;
}
