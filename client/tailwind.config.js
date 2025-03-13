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
        lightBackground: '#FFFFFF', // Light gray background for light mode
        darkBackground: '#403f3f',  // Dark gray background for dark mode
        
        // Text Colors
        lightText: '#FFFFFF',       // White text for dark mode
        darkText: '#3d3d3d',        // Dark gray text for light mode
        
        // Purple Accent (Stays the same in both modes)
        purpleAccent: '#7045f7',    // Purple accents (links, buttons, etc.)

        // Border
        lightBorder: '#A0A0A0',     // Slightly darker gray border for light mode
        darkBorder: '#3A3A3A',      // Dark gray border for dark mode
      },
    },
  },
  plugins: [],
};
