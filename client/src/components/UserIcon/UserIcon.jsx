import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserIcon = ({ username, otherUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (otherUserId) {
      navigate(`/profile/${otherUserId}`);
    }
  };

  return (
    <div className="relative">
      {/* User Icon */}
      <div 
        className=" border-2 border-slate-500 w-20 h-20 bg-gray-400 flex items-center justify-center text-white font-bold rounded-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown on icon click
      >
        {username ? username.charAt(0).toUpperCase() : '?'}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-full top-0 w-40 bg-white border rounded-md shadow-lg h-full">
          <button 
            className="block w-full h-full text-center hover:bg-gray-200 rounded-md" 
            onClick={handleViewProfile}
          >
            View Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default UserIcon;