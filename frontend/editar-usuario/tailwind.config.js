/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── Map CSS variables → Tailwind tokens ─────────────────────────────
      colors: {
        celeste:  'var(--color-celeste)',
        'celeste-dark': 'var(--color-celeste-dark)',
        'celeste-light': 'var(--color-celeste-light)',
        primary:  'var(--color-primary)',
        success:  'var(--color-success)',
        danger:   'var(--color-danger)',
        warning:  'var(--color-warning)',
        border:   'var(--color-border)',
        bg:       'var(--color-bg)',
        surface:  'var(--color-surface)',
        text:     'var(--color-text)',
        'text-sec': 'var(--color-text-sec)',
      },
      fontFamily: {
        base: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};
