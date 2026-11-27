import type { ProductRow } from "@/lib/api";
import { themeProductImages } from "@/lib/theme-preview-assets";

const TITLES = [
  "Aparador Premium",
  "Massageador Compacto",
  "Lanterna LED Pro",
  "Kit Escova Facial",
  "Relógio Esportivo",
  "Fone Bluetooth",
  "Garrafa Térmica",
  "Mochila Urbana",
];

/** Sample catalog for theme preview — no API / no save. */
export function sampleProductsForTheme(themeId: string, count = 8): ProductRow[] {
  const images = themeProductImages(themeId, count);
  return Array.from({ length: count }, (_, i) => ({
    id: `preview-${themeId}-${i + 1}`,
    externalId: `demo-${i + 1}`,
    sku: `DM-${1000 + i}`,
    title: TITLES[i % TITLES.length],
    sellPrice: [79.9, 129.0, 49.9, 199.0, 89.9, 59.9, 39.9, 149.0][i % 8],
    stock: 12 + i,
    active: true,
    categoryName: "Xnamai demo",
    publishedOnSite: true,
    imageUrl: images[i % images.length],
  }));
}
