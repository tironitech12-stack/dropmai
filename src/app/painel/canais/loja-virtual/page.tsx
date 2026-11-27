import Link from "next/link";
import { ThemeApplyButton } from "@/components/ThemeApplyButton";
import { ThemeLibraryActivateButton } from "@/components/ThemeLibraryActivateButton";
import { ThemeThumb } from "@/components/ThemeThumb";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";
import { getPanelStores } from "@/lib/panel-data";
import {
  resolveAddedThemeIds,
  THEME_META,
  themeMeta,
  type ThemeDefinition,
} from "@/lib/themes";

export default async function LojaVirtualPage() {
  let stores: StoreSummary[] = [];
  let themes = THEME_META;

  // Reuse layout's /stores via React.cache; fetch themes in parallel (no waterfall).
  const [storesResult, themesResult] = await Promise.allSettled([
    getPanelStores(),
    apiFetchServer<{
      themes: Array<{
        id: string;
        name: string;
        tagline: string;
        free: boolean;
        previewAccent: string;
        previewAccent2?: string;
      }>;
    }>("/api/v1/themes"),
  ]);

  if (storesResult.status === "fulfilled") {
    stores = storesResult.value.stores ?? [];
  }
  if (
    themesResult.status === "fulfilled" &&
    themesResult.value.themes?.length
  ) {
    themes = themesResult.value.themes.map((t) => ({
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      free: true as const,
      previewAccent: t.previewAccent,
      previewAccent2: t.previewAccent2,
    }));
  }

  const primary = stores[0];
  const activeId = primary?.themeId || "vitrine";
  const activeTheme = themeMeta(activeId);
  const addedIds = primary
    ? resolveAddedThemeIds(primary.themeId, primary.themeSettings)
    : [];
  const libraryThemes: ThemeDefinition[] = addedIds.map((id) => themeMeta(id));
  const otherLibrary = libraryThemes.filter((t) => t.id !== activeId);
  const addedCount = libraryThemes.length;

  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">Canais de vendas</p>
          <h1>Loja virtual</h1>
          <p className="panel-lead">
            Temas gratuitos Dropmai, editor de marca e vitrine no seu subdomínio.
          </p>
        </div>
        <div className="panel-head-actions">
          {primary ? (
            <a
              href={`/loja/${primary.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Pré-visualizar loja
            </a>
          ) : null}
          <Link href="/painel/lojas/nova" className="btn btn-secondary">
            Nova loja
          </Link>
        </div>
      </div>

      {!primary ? (
        <div className="panel-empty">
          <h3>Nenhuma loja virtual</h3>
          <p>Crie uma loja para escolher tema e publicar a vitrine.</p>
          <Link href="/painel/lojas/nova" className="btn btn-primary">
            Criar loja
          </Link>
        </div>
      ) : (
        <>
          <section className="dm-active-theme" aria-labelledby="tema-ativo">
            <div className="dm-active-theme-copy">
              <p className="panel-eyebrow">Tema atual</p>
              <h2 id="tema-ativo">{activeTheme.name}</h2>
              <p>
                {primary.name} ·{" "}
                <code>
                  {primary.slug}.dropmai.com.br
                </code>
              </p>
              <p className="panel-muted-note">{activeTheme.tagline}</p>
              <p className="dm-theme-lib-count">
                <strong>{addedCount}</strong>{" "}
                {addedCount === 1
                  ? "tema adicionado"
                  : "temas adicionados"}{" "}
                nesta loja
              </p>
              <div className="panel-form-actions">
                <Link
                  href={`/painel/lojas/${primary.id}/tema`}
                  className="btn btn-primary"
                >
                  Editar tema
                </Link>
                <Link
                  href={`/loja/preview/${activeId}?storeId=${encodeURIComponent(primary.id)}`}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pré-visualizar
                </Link>
                <Link
                  href={`/painel/lojas/${primary.id}/produtos`}
                  className="btn btn-secondary"
                >
                  Produtos da loja
                </Link>
                <a
                  href={`/loja/${primary.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Abrir vitrine
                </a>
              </div>
            </div>
            <div className="dm-active-theme-preview is-thumb">
              <ThemeThumb
                themeId={activeTheme.id}
                name={activeTheme.name}
                accent={activeTheme.previewAccent}
                accent2={activeTheme.previewAccent2 || activeTheme.previewAccent}
              />
              <div className="dm-active-theme-preview-meta">
                <strong>{activeTheme.name}</strong>
                <span>Ativo agora · Dropmai</span>
              </div>
            </div>
          </section>

          <section
            className="panel-section dm-theme-library"
            aria-labelledby="temas-loja"
          >
            <div className="panel-section-head">
              <h2 id="temas-loja">Temas da loja</h2>
              <p>
                Biblioteca desta loja — ative outro tema ou edite o layout no
                Puck.
              </p>
            </div>
            <div className="dm-theme-library-rail">
              {libraryThemes.map((theme) => {
                const isActive = theme.id === activeId;
                return (
                  <article
                    key={theme.id}
                    className={`dm-theme-lib-card${isActive ? " is-active" : ""}`}
                  >
                    <div className="dm-theme-lib-preview">
                      <ThemeThumb
                        themeId={theme.id}
                        name={theme.name}
                        accent={theme.previewAccent}
                        accent2={theme.previewAccent2 || theme.previewAccent}
                      />
                    </div>
                    <div className="dm-theme-lib-body">
                      <strong>{theme.name}</strong>
                      <span className="xn-meta">
                        {isActive ? "Tema ativo" : "Na biblioteca"}
                      </span>
                      <div className="dm-theme-lib-row">
                        <ThemeLibraryActivateButton
                          storeId={primary.id}
                          themeId={theme.id}
                          active={isActive}
                        />
                        <Link
                          href={`/painel/lojas/${primary.id}/tema`}
                          className="btn btn-sm btn-secondary"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/loja/preview/${theme.id}?storeId=${encodeURIComponent(primary.id)}`}
                          className="btn btn-sm btn-secondary"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {otherLibrary.length === 0 ? (
              <p className="dm-theme-lib-empty">
                Só o tema ativo está na biblioteca. Use{" "}
                <strong>Adicionar</strong> em Descobrir temas para guardar
                outros estilos nesta loja.
              </p>
            ) : null}
          </section>

          <section className="panel-section" aria-labelledby="descobrir-temas">
            <div className="panel-section-head">
              <h2 id="descobrir-temas">Descobrir temas</h2>
              <p>
                {themes.length} estilos gratuitos com layout próprio — depois
                personalize no editor Puck.
              </p>
            </div>
            <div className="dm-theme-grid">
              {themes.map((theme) => {
                const active = activeId === theme.id;
                const inLibrary = addedIds.includes(theme.id);
                const accent2 = theme.previewAccent2 || theme.previewAccent;
                return (
                  <article key={theme.id} className="dm-theme-card">
                    <div className="dm-theme-card-preview">
                      <ThemeThumb
                        themeId={theme.id}
                        name={theme.name}
                        accent={theme.previewAccent}
                        accent2={accent2}
                      />
                    </div>
                    <div className="dm-theme-card-body">
                      <strong>{theme.name}</strong>
                      <span className="xn-meta">
                        {inLibrary
                          ? "Na biblioteca · Gratuito"
                          : "da Dropmai · Gratuito"}
                      </span>
                      <p>{theme.tagline}</p>
                      <ThemeApplyButton
                        storeId={primary.id}
                        themeId={theme.id}
                        active={active}
                        inLibrary={inLibrary}
                        showPreview
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
