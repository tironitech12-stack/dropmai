"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { apiFetch } from "@/lib/api";
import {
  googleAuthUrl,
  isValidEmail,
  mirrorSessionCookie,
  normalizeEmail,
} from "@/lib/auth";
import { AuthShell, GoogleButton } from "@/components/AuthShell";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => {
    const err = params.get("error");
    if (!err) return null;
    if (err === "google_not_configured") {
      return "Google ainda não está configurado no servidor (GOOGLE_CLIENT_ID). Use e-mail e senha por enquanto.";
    }
    if (err === "google_failed") {
      return "Falha ao validar o login Google. Tente de novo.";
    }
    return "Não foi possível entrar com Google.";
  });
  const [loading, setLoading] = useState(false);

  const googleHref = useMemo(() => {
    if (typeof window === "undefined") return "";
    return googleAuthUrl(`${window.location.origin}/painel`);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setFieldError("Informe um e-mail válido.");
      return;
    }
    if (!password.trim()) {
      setFieldError("Informe a senha.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch<{
        ok: boolean;
        session?: string;
        user?: { id: string; email: string; name: string };
      }>("/api/v1/auth/login", {
        method: "POST",
        json: { email: normalized, password },
      });
      mirrorSessionCookie(data.session);
      router.push("/painel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Entrar na sua conta"
      subtitle="Acesse o painel Dropmai para criar lojas e publicar o catálogo Xnamai."
      footer={
        <>
          Não tem conta? <Link href="/cadastro">Criar conta</Link>
        </>
      }
    >
      <GoogleButton href={googleHref} />
      <div className="auth-divider">
        <span>ou</span>
      </div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label>
          E-mail
          <input
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
            placeholder="voce@email.com"
          />
        </label>
        <label>
          Senha
          <input
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </label>
        {(fieldError || error) && (
          <p className="auth-error" role="alert">
            {fieldError || error}
          </p>
        )}
        <button className="btn auth-submit" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Continuar"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthShell title="Entrar na sua conta"><p className="auth-sub">Carregando…</p></AuthShell>}>
      <LoginForm />
    </Suspense>
  );
}
