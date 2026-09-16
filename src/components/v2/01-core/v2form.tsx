// v2form.tsx
// Purpose: Shared form primitives (label style, input style, field wrapper,
//          chip multi-select, submit button, success panel) for /v2 forms.
// Used in: features/XerxezContactForm.tsx, features/XerxezCareersForm.tsx
// Data source: none — pure UI. Field lists / option arrays live in the forms.

import type { CSSProperties, ReactNode } from "react";   // types only
import { Check } from "lucide-react";                     // tick icon for chips + success
import { T } from "./v2theme";                            // design tokens

// ── validateEmail ────────────────────────────────────────────────────────
// Deliberately permissive "something@something.tld" shape check — the same
// rule the existing site forms use. Real verification happens server-side, so
// this only catches obvious typos without rejecting valid exotic addresses.
// Shared by both /v2 forms so the rule can't drift between them.
export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── v2Label ──────────────────────────────────────────────────────────────
// Style object for the small uppercase <label> above every field.
export const v2Label: CSSProperties = {
  display: "block",
  fontFamily: T.fontBody,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#5b6b7c",          // slate — passes 4.5:1 on white
  marginBottom: 7,
};

// ── v2Control ────────────────────────────────────────────────────────────
// Returns the style for an <input> / <select> / <textarea>. Called with the
// field's current state so the border + ring reflect focus / error / disabled.
export const v2Control = (opts: { focused?: boolean; error?: boolean; disabled?: boolean }): CSSProperties => ({
  width: "100%",
  boxSizing: "border-box",                       // padding must not overflow the grid column
  fontFamily: T.fontBody,
  fontSize: 14.5,
  color: T.ink,
  background: opts.disabled ? "#f4f7fa" : "#fff", // greyed while submitting
  // border priority: error (red) → focused (red) → resting (grey)
  border: `1.5px solid ${opts.error ? "#e11d2e" : opts.focused ? T.red : T.border}`,
  borderRadius: T.rx,
  padding: "12px 14px",
  outline: "none",                               // native outline replaced by the ring below
  // focus ring — only when focused AND not in an error state
  boxShadow: opts.focused && !opts.error ? `0 0 0 3px rgba(217,53,34,0.12)` : "none",
  transition: "border-color 160ms ease, box-shadow 160ms ease",
});

// ── <V2Field> ────────────────────────────────────────────────────────────
// One form row: <label> + the control (passed as children) + an optional
// error message. Renders as a Bootstrap grid column so fields sit 2-up.
export const V2Field = ({
  label,                 // visible field name
  required,              // adds a red asterisk
  error,                 // error text — also announced via role="alert"
  htmlFor,               // id of the control, for label association
  children,              // the <input>/<select>/<textarea>
  full,                  // true → full width (col-12) instead of half (col-md-6)
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  full?: boolean;
}) => (
  <div className={full ? "col-12" : "col-md-6"}>
    <label htmlFor={htmlFor} style={v2Label}>
      {label}{required && <span style={{ color: T.red }}> *</span>}
    </label>
    {children}
    {error && (
      // role="alert" so screen readers announce the error when it appears
      <span role="alert" style={{
        display: "block", marginTop: 6,
        fontFamily: T.fontBody, fontSize: 12, color: "#e11d2e",
      }}>
        {error}
      </span>
    )}
  </div>
);

// ── <V2Chips> ────────────────────────────────────────────────────────────
// Multi-select as toggle pills. The selected values are stored by the parent
// as a single ", "-joined string because the backend fields are CharFields —
// this matches the original ContactSection2 behaviour exactly.
export const V2Chips = ({
  options,               // all choices
  value,                 // ", "-joined string of the currently selected ones
  onToggle,              // parent handler: add/remove one value
  disabled,              // true while the form is submitting
}: {
  options: string[];
  value: string;
  onToggle: (v: string) => void;
  disabled?: boolean;
}) => {
  const selected = value.split(", ").filter(Boolean);   // string → array (drop empties)
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const on = selected.includes(opt);               // is this chip selected?
        return (
          <button
            key={opt}
            type="button"                                // not a submit
            disabled={disabled}
            aria-pressed={on}                            // expose toggle state to AT
            onClick={() => onToggle(opt)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px",
              borderRadius: 999,                         // pill
              border: `1.5px solid ${on ? T.red : T.border}`,
              background: on ? "rgba(217,53,34,0.08)" : "#fff",
              color: on ? T.red : "#5b6b7c",
              fontFamily: T.fontHead, fontSize: 12.5, fontWeight: 600,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "border-color 140ms ease, background 140ms ease, color 140ms ease",
            }}
          >
            {on && <Check size={12} strokeWidth={3} />}  {/* tick only when selected */}
            {opt}
          </button>
        );
      })}
    </div>
  );
};

// Injected once into <head> on first use, not per-render — avoids every
// V2SubmitBtn re-render (e.g. on a sibling field's onChange) re-parsing a
// duplicate <style> node.
let v2SpinKeyframeInjected = false;
const ensureV2SpinKeyframe = () => {
  if (v2SpinKeyframeInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = `@keyframes v2spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
  v2SpinKeyframeInjected = true;
};

// ── <V2SubmitBtn> ────────────────────────────────────────────────────────
// Red submit button with idle / loading states (spinner + label swap).
export const V2SubmitBtn = ({
  loading,                       // true while the request is in flight
  children,                     // idle label
  loadingLabel = "Sending…",    // label shown next to the spinner
}: { loading: boolean; children: ReactNode; loadingLabel?: string }) => {
  ensureV2SpinKeyframe();
  return (
  <button
    type="submit"
    disabled={loading}                              // block double-submits
    style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
      minHeight: 50, padding: "0 32px",             // 50px ≥ 44px touch target
      background: loading ? "#b52a1c" : T.red,      // darker red while loading
      color: "#fff",
      fontFamily: T.fontHead, fontSize: 15, fontWeight: 600,
      border: "none", borderRadius: T.rx,
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: `0 10px 26px ${T.redGlow}`,
      transition: "background 160ms ease",
    }}
  >
    {loading ? (
      <>
        {/* inline spinner — rotates via the v2spin keyframe injected above */}
        <svg width="15" height="15" viewBox="0 0 18 18" style={{ animation: "v2spin 0.9s linear infinite" }}>
          <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <path d="M9 2a7 7 0 0 1 7 7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {loadingLabel}
      </>
    ) : children}
  </button>
  );
};

// ── <V2FormSuccess> ──────────────────────────────────────────────────────
// Green check + heading + optional message, shown in place of a form after a
// successful submit. (Both forms currently render their own inline success
// block; this is the reusable version for future forms.)
export const V2FormSuccess = ({
  title, children,
}: { title: string; children?: ReactNode }) => (
  <div style={{ textAlign: "center", padding: "48px 20px" }}>
    <div style={{
      width: 68, height: 68, borderRadius: "50%",
      background: "linear-gradient(135deg,#16a34a,#22c55e)",   // green success gradient
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      marginBottom: 22, boxShadow: "0 10px 30px rgba(34,197,94,0.28)",
    }}>
      <Check size={30} color="#fff" strokeWidth={3} />
    </div>
    <h3 style={{
      fontFamily: T.fontHead, fontSize: 24, fontWeight: 800,
      color: T.headNavy, margin: "0 0 12px",
    }}>
      {title}
    </h3>
    {children && (
      <p style={{
        fontFamily: T.fontBody, fontSize: 15, lineHeight: 1.7,
        color: T.muted, maxWidth: 420, margin: "0 auto",
      }}>
        {children}
      </p>
    )}
  </div>
);
