'use client'

import { useSyncExternalStore } from 'react'
import { prefersReducedMotion } from '@/lib/webgl/utils'

function subscribe(onStoreChange: () => void) {
  const coarse = window.matchMedia('(pointer: coarse)')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  coarse.addEventListener('change', onStoreChange)
  reduced.addEventListener('change', onStoreChange)
  return () => {
    coarse.removeEventListener('change', onStoreChange)
    reduced.removeEventListener('change', onStoreChange)
  }
}

function getSnapshot(): boolean {
  // Only enable on fine pointers — grain adds nothing on touch
  return !prefersReducedMotion() && !window.matchMedia('(pointer: coarse)').matches
}

function getServerSnapshot(): boolean {
  return false
}

/**
 * Grain overlay — film grain / noise texture.
 * Renders a subtle animated noise layer over the whole viewport.
 * Disabled on touch (pointer: coarse) and reduced motion.
 */
export function GrainOverlay() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="grain fixed inset-0 z-[45] pointer-events-none"
      style={{ ['--grain-opacity' as string]: '0.055' }}
    />
  )
}
