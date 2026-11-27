import type { Data } from "@puckeditor/core";
import type { DropmaiPuckProps, DropmaiRootProps } from "@/puck/config";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import type { ThemeSettings } from "@/lib/themes";
import { isDenseTheme } from "@/lib/themes";

export type DropmaiPuckData = Data<DropmaiPuckProps, DropmaiRootProps>;

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buildDefaultPuckData(
  storeName: string,
  themeId = "vitrine",
  settings?: ThemeSettings | null,
): DropmaiPuckData {
  const fallback = buildDefaultSettingsClient(themeId, storeName);
  const colors = settings?.colors ?? fallback.colors;
  const brand = settings?.brand ?? fallback.brand;
  const typography = settings?.typography ?? fallback.typography;
  const hero = settings?.home.sections.find((s) => s.type === "hero");
  const announcement = settings?.home.sections.find(
    (s) => s.type === "announcement",
  );
  const featured = settings?.home.sections.find(
    (s) => s.type === "featured_products",
  );
  const footer = settings?.home.sections.find((s) => s.type === "footer");
  const dense = isDenseTheme(themeId);

  const content: DropmaiPuckData["content"] = [];

  if (announcement?.enabled !== false) {
    content.push({
      type: "AnnouncementBar",
      props: {
        id: uid("ann"),
        text: String(
          announcement?.props.text ||
            fallback.home.sections.find((s) => s.type === "announcement")
              ?.props.text ||
            "",
        ),
      },
    });
  }

  content.push(
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
        eyebrow: brand?.tagline || "",
        title: String(
          hero?.props.title ||
            fallback.home.sections.find((s) => s.type === "hero")?.props
              .title ||
            storeName,
        ),
        subtitle: String(
          hero?.props.subtitle ||
            fallback.home.sections.find((s) => s.type === "hero")?.props
              .subtitle ||
            "",
        ),
        ctaLabel: String(hero?.props.ctaLabel || "Ver produtos"),
        ctaHref: String(hero?.props.ctaHref || "#produtos"),
      },
    },
    {
      type: "FeaturedProducts",
      props: {
        id: uid("feat"),
        title: String(featured?.props.title || "Destaques"),
        limit: Number(featured?.props.limit ?? 12) || 12,
        dense,
      },
    },
    {
      type: "StoreFooter",
      props: {
        id: uid("ftr"),
        text: String(
          footer?.props.text ||
            fallback.home.sections.find((s) => s.type === "footer")?.props
              .text ||
            "Loja powered by Dropmai",
        ),
      },
    },
  );

  return {
    root: {
      props: {
        themeId,
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        surface: colors.surface,
        text: colors.text,
        muted: colors.muted,
        headingFont: typography.heading,
        bodyFont: typography.body,
      },
    },
    content,
  };
}

export function isPuckData(value: unknown): value is DropmaiPuckData {
  if (!value || typeof value !== "object") return false;
  const v = value as DropmaiPuckData;
  return Array.isArray(v.content) && typeof v.root === "object";
}

/** Fill required root props for older saved Puck JSON / partial data. */
export function ensurePuckRootProps(
  data: DropmaiPuckData,
  themeId: string,
  settings?: ThemeSettings | null,
): DropmaiPuckData {
  const fallback = buildDefaultPuckData(
    settings?.brand.name || "Loja",
    themeId,
    settings,
  ).root.props!;
  const prev = data.root?.props;
  return {
    ...data,
    root: {
      ...data.root,
      props: {
        ...fallback,
        ...prev,
        themeId: prev?.themeId || themeId || fallback.themeId,
        bodyFont:
          prev?.bodyFont ||
          settings?.typography.body ||
          fallback.bodyFont,
      },
    },
  };
}
