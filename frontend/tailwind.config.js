/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'media0': '0px',
      'media480': '480px',
      'media600': '600px',
      'media768': '768px',
      'media900': '900px',
      'media1024': '1024px',
      'media1200': '1200px',
    },
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
      },
      animation: {
        "loop-scroll": "loop-scroll 20s linear infinite",
      },
      keyframes: {
        "loop-scroll": {
          to: { transform: "translateX(calc(-100% - 100px))" }
        }
      }
    },
  },
  plugins: [],
}