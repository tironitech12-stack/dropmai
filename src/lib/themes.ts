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
};

export type ThemeDefinition = {
  id: string;
  name: string;
  tagline: string;
  free: true;
  previewAccent: string;
};

export const THEME_META: ThemeDefinition[] = [
  {
    id: "vitrine",
    name: "Vitrine",
    tagline: "Hero amplo e grade de produtos — ideal para começar.",
    free: true,
    previewAccent: "#0f8a6b",
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Limpo e tipográfico — foco no catálogo.",
    free: true,
    previewAccent: "#1c1917",
  },
  {
    id: "catalogo",
    name: "Catálogo",
    tagline: "Visual denso para muitas SKUs e preço em evidência.",
    free: true,
    previewAccent: "#1d4ed8",
  },
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
