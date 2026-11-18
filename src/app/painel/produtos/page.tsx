import Link from "next/link";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

export default async function ProdutosHubPage() {
  let stores: StoreSummary[] = [];

  try {
    const data = await apiFetchServer<{ stores: StoreSummary[] }>(
      "/api/v1/stores",
    );
    stores = data.stores ?? [];
  } catch {
    stores = [];
  }

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Produtos</p>
          <h1>Catálogo</h1>
          <p className="panel-lead">
            Escolha uma loja para ver e sincronizar produtos do fornecedor Xnamai.
          </p>
        </div>
      </div>

      {stores.length === 0 ? (
        <div className="panel-empty">
          <h3>Sem loja para exibir produtos</h3>
          <p>Crie uma loja primeiro; o catálogo fica vinculado a ela.</p>
          <Link href="/painel/lojas/nova" className="btn btn-primary">
            Criar loja
          </Link>
        </div>
      ) : (
        <ul className="panel-store-list panel-store-list-full">
          {stores.map((store) => (
            <li key={store.id}>
              <Link
                href={`/painel/lojas/${store.id}/produtos`}
                className="panel-store-row"
              >
                <div>
                  <strong>{store.name}</strong>
                  <span className="panel-store-url">
                    Abrir catálogo · {store.slug}.dropmai.com.br
                  </span>
                </div>
                <span className="panel-badge panel-badge-neutral">Catálogo</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
