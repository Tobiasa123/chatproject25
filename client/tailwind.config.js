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
        lightBackground: '#FFFFFF', 
        darkBackground: '#403f3f',  
        
        // Text Colors
        lightText: '#FFFFFF',       
        darkText: '#3d3d3d',        
        
        // Purple Accent (Stays the same in both modes)
        purpleAccent: '#7045f7',  

        // Border
        lightBorder: '#A0A0A0', 
        darkBorder: '#3A3A3A',     
      },
    },
  },
  plugins: [],
};
