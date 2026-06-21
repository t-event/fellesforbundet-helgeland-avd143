/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        morkbla: '#1A1836',
        rod: '#CF0000',
        gra: '#E9E9E9',
        lysgronn: '#C4D3A4',
        lysbla: '#98B4F4',
        oransje: '#FF6700',
        gul: '#FCCB00',
        rosa: '#FFE1E4',
        beige: '#FFEDD2',
        burgunder: '#621324',
      },
      fontFamily: {
        sans: ['Monument Grotesk', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
