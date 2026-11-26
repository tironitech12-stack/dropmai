"use client";

import { useStorefrontRuntime } from "@/puck/storefront-context";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AnnouncementBar({ text }: { text: string }) {
  return <div className="dm-announce">{text}</div>;
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
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="dm-hero">
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
