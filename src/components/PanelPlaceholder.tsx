import Link from "next/link";

type PanelPlaceholderProps = {
  eyebrow: string;
  title: string;
  lead: string;
  emptyTitle: string;
  emptyBody: string;
  actionHref?: string;
  actionLabel?: string;
};

export function PanelPlaceholder({
  eyebrow,
  title,
  lead,
  emptyTitle,
  emptyBody,
  actionHref = "/painel",
  actionLabel = "Voltar ao início",
}: PanelPlaceholderProps) {
  return (
    <main className="panel-page">
      <div className="panel-page-head">
        <div>
          <p className="panel-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="panel-lead">{lead}</p>
        </div>
      </div>
      <div className="panel-empty">
        <h3>{emptyTitle}</h3>
        <p>{emptyBody}</p>
        <Link href={actionHref} className="btn btn-secondary btn-sm">
          {actionLabel}
        </Link>
      </div>
    </main>
  );
}
