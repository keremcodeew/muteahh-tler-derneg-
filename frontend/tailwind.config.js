/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        'primary-dark': '#152942',
        navy: '#1e3a5f',
        gold: '#d4a853',
        'gold-light': '#e8c97a',
        'sky-light': '#7dd3fc',
        'dark-gray': '#2B2B2B',
        'light-gray': '#f9fafb',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'corp': '0 4px 20px rgba(11, 61, 145, 0.08)',
        'corp-hover': '0 8px 30px rgba(11, 61, 145, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
