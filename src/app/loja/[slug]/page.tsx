import { StorefrontPuck } from "@/components/StorefrontPuck";
import { StorefrontTheme } from "@/components/StorefrontTheme";
import { getApiUrl, type ProductRow, type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import {
  buildDefaultPuckData,
  isPuckData,
  type DropmaiPuckData,
} from "@/puck/default-data";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ host?: string; path?: string }>;
};

export default async function StorefrontPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;

  if (slug === "_domain") {
    const host = query.host ?? "";
    let resolved: { store?: { slug?: string; name?: string } | null } = {};
    try {
      resolved = await apiFetchServer(
        `/api/v1/public/domains/lookup?host=${encodeURIComponent(host)}`,
      );
    } catch {
      resolved = {};
    }

    return (
      <main className="shell" style={{ padding: "3rem 0" }}>
        <h1 style={{ fontFamily: "var(--font-display)" }}>
          Domínio personalizado
        </h1>
        <p className="muted">
          Host <code>{host || "—"}</code>.{" "}
          {resolved.store
            ? `Resolvido para loja ${resolved.store.name ?? resolved.store.slug}.`
            : "Lookup stub — verifique DNS/CNAME e status VERIFIED no backend."}
        </p>
        <p className="muted">
          API: <code>{getApiUrl() || "(NEXT_PUBLIC_API_URL não definida)"}</code>
        </p>
      </main>
    );
  }

  let store: StoreSummary | null = null;
  let products: ProductRow[] = [];

  try {
    const data = await apiFetchServer<{
      store: StoreSummary;
      products: ProductRow[];
    }>(`/api/v1/public/stores/${slug}/products`);
    store = data.store;
    products = data.products ?? [];
  } catch {
    try {
      const only = await apiFetchServer<{ store: StoreSummary }>(
        `/api/v1/public/stores/${slug}`,
      );
      store = only.store;
    } catch {
      notFound();
    }
  }

  if (!store) notFound();

  if (!store.themeSettings) {
    try {
      const only = await apiFetchServer<{ store: StoreSummary }>(
        `/api/v1/public/stores/${slug}`,
      );
      store = { ...store, ...only.store };
    } catch {
      /* keep lean store */
    }
  }

  const themeId = store.themeId || "vitrine";
  const settings =
    store.themeSettings ??
    buildDefaultSettingsClient(themeId, store.name, store.logoUrl);

  const puckData: DropmaiPuckData = isPuckData(settings.puck)
    ? (settings.puck as DropmaiPuckData)
    : buildDefaultPuckData(store.name, themeId, settings);

  // Prefer Puck layout whenever we have structured page data.
  if (isPuckData(puckData)) {
    return (
      <StorefrontPuck
        storeName={store.name}
        storeSlug={store.slug}
        products={products}
        data={puckData}
      />
    );
  }

  return (
    <StorefrontTheme
      storeName={store.name}
      storeSlug={store.slug}
      themeId={themeId}
      settings={settings}
      products={products}
    />
  );
}
