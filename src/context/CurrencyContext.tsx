import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CurrencyDef {
  code: "AED" | "INR" | "USD";
  symbol: string;
  tax: number;
  taxLabel: string;
  /** Units of this currency per 1 AED (AED is the base). */
  rate: number;
}

export const CURRENCIES: Record<string, CurrencyDef> = {
  AED: { code: "AED", symbol: "د.إ", tax: 0.05, taxLabel: "VAT 5%", rate: 1 },
  INR: { code: "INR", symbol: "₹", tax: 0.18, taxLabel: "GST 18%", rate: 22.5 },
  USD: { code: "USD", symbol: "$", tax: 0, taxLabel: "", rate: 0.27 },
};

const LOCALE: Record<string, string> = { AED: "en-AE", INR: "en-IN", USD: "en-US" };
const STORAGE_KEY = "xerxez_erp_currency";

/** Stored ERP amounts are in INR (existing `fmtINR` convention) — convert via the AED-based rate table. */
function toSelectedCurrency(amountInInr: number, currency: CurrencyDef): number {
  const amountInAed = amountInInr / CURRENCIES.INR.rate;
  return amountInAed * currency.rate;
}

function detectDefaultCurrency(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Dubai" || tz === "Asia/Muscat") return "AED";
    if (tz === "Asia/Kolkata") return "INR";
    if (tz.startsWith("America/")) return "USD";
  } catch {
    // Intl unavailable — fall through to default.
  }
  return "AED";
}

export interface FormatWithTaxResult {
  amount: string;
  tax: string;
  total: string;
  taxLabel: string;
}

interface CurrencyContextValue {
  currency: CurrencyDef;
  selectedCurrency: string;
  setCurrency: (code: string) => void;
  symbol: string;
  taxLabel: string;
  /** Converts (from INR base) + formats with the currency symbol, e.g. "د.إ 5,000.00". */
  formatAmount: (amount: number | string) => string;
  /** Converts + splits into amount / tax / total, each pre-formatted. */
  formatWithTax: (amount: number | string) => FormatWithTaxResult;
  /** Converts (from INR base) to a plain number in the selected currency — for animated count-ups. */
  convertAmount: (amount: number | string) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && CURRENCIES[saved]) return saved;
    return detectDefaultCurrency();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedCurrency);
  }, [selectedCurrency]);

  const currency = CURRENCIES[selectedCurrency] ?? CURRENCIES.AED;

  const fmt = (n: number) =>
    `${currency.symbol} ${n.toLocaleString(LOCALE[currency.code], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatAmount = (amount: number | string) =>
    fmt(toSelectedCurrency(Number(amount || 0), currency));

  const formatWithTax = (amount: number | string): FormatWithTaxResult => {
    const converted = toSelectedCurrency(Number(amount || 0), currency);
    const tax = converted * currency.tax;
    return {
      amount: fmt(converted),
      tax: fmt(tax),
      total: fmt(converted + tax),
      taxLabel: currency.taxLabel,
    };
  };

  const setCurrency = (code: string) => {
    if (CURRENCIES[code]) setSelectedCurrency(code);
  };

  const convertAmount = (amount: number | string) => toSelectedCurrency(Number(amount || 0), currency);

  return (
    <CurrencyContext.Provider
      value={{ currency, selectedCurrency, setCurrency, symbol: currency.symbol, taxLabel: currency.taxLabel, formatAmount, formatWithTax, convertAmount }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
};
