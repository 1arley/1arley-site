'use client'

import { useEffect, useState } from 'react'
import { isBrowser, prefersReducedMotion } from '@/lib/webgl/utils'

/**
 * Grain overlay — film grain / noise texture.
 * Renders a subtle animated noise layer over the whole viewport.
 * Disabled on touch (pointer: coarse) and reduced motion.
 */
export function GrainOverlay() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!isBrowser()) return
    if (prefersReducedMotion()) return
    // Only enable on fine pointers — grain adds nothing on touch
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="grain fixed inset-0 z-[45] pointer-events-none"
      style={{ ['--grain-opacity' as string]: '0.055' }}
    />
  )
}
