import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors driven by CSS custom properties
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
        },
        // Fixed utility colors
        navy: {
          50: '#eef1f6',
          100: '#d4dce9',
          200: '#a9b9d3',
          300: '#7e96bd',
          400: '#5373a7',
          500: '#2f5191',
          600: '#1B263B', // Primary Deep Blue
          700: '#151e2e',
          800: '#0e1521',
          900: '#070b11',
        },
        gold: {
          50: '#fdf8ef',
          100: '#f9edcf',
          200: '#f3dba0',
          300: '#E0C397', // Primary Gold/Sand
          400: '#d4ac6e',
          500: '#c89545',
          600: '#a87a2e',
          700: '#885f22',
          800: '#674516',
          900: '#462b0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, rgba(27,38,59,0.85) 0%, rgba(27,38,59,0.5) 50%, transparent 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'gold': '0 4px 20px rgba(224, 195, 151, 0.3)',
        'navy': '0 4px 20px rgba(27, 38, 59, 0.3)',
        'card': '0 8px 32px rgba(27, 38, 59, 0.12)',
        'card-hover': '0 16px 48px rgba(27, 38, 59, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
