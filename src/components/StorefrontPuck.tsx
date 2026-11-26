"use client";

import { Render } from "@puckeditor/core";
import type { ProductRow } from "@/lib/api";
import { dropmaiPuckConfig } from "@/puck/config";
import type { DropmaiPuckData } from "@/puck/default-data";
import { StorefrontRuntimeProvider } from "@/puck/storefront-context";

type Props = {
  storeName: string;
  storeSlug: string;
  products: ProductRow[];
  data: DropmaiPuckData;
};

export function StorefrontPuck({
  storeName,
  storeSlug,
  products,
  data,
}: Props) {
  return (
    <StorefrontRuntimeProvider value={{ storeName, storeSlug, products }}>
      <Render config={dropmaiPuckConfig} data={data} />
    </StorefrontRuntimeProvider>
  );
}
