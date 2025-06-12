/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#EC4899',
        surface: '#1E1B2E',
        background: '#0F0E17',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        surface50: '#f8fafc',
        surface100: '#f1f5f9',
        surface200: '#e2e8f0',
        surface300: '#cbd5e1',
        surface400: '#94a3b8',
        surface500: '#64748b',
        surface600: '#475569',
        surface700: '#334155',
        surface800: '#1e293b',
        surface900: '#0f172a'
      },
      fontFamily: {
        display: ['Bebas Neue', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Bebas Neue', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1' }],
        'display-lg': ['3rem', { lineHeight: '1.2' }],
        'display-md': ['2.25rem', { lineHeight: '1.3' }],
        'display-sm': ['1.875rem', { lineHeight: '1.4' }]
      }
    },
  },
  plugins: [],
}