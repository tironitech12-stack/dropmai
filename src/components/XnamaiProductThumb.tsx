"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiUrl } from "@/lib/api";

type Props = {
  product: {
    id: string;
    externalId: string;
    sku: string | null;
    title: string;
    imageUrl: string | null;
  };
};

function buildProxyUrl(
  productId: string,
  hint: { sku?: string | null; title?: string; force?: boolean },
) {
  const api = getApiUrl() || "https://dropmai-backend.onrender.com";
  const qs = new URLSearchParams();
  if (hint.sku) qs.set("sku", hint.sku);
  if (hint.title) qs.set("q", hint.title.slice(0, 80));
  if (hint.force) qs.set("force", "1");
  const suffix = qs.toString() ? `?${qs}` : "";
  return `${api.replace(/\/$/, "")}/api/v1/suppliers/xnamai/products/${encodeURIComponent(productId)}/image${suffix}`;
}

function isCdnUrl(url: string | null | undefined) {
  return Boolean(
    url && /arquivos\.mercos\.com|thumbnails\.meuspedidos\.com\.br/i.test(url),
  );
}

function isProxyUrl(url: string | null | undefined) {
  return Boolean(url && /\/suppliers\/xnamai\/products\/.+\/image/i.test(url));
}

/** Fix localhost / relative proxy URLs baked by a misconfigured PUBLIC_API_URL. */
export function sanitizeProductImageUrl(
  imageUrl: string | null | undefined,
  product: { externalId: string; id: string; sku: string | null; title: string },
): string | null {
  const raw = (imageUrl ?? "").trim();
  const productId = product.externalId || product.id;

  if (isCdnUrl(raw)) return raw;

  if (raw.startsWith("/api/v1/suppliers/xnamai/products/")) {
    const api = getApiUrl() || "https://dropmai-backend.onrender.com";
    return `${api.replace(/\/$/, "")}${raw}`;
  }

  if (!raw || /localhost|127\.0\.0\.1/i.test(raw)) {
    return buildProxyUrl(productId, { sku: product.sku, title: product.title });
  }

  if (raw.includes("/suppliers/xnamai/products/") && raw.includes("/image")) {
    try {
      const u = new URL(raw);
      const api = getApiUrl() || "https://dropmai-backend.onrender.com";
      const apiHost = new URL(api).host;
      if (u.host !== apiHost || /localhost|127\.0\.0\.1/i.test(u.host)) {
        return buildProxyUrl(productId, {
          sku: product.sku,
          title: product.title,
        });
      }
    } catch {
      return buildProxyUrl(productId, {
        sku: product.sku,
        title: product.title,
      });
    }
  }

  if (/^https?:\/\//i.test(raw)) return raw;
  return buildProxyUrl(productId, { sku: product.sku, title: product.title });
}

export function XnamaiProductThumb({ product }: Props) {
  const initial = useMemo(
    () => sanitizeProductImageUrl(product.imageUrl, product),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product.imageUrl, product.externalId, product.id, product.sku, product.title],
  );
  const [src, setSrc] = useState<string | null>(initial);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(initial);
    setFailed(false);
  }, [initial]);

  // Background upgrade: if we only have a proxy URL, force-resolve once CDN may be warm.
  useEffect(() => {
    if (!src || isCdnUrl(src) || !isProxyUrl(src)) return;
    let cancelled = false;
    const productId = product.externalId || product.id;
    const timers = [1200, 3500].map((ms) =>
      window.setTimeout(async () => {
        const forced = buildProxyUrl(productId, {
          sku: product.sku,
          title: product.title,
          force: true,
        });
        try {
          const res = await fetch(forced, { method: "GET", cache: "no-store" });
          const ct = res.headers.get("content-type") || "";
          if (cancelled || !res.ok) return;
          if (/image\/(jpeg|jpg|png|webp|gif)/i.test(ct)) {
            setSrc(forced);
            setFailed(false);
          }
        } catch {
          /* ignore */
        }
      }, ms),
    );
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [src, product.externalId, product.id, product.sku, product.title]);

  if (failed || !src) {
    // Soft neutral tile — avoid broken-icon glyph. Prefer photos via BE resolve.
    return <div className="xn-thumb xn-thumb-fallback" aria-hidden />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="xn-thumb"
      width={160}
      height={160}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (isCdnUrl(src)) {
          const bust = src.includes("?") ? "&" : "?";
          setSrc(`${src}${bust}_dm=${Date.now()}`);
          return;
        }
        if (isProxyUrl(src) && !/[?&]force=1/.test(src)) {
          setSrc(
            buildProxyUrl(product.externalId || product.id, {
              sku: product.sku,
              title: product.title,
              force: true,
            }),
          );
          return;
        }
        setFailed(true);
      }}
    />
  );
}
