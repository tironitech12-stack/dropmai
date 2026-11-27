"use client";

import Link from "next/link";
import { ThemeApplyButton } from "@/components/ThemeApplyButton";

type Props = {
  themeId: string;
  themeName: string;
  storeId?: string;
  active?: boolean;
};

export function ThemePreviewChrome({
  themeId,
  themeName,
  storeId,
  active,
}: Props) {
  return (
    <div className="dm-theme-preview-chrome">
      <div className="dm-theme-preview-chrome-inner">
        <div className="dm-theme-preview-chrome-meta">
          <strong>{themeName}</strong>
          <span>Pré-visualização · não salva o tema</span>
        </div>
        <div className="dm-theme-preview-chrome-actions">
          <Link
            href="/painel/canais/loja-virtual"
            className="btn btn-sm btn-secondary"
          >
            Fechar
          </Link>
          {storeId ? (
            <ThemeApplyButton
              storeId={storeId}
              themeId={themeId}
              active={active}
            />
          ) : (
            <Link href="/painel/lojas/nova" className="btn btn-sm btn-primary">
              Criar loja para usar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
