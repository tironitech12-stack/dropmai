import type { ThemeSettings } from "@/lib/themes";

/** Client/SSR fallback when API omits themeSettings (legacy store). */
export function buildDefaultSettingsClient(
  themeId: string,
  storeName: string,
  logoUrl?: string | null,
): ThemeSettings {
  const presets: Record<string, ThemeSettings["colors"]> = {
    vitrine: {
      primary: "#0f8a6b",
      secondary: "#0a5c49",
      background: "#f4f7f9",
      surface: "#ffffff",
      text: "#15202b",
      muted: "#5b6b7c",
    },
    minimal: {
      primary: "#1c1917",
      secondary: "#44403c",
      background: "#fafaf9",
      surface: "#ffffff",
      text: "#1c1917",
      muted: "#78716c",
    },
    catalogo: {
      primary: "#1d4ed8",
      secondary: "#1e3a8a",
      background: "#eef2ff",
      surface: "#ffffff",
      text: "#0f172a",
      muted: "#64748b",
    },
  };

  const colors = presets[themeId] ?? presets.vitrine;

  return {
    brand: {
      name: storeName,
      logoUrl: logoUrl ?? null,
      tagline: themeId === "minimal" ? "" : "Loja Dropmai",
    },
    colors,
    typography: {
      heading:
        themeId === "vitrine"
          ? 'Georgia, "Times New Roman", serif'
          : "system-ui, -apple-system, Segoe UI, sans-serif",
      body: "system-ui, -apple-system, Segoe UI, sans-serif",
    },
    home: {
      sections: [
        {
          id: "announcement",
          type: "announcement",
          enabled: true,
          props: {
            text: "Frete calculado no checkout · Estoque com o fornecedor",
          },
        },
        {
          id: "hero",
          type: "hero",
          enabled: true,
          props: {
            title:
              themeId === "minimal"
                ? "Catálogo"
                : themeId === "catalogo"
                  ? "Pronto para pedir"
                  : "Novidades da sua vitrine",
            subtitle:
              themeId === "minimal"
                ? "Seleção objetiva. Sem ruído."
                : "Produtos Xnamai publicados com o seu markup.",
            ctaLabel: "Ver produtos",
            ctaHref: "#produtos",
            imageUrl: "",
          },
        },
        {
          id: "featured_products",
          type: "featured_products",
          enabled: true,
          props: { title: "Destaques", limit: 12 },
        },
        {
          id: "footer",
          type: "footer",
          enabled: true,
          props: { text: "Loja powered by Dropmai" },
        },
      ],
    },
  };
}
