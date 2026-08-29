/**
 * Design tokens — single source of truth for the ROCKSTAR MONOCHROME system.
 * Centralizes spacing, type scale, borders, z-index, and motion.
 */

export const tokens = {
  color: {
    black: '#000000',
    black2: '#050505',
    black4: '#0A0A0A',
    black6: '#111111',
    black8: '#1A1A1A',
    black10: '#1A1A1A',
    black16: '#2A2A2A',
    gray33: '#555555',
    gray53: '#888888',
    gray80: '#CCCCCC',
    gray95: '#F2F2F2',
    white: '#FFFFFF',
  },

  /** Grayscale ramp keyed by light index */
  ramp: (i: number) =>
    `hsl(0 0% ${i}%)`,

  border: {
    default: 'hsl(0 0% 16%)',
    strong: 'hsl(0 0% 33%)',
    bright: 'hsl(0 0% 95%)',
  },

  type: {
    display: ['var(--font-titillium)', 'Space Grotesk', 'sans-serif'],
    body: ['var(--font-geist-sans)', 'sans-serif'],
    mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'monospace'],
    scale: {
      'display-hero': 'clamp(4rem, 12vw, 13rem)',
      'display-section': 'clamp(2.5rem, 7vw, 6rem)',
      h2: 'clamp(1.75rem, 4vw, 2.5rem)',
      h3: 'clamp(1.25rem, 2.5vw, 1.5rem)',
      body: '1rem',
      mono: '0.6875rem',
    },
  },

  space: {
    pageX: 'clamp(1rem, 4vw, 2.5rem)',
    sectionY: 'clamp(6rem, 12vh, 10rem)',
    gutter: '1.5rem',
  },

  z: {
    base: 0,
    section: 10,
    sticky: 20,
    modal: 30,
    overlay: 40,
    cursor: 50,
    transition: 100,
  },

  motion: {
    fast: 150,
    base: 250,
    slow: 450,
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const

export default tokens
