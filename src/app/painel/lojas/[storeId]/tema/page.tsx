"use client";

import { useParams } from "next/navigation";
import { PuckThemeEditor } from "@/components/PuckThemeEditor";

export default function ThemeEditorPage() {
  const params = useParams<{ storeId: string }>();
  return <PuckThemeEditor storeId={params.storeId} />;
}
