/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fis: {
          canvas: '#050811',
          panel: '#0a0f1d',
          surface: '#0f172a',
          interactive: '#141f36',
          highlight: '#1a2844',
          border: {
            subtle: '#151f33',
            default: '#1e2d4a',
            strong: '#2a3f66',
            accent: '#3b82f6',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
            subtle: '#64748b',
          },
          accent: {
            blue: '#3b82f6',
            cyan: '#06b6d4',
            sky: '#38bdf8',
            indigo: '#6366f1',
            purple: '#a855f7',
          },
          status: {
            stable: '#10b981',
            degrading: '#f59e0b',
            critical: '#ef4444',
            collapsing: '#a855f7',
            recovering: '#06b6d4',
            restored: '#38bdf8',
            unverified: '#64748b',
            conflicted: '#f97316',
            gap: '#f43f5e',
            residual: '#eab308'
          }
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.25)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.25)',
        'glow-emerald': '0 0 15px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
