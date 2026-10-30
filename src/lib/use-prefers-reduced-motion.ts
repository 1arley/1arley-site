"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * prefers-reduced-motion como estado React.
 *
 * O CSS global do site já mata animações CSS quando o usuário pede
 * movimento reduzido, mas animações JS (motion/canvas/WebGL) rodam fora
 * desse guard — os componentes de efeito devem consultar este hook.
 */
export function usePrefersReducedMotion(): boolean {
  // O primeiro render precisa ser idêntico no servidor e no navegador. Ler
  // matchMedia no inicializador fazia clientes com movimento reduzido gerar
  // uma árvore diferente do HTML SSR e disparava o erro de hidratação #418.
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
