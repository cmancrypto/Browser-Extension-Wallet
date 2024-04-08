import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#F2F2FA',
      grey: '#D5D5E0',
      'neutral-1': '#A2A2AA',
      'neutral-2': 'rgba(255, 255, 255, 0.06)',
      'neutral-3': 'rgba(82, 82, 90, 1)',
      black: 'rgba(24, 24, 27, 1)',
      'error-red': '#FC2A58',
      blue: {
        DEFAULT: '#61CBF4',
        darker: '#43ADD6',
        dark: '#2F99C2',
        pressed: '#117BA4',
        hover: 'rgba(10, 103, 144, 0.42)',
        'pressed-secondary': 'rgba(0, 103, 144, 0.18)',
        'hover-secondary': 'rgba(87, 193, 234, 0.18)',
      },
      background: {
        black: 'rgba(10, 9, 13, 1)',
        'dark-grey': 'rgba(24, 24, 27, 1)',
        gradient: 'linear-gradient(159.61deg, #202022 13.58%, rgba(51, 51, 70, 0.32) 86.49%)',
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      fontSize: {
        h1: ['32px', '44px'],
        h2: ['28px', '40px'],
        h3: ['24px', '34px'],
        h4: ['22px', '30px'],
        h5: ['20px', '28px'],
        h6: ['18px', '26px'],
        large: ['16px', '20px'],
        base: ['14px', '16px'],
        small: ['12px', '14px'],
        'x-small': ['11px', '13px'],
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('not-last', '&:not(:last-child)');
    }),
  ],
};
