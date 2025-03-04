import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserIcon from '../UserIcon/UserIcon';
import ChatMenu from '../ChatMenu/ChatMenu';

const Chat = ({ chatId, otherUser }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${chatId}/messages`);
  };

  return (
    <div 
      className="bg-blue-400 hover:bg-blue-600 hover:cursor-pointer transition border rounded-md p-3 flex items-center space-x-3 height-full w-full" 
      
    >     
      
      {otherUser ? (
      <div onClick={handleClick} className="bg-orange-200 hover:bg-orange-300 hover:cursor-pointer transition border rounded-md flex items-center justify-between w-full">
         <UserIcon username={otherUser?.username} />
         <h4 className="font-bold overflow-x-hidden  flex-1 text-center">{otherUser?.username}, chatId: {chatId}</h4>
         
       </div>
        
      ) : (
        <h4 className="font-bold">Other user not found</h4>
      )}
      <ChatMenu />
    </div>
  );
};

export default Chat;
