"use client";

import { createContext, useContext } from "react";
import type { ProductRow } from "@/lib/api";

export type StorefrontRuntime = {
  storeName: string;
  storeSlug: string;
  products: ProductRow[];
};

const StorefrontRuntimeContext = createContext<StorefrontRuntime>({
  storeName: "Loja",
  storeSlug: "loja",
  products: [],
});

export function StorefrontRuntimeProvider({
  value,
  children,
}: {
  value: StorefrontRuntime;
  children: React.ReactNode;
}) {
  return (
    <StorefrontRuntimeContext.Provider value={value}>
      {children}
    </StorefrontRuntimeContext.Provider>
  );
}

export function useStorefrontRuntime() {
  return useContext(StorefrontRuntimeContext);
}
