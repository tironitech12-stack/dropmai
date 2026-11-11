"use client";

import { FormEvent, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function NovaLojaPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const preview = useMemo(() => {
    const cleaned = slug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return cleaned ? `${cleaned}.dropmai.com.br` : "sua-loja.dropmai.com.br";
  }, [slug]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ store: { id: string } }>("/api/v1/stores", {
        method: "POST",
        json: { name, slug, description },
      });
      router.push(`/painel/lojas/${data.store.id}/produtos`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a loja");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="fade-up" style={{ maxWidth: 560 }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.2rem",
          marginBottom: 8,
        }}
      >
        Nova loja
      </h1>
      <p className="muted">O slug vira o subdomínio da vitrine.</p>
      <form
        className="panel"
        onSubmit={onSubmit}
        style={{ padding: "1.25rem", display: "grid", gap: "0.85rem" }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Nome da loja</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Slug / subdomínio</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="minhaloja"
            required
            style={inputStyle}
          />
          <span className="muted" style={{ fontSize: "0.9rem" }}>
            {preview}
          </span>
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Descrição (opcional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>
        {error ? <p style={{ color: "#9b2c2c", margin: 0 }}>{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Criando…" : "Criar loja"}
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
