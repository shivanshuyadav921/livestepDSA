import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
    },
    extend: {
      colors: {
        background: '#09090b',
        surface: {
          DEFAULT: '#131316',
          raised: '#1a1a1f',
        },
        border: {
          DEFAULT: '#27272a',
          subtle: '#1f1f23',
        },
        foreground: '#fafafa',
        muted: {
          DEFAULT: '#a1a1aa',
          subtle: '#71717a',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
          foreground: '#09090b',
        },
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
