import Link from "next/link";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

export default async function LojaVirtualPage() {
  let stores: StoreSummary[] = [];
  try {
    const data = await apiFetchServer<{ stores: StoreSummary[] }>(
      "/api/v1/stores",
    );
    stores = data.stores ?? [];
  } catch {
    stores = [];
  }

  const primary = stores[0];

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Canais de vendas</p>
          <h1>Loja virtual</h1>
          <p className="panel-lead">
            Sua vitrine Dropmai em subdomínio próprio, pronta para vender sem
            estoque.
          </p>
        </div>
        <div className="panel-head-actions">
          <Link href="/painel/lojas/nova" className="btn btn-secondary">
            Nova loja
          </Link>
        </div>
      </div>

      {primary ? (
        <div className="panel-empty">
          <h3>{primary.name}</h3>
          <p>
            Endereço público:{" "}
            <code>
              {primary.slug}.dropmai.com.br
            </code>
          </p>
          <div className="panel-form-actions">
            <Link href={`/loja/${primary.slug}`} className="btn btn-primary">
              Abrir vitrine
            </Link>
            <Link href="/painel/lojas" className="btn btn-secondary">
              Gerenciar lojas
            </Link>
          </div>
        </div>
      ) : (
        <div className="panel-empty">
          <h3>Nenhuma loja virtual</h3>
          <p>Crie uma loja para liberar o canal de vitrine Dropmai.</p>
          <Link href="/painel/lojas/nova" className="btn btn-primary">
            Criar loja
          </Link>
        </div>
      )}
    </main>
  );
}
