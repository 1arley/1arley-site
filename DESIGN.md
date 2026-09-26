---
name: Rockstar Monochrome
description: Portfolio editorial de Arthur Iarley.
colors:
  background: "#000000"
  surface: "#0A0A0A"
  foreground: "#FFFFFF"
  secondary: "#949494"
rounded:
  default: "0px"
typography:
  display:
    fontFamily: Anton
    lineHeight: 1
    letterSpacing: "0"
  headline:
    fontFamily: Oswald
    lineHeight: 1
  body:
    fontFamily: Geist
  label:
    fontFamily: JetBrains Mono
---

# Rockstar Monochrome

## Overview
Identidade pessoal com linguagem brutalista, fotografias em preto e branco,
tipografia condensada e informacao tecnica verificavel. O trabalho real vem
antes da biografia; nenhum cliente, resultado ou numero pode ser inventado.

## Colors
Escala de cinza absoluta. Branco sinaliza acao e hierarquia; preto e cinzas
organizam superficies. Texto pequeno deve ter contraste minimo de 4.5:1.

## Typography
Anton assina os grandes titulos. Oswald estrutura subtitulos. Geist serve
paragrafos e JetBrains Mono serve codigo e metadados. Tamanhos por breakpoint,
sem tipografia vinculada a vw, sem tracking negativo e sem sobrepor linhas.

## Layout
Container ate 1600px, margens de 20px no mobile e 32px no desktop.
Projetos com composicao assimetrica de 12 colunas, uma coluna no mobile.
Secoes com espacamento vertical de 96px a 128px. Imagens tem proporcao reservada.

## Elevation & Depth
Superficies planas, bordas de 1px, sem sombras decorativas, glow ou vidro.
Textura raster discreta; fotografia e escala criam profundidade.

## Shapes
Cantos retos. Cards somente para itens ou ferramentas realmente enquadradas,
nunca como recipiente decorativo de toda uma secao.

## Components
Hero fotografico com titulo separado da imagem por scroll e movimento oposto
de ponteiro limitado a poucos pixels. Molas amortecidas retornam ao repouso.
Reduced motion deixa o hero estatico. Demais secoes nao repetem reveals.
Links de projetos permanecem nativos, com destinos originais e imagem real.
Menu mobile usa dialog nativo com foco protegido e fechamento por Escape.
Alvos interativos de pelo menos 44px; foco visivel e contraste alto.
Conteudo principal funciona sem JavaScript e sem backend CMS.

## Do's and Don'ts
- Preservar os conteudos PT/EN, projetos, destinos externos e rotas.
- Priorizar imagens existentes e comprimir derivados sem inventar evidencias.
- Nao usar loaders que bloqueiem leitura, cursor substituto ou scroll hijack.
- Nao reintroduzir efeitos identicos em todas as secoes.
- Nao tratar build local como publicacao em producao.
