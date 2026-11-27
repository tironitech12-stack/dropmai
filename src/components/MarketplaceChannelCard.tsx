"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export type MarketplaceStatus =
  | "not_configured"
  | "not_connected"
  | "connected"
  | "error";

export type MarketplaceAccount = {
  channel: "MERCADO_LIVRE" | "SHOPEE";
  label: string;
  status: MarketplaceStatus;
  oauthConfigured: boolean;
  externalUserId: string | null;
  connectedAt: string | null;
  lastError: string | null;
  note: string | null;
};

type Props = {
  storeId: string;
  account: MarketplaceAccount;
};

function statusLabel(status: MarketplaceStatus) {
  switch (status) {
    case "connected":
      return "Conectado";
    case "not_configured":
      return "Aguardando credenciais";
    case "error":
      return "Erro";
    default:
      return "Não conectado";
  }
}

function channelSlug(channel: MarketplaceAccount["channel"]) {
  return channel === "MERCADO_LIVRE" ? "mercado_livre" : "shopee";
}

function channelBlurb(channel: MarketplaceAccount["channel"]) {
  if (channel === "MERCADO_LIVRE") {
    return "Anúncios, estoque e pedidos do Mercado Livre na sua loja Dropmai.";
  }
  return "Vitrine Shopee sincronizada com o catálogo importado do fornecedor.";
}

export function MarketplaceChannelCard({ storeId, account }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(account.note);
  const [status, setStatus] = useState(account.status);

  async function connect() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await apiFetch<{
        ok: boolean;
        status?: string;
        authorizeUrl?: string;
        message?: string;
      }>(`/api/v1/stores/${storeId}/marketplaces/${channelSlug(account.channel)}/connect`, {
        method: "POST",
        json: {},
      });

      if (res.authorizeUrl) {
        setMessage(res.message || "Redirecionando para autorização…");
        window.location.href = res.authorizeUrl;
        return;
      }

      setMessage(
        res.message ||
          "Conexão ainda não disponível. Credenciais do provedor não configuradas no Backend.",
      );
      if (res.status === "not_configured") {
        setStatus("not_configured");
      }
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Falha ao iniciar conexão.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setMessage(null);
    try {
      await apiFetch(
        `/api/v1/stores/${storeId}/marketplaces/${channelSlug(account.channel)}/disconnect`,
        { method: "POST", json: {} },
      );
      setStatus("not_connected");
      setMessage("Conta desconectada neste painel.");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Falha ao desconectar.",
      );
    } finally {
      setBusy(false);
    }
  }

  const canConnect = status === "not_connected" || status === "error";
  const canDisconnect = status === "connected";

  return (
    <article
      className={`dm-mp-card dm-mp-card--${account.channel.toLowerCase()}`}
      data-status={status}
    >
      <div className="dm-mp-card-top">
        <div
          className="dm-mp-mark"
          aria-hidden
          data-channel={channelSlug(account.channel)}
        />
        <div>
          <h3>{account.label}</h3>
          <p className="dm-mp-blurb">{channelBlurb(account.channel)}</p>
        </div>
        <span className={`dm-mp-status dm-mp-status--${status}`}>
          {statusLabel(status)}
        </span>
      </div>

      {account.externalUserId ? (
        <p className="dm-mp-meta">ID externo: {account.externalUserId}</p>
      ) : null}

      {message ? <p className="dm-mp-note">{message}</p> : null}

      <div className="dm-mp-actions">
        {canConnect ? (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={busy}
            onClick={() => void connect()}
          >
            {busy ? "Aguarde…" : "Conectar"}
          </button>
        ) : null}
        {canDisconnect ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => void disconnect()}
          >
            {busy ? "Aguarde…" : "Desconectar"}
          </button>
        ) : null}
        {status === "not_configured" ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            title="Credenciais do provedor ainda não estão no Backend"
            onClick={() => void connect()}
          >
            {busy ? "Aguarde…" : "Verificar configuração"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
