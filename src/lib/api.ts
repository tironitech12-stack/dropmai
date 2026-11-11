const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

export function getApiUrl() {
  return API_URL;
}

type FetchOptions = RequestInit & {
  json?: unknown;
  /** Extra Cookie header (server components forward session) */
  cookieHeader?: string;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.cookieHeader) {
    headers.set("cookie", options.cookieHeader);
    headers.set("x-dropmai-user", "demo");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    body:
      options.json !== undefined ? JSON.stringify(options.json) : options.body,
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    error?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }
  return data;
}

export type StoreSummary = {
  id: string;
  slug: string;
  name: string;
  status: string;
  description?: string | null;
  createdAt: string;
};

export type ProductRow = {
  id: string;
  externalId?: string;
  sku?: string | null;
  title: string;
  costPrice?: number;
  sellPrice: number;
  stock: number;
  active?: boolean;
  categoryName?: string | null;
  publishedOnSite?: boolean;
};
