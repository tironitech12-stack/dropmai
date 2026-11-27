import type { CSSProperties } from "react";
import { thematicById, type ThemeLayout } from "@/lib/thematic-presets";

type Props = {
  themeId: string;
  name: string;
  accent: string;
  accent2?: string;
};

function layoutFor(themeId: string): ThemeLayout {
  return thematicById(themeId)?.layout ?? "standard";
}

/** Mini wireframe of the storefront home — not a flat gradient. */
export function ThemeThumb({ themeId, name, accent, accent2 }: Props) {
  const layout = layoutFor(themeId);
  const a2 = accent2 || accent;

  return (
    <div
      className={`dm-thumb dm-thumb--${layout}`}
      style={
        {
          "--thumb-a": accent,
          "--thumb-b": a2,
        } as CSSProperties
      }
      aria-hidden
    >
      <div className="dm-thumb-announce" />
      <div className="dm-thumb-chrome">
        <span className="dm-thumb-logo" />
        <span className="dm-thumb-nav" />
      </div>
      <div className="dm-thumb-hero">
        <span className="dm-thumb-hero-title">{name}</span>
        <span className="dm-thumb-hero-cta" />
      </div>
      {layout === "editorial" || layout === "soft" ? (
        <div className="dm-thumb-iwt">
          <span className="dm-thumb-iwt-media" />
          <span className="dm-thumb-iwt-copy" />
        </div>
      ) : null}
      {layout === "multi" || layout === "gift" || layout === "editorial" ? (
        <div className="dm-thumb-tiles">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}
      <div
        className={`dm-thumb-grid${
          layout === "retail" || themeId === "deposito" || themeId === "prateleira"
            ? " is-dense"
            : ""
        }`}
      >
        <span />
        <span />
        <span />
        <span />
        {(layout === "retail" || layout === "cinema") && (
          <>
            <span />
            <span />
          </>
        )}
      </div>
      {layout === "editorial" ? <div className="dm-thumb-stl" /> : null}
    </div>
  );
}
