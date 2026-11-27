import { thematicMetaList } from "@/lib/thematic-presets";

export type ThemeSectionType =
  | "announcement"
  | "hero"
  | "featured_products"
  | "footer";

export type ThemeSection = {
  id: string;
  type: ThemeSectionType;
  enabled: boolean;
  props: Record<string, string | number | boolean>;
};

export type ThemeSettings = {
  brand: {
    name: string;
    logoUrl: string | null;
    tagline: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  home: {
    sections: ThemeSection[];
  };
  /** Puck page JSON (sections/blocks). When present, storefront prefers it. */
  puck?: unknown;
};

export type ThemeDefinition = {
  id: string;
  name: string;
  tagline: string;
  free: true;
  previewAccent: string;
  previewAccent2?: string;
};

const BASE_THEME_META: ThemeDefinition[] = [
  {
    id: "vitrine",
    name: "Vitrine",
    tagline: "Hero amplo e vitrine de marca — ideal para loja própria.",
    free: true,
    previewAccent: "#0d9488",
    previewAccent2: "#134e4a",
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Limpo e tipográfico — pouco ruído, foco no produto.",
    free: true,
    previewAccent: "#292524",
    previewAccent2: "#a8a29e",
  },
  {
    id: "catalogo",
    name: "Catálogo",
    tagline: "Grade densa e preço em evidência — muitas SKUs / B2B.",
    free: true,
    previewAccent: "#2563eb",
    previewAccent2: "#1e3a8a",
  },
  {
    id: "boutique",
    name: "Boutique",
    tagline: "Sofisticado e editorial — moda, beleza e lifestyle.",
    free: true,
    previewAccent: "#9f1239",
    previewAccent2: "#fce7f3",
  },
  {
    id: "urbano",
    name: "Urbano",
    tagline: "Street e contraste alto — drop, sneaker e cultura jovem.",
    free: true,
    previewAccent: "#fb923c",
    previewAccent2: "#0a0a0a",
  },
  {
    id: "solar",
    name: "Solar",
    tagline: "Varejo alegre e solar — casa, kids e presentes.",
    free: true,
    previewAccent: "#ea580c",
    previewAccent2: "#fbbf24",
  },
];

export const THEME_META: ThemeDefinition[] = [
  ...BASE_THEME_META,
  ...thematicMetaList(),
];

export function themeMeta(themeId: string) {
  return THEME_META.find((t) => t.id === themeId) ?? THEME_META[0];
}

export function sectionByType(settings: ThemeSettings, type: ThemeSectionType) {
  return settings.home.sections.find((s) => s.type === type);
}

export function themeCssVars(
  settings: ThemeSettings,
): Record<string, string> {
  return {
    "--dm-primary": settings.colors.primary,
    "--dm-secondary": settings.colors.secondary,
    "--dm-bg": settings.colors.background,
    "--dm-surface": settings.colors.surface,
    "--dm-text": settings.colors.text,
    "--dm-muted": settings.colors.muted,
    "--dm-font-heading": settings.typography.heading,
    "--dm-font-body": settings.typography.body,
  };
}

export function isDenseTheme(themeId: string) {
  return (
    themeId === "catalogo" ||
    themeId === "prateleira" ||
    themeId === "deposito"
  );
}

export function isMinimalTheme(themeId: string) {
  return themeId === "minimal";
}
