# 1arley Template

Template multi-domínio com Next.js 16, React 19, TypeScript e Tailwind CSS.

## Stack

- **Next.js 16** — App Router, SSR, RSC, standalone
- **React 19** — Hooks, Context, Suspense
- **TypeScript 5** — Tipagem estária, strict mode
- **Tailwind CSS 3** — Design system utilitário
- **Radix UI / shadcn** — Componentes acessíveis
- **Framer Motion** — Animações
- **Axios** — HTTP client com proxy e refresh de token
- **React Hook Form** — Formulários
- **Sonner** — Toasts
- **Recharts** — Gráficos

## Início rápido

```bash
cp .env.dev.example .env.local
npm install
npm run dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build de produção |
| `npm run start` | Iniciar produção |
| `npm run lint` | Lint com ESLint |
| `npm run typecheck` | Verificação de tipos |
| `npm run clean-dev` | Limpa .next e inicia dev |
| `npm run clean-build` | Limpa .next e faz build |

## Estrutura

```
src/
├── app/              Rotas e páginas
├── components/       UI e seções reutilizáveis
│   ├── ui/           Componentes Radix/shadcn
│   ├── sections/     Seções da home page
│   └── admin/        Componentes administrativos
├── hooks/            Lógica customizada
├── lib/              Utilitários e helpers
├── services/         Camada de API (contrato genérico)
├── types/            Definições TypeScript
├── utils/            Funções auxiliares
└── config.ts         Configuração central
```

## API

O site consome um backend CMS (services/cms-backend) via proxy `/api/[...path]`.
Defina `API_BASE_URL` apontando para a raiz da API **terminando em `/api`**
(ex.: `https://1arley-cms-backend.onrender.com/api`) — o proxy concatena `/v1/...`.

Endpoints:

### Auth
- `POST /api/v1/auth/login` → `{ access_token, user }`

### Conteúdo do site (hero, sobre, skills, experiência, projetos, contato)
- `GET /api/v1/site` → `{ data: { pt, en } }`
- `PUT /api/v1/site` → JSON `{ pt, en }` (auth)

### Posts
- `GET /api/v1/posts` → `{ data: Post[] }`
- `POST /api/v1/posts` → FormData
- `PATCH /api/v1/posts/:id` → FormData
- `DELETE /api/v1/posts/:id`

### Equipe
- `GET /api/v1/team-members` → `{ data: Member[] }`
- `POST /api/v1/team-members` → FormData
- `PATCH /api/v1/team-members/:id` → FormData
- `DELETE /api/v1/team-members/:id`

### Links
- `GET /api/v1/quick-access` → `{ data: QuickLink[] }`
- `POST /api/v1/quick-access` → JSON
- `PATCH /api/v1/quick-access/:id` → JSON
- `DELETE /api/v1/quick-access/:id`

### Usuários
- `GET /api/v1/users` → `{ data: AdminUser[] }`
- `POST /api/v1/users` → JSON
- `PATCH /api/v1/users/:id` → JSON
- `DELETE /api/v1/users/:id`

### Uploads
- `POST /api/v1/upload` → FormData `file` → `{ url }` (auth)
- `GET /api/v1/images/:id` → imagem (público)

## Variáveis de ambiente

Site (Next.js):

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
API_BASE_URL=https://1arley-cms-backend.onrender.com/api
```

Backend CMS (Render — services/cms-backend):

```env
DATABASE_URL=postgres://...   # Postgres do Render
CMS_ADMIN_EMAIL=admin@exemplo.com
CMS_ADMIN_PASSWORD=senha-forte
CMS_SECRET=segredo-aleatorio
```

As credenciais vivem apenas no ambiente do Render — nada hardcoded no site.

## Deploy do backend (Render)

Blueprint: `render.yaml` (serviço web `cms-backend` + Postgres). Ou manual:

- **Root Directory:** `services/cms-backend`
- **Build:** `npm install` · **Start:** `npm start`
- **Env:** `DATABASE_URL`, `CMS_ADMIN_EMAIL`, `CMS_ADMIN_PASSWORD`, `CMS_SECRET`

## Docker

```bash
docker compose up
```

## Licença

MIT
