import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary:     'var(--color-primary)',
        background:  'var(--color-background)',
        foreground:  'var(--color-foreground)',
        muted:       'var(--color-muted)',
        accent:      'var(--color-accent)',
        destructive: 'var(--color-destructive)',
        border:      'var(--color-border)',
        ring:        'var(--color-ring)',
        success:     'var(--color-success)',
        warning:     'var(--color-warning)',
      },
    },
  },
  plugins: [],
};

export default config;
