"use client";

import { FormEvent, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("paulo@dropmai.com.br");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/api/v1/auth/login", {
        method: "POST",
        json: { email, password },
      });
      // Mirror session on the frontend host (cross-port stub with Nest cookie)
      document.cookie = "dropmai_session=demo; path=/; max-age=1209600; samesite=lax";
      router.push("/painel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell" style={{ padding: "3rem 0", maxWidth: 480 }}>
      <Link href="/" className="muted">
        ← Dropmai
      </Link>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.4rem",
          margin: "1rem 0 0.35rem",
        }}
      >
        Entrar
      </h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Auth stub no backend — use o e-mail demo.
      </p>
      <form
        className="panel"
        onSubmit={onSubmit}
        style={{ padding: "1.25rem", display: "grid", gap: "0.85rem" }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>E-mail</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={inputStyle}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Senha</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={inputStyle}
          />
        </label>
        {error ? <p style={{ color: "#9b2c2c", margin: 0 }}>{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar no painel"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: "0.75rem 0.9rem",
  font: "inherit",
  background: "#fffdf8",
};
