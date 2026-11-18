"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isSignedSessionToken,
  mirrorSessionCookie,
} from "@/lib/auth";
import { AuthShell } from "@/components/AuthShell";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(raw);
    const session = params.get("session");
    const returnTo = params.get("returnTo") || "/painel";

    if (!isSignedSessionToken(session)) {
      setError("Sessão Google inválida. Tente entrar de novo.");
      return;
    }

    mirrorSessionCookie(session);
    // Drop the token from the address bar.
    window.history.replaceState(null, "", "/auth/callback");

    try {
      const url = new URL(returnTo, window.location.origin);
      if (url.origin === window.location.origin) {
        router.replace(url.pathname + url.search);
      } else {
        router.replace("/painel");
      }
    } catch {
      router.replace("/painel");
    }
    router.refresh();
  }, [router]);

  if (error) {
    return (
      <AuthShell title="Falha no Google">
        <p className="auth-error" role="alert">
          {error}
        </p>
        <a className="btn auth-submit" href="/entrar">
          Voltar ao login
        </a>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Entrando…">
      <p className="auth-sub">Finalizando login com Google.</p>
    </AuthShell>
  );
}
