"use client";

import { useStorefrontRuntime } from "@/puck/storefront-context";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AnnouncementBar({ text }: { text: string }) {
  return <div className="dm-announce">{text}</div>;
}

export function PromoBar({
  text,
  code,
}: {
  text: string;
  code: string;
}) {
  return (
    <div className="dm-promo-bar">
      <span>{text}</span>
      {code ? <code className="dm-promo-code">{code}</code> : null}
    </div>
  );
}

export function BenefitStrip({
  items,
}: {
  items: string;
}) {
  const list = String(items || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  if (!list.length) return null;
  return (
    <ul className="dm-benefit-strip" aria-label="Benefícios">
      {list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function StoreHeader({
  brandName,
  showNav,
}: {
  brandName: string;
  showNav: boolean;
}) {
  const { storeSlug, storeName } = useStorefrontRuntime();
  const name = brandName?.trim() || storeName;
  return (
    <header className="dm-header">
      <div className="dm-header-inner">
        <a href={`/loja/${storeSlug}`} className="dm-brand">
          <span className="dm-brand-name">{name}</span>
        </a>
        {showNav ? (
          <nav className="dm-nav" aria-label="Principal">
            <a href="#produtos">Produtos</a>
            <a href="#contato">Contato</a>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  overlay,
  imageUrl,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  overlay?: boolean;
  imageUrl?: string;
}) {
  const photo = Boolean(imageUrl?.trim());
  return (
    <section
      className={`dm-hero${overlay || photo ? " is-overlay" : ""}${photo ? " is-photo" : ""}`}
      style={
        photo
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.55)), url(${imageUrl})`,
            }
          : undefined
      }
    >
      <div className="dm-hero-copy">
        {eyebrow ? <p className="dm-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
        {ctaLabel ? (
          <a className="dm-cta" href={ctaHref || "#produtos"}>
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export function FeaturedProducts({
  title,
  limit,
  dense,
}: {
  title: string;
  limit: number;
  dense: boolean;
}) {
  const { products } = useStorefrontRuntime();
  const max = Math.max(1, Number(limit) || 12);
  const demo =
    products.length > 0
      ? products.slice(0, max)
      : Array.from({ length: Math.min(max, 3) }).map((_, i) => ({
          id: `demo-${i}`,
          title: `Produto exemplo ${i + 1}`,
          sku: `SKU-00${i + 1}`,
          sellPrice: 49.9,
          stock: 10,
          imageUrl: `/tile-${(i % 6) + 1}.jpg`,
        }));

  return (
    <section id="produtos" className="dm-products">
      <div className="dm-products-head">
        <h2>{title || "Destaques"}</h2>
        <p>
          {products.length
            ? `${Math.min(products.length, max)} item(ns) na vitrine`
            : "Prévia com produtos de exemplo"}
        </p>
      </div>
      <div className={`dm-grid${dense ? " is-dense" : ""}`}>
        {demo.map((p) => {
          const img =
            "imageUrl" in p && typeof p.imageUrl === "string" && p.imageUrl
              ? p.imageUrl
              : null;
          return (
            <article key={p.id} className="dm-card">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="dm-card-img" src={img} alt="" />
              ) : (
                <div className="dm-card-img is-placeholder" aria-hidden />
              )}
              <div className="dm-card-body">
                <strong>{p.title}</strong>
                <span className="dm-sku">{"sku" in p ? p.sku : p.id}</span>
              </div>
              <div className="dm-card-meta">
                <span className="dm-price">{formatBRL(p.sellPrice)}</span>
                <span className="dm-stock">
                  {p.stock > 0 ? "Em estoque" : "Sob consulta"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function StoreFooter({ text }: { text: string }) {
  const { storeName, storeSlug } = useStorefrontRuntime();
  return (
    <footer id="contato" className="dm-footer">
      <strong>{storeName}</strong>
      <p>{text || "Loja powered by Dropmai"}</p>
      <p className="dm-footer-url">{storeSlug}.dropmai.com.br</p>
    </footer>
  );
}

export function MegaHeader({
  brandName,
  links,
  showSearch,
}: {
  brandName: string;
  links: string;
  showSearch: boolean;
}) {
  const { storeSlug, storeName } = useStorefrontRuntime();
  const name = brandName?.trim() || storeName;
  const nav = String(links || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
  return (
    <header className="dm-header dm-mega-header">
      <div className="dm-header-inner">
        <nav className="dm-nav dm-mega-nav" aria-label="Departamentos">
          {nav.map((label) => (
            <a key={label} href="#produtos">
              {label}
            </a>
          ))}
        </nav>
        <a href={`/loja/${storeSlug}`} className="dm-brand">
          <span className="dm-brand-name">{name}</span>
        </a>
        {showSearch ? (
          <div className="dm-mega-search" aria-hidden>
            <span>Buscar produtos…</span>
          </div>
        ) : (
          <span className="dm-mega-spacer" />
        )}
      </div>
    </header>
  );
}

export function MarqueeStrip({ text }: { text: string }) {
  const chunk = text?.trim() || "Dropmai · Xnamai";
  const line = Array.from({ length: 8 }, () => chunk).join(" · ");
  return (
    <div className="dm-marquee" aria-hidden>
      <div className="dm-marquee-track">{line}</div>
    </div>
  );
}

export function PromoTiles({
  leftTitle,
  leftBody,
  rightTitle,
  rightBody,
  leftImage,
  rightImage,
}: {
  leftTitle: string;
  leftBody: string;
  rightTitle: string;
  rightBody: string;
  leftImage?: string;
  rightImage?: string;
}) {
  return (
    <section className="dm-promo-tiles">
      {[
        { title: leftTitle, body: leftBody, image: leftImage },
        { title: rightTitle, body: rightBody, image: rightImage },
      ].map((tile) => (
        <a
          key={tile.title}
          href="#produtos"
          className="dm-promo-tile"
          style={
            tile.image
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55)), url(${tile.image})`,
                }
              : undefined
          }
        >
          <strong>{tile.title}</strong>
          {tile.body ? <span>{tile.body}</span> : null}
        </a>
      ))}
    </section>
  );
}

export function TrustRow({ items }: { items: string }) {
  const list = String(items || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  if (!list.length) return null;
  return (
    <ul className="dm-trust-row" aria-label="Confiança">
      {list.map((item) => (
        <li key={item}>
          <strong>{item.split(":")[0]?.trim() || item}</strong>
          {item.includes(":") ? (
            <span>{item.split(":").slice(1).join(":").trim()}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function FaqSection({
  title,
  items,
}: {
  title: string;
  items: string;
}) {
  const list = String(items || "")
    .split("||")
    .map((pair) => {
      const [q, a] = pair.split("|").map((s) => s.trim());
      return q ? { q, a: a || "" } : null;
    })
    .filter(Boolean) as Array<{ q: string; a: string }>;
  if (!list.length) return null;
  return (
    <section className="dm-faq">
      <h2>{title || "Perguntas frequentes"}</h2>
      <div className="dm-faq-list">
        {list.map((item) => (
          <details key={item.q} className="dm-faq-item">
            <summary>{item.q}</summary>
            {item.a ? <p>{item.a}</p> : null}
          </details>
        ))}
      </div>
    </section>
  );
}

export function Testimonials({
  title,
  quotes,
}: {
  title: string;
  quotes: string;
}) {
  const list = String(quotes || "")
    .split("||")
    .map((pair) => {
      const [quote, author] = pair.split("|").map((s) => s.trim());
      return quote ? { quote, author: author || "Cliente" } : null;
    })
    .filter(Boolean) as Array<{ quote: string; author: string }>;
  if (!list.length) return null;
  return (
    <section className="dm-testimonials">
      <h2>{title || "Quem comprou"}</h2>
      <div className="dm-testimonials-grid">
        {list.map((item) => (
          <blockquote key={item.quote} className="dm-testimonial">
            <p>“{item.quote}”</p>
            <cite>{item.author}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export function FeaturedRow({
  title,
  limit,
}: {
  title: string;
  limit: number;
}) {
  return (
    <div className="dm-featured-row">
      <FeaturedProducts title={title} limit={limit || 4} dense={false} />
    </div>
  );
}

export function RichText({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="dm-products" style={{ paddingTop: 0 }}>
      {heading ? (
        <h2 style={{ fontFamily: "var(--dm-font-heading)" }}>{heading}</h2>
      ) : null}
      {body ? (
        <p style={{ color: "var(--dm-muted)", maxWidth: "40rem", lineHeight: 1.55 }}>
          {body}
        </p>
      ) : null}
    </section>
  );
}

export function ImageWithText({
  heading,
  body,
  ctaLabel,
  ctaHref,
  imageSide,
  imageUrl,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageSide: "left" | "right";
  imageUrl?: string;
}) {
  return (
    <section
      className={`dm-iwt dm-iwt--${imageSide === "left" ? "left" : "right"}`}
    >
      <div
        className="dm-iwt-media"
        aria-hidden
        style={
          imageUrl
            ? { backgroundImage: `url(${imageUrl})` }
            : undefined
        }
      />
      <div className="dm-iwt-copy">
        {heading ? <h2>{heading}</h2> : null}
        {body ? <p>{body}</p> : null}
        {ctaLabel ? (
          <a className="dm-cta" href={ctaHref || "#produtos"}>
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export function CollectionTiles({
  title,
  tiles,
  imageUrls,
}: {
  title: string;
  tiles: string;
  imageUrls?: string;
}) {
  const items = String(tiles || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
  const imgs = String(imageUrls || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="dm-tiles">
      {title ? <h2 className="dm-tiles-title">{title}</h2> : null}
      <div className="dm-tiles-grid">
        {items.map((label, i) => (
          <a
            key={label}
            className="dm-tile is-photo"
            href="#produtos"
            style={
              imgs[i]
                ? { backgroundImage: `url(${imgs[i]})` }
                : {
                    backgroundImage: `url(/tile-${(i % 6) + 1}.jpg)`,
                  }
            }
          >
            <span>{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function ShopTheLook({
  title,
  caption,
}: {
  title: string;
  caption: string;
}) {
  const { products } = useStorefrontRuntime();
  const pins = (products.length ? products : [{ id: "1", title: "Peça em destaque", sellPrice: 79.9 }])
    .slice(0, 3)
    .map((p, i) => ({
      id: p.id,
      title: p.title,
      price: "sellPrice" in p ? p.sellPrice : 79.9,
      x: [22, 58, 74][i] ?? 40,
      y: [38, 28, 62][i] ?? 50,
    }));

  const stageImg =
    products.find((p) => p.imageUrl)?.imageUrl || "/hero-2.jpg";

  return (
    <section className="dm-stl">
      <div className="dm-stl-head">
        <h2>{title || "Monte o look"}</h2>
        {caption ? <p>{caption}</p> : null}
      </div>
      <div className="dm-stl-stage">
        <div
          className="dm-stl-canvas is-photo"
          aria-hidden
          style={{ backgroundImage: `url(${stageImg})` }}
        >
          {pins.map((pin) => (
            <span
              key={pin.id}
              className="dm-stl-pin"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              title={pin.title}
            />
          ))}
        </div>
        <ul className="dm-stl-list">
          {pins.map((pin) => (
            <li key={pin.id}>
              <strong>{pin.title}</strong>
              <span>{formatBRL(Number(pin.price) || 0)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Dawn-inspired collage mosaic (3 photo cells). */
export function Collage({
  title,
  captions,
  imageUrls,
}: {
  title: string;
  captions: string;
  imageUrls?: string;
}) {
  const caps = String(captions || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const imgs = String(imageUrls || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const cells = [0, 1, 2].map((i) => ({
    caption: caps[i] || "",
    image: imgs[i] || `/hero-${(i % 3) + 1}.jpg`,
  }));
  return (
    <section className="dm-collage">
      {title ? <h2 className="dm-collage-title">{title}</h2> : null}
      <div className="dm-collage-grid">
        {cells.map((cell, i) => (
          <a
            key={`${cell.caption}-${i}`}
            href="#produtos"
            className={`dm-collage-cell dm-collage-cell--${i + 1}`}
            style={{
              backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55)), url(${cell.image})`,
            }}
          >
            {cell.caption ? <span>{cell.caption}</span> : null}
          </a>
        ))}
      </div>
    </section>
  );
}

/** Dawn video section — poster photo + play affordance (no Liquid fork). */
export function VideoSection({
  heading,
  body,
  ctaLabel,
  posterUrl,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  posterUrl?: string;
}) {
  const poster = posterUrl?.trim() || "/hero-poster.jpg";
  return (
    <section className="dm-video">
      <div
        className="dm-video-stage"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.55)), url(${poster})`,
        }}
      >
        <button type="button" className="dm-video-play" aria-label="Reproduzir">
          ▶
        </button>
        <div className="dm-video-copy">
          {heading ? <h2>{heading}</h2> : null}
          {body ? <p>{body}</p> : null}
          {ctaLabel ? (
            <a className="dm-btn" href="#produtos">
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Dawn newsletter / email signup banner. */
export function Newsletter({
  heading,
  body,
  buttonLabel,
  placeholder,
}: {
  heading: string;
  body: string;
  buttonLabel: string;
  placeholder?: string;
}) {
  return (
    <section className="dm-newsletter">
      <div className="dm-newsletter-inner">
        <div className="dm-newsletter-copy">
          {heading ? <h2>{heading}</h2> : null}
          {body ? <p>{body}</p> : null}
        </div>
        <form
          className="dm-newsletter-form"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Newsletter"
        >
          <input
            type="email"
            name="email"
            placeholder={placeholder || "seu@email.com"}
            aria-label="E-mail"
          />
          <button type="submit" className="dm-btn">
            {buttonLabel || "Inscrever"}
          </button>
        </form>
      </div>
    </section>
  );
}
