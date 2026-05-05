/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-app)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand palette (Barmagly navy + amber accent inspired by the proposal PDF)
        brand: {
          50:  '#eef4fb',
          100: '#d6e4f3',
          200: '#aac8e5',
          300: '#7da9d5',
          400: '#4c87c1',
          500: '#2a6aa8',
          600: '#1f5188',
          700: '#1a4070',
          800: '#15325a',
          900: '#0e2342',
          950: '#081730',
        },
        accent: {
          50:  '#fff8e6',
          100: '#ffeebd',
          200: '#ffdb7a',
          300: '#ffc847',
          400: '#ffb01f',
          500: '#f59300',
          600: '#cc7700',
          700: '#a35d00',
          800: '#7c4700',
          900: '#5e3500',
        },
      },
      animation: {
        'fade-in':   'fade-in 0.5s ease-out',
        'slide-up':  'slide-up 0.5s ease-out',
        'shimmer':   'shimmer 1.6s linear infinite',
        'marquee':   'marquee 35s linear infinite',
        'float':     'float 4s ease-in-out infinite',
      },
      keyframes: {
        'fade-in':  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        'shimmer':  { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        'marquee':  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'float':    { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'card': '0 4px 16px rgba(15, 35, 66, 0.06)',
        'card-hover': '0 12px 32px rgba(15, 35, 66, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
