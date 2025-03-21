import { useEffect, useState } from 'react';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

//themeswitch button
export const ThemeSwitch = () => {
  const [theme, setTheme] = useState(
    (localStorage.getItem('theme') === 'dark' ? 'dark' : 'light') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center p-1 cursor-pointer transition-colors"
    >
      <motion.div
        className={`w-6 h-6 bg-purpleAccent dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center transform transition-transform ${
          theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
        }`}
        transition={{ duration: 0.3 }}
      >
        <FontAwesomeIcon
          icon={theme === 'light' ? faSun : faMoon}
          className={`text-lg ${theme === 'light' ? 'text-white' : 'text-purpleAccent'}`}
        />
      </motion.div>
    </motion.button>
  );
};
