/** Apex / platform hosts that must show marketing + seller UI (not storefront). */
const EXACT_PLATFORM_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "dropmai.com.br",
  "www.dropmai.com.br",
  "dropmai.vercel.app",
]);

/** Deploy/preview suffixes that are always the marketing app, never a custom domain. */
const PLATFORM_SUFFIXES = [".vercel.app"] as const;

export const ROOT_HOSTS = EXACT_PLATFORM_HOSTS;

export function normalizeHost(hostHeader: string | null): string {
  if (!hostHeader) return "";
  return hostHeader.split(":")[0]?.toLowerCase().trim() ?? "";
}

/** Marketing / app shell host — never rewrite to storefront or domain stub. */
export function isPlatformHost(hostHeader: string | null): boolean {
  const host = normalizeHost(hostHeader);
  if (!host) return true;
  if (EXACT_PLATFORM_HOSTS.has(host)) return true;
  // dropmai-xxx.vercel.app, dropmai.vercel.app, etc.
  for (const suffix of PLATFORM_SUFFIXES) {
    if (host === suffix.slice(1) || host.endsWith(suffix)) return true;
  }
  return false;
}

/**
 * Store slug from known Dropmai subdomain patterns only.
 * e.g. minhaloja.dropmai.com.br → minhaloja
 *      minhaloja.localhost → minhaloja
 */
export function extractSubdomainSlug(hostHeader: string | null): string | null {
  const host = normalizeHost(hostHeader);
  if (!host || isPlatformHost(hostHeader)) return null;

  if (host.endsWith(".localhost")) {
    const slug = host.replace(/\.localhost$/, "");
    return slug && !slug.includes(".") ? slug : null;
  }

  if (host.endsWith(".dropmai.com.br")) {
    const slug = host.replace(/\.dropmai.com.br$/, "");
    // www already handled as platform; reject nested junk
    if (!slug || slug.includes(".") || slug === "www") return null;
    return slug;
  }

  return null;
}

/**
 * True only for hosts that look like a merchant custom domain
 * (not platform, not Dropmai store subdomain).
 */
export function isLikelyCustomDomain(hostHeader: string | null): boolean {
  const host = normalizeHost(hostHeader);
  if (!host || isPlatformHost(hostHeader)) return false;
  if (host.endsWith(".localhost") || host.endsWith(".dropmai.com.br")) {
    return false;
  }
  // Require a real domain shape (foo.bar), not bare words
  return host.includes(".") && !host.endsWith(".");
}
