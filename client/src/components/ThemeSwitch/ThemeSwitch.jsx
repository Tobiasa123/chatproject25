import { useEffect, useState } from 'react';
// Icon import
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Framer-motion imports
import { motion } from 'framer-motion';

export const ThemeSwitch = () => {
  const [theme, setTheme] = useState(
    (localStorage.getItem('theme') === 'dark' ? 'dark' : 'light') || 'light'
  );

  useEffect(() => {
    // Toggle dark mode class based on theme selection
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <motion.button
      onClick={toggleTheme}
      className="grid grid-cols-[min-content_1fr] items-center sm:gap-2 p-2 rounded-md 
                 bg-purpleAccent text-darkText dark:text-lightText
                 border border-darkBorder dark:border-lightBorder
                 transition-transform"
    >
      <motion.div
        key={theme}
        className="grid place-items-center"
        initial={{ rotate: 180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: -180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FontAwesomeIcon
          icon={theme === 'light' ? faMoon : faSun}
          className="h-5 w-5"
        />
      </motion.div>
      <span className="text-sm hidden sm:inline">
        {theme === 'light' ? 'Darkmode' : 'Lightmode'}
      </span>
    </motion.button>
  );
};
