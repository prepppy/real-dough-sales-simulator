/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        rd: {
          primary: '#E53935',    // Real Dough Red
          secondary: '#FF6B35',  // Warm Orange
          purple: '#6B3FF3',     // Accent Purple
          blue: '#0066FF',       // Accent Blue
          green: '#00D084',      // Accent Green
          yellow: '#FFD600',     // Accent Yellow
        },
        bg: {
          primary: '#FAFAF9',    // Warm White
          secondary: '#F5F1E8',  // Cream
          dark: '#1A1A1A',       // Dark Mode
        }
      },
      borderWidth: {
        '3': '3px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}