import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <nav className="w-full bg-lightBackground dark:bg-darkBackground border-b-2 border-purpleAccent">

      <div className="w-full px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          EveryTen
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center px-4 py-2 rounded-md text-slate-700 dark:text-slate-300  hover:bg-purple-500 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span>Chats</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
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

        {/* Theme Switch */}
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;
