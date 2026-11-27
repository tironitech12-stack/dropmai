"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

type Props = {
  storeId: string;
  themeId: string;
  active?: boolean;
};

/** Activate a theme already in the store library (same apply API). */
export function ThemeLibraryActivateButton({
  storeId,
  themeId,
  active,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    if (active) return;
    setLoading(true);
    setError(null);
    try {
      try {
        await apiFetch(`/api/v1/stores/${storeId}/theme/apply`, {
          method: "POST",
          json: { themeId, keepCustomBrand: true },
        });
      } catch (primaryErr) {
        const msg =
          primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
        if (/not found|404|cannot post/i.test(msg)) {
          try {
            await apiFetch(`/api/v1/themes/${themeId}/apply`, {
              method: "POST",
              json: { storeId, keepCustomBrand: true },
            });
          } catch {
            await apiFetch(`/api/v1/stores/${storeId}/theme`, {
              method: "PATCH",
              json: { themeId },
            });
          }
        } else {
          throw primaryErr;
        }
      }
      router.refresh();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Falha ao ativar tema";
      setError(
        /not found|404|cannot (get|post|patch)/i.test(raw)
          ? "Backend sem rota de tema (redeploy Dropmai_Backend)."
          : raw,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dm-theme-lib-actions">
      <button
        type="button"
        className={`btn btn-sm ${active ? "btn-secondary" : "btn-primary"}`}
        disabled={loading || active}
        onClick={() => void activate()}
      >
        {active ? "Ativo" : loading ? "Ativando…" : "Ativar"}
      </button>
      {error ? <span className="panel-alert">{error}</span> : null}
    </div>
  );
}
