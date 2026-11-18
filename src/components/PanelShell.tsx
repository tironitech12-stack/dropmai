"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { StoreSummary } from "@/lib/api";

type UserInfo = { name?: string; email?: string };

type PanelShellProps = {
  user: UserInfo;
  stores: StoreSummary[];
  children: ReactNode;
};

const NAV = [
  { href: "/painel", label: "Início", icon: IconHome, exact: true },
  { href: "/painel/lojas", label: "Lojas", icon: IconStore },
  { href: "/painel/produtos", label: "Produtos", icon: IconBox },
  { href: "/painel/lojas/nova", label: "Nova loja", icon: IconPlus },
] as const;

export function PanelShell({ user, stores, children }: PanelShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hasStore = stores.length > 0;
  const hasActive = stores.some((s) => s.status?.toUpperCase() === "ACTIVE");
  const setupDone = hasStore && hasActive;
  const displayName = user.name || user.email || "Conta";
  const initials = initialsFrom(displayName);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/painel/lojas") {
      return (
        pathname === "/painel/lojas" ||
        (pathname.startsWith("/painel/lojas/") &&
          !pathname.startsWith("/painel/lojas/nova"))
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <>
      <div className="panel-side-top">
        <Link href="/painel" className="panel-brand wordmark">
          dropmai
        </Link>
        <p className="panel-side-kicker">Painel do lojista</p>
      </div>

      <nav className="panel-nav" aria-label="Principal">
        {NAV.map((item) => {
          const active = isActive(item.href, "exact" in item ? item.exact : false);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`panel-nav-link${active ? " is-active" : ""}`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="panel-side-mid">
        <div className={`panel-setup${setupDone ? " is-done" : ""}`}>
          <div className="panel-setup-title">
            {setupDone ? "Setup concluído" : "Setup pendente"}
          </div>
          <ul className="panel-setup-list">
            <SetupItem done={hasStore} label="Criar primeira loja" />
            <SetupItem done={hasActive} label="Loja ativa" />
            <SetupItem done={hasStore} label="Abrir catálogo de produtos" />
          </ul>
          {!hasStore ? (
            <Link href="/painel/lojas/nova" className="panel-setup-cta">
              Criar loja
            </Link>
          ) : null}
        </div>
      </div>

      <div className="panel-side-bottom">
        <Link
          href="/painel/configuracoes"
          className={`panel-nav-link${pathname.startsWith("/painel/configuracoes") ? " is-active" : ""}`}
        >
          <IconGear />
          <span>Configurações</span>
        </Link>
        <div className="panel-user">
          <span className="panel-avatar" aria-hidden>
            {initials}
          </span>
          <div className="panel-user-meta">
            <strong>{displayName}</strong>
            {user.email && user.name ? <span>{user.email}</span> : null}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="panel-app">
      <aside className="panel-sidebar panel-sidebar-desktop">{sidebar}</aside>

      <div
        className={`panel-drawer${open ? " is-open" : ""}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="panel-drawer-backdrop"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
        <aside className="panel-sidebar panel-sidebar-mobile" id="panel-mobile-nav">
          {sidebar}
        </aside>
      </div>

      <div className="panel-main">
        <header className="panel-topbar">
          <button
            type="button"
            className="panel-menu-btn"
            aria-expanded={open}
            aria-controls="panel-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <IconMenu />
            <span>Menu</span>
          </button>
          <div className="panel-topbar-right">
            <span className="panel-topbar-user">{displayName}</span>
          </div>
        </header>
        <div className="panel-content fade-up">{children}</div>
      </div>
    </div>
  );
}

function SetupItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={done ? "is-done" : "is-pending"}>
      <span className="panel-setup-mark" aria-hidden>
        {done ? "✓" : "–"}
      </span>
      <span>{label}</span>
    </li>
  );
}

function initialsFrom(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStore() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Zm4 0V20m8-10.5V20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 12 20 7.5M12 12 4 7.5M12 12v9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M19.4 13.1a1.2 1.2 0 0 0 .24 1.32l.06.06a1.45 1.45 0 1 1-2.05 2.05l-.06-.06a1.2 1.2 0 0 0-1.32-.24 1.2 1.2 0 0 0-.72 1.1v.17a1.45 1.45 0 1 1-2.9 0v-.09a1.2 1.2 0 0 0-.78-1.1 1.2 1.2 0 0 0-1.32.24l-.06.06a1.45 1.45 0 1 1-2.05-2.05l.06-.06a1.2 1.2 0 0 0 .24-1.32 1.2 1.2 0 0 0-1.1-.72h-.17a1.45 1.45 0 1 1 0-2.9h.09a1.2 1.2 0 0 0 1.1-.78 1.2 1.2 0 0 0-.24-1.32l-.06-.06a1.45 1.45 0 1 1 2.05-2.05l.06.06a1.2 1.2 0 0 0 1.32.24h.08a1.2 1.2 0 0 0 .72-1.1v-.17a1.45 1.45 0 1 1 2.9 0v.09a1.2 1.2 0 0 0 .72 1.1 1.2 1.2 0 0 0 1.32-.24l.06-.06a1.45 1.45 0 1 1 2.05 2.05l-.06.06a1.2 1.2 0 0 0-.24 1.32v.08a1.2 1.2 0 0 0 1.1.72h.17a1.45 1.45 0 1 1 0 2.9h-.09a1.2 1.2 0 0 0-1.1.72Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
