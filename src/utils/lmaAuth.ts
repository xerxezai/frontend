// "Middle ground" session policy: access + refresh tokens both last 8 hours
// server-side (xerxez_backend/settings.py SIMPLE_JWT). Refreshing every 7
// hours means an active session (app left open) effectively never expires,
// while a session left idle for 8+ hours (closed browser overnight) finds
// its refresh token expired too and is cleanly logged out.
export const LMA_PROACTIVE_REFRESH_INTERVAL_MS = 7 * 60 * 60 * 1000;

// Shared LMA session-persistence helpers — used by LMAStudentLayout.tsx and
// LMAInstructorDashboard.tsx (the two top-level shells every LMA route
// renders inside) so a silent token refresh happens once at the top and
// flows down to every child via the `token` prop they already receive,
// instead of touching every individual fetch call site across the app.
import { V2_API_BASE as API } from "../components/v2/01-core/v2theme";

/** Decodes a JWT's `exp` claim (seconds since epoch) to milliseconds, or
 * null if the token can't be parsed. No signature verification — this is
 * only used client-side to decide "should I bother refreshing yet?"; the
 * backend is the actual authority on validity. */
export function decodeJwtExpMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** True if the token is missing, unparseable, or within `bufferMs` of expiry
 * (default 60s) — refreshing slightly early avoids a request landing right
 * as the token expires. */
export function isLmaTokenExpiringSoon(token: string, bufferMs = 60_000): boolean {
  if (!token) return true;
  const exp = decodeJwtExpMs(token);
  if (exp === null) return true;
  return Date.now() >= exp - bufferMs;
}

export function clearLmaSession() {
  ["lma_token", "lma_refresh", "lma_role", "lma_can_instructor", "lma_instructor_level", "lma_name"]
    .forEach(k => localStorage.removeItem(k));
}

/** Calls the refresh endpoint with the stored lma_refresh token. Refresh
 * token ROTATION is enabled server-side (SIMPLE_JWT ROTATE_REFRESH_TOKENS +
 * BLACKLIST_AFTER_ROTATION) — the refresh token used here is blacklisted
 * the instant it's used, so the NEW refresh token in the response must be
 * persisted too, not just the new access token, or the next refresh fails.
 * Returns the new access token, or null if refresh genuinely failed (bad/
 * expired/blacklisted refresh token) — network errors return null too but
 * deliberately do NOT clear the session, since the user may just be briefly
 * offline and the existing token might still be valid for a bit longer. */
export async function refreshLmaSession(): Promise<string | null> {
  const refresh = localStorage.getItem("lma_refresh");
  if (!refresh) return null;
  try {
    const res = await fetch(`${API}/lma/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearLmaSession();
      return null;
    }
    const data = await res.json();
    if (!data.access) {
      clearLmaSession();
      return null;
    }
    localStorage.setItem("lma_token", data.access);
    if (data.refresh) localStorage.setItem("lma_refresh", data.refresh);
    return data.access;
  } catch {
    return null;
  }
}

/** Returns a usable access token, refreshing first if the stored one is
 * missing or about to expire. Empty string means the session could not be
 * restored — the caller should redirect to login. */
export async function ensureLmaAccessToken(): Promise<string> {
  const current = localStorage.getItem("lma_token") ?? "";
  if (current && !isLmaTokenExpiringSoon(current)) return current;
  const refreshed = await refreshLmaSession();
  return refreshed ?? "";
}
