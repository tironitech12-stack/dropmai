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
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  overlay?: boolean;
}) {
  return (
    <section className={`dm-hero${overlay ? " is-overlay" : ""}`}>
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
        {demo.map((p) => (
          <article key={p.id} className="dm-card">
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
        ))}
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
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageSide: "left" | "right";
}) {
  return (
    <section
      className={`dm-iwt dm-iwt--${imageSide === "left" ? "left" : "right"}`}
    >
      <div className="dm-iwt-media" aria-hidden />
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
}: {
  title: string;
  tiles: string;
}) {
  const items = String(tiles || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
  if (!items.length) return null;
  return (
    <section className="dm-tiles">
      {title ? <h2 className="dm-tiles-title">{title}</h2> : null}
      <div className="dm-tiles-grid">
        {items.map((label) => (
          <a key={label} className="dm-tile" href="#produtos">
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

  return (
    <section className="dm-stl">
      <div className="dm-stl-head">
        <h2>{title || "Monte o look"}</h2>
        {caption ? <p>{caption}</p> : null}
      </div>
      <div className="dm-stl-stage">
        <div className="dm-stl-canvas" aria-hidden>
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
