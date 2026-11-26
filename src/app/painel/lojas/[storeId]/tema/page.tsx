"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { apiFetch, type StoreSummary } from "@/lib/api";
import { buildDefaultSettingsClient } from "@/lib/theme-defaults";
import { themeMeta, type ThemeSettings } from "@/lib/themes";

export default function ThemeEditorPage() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const [store, setStore] = useState<StoreSummary | null>(null);
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void apiFetch<{ store: StoreSummary }>(`/api/v1/stores/${storeId}`)
      .then((data) => {
        if (cancelled) return;
        const s = data.store;
        setStore(s);
        setSettings(
          s.themeSettings ??
            buildDefaultSettingsClient(
              s.themeId || "vitrine",
              s.name,
              s.logoUrl,
            ),
        );
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

  const themeId = store?.themeId || "vitrine";
  const meta = themeMeta(themeId);
  const hero = settings?.home.sections.find((s) => s.type === "hero");
  const announcement = settings?.home.sections.find(
    (s) => s.type === "announcement",
  );

  const previewHref = useMemo(() => {
    if (!store?.slug) return "#";
    return `/loja/${store.slug}`;
  }, [store?.slug]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const data = await apiFetch<{ store: StoreSummary }>(
        `/api/v1/stores/${storeId}/theme`,
        {
          method: "PATCH",
          json: {
            themeId,
            themeSettings: settings,
            logoUrl: settings.brand.logoUrl,
          },
        },
      );
      setStore(data.store);
      setSettings(data.store.themeSettings ?? settings);
      setMessage("Tema salvo. Abra a vitrine para ver o resultado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  function updateSectionProp(
    sectionId: string,
    key: string,
    value: string | boolean,
  ) {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        home: {
          sections: prev.home.sections.map((s) =>
            s.id === sectionId
              ? { ...s, props: { ...s.props, [key]: value } }
              : s,
          ),
        },
      };
    });
  }

  if (loading) {
    return (
      <main className="panel-page">
        <p className="panel-muted-note">Carregando editor de tema…</p>
      </main>
    );
  }

  if (!store || !settings) {
    return (
      <main className="panel-page">
        <p className="panel-alert">{error || "Loja não encontrada"}</p>
        <Link href="/painel/canais/loja-virtual" className="btn btn-secondary">
          Voltar
        </Link>
      </main>
    );
  }

  return (
    <main className="panel-page dm-theme-editor">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">
            <Link href="/painel/canais/loja-virtual" className="panel-text-link">
              ← Loja virtual
            </Link>
          </p>
          <h1>Editar tema</h1>
          <p className="panel-lead">
            {meta.name} · {store.name}
            {store.status === "ACTIVE" ? " · Ativo" : ""}
          </p>
        </div>
        <div className="panel-head-actions">
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            Pré-visualizar loja
          </a>
          <button
            type="button"
            className="btn btn-primary"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      {error ? <p className="panel-alert">{error}</p> : null}
      {message ? <p className="panel-info">{message}</p> : null}

      <div className="dm-editor-layout">
        <section className="dm-editor-panel" aria-label="Atributos do tema">
          <h2>Marca</h2>
          <label className="xn-modal-field">
            <span>Nome exibido</span>
            <input
              className="field-input"
              value={settings.brand.name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brand: { ...settings.brand, name: e.target.value },
                })
              }
            />
          </label>
          <label className="xn-modal-field">
            <span>Tagline</span>
            <input
              className="field-input"
              value={settings.brand.tagline}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brand: { ...settings.brand, tagline: e.target.value },
                })
              }
            />
          </label>
          <label className="xn-modal-field">
            <span>URL do logo</span>
            <input
              className="field-input"
              placeholder="https://…/logo.png"
              value={settings.brand.logoUrl ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brand: {
                    ...settings.brand,
                    logoUrl: e.target.value.trim() || null,
                  },
                })
              }
            />
          </label>

          <h2>Cores</h2>
          <div className="dm-color-grid">
            {(
              [
                ["primary", "Primária"],
                ["secondary", "Secundária"],
                ["background", "Fundo"],
                ["surface", "Superfície"],
                ["text", "Texto"],
                ["muted", "Texto suave"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="dm-color-field">
                <span>{label}</span>
                <input
                  type="color"
                  value={settings.colors[key]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, [key]: e.target.value },
                    })
                  }
                />
                <input
                  className="field-input"
                  value={settings.colors[key]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, [key]: e.target.value },
                    })
                  }
                />
              </label>
            ))}
          </div>

          <h2>Tipografia</h2>
          <label className="xn-modal-field">
            <span>Fonte dos títulos</span>
            <select
              className="field-input"
              value={settings.typography.heading}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  typography: {
                    ...settings.typography,
                    heading: e.target.value,
                  },
                })
              }
            >
              <option value='Georgia, "Times New Roman", serif'>Serif</option>
              <option value="system-ui, -apple-system, Segoe UI, sans-serif">
                System sans
              </option>
              <option value="ui-sans-serif, system-ui, sans-serif">
                UI sans
              </option>
              <option value='"Segoe UI", Roboto, Helvetica, Arial, sans-serif'>
                Segoe / Roboto
              </option>
            </select>
          </label>

          <h2>Hero</h2>
          {hero ? (
            <>
              <label className="xn-modal-field">
                <span>Título</span>
                <input
                  className="field-input"
                  value={String(hero.props.title || "")}
                  onChange={(e) =>
                    updateSectionProp(hero.id, "title", e.target.value)
                  }
                />
              </label>
              <label className="xn-modal-field">
                <span>Subtítulo</span>
                <textarea
                  className="field-input"
                  rows={3}
                  value={String(hero.props.subtitle || "")}
                  onChange={(e) =>
                    updateSectionProp(hero.id, "subtitle", e.target.value)
                  }
                />
              </label>
              <label className="xn-modal-field">
                <span>Texto do botão</span>
                <input
                  className="field-input"
                  value={String(hero.props.ctaLabel || "")}
                  onChange={(e) =>
                    updateSectionProp(hero.id, "ctaLabel", e.target.value)
                  }
                />
              </label>
            </>
          ) : null}

          <h2>Barra de anúncio</h2>
          {announcement ? (
            <>
              <label className="dm-toggle">
                <input
                  type="checkbox"
                  checked={announcement.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      home: {
                        sections: settings.home.sections.map((s) =>
                          s.id === announcement.id
                            ? { ...s, enabled: e.target.checked }
                            : s,
                        ),
                      },
                    })
                  }
                />
                <span>Exibir barra</span>
              </label>
              <label className="xn-modal-field">
                <span>Texto</span>
                <input
                  className="field-input"
                  value={String(announcement.props.text || "")}
                  onChange={(e) =>
                    updateSectionProp(announcement.id, "text", e.target.value)
                  }
                />
              </label>
            </>
          ) : null}
        </section>

        <section className="dm-editor-preview" aria-label="Prévia">
          <div className="dm-editor-preview-frame">
            <div
              className="dm-editor-preview-inner"
              style={
                {
                  "--dm-primary": settings.colors.primary,
                  "--dm-secondary": settings.colors.secondary,
                  "--dm-bg": settings.colors.background,
                  "--dm-surface": settings.colors.surface,
                  "--dm-text": settings.colors.text,
                  "--dm-muted": settings.colors.muted,
                  "--dm-font-heading": settings.typography.heading,
                  "--dm-font-body": settings.typography.body,
                } as CSSProperties
              }
            >
              {announcement?.enabled ? (
                <div className="dm-announce">
                  {String(announcement.props.text || "")}
                </div>
              ) : null}
              <div className="dm-header">
                <div className="dm-header-inner">
                  <span className="dm-brand-name">
                    {settings.brand.logoUrl ? "Logo" : settings.brand.name}
                  </span>
                </div>
              </div>
              <div className="dm-hero is-compact">
                <div className="dm-hero-copy">
                  {settings.brand.tagline ? (
                    <p className="dm-eyebrow">{settings.brand.tagline}</p>
                  ) : null}
                  <h1>{String(hero?.props.title || store.name)}</h1>
                  <p>{String(hero?.props.subtitle || "")}</p>
                  <span className="dm-cta">
                    {String(hero?.props.ctaLabel || "Ver produtos")}
                  </span>
                </div>
              </div>
              <div className="dm-products is-compact">
                <h2>Destaques</h2>
                <div className="dm-grid is-dense">
                  {[1, 2, 3].map((n) => (
                    <article key={n} className="dm-card">
                      <div className="dm-card-body">
                        <strong>Produto exemplo {n}</strong>
                        <span className="dm-sku">SKU-00{n}</span>
                      </div>
                      <div className="dm-card-meta">
                        <span className="dm-price">R$ 49,90</span>
                        <span className="dm-stock">Em estoque</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="panel-muted-note">
            Prévia local. A vitrine pública usa os mesmos tokens após salvar.
          </p>
        </section>
      </div>
    </main>
  );
}
