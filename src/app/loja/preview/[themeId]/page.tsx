import { StorefrontPuck } from "@/components/StorefrontPuck";
import { ThemePreviewChrome } from "@/components/ThemePreviewChrome";
import type { StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";
import { sampleProductsForTheme } from "@/lib/sample-products";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import { THEME_META, themeMeta } from "@/lib/themes";
import {
  buildDefaultPuckData,
  ensurePuckRootProps,
} from "@/puck/default-data";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ themeId: string }>;
  searchParams: Promise<{ storeId?: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return THEME_META.map((t) => ({ themeId: t.id }));
}

export default async function ThemePreviewPage({
  params,
  searchParams,
}: Props) {
  const { themeId } = await params;
  const query = await searchParams;
  const meta = THEME_META.find((t) => t.id === themeId);
  if (!meta) notFound();

  const theme = themeMeta(themeId);
  const storeName = `Prévia · ${theme.name}`;
  const settings = buildDefaultSettingsClient(themeId, storeName);
  const puckData = ensurePuckRootProps(
    buildDefaultPuckData(storeName, themeId, settings),
    themeId,
    settings,
  );
  const products = sampleProductsForTheme(themeId, 8);

  let storeId = query.storeId?.trim() || "";
  let active = false;
  if (!storeId) {
    try {
      const data = await apiFetchServer<{ stores: StoreSummary[] }>(
        "/api/v1/stores",
      );
      const primary = data.stores?.[0];
      if (primary) {
        storeId = primary.id;
        active = (primary.themeId || "vitrine") === themeId;
      }
    } catch {
      /* preview works without auth */
    }
  }

  return (
    <div className="dm-theme-preview-page">
      <StorefrontPuck
        storeName={storeName}
        storeSlug="preview"
        products={products}
        data={puckData}
      />
      <ThemePreviewChrome
        themeId={themeId}
        themeName={theme.name}
        storeId={storeId || undefined}
        active={active}
      />
    </div>
  );
}
