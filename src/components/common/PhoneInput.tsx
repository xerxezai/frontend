import { useEffect, useRef, useState } from "react";

export interface CountryDialCode {
  code: string;
  name: string;
  flag: string;
  dial: string;
  placeholder: string;
}

// Order matches the brief exactly — UAE and India first (primary markets), USA default fallback.
export const PHONE_COUNTRIES: CountryDialCode[] = [
  { code: "AE", name: "UAE",        flag: "🇦🇪", dial: "+971", placeholder: "5X XXX XXXX" },
  { code: "IN", name: "India",      flag: "🇮🇳", dial: "+91",  placeholder: "XXXXX XXXXX" },
  { code: "US", name: "USA",        flag: "🇺🇸", dial: "+1",   placeholder: "XXX XXX XXXX" },
  { code: "GB", name: "UK",         flag: "🇬🇧", dial: "+44",  placeholder: "XXXX XXXXXX" },
  { code: "SA", name: "Saudi",      flag: "🇸🇦", dial: "+966", placeholder: "5X XXX XXXX" },
  { code: "QA", name: "Qatar",      flag: "🇶🇦", dial: "+974", placeholder: "XXXX XXXX" },
  { code: "BH", name: "Bahrain",    flag: "🇧🇭", dial: "+973", placeholder: "XXXX XXXX" },
  { code: "OM", name: "Oman",       flag: "🇴🇲", dial: "+968", placeholder: "XXXX XXXX" },
  { code: "KW", name: "Kuwait",     flag: "🇰🇼", dial: "+965", placeholder: "XXXX XXXX" },
  { code: "PK", name: "Pakistan",   flag: "🇵🇰", dial: "+92",  placeholder: "XXX XXXXXXX" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", dial: "+880", placeholder: "XXXX XXXXXX" },
  { code: "AU", name: "Australia",  flag: "🇦🇺", dial: "+61",  placeholder: "XXX XXX XXX" },
  { code: "CA", name: "Canada",     flag: "🇨🇦", dial: "+1",   placeholder: "XXX XXX XXXX" },
];

const DEFAULT_COUNTRY = PHONE_COUNTRIES.find(c => c.code === "US")!;
const digitsOnly = (s: string) => s.replace(/\D/g, "");

// Exact digit count for countries with a fixed-length national number; countries
// not listed here (Saudi, Qatar, Oman, Bahrain, Kuwait, Pakistan, ...) fall back
// to the 7-12 "other countries" range from the brief.
const EXACT_DIGITS: Record<string, number> = { AE: 9, IN: 10, US: 10, GB: 10 };
const OTHER_MIN = 7;
const OTHER_MAX = 12;

/** The digit-count rule for a country, as both a number range and a human hint string. */
export function digitRuleFor(countryCode: string): { min: number; max: number; hint: string } {
  const exact = EXACT_DIGITS[countryCode];
  if (exact) return { min: exact, max: exact, hint: `Enter ${exact} digits` };
  return { min: OTHER_MIN, max: OTHER_MAX, hint: `Enter ${OTHER_MIN}-${OTHER_MAX} digits` };
}

/** Must start with "+" and have a digit count valid for that country's rule. */
export function isValidPhone(full: string): boolean {
  if (!full || !full.startsWith("+")) return false;
  const byLongestDial = [...PHONE_COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  const country = byLongestDial.find(c => full.startsWith(c.dial));
  if (!country) return false;
  const localDigits = digitsOnly(full.slice(country.dial.length));
  const rule = digitRuleFor(country.code);
  return localDigits.length >= rule.min && localDigits.length <= rule.max;
}

function parseValue(value: string): { country: CountryDialCode; local: string } {
  if (value?.startsWith("+")) {
    const byLongestDial = [...PHONE_COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
    for (const c of byLongestDial) {
      if (value.startsWith(c.dial)) return { country: c, local: digitsOnly(value.slice(c.dial.length)) };
    }
  }
  return { country: DEFAULT_COUNTRY, local: value ? digitsOnly(value) : "" };
}

/** IP geolocation with a short timeout, falling back to timezone, falling back to +1 (USA). */
async function detectCountry(): Promise<CountryDialCode> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const match = PHONE_COUNTRIES.find(c => c.code === data?.country_code);
      if (match) return match;
    }
  } catch {
    // network/CORS failure — fall through to the timezone guess below
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Dubai" || tz === "Asia/Muscat") return PHONE_COUNTRIES.find(c => c.code === "AE")!;
    if (tz === "Asia/Kolkata") return PHONE_COUNTRIES.find(c => c.code === "IN")!;
  } catch {
    // Intl unavailable — fall through to default
  }
  return DEFAULT_COUNTRY;
}

interface PhoneInputProps {
  value: string;
  onChange: (full: string) => void;
  disabled?: boolean;
  /** Legacy boolean error flag — still honored for existing callers. */
  hasError?: boolean;
  /** A specific error message to render below the field. */
  error?: string;
  required?: boolean;
  id?: string;
  onBlur?: () => void;
}

/** Flag + dial-code dropdown paired with a number field. Emits the combined value, e.g. "+971501234567". */
const PhoneInput = ({ value, onChange, disabled, hasError, error, required, id, onBlur }: PhoneInputProps) => {
  const initial = parseValue(value);
  const [country, setCountry] = useState<CountryDialCode>(initial.country);
  const [local, setLocal] = useState<string>(initial.local);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const didAutoDetect = useRef(false);

  // Auto-detect the visitor's country only for a fresh/empty field — never override a
  // prefilled value (editing an existing record, or a value passed in from a parent).
  useEffect(() => {
    if (value || didAutoDetect.current) return;
    didAutoDetect.current = true;
    detectCountry().then(setCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const commit = (nextCountry: CountryDialCode, nextLocalDigits: string) => {
    onChange(nextLocalDigits ? `${nextCountry.dial}${nextLocalDigits}` : "");
  };

  const rule = digitRuleFor(country.code);
  const digitCountWrong = local.length > 0 && (local.length < rule.min || local.length > rule.max);
  const showError = hasError || !!error || digitCountWrong;
  const errorText = error || (digitCountWrong && touched ? `Enter ${rule.min === rule.max ? rule.min : `${rule.min}-${rule.max}`} digits for ${country.name}` : "");

  return (
    <div>
      <div ref={wrapRef} style={{ display: "flex", position: "relative" }}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          aria-label="Select country code"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 12px", height: 46,
            border: `1px solid ${showError ? "#ef4444" : "rgba(0,0,0,0.12)"}`,
            borderRight: "none", borderRadius: "10px 0 0 10px",
            background: "#F8F7F4", cursor: disabled ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1A1A1A", flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>{country.flag}</span>
          <span style={{ fontWeight: 700 }}>{country.dial}</span>
          <i className={`fas fa-chevron-${open ? "up" : "down"}`} style={{ fontSize: 9, color: "#6B6B6B" }} />
        </button>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          required={required}
          maxLength={rule.max}
          placeholder={country.placeholder}
          value={local}
          onChange={e => {
            const digits = digitsOnly(e.target.value).slice(0, rule.max);
            setLocal(digits);
            commit(country, digits);
          }}
          onBlur={() => { setTouched(true); onBlur?.(); }}
          style={{
            flex: 1, minWidth: 0, height: 46, padding: "0 14px",
            border: `1px solid ${showError ? "#ef4444" : "rgba(0,0,0,0.12)"}`,
            borderRadius: "0 10px 10px 0",
            fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: "#1A1A1A",
            outline: "none", background: "#fff", boxSizing: "border-box",
          }}
        />
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            width: 250, maxHeight: 280, overflowY: "auto",
            background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
            borderTop: "2px solid #D93522", borderRadius: 12,
            boxShadow: "0 12px 36px rgba(0,0,0,0.16)", zIndex: 500,
          }}>
            {PHONE_COUNTRIES.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCountry(c); setOpen(false);
                  const clipped = local.slice(0, digitRuleFor(c.code).max);
                  setLocal(clipped);
                  commit(c, clipped);
                }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 14px", background: c.code === country.code ? "rgba(217,53,34,0.08)" : "none",
                  border: "none", borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(217,53,34,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = c.code === country.code ? "rgba(217,53,34,0.08)" : "none"; }}
              >
                <span style={{ fontSize: 16 }}>{c.flag}</span>
                <span style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{c.name}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 700, color: "#D93522" }}>{c.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {errorText ? (
        <div style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>{errorText}</div>
      ) : (
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>{rule.hint} for {country.name}</div>
      )}
    </div>
  );
};

export default PhoneInput;
