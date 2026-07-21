import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CURRENCIES, type CurrencyDef } from '../../context/CurrencyContext';

// Reuses the ERP's AED-based rate table, but unlike the ERP (whose stored amounts are
// INR and get normalized to AED first), Partner Portal amounts are already entered/stored
// in AED — see deal_value on PartnerDeal — so conversion here is a direct AED -> selected.
const LOCALE: Record<string, string> = { AED: 'en-AE', INR: 'en-IN', USD: 'en-US' };
const STORAGE_KEY = 'partner_currency';

function detectDefaultCurrency(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Kolkata') return 'INR';
    if (tz.startsWith('America/')) return 'USD';
  } catch {
    // Intl unavailable — fall through to default.
  }
  return 'AED';
}

interface CurrencyContextValue {
  currency: CurrencyDef;
  selectedCurrency: string;
  setCurrency: (code: string) => void;
  symbol: string;
  /** Converts (from AED base) + formats with the currency symbol, e.g. "AED 5,000.00". */
  formatAmount: (amount: number | string | null | undefined) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && CURRENCIES[saved]) return saved;
    return detectDefaultCurrency();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedCurrency);
  }, [selectedCurrency]);

  const currency = CURRENCIES[selectedCurrency] ?? CURRENCIES.AED;

  const formatAmount = (amount: number | string | null | undefined) => {
    const converted = Number(amount || 0) * currency.rate;
    return `${currency.symbol} ${converted.toLocaleString(LOCALE[currency.code], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const setCurrency = (code: string) => {
    if (CURRENCIES[code]) setSelectedCurrency(code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, selectedCurrency, setCurrency, symbol: currency.symbol, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
};
