import { apiFetchServer } from "@/lib/api-server";

type SupplierProductRow = {
  id: string;
  externalId: string;
  sku: string | null;
  title: string;
  stock: number;
  costPrice: number;
  categoryName: string | null;
  imageUrl: string | null;
  active: boolean;
};

type ListResponse = {
  products: SupplierProductRow[];
  mode: string;
  source: string;
  inStock: boolean;
  total: number;
};

export default async function FornecedorXnamaiPage() {
  let products: SupplierProductRow[] = [];
  let meta: { mode?: string; source?: string } = {};
  let error: string | null = null;

  try {
    const data = await apiFetchServer<ListResponse>(
      "/api/v1/suppliers/xnamai/products?inStock=true",
    );
    products = data.products ?? [];
    meta = { mode: data.mode, source: data.source };
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Não foi possível carregar o catálogo Xnamai";
  }

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Fornecedores</p>
          <h1>Xnamai</h1>
          <p className="panel-lead">
            Produtos do fornecedor com estoque disponível para dropshipping.
          </p>
        </div>
      </div>

      {error ? <p className="panel-alert">{error}</p> : null}

      {!error && products.length === 0 ? (
        <div className="panel-empty">
          <h3>Nenhum produto com estoque</h3>
          <p>
            Quando o catálogo Xnamai tiver saldo maior que zero, os itens
            aparecerão nesta lista.
          </p>
        </div>
      ) : null}

      {products.length > 0 ? (
        <>
          <p className="panel-muted-note">
            {products.length} produto{products.length === 1 ? "" : "s"} com
            estoque
            {meta.source ? ` · fonte: ${meta.source}` : null}
            {meta.mode ? ` (${meta.mode})` : null}
          </p>
          <div className="panel-table-wrap">
            <table className="panel-table">
              <thead>
                <tr>
                  <th style={{ width: 56 }} />
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Estoque</th>
                  <th>Custo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="panel-thumb"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <span
                          className="panel-thumb panel-thumb-fallback"
                          aria-hidden
                        >
                          {p.title.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td>
                      <div>{p.title}</div>
                      {p.categoryName ? (
                        <div className="panel-table-sub">{p.categoryName}</div>
                      ) : null}
                    </td>
                    <td>{p.sku || p.externalId}</td>
                    <td>
                      <strong>{formatStock(p.stock)}</strong>
                    </td>
                    <td>{formatBRL(p.costPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </main>
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
