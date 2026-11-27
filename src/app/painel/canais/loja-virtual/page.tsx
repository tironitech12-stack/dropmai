import Link from "next/link";
import { ThemeApplyButton } from "@/components/ThemeApplyButton";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";
import { THEME_META, themeMeta } from "@/lib/themes";

export default async function LojaVirtualPage() {
  let stores: StoreSummary[] = [];
  let themes = THEME_META;

  // Parallel stores + themes (layout already fetched stores once; this keeps
  // page self-contained but no longer serializes the two calls).
  const [storesResult, themesResult] = await Promise.allSettled([
    apiFetchServer<{ stores: StoreSummary[] }>("/api/v1/stores"),
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
  const activeTheme = themeMeta(primary?.themeId || "vitrine");

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
              <div className="panel-form-actions">
                <Link
                  href={`/painel/lojas/${primary.id}/tema`}
                  className="btn btn-primary"
                >
                  Editar tema
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
            <div
              className="dm-active-theme-preview"
              style={{
                background: `linear-gradient(145deg, ${activeTheme.previewAccent}22, #fff 55%)`,
                borderColor: `${activeTheme.previewAccent}55`,
              }}
            >
              <div
                className="dm-active-theme-swatch"
                style={{ background: activeTheme.previewAccent }}
              />
              <strong>{activeTheme.name}</strong>
              <span>Tema gratuito Dropmai</span>
            </div>
          </section>

          <section className="panel-section" aria-labelledby="descobrir-temas">
            <div className="panel-section-head">
              <h2 id="descobrir-temas">Descobrir temas</h2>
              <p>
                Seis estilos gratuitos — marca, minimal, B2B, boutique, street e
                varejo solar. Depois personalize no editor.
              </p>
            </div>
            <div className="dm-theme-grid">
              {themes.map((theme) => {
                const active = (primary.themeId || "vitrine") === theme.id;
                const accent2 = theme.previewAccent2 || theme.previewAccent;
                return (
                  <article key={theme.id} className="dm-theme-card">
                    <div
                      className="dm-theme-card-preview"
                      style={{
                        background: `linear-gradient(145deg, ${theme.previewAccent} 0%, ${accent2} 55%, #f8fafc 120%)`,
                      }}
                    >
                      <span>{theme.name}</span>
                    </div>
                    <div className="dm-theme-card-body">
                      <strong>{theme.name}</strong>
                      <span className="xn-meta">da Dropmai · Gratuito</span>
                      <p>{theme.tagline}</p>
                      <ThemeApplyButton
                        storeId={primary.id}
                        themeId={theme.id}
                        active={active}
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
