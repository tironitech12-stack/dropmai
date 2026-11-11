import { getApiUrl, type ProductRow, type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ host?: string; path?: string }>;
};

export default async function StorefrontPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;

  if (slug === "_domain") {
    const host = query.host ?? "";
    let resolved: { store?: { slug?: string; name?: string } | null } = {};
    try {
      resolved = await apiFetchServer(
        `/api/v1/public/domains/lookup?host=${encodeURIComponent(host)}`,
      );
    } catch {
      resolved = {};
    }

    return (
      <main className="shell" style={{ padding: "3rem 0" }}>
        <h1 style={{ fontFamily: "var(--font-display)" }}>
          Domínio personalizado
        </h1>
        <p className="muted">
          Host <code>{host || "—"}</code>.{" "}
          {resolved.store
            ? `Resolvido para loja ${resolved.store.name ?? resolved.store.slug}.`
            : "Lookup stub — verifique DNS/CNAME e status VERIFIED no backend."}
        </p>
        <p className="muted">
          API: <code>{getApiUrl() || "(NEXT_PUBLIC_API_URL não definida)"}</code>
        </p>
      </main>
    );
  }

  let store: StoreSummary | null = null;
  let products: ProductRow[] = [];

  try {
    const data = await apiFetchServer<{
      store: StoreSummary;
      products: ProductRow[];
    }>(`/api/v1/public/stores/${slug}/products`);
    store = data.store;
    products = data.products ?? [];
  } catch {
    try {
      const only = await apiFetchServer<{ store: StoreSummary }>(
        `/api/v1/public/stores/${slug}`,
      );
      store = only.store;
    } catch {
      notFound();
    }
  }

  if (!store) notFound();

  return (
    <main>
      <header className="shell" style={{ padding: "1.5rem 0" }}>
        <div
          className="muted"
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Vitrine Dropmai
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6vw, 3.4rem)",
            margin: "0.3rem 0",
          }}
        >
          {store.name}
        </h1>
        <p className="muted" style={{ marginTop: 0 }}>
          {store.slug}.dropmai.com.br
          {store.description ? ` — ${store.description}` : null}
        </p>
      </header>

      <section
        className="shell"
        style={{ paddingBottom: "3rem", display: "grid", gap: "0.85rem" }}
      >
        {products.length === 0 ? (
          <div className="panel" style={{ padding: "1.25rem" }}>
            <p style={{ margin: 0 }}>Nenhum produto publicado ainda.</p>
            <p className="muted" style={{ marginBottom: 0 }}>
              No painel, sincronize o catálogo Xnamai e publique itens na loja.
            </p>
          </div>
        ) : (
          products.map((p) => (
            <article
              key={p.id}
              className="panel"
              style={{
                padding: "1rem 1.15rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                  }}
                >
                  {p.title}
                </strong>
                <div className="muted">{p.sku}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{formatBRL(p.sellPrice)}</div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {p.stock > 0 ? "Em estoque" : "Sob consulta"}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
