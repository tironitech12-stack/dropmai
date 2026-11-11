export const ROOT_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "dropmai.com.br",
  "www.dropmai.com.br",
]);

export function extractSubdomainSlug(hostHeader: string | null): string | null {
  if (!hostHeader) return null;
  const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";
  if (!host || ROOT_HOSTS.has(host)) return null;

  if (host.endsWith(".localhost")) {
    const slug = host.replace(/\.localhost$/, "");
    return slug && !slug.includes(".") ? slug : null;
  }

  if (host.endsWith(".dropmai.com.br")) {
    const slug = host.replace(/\.dropmai.com.br$/, "");
    return slug && !slug.includes(".") ? slug : null;
  }

  return null;
}

export function isLikelyCustomDomain(hostHeader: string | null): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";
  if (!host || ROOT_HOSTS.has(host)) return false;
  if (host.endsWith(".localhost") || host.endsWith(".dropmai.com.br")) return false;
  return host.includes(".");
}
