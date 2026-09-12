/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uday: {
          crimson: '#E75562',
          flame: '#FF6766',
          orange: '#FF9A66',
          peach: '#FFCB99',
          cream: '#FDFBF7',
          paper: '#FAF6EE',
          sage: '#6E9B72',
          forest: '#4D7C5D',
          teal: '#4E8097',
          aqua: '#5EB1C3',
          midnight: '#141E28',
          charcoal: '#222E38',
          sand: '#F5EFE6',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'sun-gradient': 'linear-gradient(135deg, #E75562 0%, #FF9A66 50%, #FFCB99 100%)',
        'wave-gradient': 'linear-gradient(135deg, #4E8097 0%, #5EB1C3 50%, #6E9B72 100%)',
        'uday-radial': 'radial-gradient(circle at center, #FFCB99 0%, #FF9A66 40%, #E75562 70%, #4E8097 100%)',
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(231, 85, 98, 0.25)',
        'teal': '0 10px 30px -10px rgba(78, 128, 151, 0.3)',
      }
    },
  },
  plugins: [],
}
