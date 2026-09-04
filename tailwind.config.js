/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          950: '#06090f',
          900: '#0a0f17',
          800: '#0f1623',
          700: '#161f30',
          600: '#1f2a40',
          500: '#2a3756',
          400: '#3d4d6a',
        },
        ember: {
          500: '#f97316',
          600: '#ea580c',
          400: '#fb923c',
          300: '#fdba74',
        },
        signal: {
          500: '#10b981',
          600: '#059669',
          400: '#34d399',
        },
        critical: {
          500: '#ef4444',
          600: '#dc2626',
          400: '#f87171',
        },
        info: {
          500: '#3b82f6',
          600: '#2563eb',
          400: '#60a5fa',
        },
        warn: {
          500: '#f59e0b',
          600: '#d97706',
          400: '#fbbf24',
        },
      },
      animation: {
        'flash-red': 'flashRed 0.8s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'blip': 'blip 2s linear infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'drawer-up': 'drawerUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'scan-line': 'scanLine 3s linear infinite',
        'ticker': 'ticker 40s linear infinite',
        'waveform': 'waveform 0.8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        flashRed: {
          '0%, 100%': { backgroundColor: 'rgb(127 29 29)', boxShadow: '0 0 0 0 rgba(239,68,68,0.6)' },
          '50%': { backgroundColor: 'rgb(239 68 68)', boxShadow: '0 0 40px 5px rgba(239,68,68,0.5)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.6)', opacity: '0.8' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        blip: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        drawerUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(2000%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(249,115,22,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(249,115,22,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
