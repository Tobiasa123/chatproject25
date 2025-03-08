// @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
      },
      colors: {
        // Backgrounds
        lightBackground: '#D1D1D1', // Light gray background for light mode
        darkBackground: '#2C2C2C',  // Dark gray background for dark mode
        
        // Text Colors
        lightText: '#FFFFFF',       // White text for dark mode
        darkText: '#2C2C2C',        // Dark gray text for light mode
        
        // Purple Accent (Stays the same in both modes)
        purpleAccent: '#9B4DFF',    // Purple accents (links, buttons, etc.)

        // Border
        lightBorder: '#A0A0A0',     // Slightly darker gray border for light mode
        darkBorder: '#3A3A3A',      // Dark gray border for dark mode
      },
    },
  },
  plugins: [],
};
