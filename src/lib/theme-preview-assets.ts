/** Lifestyle photos already in /public — assigned per theme for thumbs + preview. */

const HEROES = [
  "/hero-1.jpg",
  "/hero-2.jpg",
  "/hero-3.jpg",
  "/hero-poster.jpg",
] as const;

const TILES = [
  "/tile-1.jpg",
  "/tile-2.jpg",
  "/tile-3.jpg",
  "/tile-4.jpg",
  "/tile-5.jpg",
  "/tile-6.jpg",
] as const;

/** Stable hash so each themeId gets a consistent photo set. */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function themeHeroImage(themeId: string): string {
  return HEROES[hashId(themeId) % HEROES.length];
}

export function themeTileImages(themeId: string, count = 4): string[] {
  const start = hashId(themeId) % TILES.length;
  return Array.from({ length: count }, (_, i) => TILES[(start + i) % TILES.length]);
}

export function themeProductImages(themeId: string, count = 6): string[] {
  return themeTileImages(themeId, count);
}
