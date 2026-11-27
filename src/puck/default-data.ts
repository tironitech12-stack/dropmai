import type { Data } from "@puckeditor/core";
import type { DropmaiPuckProps, DropmaiRootProps } from "@/puck/config";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import type { ThemeSettings } from "@/lib/themes";
import { blueprintBlocks } from "@/puck/theme-blueprints";

export type DropmaiPuckData = Data<DropmaiPuckProps, DropmaiRootProps>;

export function buildDefaultPuckData(
  storeName: string,
  themeId = "vitrine",
  settings?: ThemeSettings | null,
): DropmaiPuckData {
  const fallback = buildDefaultSettingsClient(themeId, storeName);
  const colors = settings?.colors ?? fallback.colors;
  const typography = settings?.typography ?? fallback.typography;
  const content = blueprintBlocks(storeName, themeId, settings).map(
    (block) =>
      ({
        type: block.type,
        props: block.props,
      }) as DropmaiPuckData["content"][number],
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
