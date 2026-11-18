import Link from "next/link";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

export default async function LojasPage() {
  let stores: StoreSummary[] = [];
  let error: string | null = null;

  try {
    const data = await apiFetchServer<{ stores: StoreSummary[] }>(
      "/api/v1/stores",
    );
    stores = data.stores ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Falha ao carregar lojas";
  }

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Lojas</p>
          <h1>Suas lojas</h1>
          <p className="panel-lead">
            Cada loja ganha o subdomínio{" "}
            <code>&#123;slug&#125;.dropmai.com.br</code>.
          </p>
        </div>
        <div className="panel-head-actions">
          <Link href="/painel/lojas/nova" className="btn btn-primary">
            Nova loja
          </Link>
        </div>
      </div>

      {error ? <p className="panel-alert">{error}</p> : null}

      {stores.length === 0 && !error ? (
        <div className="panel-empty">
          <h3>Nenhuma loja cadastrada</h3>
          <p>Crie uma loja para publicar sua vitrine Dropmai.</p>
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
                    {store.slug}.dropmai.com.br
                  </span>
                  {store.description ? (
                    <span className="panel-store-desc">{store.description}</span>
                  ) : null}
                </div>
                <StatusBadge status={store.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const upper = (status || "").toUpperCase();
  const tone =
    upper === "ACTIVE" ? "ok" : upper === "DRAFT" ? "warn" : "neutral";
  return <span className={`panel-badge panel-badge-${tone}`}>{upper || "—"}</span>;
}
