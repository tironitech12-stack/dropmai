const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  const email = normalizeEmail(value);
  return EMAIL_RE.test(email) && email.length <= 254;
}

export function mirrorSessionCookie() {
  document.cookie =
    "dropmai_session=demo; path=/; max-age=1209600; samesite=lax";
}

export function googleAuthUrl(returnTo?: string) {
  const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (!api) return "";
  const q = returnTo
    ? `?returnTo=${encodeURIComponent(returnTo)}`
    : "";
  return `${api}/api/v1/auth/google${q}`;
}
