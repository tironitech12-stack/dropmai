import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="auth-screen">
      <div className="auth-bg" aria-hidden>
        <img src="/hero-1.jpg" alt="" />
        <div className="auth-bg-veil" />
      </div>

      <div className="auth-wrap">
        <Link href="/" className="wordmark auth-brand">
          dropmai
        </Link>

        <div className="auth-card">
          <h1>{title}</h1>
          {subtitle ? <p className="auth-sub">{subtitle}</p> : null}
          {children}
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function GoogleButton({ href, disabled }: { href: string; disabled?: boolean }) {
  if (!href || disabled) {
    return (
      <button
        type="button"
        className="btn auth-google"
        disabled
        title="Configure GOOGLE_CLIENT_ID no backend"
      >
        <GoogleIcon />
        Continuar com Google
      </button>
    );
  }

  return (
    <a className="btn auth-google" href={href}>
      <GoogleIcon />
      Continuar com Google
    </a>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.1 44 32 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
