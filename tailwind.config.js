const tailwindcssAnimate = require('tailwindcss-animate');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', ...fontFamily.mono],
        display: ['var(--font-anton)', 'Oswald', ...fontFamily.sans],
        headline: ['var(--font-oswald)', 'Oswald', ...fontFamily.sans],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
      colors: {
        white: '#FBFAFC',
        black: '#000000',
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        popover: "hsl(var(--popover) / <alpha-value>)",
        "popover-foreground": "hsl(var(--popover-foreground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "hsl(var(--secondary-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        "destructive-foreground": "hsl(var(--destructive-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        "gray-33": "hsl(var(--gray-33) / <alpha-value>)",
        "gray-53": "hsl(var(--gray-53) / <alpha-value>)",
        "gray-80": "hsl(var(--gray-80) / <alpha-value>)",
        "gray-95": "hsl(var(--gray-95) / <alpha-value>)",
        "black-2": "hsl(var(--black-2) / <alpha-value>)",
        "black-4": "hsl(var(--black-4) / <alpha-value>)",
        "black-6": "hsl(var(--black-6) / <alpha-value>)",
        "black-8": "hsl(var(--black-8) / <alpha-value>)",
        "black-10": "hsl(var(--black-10) / <alpha-value>)",
        "black-16": "hsl(var(--black-16) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
