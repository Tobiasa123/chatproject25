import { Link, useNavigate } from "react-router-dom";

import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";

const Navbar = () => {

  const navigate = useNavigate();  

  const handleLogout = () => {

    sessionStorage.removeItem('authToken');
    
    navigate('/');
  };

  return (
    <nav className="w-full bg-lightBackground dark:bg-darkBackground p-4 flex justify-between items-center">
      <button 
        onClick={() => navigate('/home')} 
        className="px-4 py-2 rounded-md bg-purpleAccent text-darkText dark:text-lightText  hover:bg-purpleAccent hover:text-white transition-all"
      >
        Your chats
      </button>
      
      <button 
        onClick={() => navigate('/profile')} 
        className="px-4 py-2 rounded-md bg-purpleAccent text-darkText dark:text-lightText hover:bg-purpleAccent hover:text-white transition-all"
      >
        Profile
      </button>
      
      <button 
        onClick={handleLogout} 
        className="px-4 py-2 rounded-md bg-purpleAccent text-darkText dark:text-lightText hover:bg-purpleAccent hover:text-white transition-all"
      >
        Logout
      </button>
      
      <ThemeSwitch />
    </nav>
  );
  
  
};

export default Navbar;
