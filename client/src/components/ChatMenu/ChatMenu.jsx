import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatMenu = ({ otherUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (otherUserId) {
      navigate(`/profile/${otherUserId}`);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white hover:bg-gray-300"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg">
          <button 
            className="block w-full text-left px-4 py-2 hover:bg-gray-100" 
            onClick={handleViewProfile}
          >
            View Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMenu;
