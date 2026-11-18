import { PanelPlaceholder } from "@/components/PanelPlaceholder";

export default function ClientesPage() {
  return (
    <PanelPlaceholder
      eyebrow="Clientes"
      title="Clientes"
      lead="Base de compradores das suas lojas Dropmai."
      emptyTitle="Sem clientes por enquanto"
      emptyBody="Os contatos surgem automaticamente conforme os pedidos forem concluídos."
    />
  );
}
