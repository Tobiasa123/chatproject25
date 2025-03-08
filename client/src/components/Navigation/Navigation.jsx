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
      <Link to="/home" className="text-purpleAccent text-xl font-semibold hover:underline">
        Your chats
      </Link>
      <Link to="/profile" className="text-purpleAccent text-xl font-semibold hover:underline">
        Your profile
      </Link>
      <button 
        onClick={handleLogout} 
        className="text-purpleAccent text-xl font-semibold hover:underline"
      >
        Logout
      </button>
      <ThemeSwitch />
    </nav>
  );
};

export default Navbar;
