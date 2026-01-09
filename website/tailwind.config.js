/**
 * Tailwind CSS Configuration for AStack Website
 *
 * Design System:
 * - Primary color: Cyan (#00F0FF) - tech/futuristic accent
 * - Background: Pure black (#000000) - premium dark theme
 * - Text: White (#FFFFFF) with gray variations
 * - Glass morphism effects for depth and texture
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Make container full width by default
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
        '2xl': '100%',
      },
    },
    extend: {
      // Custom color palette - limited to 3 main colors for cohesion
      colors: {
        // Primary accent color - cyan/teal for tech feel
        accent: {
          DEFAULT: '#00F0FF',
          50: '#E6FEFF',
          100: '#CCFDFF',
          200: '#99FBFF',
          300: '#66F8FF',
          400: '#33F4FF',
          500: '#00F0FF',
          600: '#00C0CC',
          700: '#009099',
          800: '#006066',
          900: '#003033',
        },
        // Dark backgrounds
        dark: {
          DEFAULT: '#000000',
          50: '#1A1A1A',
          100: '#141414',
          200: '#0F0F0F',
          300: '#0A0A0A',
          400: '#050505',
          500: '#000000',
        },
      },
      // Custom animations for UI interactions
      animation: {
        'fade-in-out': 'fadeInOut 3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      // Keyframe definitions
      keyframes: {
        fadeInOut: {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
            borderColor: 'rgba(0, 240, 255, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)',
            borderColor: 'rgba(0, 240, 255, 0.8)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      // Glass morphism backdrop blur values
      backdropBlur: {
        xs: '2px',
      },
      // Custom box shadows for glass effects
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 240, 255, 0.1)',
        'glass-lg': '0 16px 48px 0 rgba(0, 240, 255, 0.15)',
        'glow': '0 0 30px rgba(0, 240, 255, 0.4)',
        'glow-sm': '0 0 15px rgba(0, 240, 255, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(0, 240, 255, 0.1)',
      },
      // Background image utilities for grid patterns
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Background size for grid
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
};
