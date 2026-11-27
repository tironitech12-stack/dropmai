import { redirect } from "next/navigation";
import { PanelShell } from "@/components/PanelShell";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Parallelize independent session + store lookups (was a serial waterfall).
  const [meResult, storesResult] = await Promise.allSettled([
    apiFetchServer<{ user: { name?: string; email?: string } | null }>(
      "/api/v1/auth/me",
    ),
    apiFetchServer<{ stores: StoreSummary[] }>("/api/v1/stores"),
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
