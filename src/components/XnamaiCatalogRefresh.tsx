"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Soft refresh so strict BE re-resolve can replace wrong/proxy thumbs. */
export function XnamaiCatalogRefresh() {
  const router = useRouter();
  useEffect(() => {
    const timers = [3500, 9000].map((ms) =>
      window.setTimeout(() => router.refresh(), ms),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [router]);
  return null;
}
