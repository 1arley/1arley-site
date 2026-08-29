# ART DIRECTION — ROCKSTAR / P&B / BRUTAL

> Documento de direção de arte do redesign. Fonte única de verdade para decisões
> visuais. Se um elemento contradiz isto, ele está errado.

## 1. Identidade

**Nome do sistema:** `1ARLEY // ROCKSTAR MONOCHROME`
**Estilo:** experimental award-winning site × capa de disco de rock × interface
underground × WebGL demo × editorial brutalista.
**Nada de:** glassmorphism, pills, gradientes coloridos, sombras difusas,
emoji, "AI slop" (ver `impeccable.style/slop/`).

## 2. Paleta — GRAYSCALE ABSOLUTO

Só estas luminâncias (nenhuma matiz. ZERO vermelho/azul/verde/roxo/neon):

```
#000000 (black)      — fundo profundo, canvas
#050505 (black-2)    — background body
#0A0A0A (black-4)    — superfícies altas
#111111 (black-6)    — muted surfaces
#1A1A1A (black-8/10) — cards, nav, blocos
#2A2A2A (black-16)   — borders padrão
#555555 (gray-33)    — borders fortes, thumbs
#888888 (gray-53)    — texto muted, labels
#CCCCCC (gray-80)    — texto body
#F2F2F2 (gray-95)    — títulos, alto contraste
#FFFFFF (white)      — máximo destaque, só pontualmente
```

Regras:
- Hierarquia = luminância + tamanho + peso, nunca cor.
- Destaques = branco puro sobre preto. Profundidade = cinzas sobre pretos.
- `::selection` = branco sobre preto (invertido).

## 3. Tipografia

| Papel | Fonte | Tratamento |
|---|---|---|
| Display / Hero | Titillium Web 900 (variable) | caixa alta, tracking -0.03em, clamp(4rem→13rem) |
| Display secundário | Titillium Web 700 | caixa alta |
| Body | Geist Sans / Space Grotesk 400-500 | 15-17px, lh 1.6 |
| Mono / UI técnica | JetBrains Mono / Geist Mono | labels 10-12px, tracking 0.18em, caixa alta |

Tratamentos especiais: `text-outline` (stroke only, para números gigantes),
letras recortadas por `clip-path`, `text-stroke` invertido, caracteres
"rasterizados" (ASCII via Canvas UI no hero).

## 4. Forma & Geometria

- `border-radius: 0` em **tudo** (cards, botões, inputs, imagens).
- Cantos cortados via `clip-path` (`cut-corner`, diagonal 14px).
- Bordas duras 1px `#2A2A2A` (border) / `#555555` (border-strong).
- Imagens com crop agressivo, máscaras angulares, halftone overlay.
- ZERO avatar circular — o retrato é recorte retangular com grade/scanlines.
- Blocos desalinhados propositalmente (offset grid), colisão de grid.

## 5. Texturas (layers)

1. **Grain** — overlay global sutil (opacity ~0.05-0.08), animado em steps (8s).
2. **Scanlines** — CRT, só em blocos específicos (hero, terminal), z-40.
3. **Halftone dots** — em imagens P&B (retrato, projetos).
4. **Blueprint grid** — grades técnicas de 64px, opacity 0.06.
5. **Asciify (Canvas UI)** — lente ASCII sob o cursor no hero (WebGL, com fallback).

## 6. Motion language

- **Reveal:** blocos sobem com clip/máscara (Framer Motion `whileInView`), não fade simples.
- **Marquee:** ticker de texto mono (WORKS — EXPERIENCE — STACK) contínuo, 28s linear, pausa em reduced-motion.
- **Hover:** borda que acende de `#2A2A2A`→`#F2F2F2`, leve deslocamento do bloco.
- **Custom cursor:** crosshair/reticle com label contextual (VIEW/DRAG/OPEN/EXPLORE), só em hover:pointer.
- **Entrada do hero:** máscara wipe (barra que sobe), titulo com split/reveal por linha.
- **Tudo < 300ms** de resposta (Doherty), **nada** de bounce/elastic (slop).

## 7. Grid & Layout

- Grid base 12 colunas desktop / 4 mobile, gutters 24px (mobile 16px).
- Conteúdo max-w-[1400px], padding lateral clamp.
- Seções alternam **quiet / intense** (hierarquia de impacto):
  1. **HERO** — intenso (imagem guitarra + título gigante + ascii + marquee)
  2. **ABOUT** — quieto (retrato + manifesto, editorial)
  3. **SKILLS** — médio (grid técnico mono)
  4. **EXPERIENCE** — quieto (linha do tempo brutal, listas)
  5. **PROJECTS** — intenso (protagonistas, imagens P&B, hover drástico)
  6. **BACKEND** — técnico (terminal/contrato API real)
  7. **CONTACT** — intenso final (headline colossal + CTAs brutais)

## 8. Z-index scale

```
z-0   base
z-10  seções
z-20  sticky headers / nav
z-30  modais / dropdown
z-40  overlay textura (scanlines, ascii output)
z-50  custom cursor (nunca abaixo de overlay)
z-100 loading/transição de página
```

## 9. Acessibilidade (não negociável)

- `prefers-reduced-motion`: tudo desliga (animações CSS + WebGL + canvas).
- Contraste: texto muted `#888888` ≥ 4.5:1 sobre `#0A0A0A`.
- Focus visível `outline 2px white`, offset 2.
- Touch targets ≥ 44px; nada essencial só em hover.
- Conteúdo essencial nunca apenas em canvas — sempre há fallback HTML/CSS.
- Hierarquia semântica h1→h2→h3 correta, aria onde necessário.

## 10. Performance

- WebGL lazy: só monta quando visível (IntersectionObserver), pausa fora da viewport.
- Respeita `document.visibilityState` (pausa em aba oculta).
- DPR cap `Math.min(devicePixelRatio, 1.5)`.
- `prefers-reduced-motion` → Tier C (CSS+imagem, composição preservada).
- destroy() em unmount (Canvas UI + three) — nunca canvas preto.
- LCP: hero imagem `fetchpriority="high"`, `loading` estratégico.

## 11. Conteúdo — REGRAS

- **Nunca inventar**: clientes, cargos, empresas, números, métricas, faturamento,
  tecnologias, resultados, premiações. Reorganizar microcopy é livre.
- Real: nome ARTHUR IARLEY, o retrato P&B, a guitarra P&B, os endpoints do
  backend (contrato API), o sistema admin/auth, seções Sobre/FAQ existentes.
- Microcopy em pt-BR com toque editorial rock (tags técnicas em EN ok: VIEW/DRAG).
- ZERO áudio autoplay — som só com opt-in explícito, muted default, controle visível.

## 12. Referências consultadas

- canvasui.dev (implementation) — componentes canvas/WebGL, `Asciify`, `Grid`, `VHS`, `RetroDither`, `ParticleReveal`.
- impeccable.style + /slop (heuristic) — anti-AI-slop; sem gradientes roxo-azul, sem glass, sem marquee decoração sem propósito.
- interfaces.rauno.me (heuristic) — micro-detalhe de interação; <200ms, focus ring via box-shadow/outline.
- lawsofux.com (methodology) — Hick, Fitts, Miller, Doherty, Aesthetic-Usability.
- dribbble (inspiration) — rockstar/dark/3d portfolio (inacessível, logado).
- dark.design (inspiration) — dark high-contrast curation.
- animate-ui.com (implementation) — padrões de transição (inacessível JS, logado).
- shoogle.dev (discovery) — descoberta de libs.
- threejs.org + get.webgl.org (implementation) — WebGL/3D lifecycle.
- ornn `references/{creation,frontend}.yaml` — catálogo metodológico.

### Inacessíveis (logado, segue)
dribbble.com/search/* (JS pesado), lawsofux.com root (500), animate-ui.com (JS), /docs/installation (404). Não bloqueiam.
