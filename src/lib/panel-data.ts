import { cache } from "react";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

/**
 * Request-scoped memoization so layout + child pages share one /stores call
 * (and one /auth/me) within the same RSC render tree.
 */
export const getPanelMe = cache(async () =>
  apiFetchServer<{ user: { name?: string; email?: string } | null }>(
    "/api/v1/auth/me",
  ),
);

export const getPanelStores = cache(async () =>
  apiFetchServer<{ stores: StoreSummary[] }>("/api/v1/stores"),
);
