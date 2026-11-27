import Link from "next/link";
import {
  MarketplaceChannelCard,
  type MarketplaceAccount,
} from "@/components/MarketplaceChannelCard";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

const FALLBACK_ACCOUNTS: MarketplaceAccount[] = [
  {
    channel: "MERCADO_LIVRE",
    label: "Mercado Livre",
    status: "not_configured",
    oauthConfigured: false,
    externalUserId: null,
    connectedAt: null,
    lastError: null,
    note: "API indisponível — status local. Configure o Backend e tente de novo.",
  },
  {
    channel: "SHOPEE",
    label: "Shopee",
    status: "not_configured",
    oauthConfigured: false,
    externalUserId: null,
    connectedAt: null,
    lastError: null,
    note: "API indisponível — status local. Configure o Backend e tente de novo.",
  },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MarketplacesPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) ?? {};
  const flashChannel = typeof params.channel === "string" ? params.channel : null;
  const flashError = typeof params.error === "string" ? params.error : null;
  const flashConnected =
    typeof params.connected === "string" ? params.connected : null;
  const flashNote = typeof params.note === "string" ? params.note : null;

  let stores: StoreSummary[] = [];
  let accounts: MarketplaceAccount[] = FALLBACK_ACCOUNTS;
  let apiNote: string | null = null;

  const storesResult = await Promise.allSettled([
    apiFetchServer<{ stores: StoreSummary[] }>("/api/v1/stores"),
  ]);

  if (storesResult[0].status === "fulfilled") {
    stores = storesResult[0].value.stores ?? [];
  }

  const primary = stores[0];

  if (primary) {
    try {
      const data = await apiFetchServer<{
        accounts: MarketplaceAccount[];
        note?: string;
      }>(`/api/v1/stores/${primary.id}/marketplaces`);
      if (data.accounts?.length) {
        accounts = data.accounts.filter(
          (a) => a.channel === "MERCADO_LIVRE" || a.channel === "SHOPEE",
        );
      }
      apiNote = data.note ?? null;
    } catch {
      // keep fallback — honest not_configured, not fake connected
    }
  }

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Canais de vendas</p>
          <h1>Marketplaces</h1>
          <p className="panel-lead">
            Conecte Mercado Livre e Shopee à sua loja. Sync de anúncios, estoque
            e pedidos entra depois do OAuth.
          </p>
        </div>
        <div className="panel-head-actions">
          <Link href="/painel/canais/loja-virtual" className="btn btn-secondary">
            Loja virtual
          </Link>
        </div>
      </div>

      {flashError ? (
        <p className="panel-alert" role="alert">
          Falha no retorno OAuth
          {flashChannel ? ` (${flashChannel})` : ""}: {flashError}
        </p>
      ) : null}
      {flashConnected === "pending" ? (
        <p className="panel-info-banner" role="status">
          Callback recebido
          {flashChannel ? ` · ${flashChannel}` : ""}. Troca de token ainda é
          stub
          {flashNote ? ` (${flashNote})` : ""} — conta não marcada como
          conectada.
        </p>
      ) : null}

      {!primary ? (
        <div className="panel-empty">
          <h3>Crie uma loja primeiro</h3>
          <p>
            As conexões de marketplace ficam vinculadas à sua loja Dropmai.
          </p>
          <Link href="/painel/lojas/nova" className="btn btn-primary">
            Criar loja
          </Link>
        </div>
      ) : (
        <>
          <section className="panel-section">
            <div className="panel-section-head">
              <h2>Canais</h2>
              <p>
                Loja <strong>{primary.name}</strong> · status real da API — sem
                sync falso.
              </p>
            </div>
            <div className="dm-mp-grid">
              {accounts.map((account) => (
                <MarketplaceChannelCard
                  key={account.channel}
                  storeId={primary.id}
                  account={account}
                />
              ))}
            </div>
          </section>

          {apiNote ? (
            <p className="panel-muted-note" style={{ marginTop: "0.75rem" }}>
              {apiNote}
            </p>
          ) : null}
        </>
      )}
    </main>
  );
}
