import Link from "next/link";
import { HeroRotate } from "@/components/HeroRotate";

const HERO = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"] as const;
const TILES = [
  "/tile-1.jpg",
  "/tile-2.jpg",
  "/tile-3.jpg",
  "/tile-4.jpg",
  "/tile-5.jpg",
  "/tile-6.jpg",
] as const;

export default function HomePage() {
  return (
    <div className="landing">
      <header className="shell nav">
        <Link href="/" className="wordmark" aria-label="dropmai">
          dropmai
        </Link>
        <div className="nav-actions">
          <Link href="/entrar" className="btn btn-text">
            Entrar
          </Link>
          <Link href="/painel/lojas/nova" className="btn btn-solid btn-nav">
            Criar loja
          </Link>
        </div>
      </header>

      <section className="hero" aria-label="Hero Dropmai">
        <div className="hero-media" aria-hidden>
          {HERO.map((src) => (
            <div className="hero-slide" key={src}>
              <img src={src} alt="" width={1920} height={1080} />
            </div>
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="shell hero-copy">
          <p className="hero-brand wordmark rise">dropmai</p>
          <h1 className="hero-kicker rise rise-d1">
            <span className="hero-line">Sua loja pode ser</span>
            <HeroRotate />
          </h1>
          <p className="hero-sub rise rise-d2">
            Catálogo Xnamai na vitrine, subdomínio ou domínio seu — marketplaces
            quando você quiser.
          </p>
          <div className="hero-cta rise rise-d3">
            <Link href="/painel/lojas/nova" className="btn btn-solid">
              Criar minha loja
            </Link>
            <Link href="/loja/minhaloja" className="btn btn-outline">
              Ver vitrine demo
            </Link>
          </div>
        </div>
      </section>

      <section className="mosaic-section">
        <div className="shell">
          <div className="mosaic-head">
            <h2>Lojas no ar. Estoque com o fornecedor.</h2>
            <p>
              Dropshipping com clareza: sua marca na frente, Xnamai no catálogo,
              marketplaces quando fizer sentido.
            </p>
          </div>
          <div className="mosaic" aria-hidden>
            {TILES.map((src, i) => (
              <div className={`tile tile-${i + 1}`} key={src}>
                <img src={src} alt="" width={800} height={1000} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="proof">
        <div className="shell proof-grid">
          <div className="proof-item">
            <strong>Loja própria</strong>
            <p>
              Subdomínio <em>minhaloja.dropmai.com.br</em> ou domínio customizado.
            </p>
          </div>
          <div className="proof-item">
            <strong>Catálogo Xnamai</strong>
            <p>Importe produtos do fornecedor e publique na vitrine com markup.</p>
          </div>
          <div className="proof-item">
            <strong>Marketplaces depois</strong>
            <p>Site primeiro. Depois Mercado Livre, Shopee e Amazon.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="shell">
          <span className="wordmark">dropmai</span>
          <p>Loja própria · Xnamai · marketplaces</p>
        </div>
      </footer>
    </div>
  );
}
