"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
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
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">
            <Link href="/painel/lojas" className="panel-text-link">
              ← Lojas
            </Link>
          </p>
          <h1>Nova loja</h1>
          <p className="panel-lead">
            O slug vira o subdomínio da vitrine Dropmai.
          </p>
        </div>
      </div>

      <form className="panel-form" onSubmit={onSubmit}>
        <label className="panel-field">
          <span>Nome da loja</span>
          <input
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Minha Loja"
          />
        </label>
        <label className="panel-field">
          <span>Slug / subdomínio</span>
          <input
            className="field-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="minhaloja"
            required
          />
          <span className="panel-field-hint">{preview}</span>
        </label>
        <label className="panel-field">
          <span>Descrição (opcional)</span>
          <textarea
            className="field-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ resize: "vertical" }}
          />
        </label>
        {error ? <p className="panel-alert">{error}</p> : null}
        <div className="panel-form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Criando…" : "Criar loja"}
          </button>
          <Link href="/painel/lojas" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
