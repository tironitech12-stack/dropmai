import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header
        className="shell"
        style={{
          padding: "1.4rem 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.35rem",
            letterSpacing: "-0.03em",
          }}
        >
          Dropmai
        </div>
        <nav style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/entrar" className="btn btn-ghost">
            Entrar
          </Link>
          <Link href="/painel" className="btn btn-primary">
            Abrir painel
          </Link>
        </nav>
      </header>

      <section
        className="shell fade-up"
        style={{
          padding: "4.5rem 0 3rem",
          display: "grid",
          gap: "1.25rem",
          maxWidth: 720,
        }}
      >
        <p
          className="muted"
          style={{
            margin: 0,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.78rem",
          }}
        >
          Plataforma de dropshipping
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 8vw, 5.2rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          Dropmai
        </h1>
        <p
          className="muted"
          style={{ margin: 0, fontSize: "1.2rem", maxWidth: "34ch" }}
        >
          Crie sua loja em minutos, use produtos Xnamai e venda no seu domínio —
          e depois no Mercado Livre, Shopee e Amazon.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginTop: "0.5rem",
          }}
        >
          <Link href="/painel/lojas/nova" className="btn btn-primary">
            Criar minha loja
          </Link>
          <Link href="/loja/minhaloja" className="btn btn-ghost">
            Ver vitrine demo
          </Link>
        </div>
      </section>

      <section className="shell" style={{ paddingBottom: "4rem" }}>
        <div
          className="panel drift"
          style={{ padding: "1.5rem", display: "grid", gap: "0.75rem" }}
        >
          <strong
            style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem" }}
          >
            minhaloja.dropmai.com.br
          </strong>
          <p className="muted" style={{ margin: 0 }}>
            Frontend Next.js + Backend NestJS separados. Catálogo inicial:
            fornecedor <strong>Xnamai</strong>.
          </p>
        </div>
      </section>
    </main>
  );
}
