import Link from "next/link";
import { apiFetchServer } from "@/lib/api-server";

export default async function ConfiguracoesPage() {
  let user: { name?: string; email?: string } | null = null;
  try {
    const data = await apiFetchServer<{
      user: { name?: string; email?: string } | null;
    }>("/api/v1/auth/me");
    user = data.user;
  } catch {
    user = null;
  }

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Configurações</p>
          <h1>Conta</h1>
          <p className="panel-lead">
            Dados da sessão atual. Preferências avançadas chegam em breve.
          </p>
        </div>
      </div>

      <section className="panel-card-block">
        <dl className="panel-dl">
          <div>
            <dt>Nome</dt>
            <dd>{user?.name || "—"}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{user?.email || "—"}</dd>
          </div>
        </dl>
        <p className="panel-muted-note">
          Integrações de domínio próprio e planos ficarão nesta área.
        </p>
        <Link href="/painel" className="btn btn-secondary btn-sm">
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}
