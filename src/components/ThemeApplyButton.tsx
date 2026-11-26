"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

type Props = {
  storeId: string;
  themeId: string;
  active?: boolean;
};

export function ThemeApplyButton({ storeId, themeId, active }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply() {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/v1/stores/${storeId}/theme/apply`, {
        method: "POST",
        json: { themeId, keepCustomBrand: true },
      });
      router.refresh();
      router.push(`/painel/lojas/${storeId}/tema`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao aplicar tema");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dm-theme-card-actions">
      <button
        type="button"
        className={`btn btn-sm ${active ? "btn-secondary" : "btn-primary"}`}
        disabled={loading || active}
        onClick={() => void apply()}
      >
        {active ? "Tema ativo" : loading ? "Aplicando…" : "Adicionar"}
      </button>
      {error ? <span className="panel-alert">{error}</span> : null}
    </div>
  );
}
