import { PanelPlaceholder } from "@/components/PanelPlaceholder";

export default function MarketplacesPage() {
  return (
    <PanelPlaceholder
      eyebrow="Canais de vendas"
      title="Marketplaces"
      lead="Conecte Mercado Livre, Shopee, Amazon e outros canais depois."
      emptyTitle="Nenhum marketplace conectado"
      emptyBody="As integrações de anúncio e sincronização de estoque chegarão aqui."
      actionHref="/painel/integracoes"
      actionLabel="Ver integrações"
    />
  );
}
