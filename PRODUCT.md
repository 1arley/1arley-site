# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: hiring managers and recruiters evaluating Arthur Iarley for full-stack/backend roles. Their job: quickly judge real skill, project credibility, and engineering depth from the portfolio, then decide whether to reach out. Secondary: fellow developers assessing craft and open-source work.

## Product Purpose

Personal portfolio of Arthur Iarley, Brazilian full-stack developer (NestJS/Node/TypeScript/PostgreSQL focus). It exists to stand out through a strong visual identity while proving backend and architecture depth with real, verifiable projects. Success = a memorable impression plus credible project evidence that turns visitors into contact inquiries.

## Positioning

A dev portfolio where identity is the differentiator: a brutalist "Rockstar Monochrome" black-and-white world (WebGL effects, editorial typography, zero color) paired with honest backend/architecture claims. Neighboring portfolios market face and framework logos; this one markets discipline and engineering rigor — and it never fabricates clients, metrics, or results.

## Operating Context

- Visitors arrive on desktop and mobile web; heavy WebGL effects run on desktop, with graceful fallback on touch/mobile and under `prefers-reduced-motion`.
- Bilingual: pt-BR default, EN available via `LocaleProvider`.
- Home sections: hero → about → skills → experience → projects → backend (API contract) → contact, separated by ticker dividers.
- Routes: `/` (home), `/sobre` (editorial bio), `/admin` (site content), `/login` (auth).
- Content lives in `src/lib/i18n-data.ts` (pt/en) rendered by section components; site sections also editable through the admin UI.
- CMS backend in `services/cms-backend` proxied at `/api/[...path]`; deploys on Render (Postgres + web service, `render.yaml`), frontend via Docker / standalone Next.

## Capabilities and Constraints

- Stack: Next.js 16, React 19, TypeScript strict, Tailwind CSS 3, Framer Motion, Three.js/canvasui WebGL, Radix/shadcn, Sonner.
- CMS contract: auth (JWT + refresh), posts, team-members, quick-access links, users, uploads.
- WebGL budget discipline: DPR cap, lazy-mount when visible, pause outside viewport / hidden tab, destroy on unmount.
- Design constraints (binding, see `docs/ART_DIRECTION.md`): grayscale-only palette, zero border-radius, hard 1px borders, editorial mono labels, grain/scanlines/halftone layers.
- Content constraint (binding): real content only — never invent clients, employers, metrics, results, awards, or technologies. Reorganizing microcopy is free.
- No audio autoplay; sound only with explicit opt-in.
- Microcopy: editorial rock tone in pt-BR; technical tags (VIEW/DRAG/OPEN) in EN.

## Brand Commitments

- Name: Arthur Iarley; system name `1ARLEY // ROCKSTAR MONOCHROME`. Metadata title: "Arthur Iarley — Desenvolvedor Full-Stack".
- Visual world documented in `docs/ART_DIRECTION.md` (grayscale absolute, Anton/Oswald/JetBrains Mono/Inter, brutalist geometry, WebGL motion language) — treat as the source of truth for visual decisions.
- Voice: editorial rock microcopy, technical labels in EN.

## Evidence on Hand

- Real production projects with live links (in `src/lib/i18n-data.ts`): AnimesIce (animesice.app), Mesa-Redonda (mesa-redonda.1arley.me), SmartRU (smartru.com.br), BCC UFRPE (ufrpebcc.com.br).
- Real roles: Analista de Projetos at Seed a Bit, CTO at SmartRU, Sistemas de Informação student at UFRPE.
- Real assets: `/header-guitar.jpg`, P&B portrait, `/projects/*.png`, `/models/guitar.glb`.
- Real API contract (README + `services/cms-backend`) served in production.
- Absence: no invented testimonials, benchmarks, or awards; do not fabricate any.

## Product Principles

1. Identity is the differentiator — the visual world earns attention; content earns trust.
2. Honesty is non-negotiable — credibility comes from real, verifiable production work, never invented claims.
3. Backend depth is the argument — architecture, security, data modeling, and API design are the proof, not just screenshots.
4. Craft under constraint — grayscale-only, zero-radius, brutal geometry; constraint is discipline, not limitation.
5. Performance and accessibility are quality — WebGL budgets, reduced-motion fallback, contrast, and keyboard/touch support are baseline, not polish.

## Accessibility & Inclusion

- `prefers-reduced-motion` fully disables animations and WebGL (CSS + Framer Motion + canvas tiers).
- Contrast: muted text `#888888` ≥ 4.5:1 on `#0A0A0A`; focus visible `outline 2px white` offset 2.
- Touch targets ≥ 44px; nothing essential hover-only; semantic heading hierarchy; canvas content always has an HTML/CSS fallback.
- Standard applied: the practices documented in `docs/ART_DIRECTION.md` §9 (a11y) and §10 (performance).
