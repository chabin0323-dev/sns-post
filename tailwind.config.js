/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./components/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          bg: '#FFF0F5',
          main: '#D4537E',
          tag: '#FFE0EC',
          'tag-border': '#D4537E',
          'tag-text': '#72243E',
          deep: '#72243E',
          mid: '#e06090',
          light: '#f9d0e0',
        },
      },
      fontFamily: {
        noto: ['"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
