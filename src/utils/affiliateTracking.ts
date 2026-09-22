// Client-side half of affiliate click tracking. The canonical record (click
// count, IP, user agent) is written server-side by apps.affiliates.views
// .track_click, but a shared affiliate link is just `.../lma/courses/:id?ref=CODE`
// (per the spec) — most visitors land directly on the course page, not
// through the backend's /affiliates/track/ redirect, so the course page
// itself is responsible for capturing `?ref=` into a 30-day cookie.
const COOKIE_NAME = "affiliate_ref";
const COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export function captureAffiliateRefFromUrl(search: string) {
  const ref = new URLSearchParams(search).get("ref");
  if (!ref) return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(ref.toUpperCase())}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
}

export function getAffiliateRefCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
