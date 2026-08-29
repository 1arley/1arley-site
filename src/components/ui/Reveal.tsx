'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** delay in seconds */
  delay?: number
  /** vertical offset when hidden */
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}

/**
 * Editorial reveal — block rises with a mask, not a plain fade.
 * Honors reduced motion (no transform).
 */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div

  return (
    <Comp
      className={className ? `${className} reveal-block` : 'reveal-block'}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: reduce ? 0 : 0.6,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Comp>
  )
}
