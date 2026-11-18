"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";
import type { StoreSummary } from "@/lib/api";

type UserInfo = { name?: string; email?: string };
type IconComp = (props: SVGProps<SVGSVGElement>) => ReactNode;

type NavItem = {
  href: string;
  label: string;
  icon: IconComp;
  exact?: boolean;
  match?: (pathname: string) => boolean;
  external?: boolean;
};

type PanelShellProps = {
  user: UserInfo;
  stores: StoreSummary[];
  children: ReactNode;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/painel", label: "Início", icon: IconHome, exact: true },
  { href: "/painel/pedidos", label: "Pedidos", icon: IconOrders },
  { href: "/painel/produtos", label: "Produtos", icon: IconBox },
  { href: "/painel/clientes", label: "Clientes", icon: IconUsers },
  { href: "/painel/crescimento", label: "Crescimento", icon: IconGrowth },
  { href: "/painel/descontos", label: "Descontos", icon: IconTag },
  { href: "/painel/conteudo", label: "Conteúdo", icon: IconDoc },
  { href: "/painel/analises", label: "Análises", icon: IconChart },
  { href: "/painel/carteira", label: "Carteira", icon: IconWallet },
];

export function PanelShell({ user, stores, children }: PanelShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const channelNav: NavItem[] = useMemo(
    () => [
      {
        href: "/painel/canais/loja-virtual",
        label: "Loja virtual",
        icon: IconMonitor,
        match: (path) =>
          path.startsWith("/painel/canais/loja-virtual") ||
          path === "/painel/lojas" ||
          (path.startsWith("/painel/lojas/") &&
            !path.startsWith("/painel/lojas/nova")),
      },
      {
        href: "/painel/canais/marketplaces",
        label: "Marketplaces",
        icon: IconGlobe,
      },
    ],
    [],
  );

  const appsNav: NavItem[] = [
    {
      href: "/painel/integracoes",
      label: "Integrações",
      icon: IconPuzzle,
    },
  ];

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hasStore = stores.length > 0;
  const hasActive = stores.some((s) => s.status?.toUpperCase() === "ACTIVE");
  const setupDone = hasStore && hasActive;
  const displayName = user.name || user.email || "Conta";
  const initials = initialsFrom(displayName);

  function isActive(item: NavItem) {
    if (item.match) return item.match(pathname);
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  function matchesQuery(label: string) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return label.toLowerCase().includes(q);
  }

  const filteredPrimary = PRIMARY_NAV.filter((i) => matchesQuery(i.label));
  const filteredChannels = channelNav.filter((i) => matchesQuery(i.label));
  const filteredApps = appsNav.filter((i) => matchesQuery(i.label));
  const showSettings =
    !query.trim() || "configurações".includes(query.trim().toLowerCase());

  const sidebar = (
    <>
      <div className="panel-side-top">
        <Link href="/painel" className="panel-brand wordmark">
          dropmai
        </Link>
        <label className="panel-search">
          <IconSearch />
          <input
            ref={searchRef}
            type="search"
            placeholder="Pesquisar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Pesquisar no menu"
          />
          <kbd>Ctrl K</kbd>
        </label>
      </div>

      <div className="panel-side-scroll">
        <nav className="panel-nav" aria-label="Principal">
          {filteredPrimary.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </nav>

        {(filteredChannels.length > 0 || !query.trim()) && (
          <div className="panel-nav-section">
            <p className="panel-nav-section-title">Canais de vendas</p>
            <nav className="panel-nav" aria-label="Canais de vendas">
              {filteredChannels.map((item) => (
                <NavLink key={item.label} item={item} active={isActive(item)} />
              ))}
              {!query.trim() ? (
                <Link href="/painel/lojas/nova" className="panel-nav-link">
                  <IconPlus />
                  <span>Nova loja</span>
                </Link>
              ) : null}
            </nav>
          </div>
        )}

        {(filteredApps.length > 0 || !query.trim()) && (
          <div className="panel-nav-section">
            <p className="panel-nav-section-title">Apps</p>
            <nav className="panel-nav" aria-label="Apps">
              {filteredApps.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item)} />
              ))}
              {!query.trim() ? (
                <Link
                  href="/painel/integracoes"
                  className="panel-nav-link panel-nav-add"
                >
                  <IconPlus />
                  <span>Adicionar</span>
                </Link>
              ) : null}
            </nav>
          </div>
        )}

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
      </div>

      <div className="panel-side-bottom">
        {showSettings ? (
          <Link
            href="/painel/configuracoes"
            className={`panel-nav-link${pathname.startsWith("/painel/configuracoes") ? " is-active" : ""}`}
          >
            <IconGear />
            <span>Configurações</span>
          </Link>
        ) : null}
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
        <aside
          className="panel-sidebar panel-sidebar-mobile"
          id="panel-mobile-nav"
        >
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

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  const className = `panel-nav-link${active ? " is-active" : ""}`;
  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        target="_blank"
        rel="noreferrer"
      >
        <Icon />
        <span>{item.label}</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      <Icon />
      <span>{item.label}</span>
    </Link>
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

function iconProps(props: SVGProps<SVGSVGElement>) {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    ...props,
  };
}

function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconOrders(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M7 7h10l1.2 12.2a1 1 0 0 1-1 1.1H6.8a1 1 0 0 1-1-1.1L7 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 7a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBox(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
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

function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M16 19v-1.2A3.8 3.8 0 0 0 12.2 14H7.8A3.8 3.8 0 0 0 4 17.8V19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M20 19v-1a3 3 0 0 0-2.2-2.9M15.5 5.2a3 3 0 0 1 0 5.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGrowth(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M4 16.5 9.5 11l3.5 3.5L20 7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7.5H20V13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M3.5 12.5V5.8A1.8 1.8 0 0 1 5.3 4h6.7l8.2 8.2a1.8 1.8 0 0 1 0 2.5l-4.7 4.7a1.8 1.8 0 0 1-2.5 0L3.5 12.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="8.2" cy="8.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconDoc(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M7 3.8h7.2L19 8.6V20a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 20V5A1.2 1.2 0 0 1 7 3.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14 3.8V8h4.8M8.5 12h7M8.5 15.5h7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M5 19V10.5M12 19V5M19 19v-6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWallet(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17V8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 13h4v3h-4a1.5 1.5 0 0 1 0-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMonitor(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 20h8M12 16.5V20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 12h15M12 4.5c2.2 2.4 3.3 5 3.3 7.5S14.2 17.1 12 19.5C9.8 17.1 8.7 14.5 8.7 12S9.8 6.9 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPuzzle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M9 4.5h3.2a2 2 0 1 1 0 3.2H14a2 2 0 0 1 2 2v1.8a2 2 0 1 1 0 3.2V16a2 2 0 0 1-2 2h-1.8a2 2 0 1 0-3.2 0H7a2 2 0 0 1-2-2v-1.8a2 2 0 1 1 0-3.2V9.5a2 2 0 0 1 2-2h.8A2 2 0 1 0 9 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
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

function IconMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)} width={15} height={15}>
      <circle cx="11" cy="11" r="6.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m16 16 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
