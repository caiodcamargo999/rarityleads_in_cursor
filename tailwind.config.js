/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#101014',
        'main-bg': '#18181c',
        'card-bg': '#18181c',
        'button-bg': '#232336',
        'button-hover-bg': '#232136',
        'primary-text': '#e0e0e0',
        'secondary-text': '#b0b0b0',
        'sidebar-text': '#e0e0e0',
        'sidebar-text-secondary': '#b0b0b0',
        'button-text': '#fff',
        'border': '#232336',
        'sidebar-link-active': '#232336',
        'sidebar-link-hover': '#232336',
        'logout-separator': '#232336',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        normal: 400,
        medium: 500,
      },
      borderRadius: {
        'btn': '6px',
        'card': '10px',
      },
    },
  },
  plugins: [],
}; 