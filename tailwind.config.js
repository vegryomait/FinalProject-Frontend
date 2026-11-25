/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#17365D',
          navyDark: '#0F243E',
          navyLight: '#234C7E',
          blue: '#3478E5',
          blueHover: '#2563EB',
          blueLight: '#EEF4FF',
          bg: '#F4F7FC',
          surface: '#FFFFFF',
          textPrimary: '#172033',
          textSecondary: '#64748B',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#2563EB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
