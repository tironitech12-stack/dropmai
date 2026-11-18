"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import {
  googleAuthUrl,
  isValidEmail,
  mirrorSessionCookie,
  normalizeEmail,
} from "@/lib/auth";
import { AuthShell, GoogleButton } from "@/components/AuthShell";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const googleHref = useMemo(() => {
    if (typeof window === "undefined") return "";
    return googleAuthUrl(`${window.location.origin}/painel`);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    if (name.trim().length < 2) {
      setFieldError("Informe seu nome completo.");
      return;
    }
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setFieldError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setFieldError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/v1/auth/register", {
        method: "POST",
        json: { name: name.trim(), email: normalized, password },
      });
      mirrorSessionCookie();
      router.push("/painel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Criar sua conta"
      subtitle="Comece grátis. Depois você cria a loja e conecta o catálogo Xnamai."
      footer={
        <>
          Já tem conta? <Link href="/entrar">Entrar</Link>
        </>
      }
    >
      <GoogleButton href={googleHref} />
      <div className="auth-divider">
        <span>ou</span>
      </div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label>
          Nome
          <input
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            autoComplete="name"
            required
            placeholder="Seu nome"
          />
        </label>
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
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />
        </label>
        {(fieldError || error) && (
          <p className="auth-error" role="alert">
            {fieldError || error}
          </p>
        )}
        <button className="btn auth-submit" type="submit" disabled={loading}>
          {loading ? "Criando…" : "Criar conta"}
        </button>
      </form>
    </AuthShell>
  );
}
