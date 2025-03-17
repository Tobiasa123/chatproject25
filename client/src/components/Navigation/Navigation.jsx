import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';
import { useState } from 'react';
import DashboardBtn from '../DashboardBtn/DashboardBtn';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    setIsMenuOpen(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-lightBackground dark:bg-darkBackground border-b-2 border-purpleAccent">
      <div className="w-full px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-purpleAccent dark:text-lightText">
          EveryTen
        </div>

        {/* Show only ThemeSwitch if on the "/" route */}
        {location.pathname === '/' ? (
          <ThemeSwitch />
        ) : (
          <>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-2xl text-slate-700 dark:text-slate-300"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <DashboardBtn/>
              <button
                onClick={() => handleNavigation('/home')}
                className="flex items-center px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                <span>Chats</span>
              </button>
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>

            {/* ThemeSwitch (only shown when not on "/") */}
            <ThemeSwitch />
          </>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && location.pathname !== '/' && (
        <div className="md:hidden flex flex-col space-y-4 px-6 py-3">
          <DashboardBtn/>
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
