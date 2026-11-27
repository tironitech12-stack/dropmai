import { redirect } from "next/navigation";
import { PanelShell } from "@/components/PanelShell";
import { getPanelMe, getPanelStores } from "@/lib/panel-data";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Parallelize independent session + store lookups (was a serial waterfall).
  // React.cache() dedupes with child pages that also call getPanelStores().
  const [meResult, storesResult] = await Promise.allSettled([
    getPanelMe(),
    getPanelStores(),
  ]);

  const user =
    meResult.status === "fulfilled" ? meResult.value.user : null;
  if (!user) redirect("/entrar");

  const stores =
    storesResult.status === "fulfilled"
      ? (storesResult.value.stores ?? [])
      : [];

  return (
    <PanelShell user={user} stores={stores}>
      {children}
    </PanelShell>
  );
}
