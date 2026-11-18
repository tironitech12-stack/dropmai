import Link from "next/link";
import { apiFetchServer } from "@/lib/api-server";

type CatalogProduct = {
  id: string;
  externalId: string;
  sku: string | null;
  title: string;
  stock: number;
  costPrice: number;
  categoryId: string | null;
  categoryName: string | null;
  imageUrl: string | null;
  active: boolean;
  featured: boolean;
};

type CategoryRow = {
  id: string;
  name: string;
  parentId: string | null;
  count: number;
};

type ListResponse = {
  products: CatalogProduct[];
  featured: CatalogProduct[];
  categories: CategoryRow[];
  mode: string;
  source: string;
  inStock: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  warning?: string;
};

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    categoryId?: string;
    q?: string;
    inStock?: string;
  }>;
};

export default async function FornecedorXnamaiPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const categoryId = sp.categoryId?.trim() || "";
  const q = sp.q?.trim() || "";
  const inStock = sp.inStock === "false" ? false : true;

  const qs = new URLSearchParams();
  qs.set("inStock", inStock ? "true" : "false");
  qs.set("page", String(page));
  qs.set("pageSize", "48");
  if (categoryId) qs.set("categoryId", categoryId);
  if (q) qs.set("q", q);

  let data: ListResponse | null = null;
  let error: string | null = null;

  try {
    data = await apiFetchServer<ListResponse>(
      `/api/v1/suppliers/xnamai/products?${qs.toString()}`,
    );
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Não foi possível carregar o catálogo Xnamai";
  }

  const products = data?.products ?? [];
  const featured = data?.featured ?? [];
  const categories = data?.categories ?? [];

  function hrefFor(next: {
    page?: number;
    categoryId?: string | null;
    q?: string;
    inStock?: boolean;
  }) {
    const p = new URLSearchParams();
    const nextInStock = next.inStock ?? inStock;
    p.set("inStock", nextInStock ? "true" : "false");
    p.set("page", String(next.page ?? 1));
    const nextCat =
      next.categoryId === null ? "" : (next.categoryId ?? categoryId);
    if (nextCat) p.set("categoryId", nextCat);
    const nextQ = next.q ?? q;
    if (nextQ) p.set("q", nextQ);
    return `/painel/fornecedores/xnamai?${p.toString()}`;
  }

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Fornecedores</p>
          <h1>Xnamai</h1>
          <p className="panel-lead">
            Catálogo real com estoque, categorias e destaques do fornecedor
            Xnamai.
          </p>
        </div>
      </div>

      {error ? <p className="panel-alert">{error}</p> : null}
      {data?.warning ? <p className="panel-info">{data.warning}</p> : null}

      {!error && data ? (
        <>
          <form className="xn-toolbar" method="get">
            <input type="hidden" name="inStock" value={inStock ? "true" : "false"} />
            {categoryId ? (
              <input type="hidden" name="categoryId" value={categoryId} />
            ) : null}
            <input
              className="field-input"
              name="q"
              defaultValue={q}
              placeholder="Buscar por nome ou SKU"
            />
            <button className="btn btn-secondary btn-sm" type="submit">
              Buscar
            </button>
            <Link
              href={hrefFor({ inStock: !inStock, page: 1 })}
              className="btn btn-secondary btn-sm"
            >
              {inStock ? "Ver todos" : "Só com estoque"}
            </Link>
          </form>

          <p className="panel-muted-note">
            {data.total.toLocaleString("pt-BR")} produto
            {data.total === 1 ? "" : "s"}
            {inStock ? " com estoque" : ""}
            {data.source ? ` · fonte: ${data.source}` : null}
            {data.mode ? ` (${data.mode})` : null}
          </p>

          {featured.length > 0 ? (
            <section className="panel-section" aria-labelledby="destaques-title">
              <div className="panel-section-head">
                <h2 id="destaques-title">Destaques</h2>
                <p>Produtos em evidência no catálogo Xnamai.</p>
              </div>
              <div className="xn-featured-grid">
                {featured.map((p) => (
                  <article key={`feat-${p.id}`} className="xn-card">
                    <ProductThumb product={p} />
                    <div className="xn-card-body">
                      <strong>{p.title}</strong>
                      <span className="xn-meta">
                        {p.sku || p.externalId}
                        {p.categoryName ? ` · ${p.categoryName}` : ""}
                      </span>
                      <span className="xn-price-row">
                        <span>{formatBRL(p.costPrice)}</span>
                        <span className="xn-stock">Estoque {formatStock(p.stock)}</span>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {categories.length > 0 ? (
            <nav className="xn-cats" aria-label="Categorias">
              <Link
                href={hrefFor({ categoryId: null, page: 1 })}
                className={`xn-cat${categoryId ? "" : " is-active"}`}
              >
                Todas
              </Link>
              {categories.slice(0, 40).map((c) => (
                <Link
                  key={c.id}
                  href={hrefFor({ categoryId: c.id, page: 1 })}
                  className={`xn-cat${categoryId === c.id ? " is-active" : ""}`}
                >
                  {c.name}
                  <span>{c.count}</span>
                </Link>
              ))}
            </nav>
          ) : null}

          {products.length === 0 ? (
            <div className="panel-empty">
              <h3>Nenhum produto encontrado</h3>
              <p>
                Ajuste a busca, a categoria ou o filtro de estoque para ver o
                catálogo Xnamai.
              </p>
            </div>
          ) : (
            <div className="xn-grid">
              {products.map((p) => (
                <article key={p.id} className="xn-card">
                  <ProductThumb product={p} />
                  <div className="xn-card-body">
                    <strong>{p.title}</strong>
                    <span className="xn-meta">
                      {p.sku || p.externalId}
                      {p.categoryName ? ` · ${p.categoryName}` : ""}
                    </span>
                    <span className="xn-price-row">
                      <span>{formatBRL(p.costPrice)}</span>
                      <span className="xn-stock">
                        Estoque {formatStock(p.stock)}
                      </span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {data.totalPages > 1 ? (
            <div className="xn-pager">
              {page > 1 ? (
                <Link
                  className="btn btn-secondary btn-sm"
                  href={hrefFor({ page: page - 1 })}
                >
                  Anterior
                </Link>
              ) : (
                <span />
              )}
              <span className="panel-muted-note">
                Página {data.page} de {data.totalPages}
              </span>
              {page < data.totalPages ? (
                <Link
                  className="btn btn-secondary btn-sm"
                  href={hrefFor({ page: page + 1 })}
                >
                  Próxima
                </Link>
              ) : (
                <span />
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </main>
  );
}

function ProductThumb({ product }: { product: CatalogProduct }) {
  if (product.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.imageUrl}
        alt=""
        className="xn-thumb"
        width={160}
        height={160}
      />
    );
  }
  return (
    <span className="xn-thumb xn-thumb-fallback" aria-hidden>
      {product.title.slice(0, 1).toUpperCase()}
    </span>
  );
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatStock(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}
