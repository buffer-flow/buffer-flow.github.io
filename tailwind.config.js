/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-bg': 'pulse-bg 4s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        'pulse-bg': {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.1)' },
        },
      },
    },
  },
  plugins: [],
}
