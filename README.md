# Dropmai Frontend

Next.js (App Router) — UI pt-BR do Dropmai. Consome o **Dropmai_Backend** via `NEXT_PUBLIC_API_URL`.

## Rodar

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
```

Abra `http://localhost:3000`. Suba o backend na porta 4000 antes.

Login stub: `paulo@dropmai.com.br` / `demo`.

## Rotas

| Rota | Função |
|---|---|
| `/` | Landing |
| `/entrar` | Login (chama `POST /api/v1/auth/login`) |
| `/painel` | Lista lojas |
| `/painel/lojas/nova` | Criar loja |
| `/painel/lojas/[id]/produtos` | Catálogo + sync Xnamai |
| `/loja/[slug]` | Vitrine pública |

Middleware reescreve `*.dropmai.com.br` / `*.localhost` → `/loja/{slug}`. Domínio customizado → `/loja/_domain` + lookup no backend.

## Arquitetura

```
Browser → Dropmai_Frontend (:3000)
              ↓ NEXT_PUBLIC_API_URL
         Dropmai_Backend (:4000) → Prisma/Postgres + sync Xnamai
```
