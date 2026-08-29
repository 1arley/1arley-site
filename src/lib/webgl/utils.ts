/**
 * WebGL / canvas lifecycle utilities.
 * Central rules for GPU work in this project:
 *  - never mount a canvas/WebGL context that isn't visible
 *  - pause when off-viewport or the tab is hidden
 *  - cap DPR at 1.5
 *  - always destroy/dispose on unmount (never leave a black canvas)
 */

export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/** Cap device pixel ratio to keep GPU cost bounded. */
export function cappedDpr(): number {
  if (!isBrowser()) return 1
  return Math.min(window.devicePixelRatio || 1, 1.5)
}

/** True when the user asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export interface LifecycleHooks {
  onVisible?: () => void
  onHidden?: () => void
  onPageHidden?: () => void
  onPageVisible?: () => void
  onReducedMotion?: () => void
}

/**
 * Observes an element and the document visibility state, and calls the
 * appropriate hook. Returns a cleanup function.
 */
export function observeLifecycle(
  element: Element | null,
  hooks: LifecycleHooks,
): () => void {
  if (!isBrowser() || !element) return () => {}

  let inView = false

  const apply = () => {
    const docHidden = document.visibilityState === 'hidden'
    if (inView && !docHidden) hooks.onVisible?.()
    else hooks.onHidden?.()
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting
      apply()
    },
    { rootMargin: '120px' },
  )
  io.observe(element)

  const onVis = () => {
    if (document.visibilityState === 'visible') hooks.onPageVisible?.()
    else hooks.onPageHidden?.()
    apply()
  }
  document.addEventListener('visibilitychange', onVis)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onReduced = () => {
    if (reduced.matches) hooks.onReducedMotion?.()
  }
  reduced.addEventListener('change', onReduced)

  return () => {
    io.disconnect()
    document.removeEventListener('visibilitychange', onVis)
    reduced.removeEventListener('change', onReduced)
  }
}

/** Detects WebGL support once, cached. */
let _webglSupported: boolean | null = null
export function webglSupported(): boolean {
  if (_webglSupported !== null) return _webglSupported
  if (!isBrowser()) return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    _webglSupported = !!gl
    return _webglSupported
  } catch {
    _webglSupported = false
    return false
  }
}
