import { redirect } from "next/navigation";
import { PanelShell } from "@/components/PanelShell";
import { type StoreSummary } from "@/lib/api";
import { apiFetchServer } from "@/lib/api-server";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { name?: string; email?: string } | null = null;
  let stores: StoreSummary[] = [];

  try {
    const data = await apiFetchServer<{
      user: { name?: string; email?: string } | null;
    }>("/api/v1/auth/me");
    user = data.user;
  } catch {
    user = null;
  }

  if (!user) redirect("/entrar");

  try {
    const data = await apiFetchServer<{ stores: StoreSummary[] }>(
      "/api/v1/stores",
    );
    stores = data.stores ?? [];
  } catch {
    stores = [];
  }

  return (
    <PanelShell user={user} stores={stores}>
      {children}
    </PanelShell>
  );
}
