import Link from "next/link";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

export default async function PainelPage() {
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
    <main className="fade-up">
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.4rem",
          marginBottom: "0.35rem",
        }}
      >
        Suas lojas
      </h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Cada loja ganha o subdomínio <code>&#123;slug&#125;.dropmai.com.br</code>.
      </p>

      {error ? (
        <p className="panel" style={{ padding: "1rem", color: "#9b2c2c" }}>
          {error}.{" "}
          {process.env.NEXT_PUBLIC_API_URL
            ? <>Confirme o backend em <code>{process.env.NEXT_PUBLIC_API_URL}</code>.</>
            : <>Defina <code>NEXT_PUBLIC_API_URL</code> no ambiente (Vercel).</>}
        </p>
      ) : null}

      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1.5rem" }}>
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/painel/lojas/${store.id}/produtos`}
            className="panel"
            style={{ padding: "1.1rem 1.2rem", display: "grid", gap: 4 }}
          >
            <strong
              style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}
            >
              {store.name}
            </strong>
            <span className="muted">
              {store.slug}.dropmai.com.br · {store.status}
            </span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <Link href="/painel/lojas/nova" className="btn btn-primary">
          Criar loja
        </Link>
      </div>
    </main>
  );
}
