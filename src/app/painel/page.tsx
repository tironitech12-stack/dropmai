import Link from "next/link";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

export default async function PainelHomePage() {
  let userName = "lojista";
  let stores: StoreSummary[] = [];
  let error: string | null = null;

  try {
    const me = await apiFetchServer<{
      user: { name?: string; email?: string } | null;
    }>("/api/v1/auth/me");
    userName = firstName(me.user?.name || me.user?.email || "lojista");
  } catch {
    /* layout already gates auth */
  }

  try {
    const data = await apiFetchServer<{ stores: StoreSummary[] }>(
      "/api/v1/stores",
    );
    stores = data.stores ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Falha ao carregar lojas";
  }

  const hasStore = stores.length > 0;
  const hasActive = stores.some((s) => s.status?.toUpperCase() === "ACTIVE");
  const primaryStore = stores[0];
  const pendingCount = [hasStore, hasActive].filter((v) => !v).length;

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Painel do lojista</p>
          <h1>Olá, {userName}</h1>
          <p className="panel-lead">
            {hasStore
              ? "Gerencie suas lojas, sincronize o catálogo e prepare sua vitrine."
              : "Configure sua primeira loja Dropmai e comece a vender sem estoque."}
          </p>
        </div>
        <div className="panel-head-actions">
          {primaryStore ? (
            <Link
              href={`/painel/lojas/${primaryStore.id}/produtos`}
              className="btn btn-primary"
            >
              Ver produtos
            </Link>
          ) : (
            <Link href="/painel/produtos" className="btn btn-primary">
              Ver produtos
            </Link>
          )}
          <Link href="/painel/lojas/nova" className="btn btn-secondary">
            Nova loja
          </Link>
        </div>
      </div>

      {error ? (
        <p className="panel-alert">
          {error}.{" "}
          {process.env.NEXT_PUBLIC_API_URL ? (
            <>
              Confirme o backend em <code>{process.env.NEXT_PUBLIC_API_URL}</code>
              .
            </>
          ) : (
            <>
              Defina <code>NEXT_PUBLIC_API_URL</code> no ambiente.
            </>
          )}
        </p>
      ) : null}

      <section className="panel-section" aria-labelledby="setup-heading">
        <div className="panel-section-head">
          <h2 id="setup-heading">
            {pendingCount > 0 ? "Setup pendente" : "Setup concluído"}
          </h2>
          <p>
            {pendingCount > 0
              ? `${pendingCount} passo${pendingCount > 1 ? "s" : ""} para deixar sua operação pronta.`
              : "Sua conta já tem loja ativa. Continue no catálogo."}
          </p>
        </div>

        <ol className="panel-checklist">
          <ChecklistRow
            done={hasStore}
            title="Criar loja"
            detail="Defina nome e slug. A vitrine fica em {slug}.dropmai.com.br."
            action={
              hasStore ? undefined : (
                <Link href="/painel/lojas/nova" className="btn btn-primary btn-sm">
                  Criar loja
                </Link>
              )
            }
          />
          <ChecklistRow
            done={hasActive}
            title="Ativar loja"
            detail={
              hasStore
                ? hasActive
                  ? "Pelo menos uma loja está ACTIVE."
                  : "Sua loja ainda não está ACTIVE — confira o status em Lojas."
                : "Crie uma loja para liberar o status ACTIVE."
            }
            action={
              hasStore ? (
                <Link href="/painel/lojas" className="btn btn-secondary btn-sm">
                  Ver lojas
                </Link>
              ) : undefined
            }
          />
          <ChecklistRow
            done={hasStore}
            title="Explorar produtos"
            detail="Importe o catálogo Xnamai e publique na vitrine."
            action={
              primaryStore ? (
                <Link
                  href={`/painel/lojas/${primaryStore.id}/produtos`}
                  className="btn btn-secondary btn-sm"
                >
                  Abrir catálogo
                </Link>
              ) : (
                <Link href="/painel/produtos" className="btn btn-secondary btn-sm">
                  Produtos
                </Link>
              )
            }
          />
        </ol>
      </section>

      <section className="panel-section" aria-labelledby="stores-heading">
        <div className="panel-section-head panel-section-head-row">
          <div>
            <h2 id="stores-heading">Suas lojas</h2>
            <p>Subdomínio automático por loja.</p>
          </div>
          <Link href="/painel/lojas" className="panel-text-link">
            Ver todas
          </Link>
        </div>

        {stores.length === 0 ? (
          <div className="panel-empty">
            <h3>Nenhuma loja ainda</h3>
            <p>
              Crie a primeira loja para receber o endereço{" "}
              <code>sua-loja.dropmai.com.br</code>.
            </p>
            <Link href="/painel/lojas/nova" className="btn btn-primary">
              Criar loja
            </Link>
          </div>
        ) : (
          <ul className="panel-store-list">
            {stores.slice(0, 4).map((store) => (
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
                  </div>
                  <StatusBadge status={store.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function ChecklistRow({
  done,
  title,
  detail,
  action,
}: {
  done: boolean;
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return (
    <li className={`panel-check-row${done ? " is-done" : ""}`}>
      <span className="panel-check-mark" aria-hidden>
        {done ? "✓" : "!"}
      </span>
      <div className="panel-check-body">
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      {action ? <div className="panel-check-action">{action}</div> : null}
    </li>
  );
}

function StatusBadge({ status }: { status: string }) {
  const upper = (status || "").toUpperCase();
  const tone =
    upper === "ACTIVE" ? "ok" : upper === "DRAFT" ? "warn" : "neutral";
  return <span className={`panel-badge panel-badge-${tone}`}>{upper || "—"}</span>;
}

function firstName(value: string) {
  const part = value.trim().split(/\s+|@/)[0];
  if (!part) return "lojista";
  return part.charAt(0).toUpperCase() + part.slice(1);
}
