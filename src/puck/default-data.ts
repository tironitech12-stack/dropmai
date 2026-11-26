import type { Data } from "@puckeditor/core";
import type { DropmaiPuckProps, DropmaiRootProps } from "@/puck/config";
import type { ThemeSettings } from "@/lib/themes";

export type DropmaiPuckData = Data<DropmaiPuckProps, DropmaiRootProps>;

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buildDefaultPuckData(
  storeName: string,
  themeId = "vitrine",
  settings?: ThemeSettings | null,
): DropmaiPuckData {
  const colors = settings?.colors;
  const brand = settings?.brand;
  const dense = themeId === "catalogo";
  const minimal = themeId === "minimal";

  return {
    root: {
      props: {
        primary: colors?.primary ?? (themeId === "catalogo" ? "#1d4ed8" : themeId === "minimal" ? "#1c1917" : "#0f8a6b"),
        secondary:
          colors?.secondary ??
          (themeId === "catalogo" ? "#1e3a8a" : themeId === "minimal" ? "#44403c" : "#0a5c49"),
        background:
          colors?.background ??
          (themeId === "catalogo" ? "#eef2ff" : themeId === "minimal" ? "#fafaf9" : "#f4f7f9"),
        surface: colors?.surface ?? "#ffffff",
        text: colors?.text ?? "#15202b",
        muted: colors?.muted ?? "#5b6b7c",
        headingFont:
          settings?.typography.heading ??
          (themeId === "vitrine"
            ? 'Georgia, "Times New Roman", serif'
            : "system-ui, -apple-system, Segoe UI, sans-serif"),
      },
    },
    content: [
      {
        type: "AnnouncementBar",
        props: {
          id: uid("ann"),
          text:
            (settings?.home.sections.find((s) => s.type === "announcement")
              ?.props.text as string) ||
            "Frete calculado no checkout · Estoque com o fornecedor",
        },
      },
      {
        type: "StoreHeader",
        props: {
          id: uid("hdr"),
          brandName: brand?.name || storeName,
          showNav: true,
        },
      },
      {
        type: "HeroSection",
        props: {
          id: uid("hero"),
          eyebrow: brand?.tagline || (minimal ? "" : "Loja Dropmai"),
          title: minimal
            ? "Catálogo"
            : dense
              ? "Pronto para pedir"
              : "Novidades da sua vitrine",
          subtitle: minimal
            ? "Seleção objetiva. Sem ruído."
            : "Produtos Xnamai publicados com o seu markup.",
          ctaLabel: "Ver produtos",
          ctaHref: "#produtos",
        },
      },
      {
        type: "FeaturedProducts",
        props: {
          id: uid("feat"),
          title: "Destaques",
          limit: 12,
          dense,
        },
      },
      {
        type: "StoreFooter",
        props: {
          id: uid("ftr"),
          text: "Loja powered by Dropmai",
        },
      },
    ],
  };
}

export function isPuckData(value: unknown): value is DropmaiPuckData {
  if (!value || typeof value !== "object") return false;
  const v = value as DropmaiPuckData;
  return Array.isArray(v.content) && typeof v.root === "object";
}
