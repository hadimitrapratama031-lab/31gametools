import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0d0d14',
          secondary: '#12121c',
          card:      '#16161f',
          hover:     '#1c1c28',
          border:    '#2a2a3d',
        },
        violet: {
          DEFAULT: '#7c6ef7',
          dark:    '#5b4ee8',
          light:   '#a498f9',
          glow:    'rgba(124,110,247,0.25)',
        },
        accent: {
          green:  '#22c55e',
          red:    '#ef4444',
          blue:   '#3b82f6',
          gold:   '#f59e0b',
          purple: '#a855f7',
        },
        text: {
          primary:   '#f1f1f5',
          secondary: '#8b8fa8',
          muted:     '#4a4a6a',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #7c6ef7, #5b4ee8)',
        'gradient-dark':   'linear-gradient(180deg, #0d0d14 0%, #12121c 100%)',
      },
      boxShadow: {
        'violet-glow': '0 0 24px rgba(124,110,247,0.35)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease forwards',
        'slide-up':   'slideUp 0.3s ease forwards',
        'slide-left': 'slideLeft 0.3s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                   to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
} satisfies Config
