"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { apiFetch, type StoreSummary } from "@/lib/api";
import { XnamaiProductThumb } from "@/components/XnamaiProductThumb";

export type ImportableProduct = {
  id: string;
  externalId: string;
  sku: string | null;
  title: string;
  description?: string | null;
  stock: number;
  costPrice: number;
  categoryName: string | null;
  imageUrl: string | null;
};

type PriceMode = "markup" | "fixed";

type Props = {
  product: ImportableProduct;
  open: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null;
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

const PANEL_WIDTH = 380;
const PANEL_MAX_HEIGHT = 560;
const GAP = 8;

function computePanelStyle(anchor: DOMRect | null): CSSProperties {
  if (typeof window === "undefined") {
    return { top: 80, left: 24, width: PANEL_WIDTH };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(PANEL_WIDTH, vw - 24);

  // Mobile / narrow: dock near bottom of viewport (still not page-center modal).
  if (vw < 640 || !anchor) {
    return {
      left: 12,
      right: 12,
      bottom: 12,
      width: "auto",
      maxHeight: Math.min(PANEL_MAX_HEIGHT, vh - 24),
    };
  }

  let left = anchor.left;
  if (left + width > vw - 12) left = Math.max(12, vw - width - 12);
  if (left < 12) left = 12;

  const spaceBelow = vh - anchor.bottom - GAP;
  const spaceAbove = anchor.top - GAP;
  const preferBelow = spaceBelow >= 280 || spaceBelow >= spaceAbove;

  if (preferBelow) {
    const top = Math.min(anchor.bottom + GAP, vh - 120);
    return {
      top,
      left,
      width,
      maxHeight: Math.min(PANEL_MAX_HEIGHT, Math.max(220, vh - top - 12)),
    };
  }

  const maxHeight = Math.min(PANEL_MAX_HEIGHT, Math.max(220, spaceAbove));
  const top = Math.max(12, anchor.top - GAP - maxHeight);
  return {
    top,
    left,
    width,
    maxHeight,
  };
}

export function ImportToStoreModal({
  product,
  open,
  onClose,
  anchorRect,
}: Props) {
  const cost = Number(product.costPrice) || 0;
  const panelRef = useRef<HTMLDivElement>(null);
  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [storeId, setStoreId] = useState("");
  const [priceMode, setPriceMode] = useState<PriceMode>("markup");
  const [markupPercent, setMarkupPercent] = useState("35");
  const [fixedPrice, setFixedPrice] = useState(() =>
    String(round2(cost * 1.35).toFixed(2)),
  );
  const [loadingStores, setLoadingStores] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>(() =>
    computePanelStyle(anchorRect),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    setPanelStyle(computePanelStyle(anchorRect));
  }, [open, anchorRect]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => setPanelStyle(computePanelStyle(anchorRect));
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, anchorRect]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(null);
    setPriceMode("markup");
    setMarkupPercent("35");
    setFixedPrice(String(round2(cost * 1.35).toFixed(2)));
    setLoadingStores(true);
    void apiFetch<{ stores: StoreSummary[] }>("/api/v1/stores")
      .then((data) => {
        const list = data.stores ?? [];
        setStores(list);
        setStoreId((prev) => prev || list[0]?.id || "");
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar lojas",
        );
      })
      .finally(() => setLoadingStores(false));
  }, [open, cost, product.id]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // pointerdown in bubble phase (not capture) so the opening click on the
    // button finishes first; ignore events inside the panel or its anchor.
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest(`[data-import-anchor="${product.id}"]`)
      ) {
        return;
      }
      onClose();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open, onClose, product.id]);

  const markupNum = Number(String(markupPercent).replace(",", ".")) || 0;
  const fixedNum = Number(String(fixedPrice).replace(",", ".")) || 0;

  const sellPrice = useMemo(() => {
    if (priceMode === "fixed") return round2(fixedNum);
    return round2(cost * (1 + markupNum / 100));
  }, [priceMode, fixedNum, cost, markupNum]);

  const impliedMarkup = useMemo(() => {
    if (cost <= 0) return 0;
    return round2(((sellPrice - cost) / cost) * 100);
  }, [sellPrice, cost]);

  const profit = useMemo(() => round2(sellPrice - cost), [sellPrice, cost]);

  if (!open || !mounted) return null;

  async function submit() {
    setError(null);
    setSuccess(null);
    if (!storeId) {
      setError("Selecione uma loja para importar.");
      return;
    }
    if (sellPrice < 0) {
      setError("Preço de venda inválido.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await apiFetch<{
        ok?: boolean;
        mode?: string;
        message?: string;
        listing?: { sellPrice: number; profit?: number };
        error?: string;
      }>(`/api/v1/stores/${storeId}/products/import`, {
        method: "POST",
        json: {
          externalId: product.externalId || product.id,
          sku: product.sku,
          title: product.title,
          description: product.description ?? null,
          costPrice: cost,
          stock: product.stock,
          categoryName: product.categoryName,
          imageUrl: product.imageUrl,
          priceMode,
          sellPrice: priceMode === "fixed" ? sellPrice : undefined,
          markupPercent: priceMode === "markup" ? markupNum : impliedMarkup,
          publishedOnSite: true,
        },
      });
      if (data.error) throw new Error(data.error);
      const storeName =
        stores.find((s) => s.id === storeId)?.name || "sua loja";
      setSuccess(
        `Importado para ${storeName} a ${formatBRL(data.listing?.sellPrice ?? sellPrice)}` +
          (data.mode === "memory" && data.message
            ? ` · ${data.message}`
            : ""),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao importar");
    } finally {
      setSubmitting(false);
    }
  }

  const panel = (
    <div
      ref={panelRef}
      className="xn-import-popover"
      style={panelStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="xn-import-title"
    >
      <header className="xn-modal-head">
        <div>
          <p className="panel-eyebrow">Importar produto</p>
          <h2 id="xn-import-title">Importar para a loja</h2>
        </div>
        <button
          type="button"
          className="xn-modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
      </header>

      <div className="xn-modal-product">
        <div className="xn-modal-thumb">
          <XnamaiProductThumb product={product} />
        </div>
        <div className="xn-modal-product-body">
          <strong>{product.title}</strong>
          <span className="xn-meta">
            {product.sku || product.externalId}
            {product.categoryName ? ` · ${product.categoryName}` : ""}
          </span>
        </div>
      </div>

      <dl className="xn-modal-facts">
        <div>
          <dt>Custo / valor</dt>
          <dd>{formatBRL(cost)}</dd>
        </div>
        <div>
          <dt>Estoque</dt>
          <dd>{product.stock}</dd>
        </div>
      </dl>

      <label className="xn-modal-field">
        <span>Loja de destino</span>
        {loadingStores ? (
          <span className="panel-muted-note">Carregando lojas…</span>
        ) : stores.length === 0 ? (
          <span className="panel-alert">
            Nenhuma loja ainda. Crie uma em Loja virtual antes de importar.
          </span>
        ) : (
          <select
            className="field-input"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.slug})
              </option>
            ))}
          </select>
        )}
      </label>

      <div className="xn-price-mode" role="group" aria-label="Tipo de preço">
        <button
          type="button"
          className={`xn-price-mode-btn${priceMode === "markup" ? " is-active" : ""}`}
          onClick={() => setPriceMode("markup")}
        >
          % markup
        </button>
        <button
          type="button"
          className={`xn-price-mode-btn${priceMode === "fixed" ? " is-active" : ""}`}
          onClick={() => setPriceMode("fixed")}
        >
          Valor fixo
        </button>
      </div>

      {priceMode === "markup" ? (
        <label className="xn-modal-field">
          <span>Markup sobre o custo (%)</span>
          <input
            className="field-input"
            type="number"
            min={0}
            step={0.1}
            value={markupPercent}
            onChange={(e) => setMarkupPercent(e.target.value)}
          />
        </label>
      ) : (
        <label className="xn-modal-field">
          <span>Preço de venda (R$)</span>
          <input
            className="field-input"
            type="number"
            min={0}
            step={0.01}
            value={fixedPrice}
            onChange={(e) => setFixedPrice(e.target.value)}
          />
        </label>
      )}

      <div className="xn-modal-calc" aria-live="polite">
        <div>
          <span>Venda</span>
          <strong>{formatBRL(sellPrice)}</strong>
        </div>
        <div>
          <span>Markup</span>
          <strong>
            {impliedMarkup.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            })}
            %
          </strong>
        </div>
        <div className={profit >= 0 ? "is-profit" : "is-loss"}>
          <span>Lucro</span>
          <strong>{formatBRL(profit)}</strong>
        </div>
      </div>

      {error ? <p className="panel-alert">{error}</p> : null}
      {success ? <p className="panel-info">{success}</p> : null}

      <footer className="xn-modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {success ? "Fechar" : "Cancelar"}
        </button>
        {!success ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={submitting || stores.length === 0}
            onClick={() => void submit()}
          >
            {submitting ? "Importando…" : "Importar"}
          </button>
        ) : null}
      </footer>
    </div>
  );

  // Portal escapes PanelShell `.fade-up` / overflow parents so fixed coords
  // are viewport-relative and the panel is not clipped by the product card.
  return createPortal(panel, document.body);
}

export function ImportToStoreButton({ product }: { product: ImportableProduct }) {
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function toggleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect() ?? null;
    setAnchorRect(rect);
    setOpen(true);
  }

  return (
    <div className="xn-import-anchor" data-import-anchor={product.id}>
      <button
        ref={btnRef}
        type="button"
        className="btn btn-secondary btn-sm xn-import-btn"
        aria-expanded={open}
        onClick={toggleOpen}
      >
        Importar para a loja
      </button>
      <ImportToStoreModal
        product={product}
        open={open}
        anchorRect={anchorRect}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
