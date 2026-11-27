import type { CSSProperties } from "react";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import { thematicById, type ThemeLayout } from "@/lib/thematic-presets";

type Props = {
  themeId: string;
  name: string;
  accent: string;
  accent2?: string;
};

type ThumbSpec = {
  layout: ThemeLayout;
  dense: boolean;
  overlay: boolean;
  announce: string | null;
  heroTitle: string;
  heroSubtitle: string;
  cta: string;
  featured: string;
  tiles: string[];
  fontHeading: string;
  fontBody: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
};

function specFor(themeId: string, name: string): ThumbSpec {
  const settings = buildDefaultSettingsClient(themeId, name);
  const thematic = thematicById(themeId);
  const hero = settings.home.sections.find((s) => s.type === "hero");
  const ann = settings.home.sections.find((s) => s.type === "announcement");
  const feat = settings.home.sections.find((s) => s.type === "featured_products");
  const announceEnabled = ann?.enabled !== false;
  const tiles = (thematic?.tiles ?? "Novidades|Destaques|Ofertas|Mais")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);

  return {
    layout: thematic?.layout ?? (themeId === "catalogo" ? "retail" : themeId === "minimal" ? "concept" : themeId === "boutique" ? "editorial" : themeId === "urbano" ? "energy" : themeId === "solar" ? "soft" : "standard"),
    dense: Boolean(thematic?.dense || themeId === "catalogo" || themeId === "deposito" || themeId === "prateleira"),
    overlay: Boolean(thematic?.overlayHero || themeId === "urbano" || themeId === "amplia"),
    announce:
      announceEnabled && typeof ann?.props.text === "string"
        ? String(ann.props.text)
        : null,
    heroTitle:
      typeof hero?.props.title === "string"
        ? String(hero.props.title)
        : name,
    heroSubtitle:
      typeof hero?.props.subtitle === "string"
        ? String(hero.props.subtitle)
        : "",
    cta:
      typeof hero?.props.ctaLabel === "string"
        ? String(hero.props.ctaLabel)
        : "Ver produtos",
    featured:
      typeof feat?.props.title === "string"
        ? String(feat.props.title)
        : "Destaques",
    tiles,
    fontHeading: settings.typography.heading,
    fontBody: settings.typography.body,
    colors: settings.colors,
  };
}

const PRODUCT_LABELS = ["01", "02", "03", "04", "05", "06"];

/** Mini storefront preview — real theme colors, type, hero copy, product cards. */
export function ThemeThumb({ themeId, name }: Props) {
  const spec = specFor(themeId, name);
  const cardCount = spec.dense ? 6 : spec.layout === "cinema" || spec.layout === "retail" ? 4 : 3;
  const showTiles =
    spec.layout === "multi" ||
    spec.layout === "gift" ||
    spec.layout === "editorial" ||
    themeId === "solar" ||
    themeId === "vitrine";
  const showIwt =
    spec.layout === "editorial" ||
    spec.layout === "soft" ||
    themeId === "boutique" ||
    themeId === "minimal";

  return (
    <div
      className={`dm-thumb dm-thumb--${spec.layout}${spec.overlay ? " is-overlay" : ""}${spec.dense ? " is-dense" : ""}`}
      style={
        {
          "--thumb-primary": spec.colors.primary,
          "--thumb-secondary": spec.colors.secondary,
          "--thumb-bg": spec.colors.background,
          "--thumb-surface": spec.colors.surface,
          "--thumb-text": spec.colors.text,
          "--thumb-muted": spec.colors.muted,
          "--thumb-font-h": spec.fontHeading,
          "--thumb-font-b": spec.fontBody,
        } as CSSProperties
      }
      aria-hidden
    >
      {spec.announce ? (
        <div className="dm-thumb-announce">{spec.announce}</div>
      ) : null}

      <header className="dm-thumb-header">
        <span className="dm-thumb-brand">{name}</span>
        <nav className="dm-thumb-nav">
          <i />
          <i />
          <i />
        </nav>
      </header>

      <section className="dm-thumb-hero">
        <div className="dm-thumb-hero-copy">
          <strong className="dm-thumb-hero-title">{spec.heroTitle}</strong>
          {spec.heroSubtitle ? (
            <span className="dm-thumb-hero-sub">{spec.heroSubtitle}</span>
          ) : null}
          <span className="dm-thumb-cta">{spec.cta}</span>
        </div>
        {!spec.overlay ? <div className="dm-thumb-hero-media" /> : null}
      </section>

      {showIwt ? (
        <div className="dm-thumb-iwt">
          <div className="dm-thumb-iwt-media" />
          <div className="dm-thumb-iwt-copy">
            <b />
            <i />
            <i />
          </div>
        </div>
      ) : null}

      {showTiles ? (
        <div className="dm-thumb-tiles">
          {spec.tiles.map((label) => (
            <span key={label} className="dm-thumb-tile">
              {label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="dm-thumb-featured">
        <span className="dm-thumb-featured-label">{spec.featured}</span>
        <div className={`dm-thumb-products${spec.dense ? " is-dense" : ""}`}>
          {PRODUCT_LABELS.slice(0, cardCount).map((label, i) => (
            <article key={label} className="dm-thumb-card">
              <div
                className="dm-thumb-card-img"
                style={{
                  background: `linear-gradient(145deg, color-mix(in srgb, var(--thumb-primary) ${28 + i * 8}%, var(--thumb-surface)), color-mix(in srgb, var(--thumb-secondary) ${20 + i * 6}%, #888))`,
                }}
              />
              <div className="dm-thumb-card-meta">
                <b />
                <i />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
