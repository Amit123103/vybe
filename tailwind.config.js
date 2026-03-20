/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        vybe: {
          primary: '#FF3CAC',
          'primary-dark': '#C4006E',
          secondary: '#784BA0',
          accent: '#2B86C5',
          bg: {
            primary: '#0A0A0F',
            secondary: '#12121A',
            tertiary: '#1C1C28',
          },
          text: {
            primary: '#F5F5FF',
            secondary: '#9999BB',
            muted: '#555577',
          },
          success: '#00E676',
          warning: '#FFD740',
          error: '#FF5252',
          info: '#40C4FF',
        },
      },
      fontFamily: {
        'clash-bold': ['ClashDisplay-Bold'],
        'clash-semibold': ['ClashDisplay-SemiBold'],
        'satoshi': ['Satoshi-Regular'],
        'satoshi-medium': ['Satoshi-Medium'],
        'satoshi-bold': ['Satoshi-Bold'],
      },
    },
  },
  plugins: [],
};
