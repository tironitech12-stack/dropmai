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

function initialsFor(title: string) {
  const cleaned = title.replace(/^pr[eé]\s*cadastro\s*/i, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (!parts.length) return "X";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

/** Fix localhost / relative proxy URLs baked by a misconfigured PUBLIC_API_URL. */
export function sanitizeProductImageUrl(
  imageUrl: string | null | undefined,
  product: { externalId: string; id: string; sku: string | null; title: string },
): string | null {
  const raw = (imageUrl ?? "").trim();
  const productId = product.externalId || product.id;

  if (/^https:\/\/arquivos\.mercos\.com\//i.test(raw)) return raw;
  if (/^https:\/\/thumbnails\.meuspedidos\.com\.br\//i.test(raw)) return raw;

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
  const [phase, setPhase] = useState<"img" | "fallback">(
    initial ? "img" : "fallback",
  );
  const [triedForce, setTriedForce] = useState(false);

  useEffect(() => {
    setSrc(initial);
    setPhase(initial ? "img" : "fallback");
    setTriedForce(false);
  }, [initial]);

  if (phase === "fallback" || !src) {
    return (
      <div
        className="xn-thumb xn-thumb-fallback"
        aria-hidden
        title={product.title}
      >
        {initialsFor(product.title)}
      </div>
    );
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
        const isCdn =
          /arquivos\.mercos\.com|thumbnails\.meuspedidos\.com\.br/i.test(src);
        if (isCdn && !triedForce) {
          setTriedForce(true);
          const bust = src.includes("?") ? "&" : "?";
          setSrc(`${src}${bust}_dm=${Date.now()}`);
          return;
        }
        if (!isCdn && !triedForce) {
          setTriedForce(true);
          setSrc(
            buildProxyUrl(product.externalId || product.id, {
              sku: product.sku,
              title: product.title,
              force: true,
            }),
          );
          return;
        }
        // Final: solid fallback — never leave a broken <img> icon.
        setPhase("fallback");
      }}
    />
  );
}
