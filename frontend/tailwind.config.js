/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       extend: {
     fontFamily: {
      sans: ['Poppins', 'system-ui', 'sans-serif'],
        }
      },
    },
  },
  plugins: [],
};