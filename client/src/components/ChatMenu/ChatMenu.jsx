import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

const ChatMenu = ({ onViewProfile, onBlock, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

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
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={onViewProfile}>View Profile</button>
          <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100" onClick={onBlock}>Block User</button>
          <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100" onClick={onDelete}>Delete Chat</button>
        </div>
      )}
    </div>
  );
};

export default ChatMenu;
