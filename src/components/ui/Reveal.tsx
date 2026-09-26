import { createElement, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}

export function Reveal({ children, className, as = 'div' }: RevealProps) {
  return createElement(
    as,
    {
      className: className ? `${className} reveal-block` : 'reveal-block',
    },
    children,
  )
}
