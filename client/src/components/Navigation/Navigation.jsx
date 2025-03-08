import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();  

  const handleLogout = () => {

    sessionStorage.removeItem('authToken');
    
    navigate('/');
  };

  return (
    <nav className="w-full bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <Link to="/home" className="text-white text-xl font-semibold hover:underline">
        Your chats
      </Link>
      <Link to="/profile" className="text-white text-xl font-semibold hover:underline">
        Your profile
      </Link>
      <button 
        onClick={handleLogout} 
        className="text-white text-xl font-semibold hover:underline"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
