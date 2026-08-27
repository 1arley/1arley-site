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

O template espera uma API RESTful com os seguintes endpoints:

### Auth
- `POST /api/v1/auth/login` → `{ access_token, user }`
- `POST /api/v1/auth/refresh` → `{ access_token }`

### Posts/Conteúdo
- `GET /api/v1/posts` → `Post[]`
- `POST /api/v1/posts` → FormData
- `PATCH /api/v1/posts/:id` → FormData
- `DELETE /api/v1/posts/:id`

### Equipe
- `GET /api/v1/team-members` → `{ data: Member[] }`
- `POST /api/v1/team-members` → FormData
- `PATCH /api/v1/team-members/:id` → FormData
- `DELETE /api/v1/team-members/:id`

### Links
- `GET /api/v1/quick-access` → `QuickLink[]`
- `POST /api/v1/quick-access` → JSON
- `PATCH /api/v1/quick-access/:id` → JSON
- `DELETE /api/v1/quick-access/:id`

### FAQ
- `GET /api/v1/faq/topics` → `FaqTopic[]`
- `POST /api/v1/faq/topics` → JSON
- `PATCH /api/v1/faq/topics/:id` → JSON
- `DELETE /api/v1/faq/topics/:id`
- `POST /api/v1/faq/questions` → JSON
- `PATCH /api/v1/faq/questions/:id` → JSON
- `DELETE /api/v1/faq/questions/:id`

### Usuários
- `GET /api/v1/users` → `AdminUser[]`
- `POST /api/v1/users` → JSON
- `PATCH /api/v1/users/:id` → JSON
- `DELETE /api/v1/users/:id`

## Variáveis de ambiente

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
API_BASE_URL=https://api.seu-dominio.com.br/api/v1
```

## Docker

```bash
docker compose up
```

## Licença

MIT
