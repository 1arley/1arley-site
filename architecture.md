# Architecture: Correções incrementais de UX mobile para todo o site

## Approach
Aplicar ajustes responsivos progressivos para 320 px ou mais, sem reescrever a estrutura do Next.js ou trocar dependências. As seções públicas receberão escalas tipográficas, espaçamentos e densidade de conteúdo adequados ao mobile; efeitos dependentes de hover, cursor ou WebGL serão desativados abaixo do breakpoint mobile quando prejudicarem leitura, toque ou desempenho. A guitarra de partículas será ocultada no mobile e não poderá interceptar gestos onde permanecer visível. Navegação, login e todas as telas administrativas serão reorganizadas para uma única coluna e controles com área de toque adequada. O overflow horizontal será corrigido na origem em vez de depender de clipping global.

## Files to Create
- Nenhum.

## Files to Modify
- requirements.json (registrar os requisitos v1 bloqueados e decisões aprovadas)
- src/app/globals.css (tokens/regras mobile, tratamento de overflow e variantes para efeitos sem ponteiro)
- src/components/hero/HeroSection.tsx (ocultar guitarra no mobile, preservar conteúdo e CTAs acima de camadas decorativas)
- src/components/Navbar.tsx (aumentar alvos de toque e evitar compressão da barra e do menu em 320 px)
- src/components/Footer.tsx (reduzir a marca d'água e desativar efeito de cursor no mobile)
- src/components/about/AboutSection.tsx (substituir/desativar peel por hover no mobile e ajustar tipografia/densidade)
- src/components/skills/SkillsSection.tsx (desativar HexFloat dependente de cursor e tornar cartões mais legíveis no mobile)
- src/components/experience/ExperienceSection.tsx (reduzir a altura/complexidade da etapa ParticleScroll e o espaçamento das linhas)
- src/components/projects/ProjectsSection.tsx (desativar Shatter por ponteiro, ajustar heading e metadados dos cards)
- src/components/backend/BackendSection.tsx (desativar GlyphRain por ponteiro, reorganizar linhas do terminal e remover estados hover apenas decorativos)
- src/components/contact/ContactSection.tsx (reduzir título/spacing, desligar Ripple e efeitos de cursor, permitir quebra segura das informações de contato)
- src/components/effects/Preloader.tsx (ajustar tipografia e microtexto para viewport estreito)
- src/app/sobre/page.tsx (ajustar padding, tipografia e bloco monoespaçado para não cortar em 320 px)
- src/app/login/page.tsx (adequar padding e altura útil em telas curtas)
- src/app/admin/layout.tsx (transformar a navegação lateral em navegação mobile utilizável, sem coluna comprimida)
- src/app/admin/content/page.tsx (empilhar cabeçalho/listagem/ações e garantir diálogo e botões utilizáveis em mobile)
- src/app/admin/site/page.tsx (revisar formulários e ações em viewport estreito)
- src/app/admin/links/page.tsx (revisar listagens, formulários e ações em viewport estreito)
- src/app/admin/team/page.tsx (revisar listagens, formulários e ações em viewport estreito)
- src/app/admin/users/page.tsx (revisar listagens, formulários e ações em viewport estreito)

## Risks
- Desativar componentes WebGL no mobile exige manter um fallback DOM visualmente coerente e sem hidratação divergente.
- Alterações no overflow global podem expor largura intrínseca excessiva de textos, URLs ou canvases que hoje está mascarada.
- O painel administrativo usa componentes compartilhados; ajustes de layout devem preservar a experiência desktop.
- Teste manual em dispositivos/tamanhos reais é necessário para validar camadas canvas, teclado virtual e gestos de scroll.

## Acceptance Criteria
- Em 320 px, a guitarra de partículas não é renderizada e nenhum elemento decorativo sobrepõe o nome, texto ou CTAs do hero.
- Em 320 px, não há rolagem horizontal involuntária nem conteúdo cortado nas rotas públicas, login e rotas administrativas.
- Em mobile, efeitos dependentes de hover/cursor/ponteiro nas seções públicas são desativados ou não interceptam toque e scroll.
- Navbar, menu mobile, seletor de idioma e ações administrativas possuem área de toque mínima de aproximadamente 44 × 44 px ou padding equivalente.
- Títulos, cartões, URLs e dados de terminal quebram/empilham sem perda de contexto e permanecem legíveis em 320 px.
- A navegação administrativa e as listas/formulários de Site, Conteúdo, Equipe, Links e Usuários são utilizáveis sem layout comprimido em 320 px.
- `npm run lint` e `npm run typecheck` terminam sem erros após a implementação.
