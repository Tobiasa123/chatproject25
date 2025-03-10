import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/');
    setIsMenuOpen(false); 
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); 
  };

  return (
    <nav className="w-full bg-lightBackground dark:bg-darkBackground border-b-2 border-purpleAccent">
      <div className="w-full px-6 py-3 flex justify-between items-center">
      
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          EveryTen
        </div>

       
        <div className="sm:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl text-purple-600 dark:text-purple-400"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

     
        <div className="hidden sm:flex space-x-6">
          <button
            onClick={() => handleNavigation('/home')}
            className="flex items-center px-4 py-2 rounded-md text-slate-700 dark:text-slate-300  hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span>Chats</span>
          </button>
          <button
            onClick={() => handleNavigation('/profile')}
            className="flex items-center px-4 py-2 rounded-md text-slate-700 dark:text-slate-300   hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <span>Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-md text-slate-700 dark:text-slate-300  hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>

   
        <ThemeSwitch />
      </div>

     
      {isMenuOpen && (
        <div className="sm:hidden flex flex-col space-y-4 px-6 py-3">
          <button
            onClick={() => handleNavigation('/home')}
            className="text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span>Chats</span>
          </button>
          <button
            onClick={() => handleNavigation('/profile')}
            className="text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <span>Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
