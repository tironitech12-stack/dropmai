"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { apiFetch, type StoreSummary } from "@/lib/api";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import { themeMeta, type ThemeSettings } from "@/lib/themes";
import { dropmaiPuckConfig } from "@/puck/config";
import {
  buildDefaultPuckData,
  ensurePuckRootProps,
  isPuckData,
  type DropmaiPuckData,
} from "@/puck/default-data";
import { StorefrontRuntimeProvider } from "@/puck/storefront-context";

type Props = {
  storeId: string;
};

export function PuckThemeEditor({ storeId }: Props) {
  const [store, setStore] = useState<StoreSummary | null>(null);
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [data, setData] = useState<DropmaiPuckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void apiFetch<{ store: StoreSummary }>(`/api/v1/stores/${storeId}`)
      .then((res) => {
        if (cancelled) return;
        const s = res.store;
        const themeId = s.themeId || "vitrine";
        const nextSettings =
          s.themeSettings ??
          buildDefaultSettingsClient(themeId, s.name, s.logoUrl);
        const raw = isPuckData(nextSettings.puck)
          ? (nextSettings.puck as DropmaiPuckData)
          : buildDefaultPuckData(s.name, themeId, nextSettings);
        const puck = ensurePuckRootProps(raw, themeId, nextSettings);
        setStore(s);
        setSettings(nextSettings);
        setData(puck);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Falha ao carregar");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [storeId]);

  // Lock page scroll while the full-screen editor is open.
  useEffect(() => {
    if (!store || !data) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [store, data]);

  const runtime = useMemo(
    () => ({
      storeName: store?.name || "Loja",
      storeSlug: store?.slug || "loja",
      products: [],
    }),
    [store?.name, store?.slug],
  );

  const persist = useCallback(
    async (next: Data) => {
      if (!store || !settings) return;
      setStatus("Salvando…");
      setError(null);
      const rootProps = (next.root?.props ?? {}) as Record<string, string>;
      const merged: ThemeSettings = {
        ...settings,
        brand: {
          ...settings.brand,
          name: store.name,
        },
        colors: {
          primary: rootProps.primary || settings.colors.primary,
          secondary: rootProps.secondary || settings.colors.secondary,
          background: rootProps.background || settings.colors.background,
          surface: rootProps.surface || settings.colors.surface,
          text: rootProps.text || settings.colors.text,
          muted: rootProps.muted || settings.colors.muted,
        },
        typography: {
          heading: rootProps.headingFont || settings.typography.heading,
          body: rootProps.bodyFont || settings.typography.body,
        },
        puck: next,
      };
      try {
        const res = await apiFetch<{ store: StoreSummary }>(
          `/api/v1/stores/${storeId}/theme`,
          {
            method: "PATCH",
            json: {
              themeId: store.themeId || "vitrine",
              themeSettings: merged,
              logoUrl: merged.brand.logoUrl,
            },
          },
        );
        setStore(res.store);
        setSettings(res.store.themeSettings ?? merged);
        setData(
          isPuckData(res.store.themeSettings?.puck)
            ? (res.store.themeSettings!.puck as DropmaiPuckData)
            : (next as DropmaiPuckData),
        );
        setStatus("Tema publicado na vitrine.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao salvar");
        setStatus(null);
      }
    },
    [settings, store, storeId],
  );

  if (loading) {
    return (
      <main className="panel-page">
        <p className="panel-muted-note">Carregando editor Puck…</p>
      </main>
    );
  }

  if (!store || !data) {
    return (
      <main className="panel-page">
        <p className="panel-alert">{error || "Loja não encontrada"}</p>
        <Link href="/painel/canais/loja-virtual" className="btn btn-secondary">
          Voltar
        </Link>
      </main>
    );
  }

  const meta = themeMeta(store.themeId || "vitrine");

  const editor = (
    <div className="dm-puck-shell" role="application" aria-label="Editor de tema">
      <div className="dm-puck-topbar">
        <div>
          <Link href="/painel/canais/loja-virtual" className="panel-text-link">
            ← Loja virtual
          </Link>
          <strong>
            Editar tema · {meta.name} · {store.name}
          </strong>
        </div>
        <div className="dm-puck-topbar-actions">
          {status ? <span className="panel-muted-note">{status}</span> : null}
          {error ? <span className="panel-alert">{error}</span> : null}
          <a
            href={`/loja/${store.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
          >
            Pré-visualizar loja
          </a>
        </div>
      </div>

      <div className="dm-puck-canvas">
        <StorefrontRuntimeProvider value={runtime}>
          <Puck
            config={dropmaiPuckConfig}
            data={data}
            onPublish={(next) => void persist(next)}
            headerTitle={`${store.name} · ${meta.name}`}
            iframe={{ enabled: false }}
          />
        </StorefrontRuntimeProvider>
      </div>
    </div>
  );

  // Portal escapes PanelShell `.fade-up` transform, which otherwise traps
  // position:fixed and collapses the editor into the 960px content column.
  if (!mounted) {
    return (
      <main className="panel-page">
        <p className="panel-muted-note">Abrindo editor…</p>
      </main>
    );
  }

  return createPortal(editor, document.body);
}
