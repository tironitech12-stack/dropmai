import type { CSSProperties } from "react";
import type { ProductRow } from "@/lib/api";
import {
  sectionByType,
  themeCssVars,
  type ThemeSettings,
} from "@/lib/themes";

type Props = {
  storeName: string;
  storeSlug: string;
  themeId: string;
  settings: ThemeSettings;
  products: ProductRow[];
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function StorefrontTheme({
  storeName,
  storeSlug,
  themeId,
  settings,
  products,
}: Props) {
  const brandName = settings.brand.name || storeName;
  const announcement = sectionByType(settings, "announcement");
  const hero = sectionByType(settings, "hero");
  const featured = sectionByType(settings, "featured_products");
  const footer = sectionByType(settings, "footer");
  const limit = Number(featured?.props.limit ?? 12) || 12;
  const list = products.slice(0, limit);
  const dense = themeId === "catalogo";
  const minimal = themeId === "minimal";

  return (
    <div
      className={`dm-store dm-theme-${themeId}`}
      style={themeCssVars(settings) as CSSProperties}
    >
      {announcement?.enabled ? (
        <div className="dm-announce">{String(announcement.props.text || "")}</div>
      ) : null}

      <header className={`dm-header${minimal ? " is-minimal" : ""}`}>
        <div className="dm-header-inner">
          <a href={`/loja/${storeSlug}`} className="dm-brand">
            {settings.brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.brand.logoUrl}
                alt={brandName}
                className="dm-logo"
              />
            ) : (
              <span className="dm-brand-name">{brandName}</span>
            )}
          </a>
          <nav className="dm-nav" aria-label="Principal">
            <a href="#produtos">Produtos</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
      </header>

      {hero?.enabled ? (
        <section className={`dm-hero${minimal ? " is-minimal" : ""}`}>
          <div className="dm-hero-copy">
            {settings.brand.tagline ? (
              <p className="dm-eyebrow">{settings.brand.tagline}</p>
            ) : null}
            <h1>{String(hero.props.title || brandName)}</h1>
            <p>{String(hero.props.subtitle || "")}</p>
            <a className="dm-cta" href={String(hero.props.ctaHref || "#produtos")}>
              {String(hero.props.ctaLabel || "Ver produtos")}
            </a>
          </div>
        </section>
      ) : null}

      <section id="produtos" className="dm-products">
        <div className="dm-products-head">
          <h2>{String(featured?.props.title || "Produtos")}</h2>
          <p>
            {list.length
              ? `${list.length} item${list.length === 1 ? "" : "s"} na vitrine`
              : "Nenhum produto publicado ainda"}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="dm-empty">
            Importe produtos do catálogo Xnamai e marque como publicados na loja.
          </div>
        ) : (
          <div className={`dm-grid${dense ? " is-dense" : ""}`}>
            {list.map((p) => (
              <article key={p.id} className="dm-card">
                <div className="dm-card-body">
                  <strong>{p.title}</strong>
                  <span className="dm-sku">{p.sku || p.externalId || p.id}</span>
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
        )}
      </section>

      {footer?.enabled ? (
        <footer id="contato" className="dm-footer">
          <strong>{brandName}</strong>
          <p>{String(footer.props.text || "Loja powered by Dropmai")}</p>
          <p className="dm-footer-url">{storeSlug}.dropmai.com.br</p>
        </footer>
      ) : null}
    </div>
  );
}
