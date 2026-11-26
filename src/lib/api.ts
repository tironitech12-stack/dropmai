import type { ThemeSettings } from "@/lib/themes";

function resolveApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  // Never bake localhost into production / Vercel builds
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:4000";
  }
  return "";
}

const API_URL = resolveApiUrl();

export function getApiUrl() {
  return API_URL;
}

export function isApiConfigured() {
  return Boolean(API_URL);
}

type FetchOptions = RequestInit & {
  json?: unknown;
  /** Extra Cookie header (server components forward session) */
  cookieHeader?: string;
};

/** Browser-only: read mirrored dropmai_session from the frontend host. */
function readMirroredSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)dropmai_session=([^;]*)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL não configurada. Defina a URL do Dropmai_Backend no Vercel.",
    );
  }

  const headers = new Headers(options.headers);
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.cookieHeader) {
    headers.set("cookie", options.cookieHeader);
  }

  // Cross-origin (Vercel → Render): browser won't send the mirrored frontend
  // cookie to the API host. Forward the signed dm1 token via X-Dropmai-User
  // (AuthGuard already accepts it) so client panel calls match SSR auth.
  if (
    typeof window !== "undefined" &&
    !headers.has("x-dropmai-user") &&
    !headers.has("authorization") &&
    !options.cookieHeader
  ) {
    const mirrored = readMirroredSessionToken();
    if (mirrored?.startsWith("dm1.")) {
      headers.set("x-dropmai-user", mirrored);
      headers.set("authorization", `Bearer ${mirrored}`);
    }
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
  logoUrl?: string | null;
  themeId?: string;
  themeSettings?: ThemeSettings;
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
