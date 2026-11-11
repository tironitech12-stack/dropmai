"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, type ProductRow } from "@/lib/api";

export default function StoreProductsPage() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [mode, setMode] = useState("");
  const [syncInfo, setSyncInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<{ products: ProductRow[]; mode?: string }>(
        `/api/v1/stores/${storeId}/products`,
      );
      setProducts(data.products ?? []);
      setMode(data.mode ?? "");
    } catch (err) {
      setSyncInfo(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  async function runSync() {
    setSyncing(true);
    try {
      const data = await apiFetch<{
        mode: string;
        source: string;
        upserted: number;
        fetched: number;
        error?: string;
      }>("/api/v1/sync/xnamai", {
        method: "POST",
        json: { forceMock: true },
      });
      setSyncInfo(
        `Sync ${data.mode} via ${data.source}: ${data.upserted}/${data.fetched} produtos` +
          (data.error ? ` — ${data.error}` : ""),
      );
      await load();
    } catch (err) {
      setSyncInfo(err instanceof Error ? err.message : "Falha no sync");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <main className="fade-up">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <Link href="/painel" className="muted">
            ← Lojas
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.1rem",
              margin: "0.4rem 0",
            }}
          >
            Catálogo da loja
          </h1>
          <p className="muted" style={{ marginTop: 0 }}>
            Fornecedor #1: Xnamai. {mode ? `Fonte atual: ${mode}.` : null}
          </p>
        </div>
        <button className="btn btn-primary" onClick={runSync} disabled={syncing}>
          {syncing ? "Sincronizando…" : "Sincronizar Xnamai"}
        </button>
      </div>

      {syncInfo ? (
        <p className="panel" style={{ padding: "0.85rem 1rem" }}>
          {syncInfo}
        </p>
      ) : null}

      {loading ? (
        <p className="muted">Carregando produtos…</p>
      ) : (
        <div className="panel" style={{ overflow: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <th style={th}>SKU</th>
                <th style={th}>Produto</th>
                <th style={th}>Custo</th>
                <th style={th}>Venda*</th>
                <th style={th}>Estoque</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={td}>{p.sku || p.externalId || p.id}</td>
                  <td style={td}>
                    <div>{p.title}</div>
                    {p.categoryName ? (
                      <div className="muted" style={{ fontSize: "0.85rem" }}>
                        {p.categoryName}
                      </div>
                    ) : null}
                  </td>
                  <td style={td}>
                    {p.costPrice != null ? formatBRL(p.costPrice) : "—"}
                  </td>
                  <td style={td}>{formatBRL(p.sellPrice)}</td>
                  <td style={td}>{p.stock}</td>
                  <td style={td}>
                    {p.active === false
                      ? "Inativo"
                      : p.publishedOnSite
                        ? "No site"
                        : "No catálogo"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 ? (
            <p className="muted" style={{ padding: "1rem" }}>
              Nenhum produto. Clique em sincronizar para importar o mock Xnamai.
            </p>
          ) : null}
        </div>
      )}
      <p className="muted" style={{ fontSize: "0.85rem" }}>
        * Markup padrão 35% sobre o custo do fornecedor.
      </p>
    </main>
  );
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const th: CSSProperties = { padding: "0.85rem 1rem", whiteSpace: "nowrap" };
const td: CSSProperties = { padding: "0.75rem 1rem", verticalAlign: "top" };
