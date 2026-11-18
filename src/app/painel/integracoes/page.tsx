import { PanelPlaceholder } from "@/components/PanelPlaceholder";

export default function IntegracoesPage() {
  return (
    <PanelPlaceholder
      eyebrow="Apps"
      title="Integrações"
      lead="Conecte fornecedores, pagamentos e canais externos à Dropmai."
      emptyTitle="Adicionar integração"
      emptyBody="Xnamai já é o fornecedor #1. Em breve você poderá adicionar apps e webhooks."
      actionHref="/painel/lojas"
      actionLabel="Ver lojas"
    />
  );
}
