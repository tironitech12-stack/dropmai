import type { ProductRow } from "@/lib/api";
import {
  nicheProductTitles,
  themeProductImages,
} from "@/lib/theme-preview-assets";

/** Sample catalog for theme preview — niche titles + coherent images. */
export function sampleProductsForTheme(
  themeId: string,
  count = 8,
): ProductRow[] {
  const images = themeProductImages(themeId, count);
  const titles = nicheProductTitles(themeId);
  return Array.from({ length: count }, (_, i) => ({
    id: `preview-${themeId}-${i + 1}`,
    externalId: `demo-${i + 1}`,
    sku: `XN-${1000 + i}`,
    title: titles[i % titles.length],
    sellPrice: [79.9, 129.0, 49.9, 199.0, 89.9, 59.9, 39.9, 149.0][i % 8],
    stock: 12 + i,
    active: true,
    categoryName: "Xnamai",
    publishedOnSite: true,
    imageUrl: images[i % images.length],
  }));
}
