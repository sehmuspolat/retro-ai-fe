import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        turkcell: {
          yellow: '#ffc72c',
          'yellow-light': '#ffe082',
          'yellow-dark': '#e6a800',
          navy: '#1a2b3c',
          'navy-light': '#253d54',
          'navy-dark': '#0f1a26',
          blue: '#00a0d2',
          'blue-light': '#4dc4e6',
          gray: '#f4f5f7',
          'gray-medium': '#8c939a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
