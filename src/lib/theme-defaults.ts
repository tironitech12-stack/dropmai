import type { ThemeSettings } from "@/lib/themes";

type ThemePreset = {
  colors: ThemeSettings["colors"];
  typography: ThemeSettings["typography"];
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  announcementEnabled?: boolean;
  featuredTitle?: string;
  featuredLimit?: number;
  ctaLabel?: string;
  footerText?: string;
};

const PRESETS: Record<string, ThemePreset> = {
  vitrine: {
    colors: {
      primary: "#0d9488",
      secondary: "#134e4a",
      background: "#f0f7f6",
      surface: "#ffffff",
      text: "#134e4a",
      muted: "#5b7c78",
    },
    typography: {
      heading: 'Georgia, "Times New Roman", serif',
      body: "system-ui, -apple-system, Segoe UI, sans-serif",
    },
    tagline: "Loja própria",
    heroTitle: "Novidades da sua vitrine",
    heroSubtitle:
      "Publique do catálogo Xnamai e venda no seu domínio com a sua marca.",
    announcement: "Novidades toda semana · Frete no checkout",
    ctaLabel: "Explorar vitrine",
  },
  minimal: {
    colors: {
      primary: "#292524",
      secondary: "#57534e",
      background: "#fafaf9",
      surface: "#ffffff",
      text: "#1c1917",
      muted: "#78716c",
    },
    typography: {
      heading: "system-ui, -apple-system, Segoe UI, sans-serif",
      body: "system-ui, -apple-system, Segoe UI, sans-serif",
    },
    tagline: "",
    heroTitle: "Seleção",
    heroSubtitle: "Objetiva. Sem ruído. Só o essencial.",
    announcement: "Envio sob demanda",
    announcementEnabled: false,
    featuredTitle: "Catálogo",
    ctaLabel: "Ver tudo",
  },
  catalogo: {
    colors: {
      primary: "#2563eb",
      secondary: "#1e3a8a",
      background: "#eef2ff",
      surface: "#ffffff",
      text: "#0f172a",
      muted: "#64748b",
    },
    typography: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    tagline: "Atacado e varejo",
    heroTitle: "Pronto para pedir",
    heroSubtitle:
      "Lista compacta com preço da sua loja sobre o custo do fornecedor.",
    announcement: "Estoque atualizado com o fornecedor",
    featuredTitle: "Lista de produtos",
    featuredLimit: 24,
    ctaLabel: "Ver catálogo",
  },
  boutique: {
    colors: {
      primary: "#9f1239",
      secondary: "#881337",
      background: "#fff5f8",
      surface: "#ffffff",
      text: "#4c0519",
      muted: "#9f6b7c",
    },
    typography: {
      heading: '"Palatino Linotype", Palatino, Georgia, serif',
      body: 'Georgia, "Times New Roman", serif',
    },
    tagline: "Coleção da temporada",
    heroTitle: "Peças com presença",
    heroSubtitle: "Curadoria visual para marcas que querem parecer boutique.",
    announcement: "Edição limitada · Envio cuidadoso",
    featuredTitle: "Em destaque",
    featuredLimit: 8,
    ctaLabel: "Ver coleção",
    footerText: "Boutique powered by Dropmai",
  },
  urbano: {
    colors: {
      primary: "#fb923c",
      secondary: "#ea580c",
      background: "#0a0a0a",
      surface: "#171717",
      text: "#fafafa",
      muted: "#a3a3a3",
    },
    typography: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    tagline: "Drop semanal",
    heroTitle: "Novo drop",
    heroSubtitle: "Peças com atitude. Markup seu. Estoque no fornecedor.",
    announcement: "Restock alert · Frete no checkout",
    featuredTitle: "No radar",
    ctaLabel: "Shop now",
    footerText: "Urbano · Dropmai",
  },
  solar: {
    colors: {
      primary: "#ea580c",
      secondary: "#c2410c",
      background: "#fff7ed",
      surface: "#ffffff",
      text: "#7c2d12",
      muted: "#b45309",
    },
    typography: {
      heading: '"Trebuchet MS", "Segoe UI", sans-serif',
      body: "system-ui, -apple-system, Segoe UI, sans-serif",
    },
    tagline: "Feito para o dia a dia",
    heroTitle: "Achados com sol",
    heroSubtitle:
      "Vitrine quente e amigável para quem vende volume no varejo.",
    announcement: "Ofertas da semana · Entrega sob demanda",
    featuredTitle: "Mais pedidos",
    ctaLabel: "Ver ofertas",
    footerText: "Solar · Dropmai",
  },
  impeto: {
    colors: {
      primary: "#111111",
      secondary: "#404040",
      background: "#fafafa",
      surface: "#ffffff",
      text: "#0a0a0a",
      muted: "#737373",
    },
    typography: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    tagline: "ESSÊNCIA",
    heroTitle: "PELE VIVA,",
    heroSubtitle: "Curadoria bold para beleza e lifestyle com presença.",
    announcement: "Leve 3 e ganhe 20% · Shop now",
    featuredTitle: "Em cena",
    featuredLimit: 8,
    ctaLabel: "Explorar",
    footerText: "Ímpeto · Dropmai",
  },
  trilha: {
    colors: {
      primary: "#171717",
      secondary: "#dc2626",
      background: "#f5f5f5",
      surface: "#ffffff",
      text: "#0a0a0a",
      muted: "#525252",
    },
    typography: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "system-ui, -apple-system, Segoe UI, sans-serif",
    },
    tagline: "Performance",
    heroTitle: "Pronto pra trilha",
    heroSubtitle:
      "Layout de outdoor: cards arredondados e foco na foto do produto.",
    announcement: "Frete sob demanda · Peças em movimento",
    featuredTitle: "Bikes & gear",
    featuredLimit: 8,
    ctaLabel: "Ver coleção",
    footerText: "Trilha · Dropmai",
  },
  prateleira: {
    colors: {
      primary: "#ea580c",
      secondary: "#0f172a",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      muted: "#64748b",
    },
    typography: {
      heading: "ui-sans-serif, system-ui, sans-serif",
      body: "ui-sans-serif, system-ui, sans-serif",
    },
    tagline: "Milhares de SKUs",
    heroTitle: "Top specs. Preço justo.",
    heroSubtitle:
      "Varejo de catálogo grande: benefícios, cupom e grade densa.",
    announcement: "Frete sob demanda · Ajuda na compra · Aberto 7 dias",
    featuredTitle: "Mais vendidos",
    featuredLimit: 24,
    ctaLabel: "Ver catálogo",
    footerText: "Prateleira · Dropmai",
  },
};

/** Client/SSR fallback when API omits themeSettings (legacy store). */
export function buildDefaultSettingsClient(
  themeId: string,
  storeName: string,
  logoUrl?: string | null,
): ThemeSettings {
  const preset = PRESETS[themeId] ?? PRESETS.vitrine;

  return {
    brand: {
      name: storeName,
      logoUrl: logoUrl ?? null,
      tagline: preset.tagline,
    },
    colors: preset.colors,
    typography: preset.typography,
    home: {
      sections: [
        {
          id: "announcement",
          type: "announcement",
          enabled: preset.announcementEnabled ?? true,
          props: { text: preset.announcement },
        },
        {
          id: "hero",
          type: "hero",
          enabled: true,
          props: {
            title: preset.heroTitle,
            subtitle: preset.heroSubtitle,
            ctaLabel: preset.ctaLabel ?? "Ver produtos",
            ctaHref: "#produtos",
            imageUrl: "",
          },
        },
        {
          id: "featured_products",
          type: "featured_products",
          enabled: true,
          props: {
            title: preset.featuredTitle ?? "Destaques",
            limit: preset.featuredLimit ?? 12,
          },
        },
        {
          id: "footer",
          type: "footer",
          enabled: true,
          props: {
            text: preset.footerText ?? "Loja powered by Dropmai",
          },
        },
      ],
    },
  };
}
