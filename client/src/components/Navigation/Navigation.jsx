import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <Link to="/home" className="text-white text-xl font-semibold hover:underline">
        Your chats
      </Link>
      <Link to="/profile" className="text-white text-xl font-semibold hover:underline">
        Your profile
      </Link>
    </nav>
  );
};

export default Navbar;
