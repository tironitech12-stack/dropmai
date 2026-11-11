import Link from "next/link";
import { redirect } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { name?: string; email?: string } | null = null;
  try {
    const data = await apiFetchServer<{
      user: { name?: string; email?: string } | null;
    }>("/api/v1/auth/me");
    user = data.user;
  } catch {
    user = null;
  }

  if (!user) redirect("/entrar");

  return (
    <div>
      <header
        className="shell"
        style={{
          padding: "1.1rem 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.2rem",
            }}
          >
            Dropmai
          </Link>
          <nav style={{ display: "flex", gap: "0.85rem" }} className="muted">
            <Link href="/painel">Painel</Link>
            <Link href="/painel/lojas/nova">Nova loja</Link>
          </nav>
        </div>
        <div className="muted" style={{ fontSize: "0.92rem" }}>
          {user.name || user.email}
        </div>
      </header>
      <div className="shell" style={{ paddingBottom: "3rem" }}>
        {children}
      </div>
    </div>
  );
}
