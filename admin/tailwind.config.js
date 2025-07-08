// tailwind.config.js
export default {
  content: [
    "./index.html",             // for Vite
    "./src/**/*.{js,ts,jsx,tsx}" // for React source files
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#5F6FFF"
      }
    },
  },
  plugins: [],
}
