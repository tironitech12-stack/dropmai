"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Soft refresh once so warmed B2B CDN URLs replace proxy placeholders. */
export function XnamaiCatalogRefresh() {
  const router = useRouter();
  useEffect(() => {
    const t = window.setTimeout(() => {
      router.refresh();
    }, 4500);
    return () => window.clearTimeout(t);
  }, [router]);
  return null;
}
