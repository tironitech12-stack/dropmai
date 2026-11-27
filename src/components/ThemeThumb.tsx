import type { CSSProperties } from "react";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import {
  nicheForTheme,
  themeHeroImage,
  themeTileImages,
} from "@/lib/theme-preview-assets";
import { thematicById, type ThemeLayout } from "@/lib/thematic-presets";

type Props = {
  themeId: string;
  name: string;
  accent: string;
  accent2?: string;
};

function layoutFor(themeId: string): ThemeLayout {
  const thematic = thematicById(themeId);
  if (thematic?.layout) return thematic.layout;
  if (themeId === "catalogo") return "retail";
  if (themeId === "minimal") return "concept";
  if (themeId === "boutique") return "editorial";
  if (themeId === "urbano") return "energy";
  if (themeId === "solar") return "soft";
  return "standard";
}

/** Stack cues so thumbs mirror blueprint structure (not just colors). */
function stackCues(themeId: string) {
  return {
    marquee: ["impeto", "trilha", "faisca", "impacto", "urbano", "oficina", "extra"].includes(
      themeId,
    ),
    collage: ["focal", "editorial", "prateleira", "oficina", "amplia", "seixo", "impecavel"].includes(
      themeId,
    ),
    dense: ["prateleira", "deposito", "oficina", "catalogo"].includes(themeId),
    lookbook: ["editorial", "impecavel", "boutique"].includes(themeId),
    video: ["trilha", "focal", "oficina", "impacto", "amplia"].includes(themeId),
    promo: ["prateleira", "impeto", "faisca", "extra"].includes(themeId),
    hideTiles: ["minimal", "monge", "conceito", "deposito"].includes(themeId),
    caps: themeId === "impeto",
    overlayCopy: ["impeto", "oficina", "impacto", "amplia", "faisca"].includes(themeId),
  };
}

/** Lifestyle mini-storefront using niche hero + product strips. */
export function ThemeThumb({ themeId, name }: Props) {
  const settings = buildDefaultSettingsClient(themeId, name);
  const layout = layoutFor(themeId);
  const niche = nicheForTheme(themeId);
  const cues = stackCues(themeId);
  const hero = settings.home.sections.find((s) => s.type === "hero");
  const heroTitle =
    typeof hero?.props.title === "string" ? String(hero.props.title) : name;
  const heroSub =
    typeof hero?.props.subtitle === "string" ? String(hero.props.subtitle) : "";
  const cta =
    typeof hero?.props.ctaLabel === "string"
      ? String(hero.props.ctaLabel)
      : "Ver produtos";
  const heroImg = themeHeroImage(themeId);
  const tiles = themeTileImages(themeId, cues.dense ? 4 : 3);

  return (
    <div
      className={`dm-thumb dm-thumb--photo dm-thumb--${layout}${cues.caps ? " dm-thumb--caps" : ""}${cues.lookbook ? " dm-thumb--lookbook" : ""}${cues.dense ? " dm-thumb--dense" : ""}`}
      data-niche={niche}
      data-theme={themeId}
      style={
        {
          "--thumb-primary": settings.colors.primary,
          "--thumb-secondary": settings.colors.secondary,
          "--thumb-bg": settings.colors.background,
          "--thumb-surface": settings.colors.surface,
          "--thumb-text": settings.colors.text,
          "--thumb-muted": settings.colors.muted,
          "--thumb-font-h": settings.typography.heading,
          "--thumb-font-b": settings.typography.body,
        } as CSSProperties
      }
      aria-hidden
    >
      {cues.promo ? <div className="dm-thumb-promo">FLASH</div> : null}
      {cues.marquee ? <div className="dm-thumb-announce">{niche}</div> : null}
      <header className="dm-thumb-header">
        <span className="dm-thumb-brand">{name}</span>
        <nav className="dm-thumb-nav">
          <i />
          <i />
          <i />
        </nav>
      </header>

      <section
        className={`dm-thumb-hero is-photo${cues.overlayCopy ? " is-overlay-copy" : ""}`}
        style={{
          backgroundImage: `linear-gradient(105deg, color-mix(in srgb, var(--thumb-secondary) 55%, transparent) 0%, rgba(0,0,0,0.2) 50%, transparent 100%), url(${heroImg})`,
        }}
      >
        <div className="dm-thumb-hero-copy">
          <strong className="dm-thumb-hero-title">{heroTitle}</strong>
          {heroSub ? <span className="dm-thumb-hero-sub">{heroSub}</span> : null}
          <span className="dm-thumb-cta">{cta}</span>
        </div>
      </section>

      {cues.video ? <div className="dm-thumb-video" /> : null}

      {!cues.hideTiles ? (
        <div className={`dm-thumb-tiles${cues.collage ? " is-collage" : ""}`}>
          {tiles.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} className="dm-thumb-tile-img" src={src} alt="" data-i={i} />
          ))}
        </div>
      ) : null}

      <div className="dm-thumb-featured">
        <div className={`dm-thumb-products${cues.dense ? " is-dense" : ""}`}>
          {tiles.map((src) => (
            <article key={`p-${src}`} className="dm-thumb-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dm-thumb-card-img" src={src} alt="" />
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
