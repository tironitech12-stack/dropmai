const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_COOKIE = "dropmai_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  const email = normalizeEmail(value);
  return EMAIL_RE.test(email) && email.length <= 254;
}

/** Mirror backend session onto the frontend host for SSR cookie forwarding. */
export function mirrorSessionCookie(session?: string | null) {
  if (typeof document === "undefined") return;
  const value = (session ?? "").trim();
  if (!value || value === "demo") {
    // Do not invent a fake demo session anymore.
    return;
  }
  // Token is base64url + HMAC — cookie-safe without encoding.
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=${SESSION_MAX_AGE}; samesite=lax`;
}

export function clearMirroredSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function googleAuthUrl(returnTo?: string) {
  const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (!api) return "";
  const q = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
  return `${api}/api/v1/auth/google${q}`;
}

export function isSignedSessionToken(value: string | null | undefined) {
  return Boolean(value && value.startsWith("dm1."));
}
