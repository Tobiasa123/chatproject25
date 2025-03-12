import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserIcon from '../UserIcon/UserIcon';

const Chat = ({ chatId, otherUser, latestMessage, latestTimestamp, latestSenderId, currentUserId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${chatId}/messages`);
  };


  const formattedDate = latestTimestamp ? new Date(latestTimestamp).toLocaleDateString() : null;
  const formattedTime = latestTimestamp ? new Date(latestTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  const messageSender = latestSenderId === currentUserId ? 'You' : otherUser?.username;

  return (
    <div className=" grid grid-cols-[auto_1fr] items-center gap-2 w-full ">
    <UserIcon username={otherUser?.username} otherUserId={otherUser?._id} />
  
  {otherUser ? (
    <div 
      onClick={handleClick} 
      className="bg-lightBackground  dark:bg-darkBackground hover:bg-purpleAccent dark:hover:bg-purpleAccent cursor-pointer transition grid grid-rows-[auto_auto] h-full p-3"
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <h4 className="font-bold text-lg text-darkText dark:text-lightText truncate">
          {otherUser.username}
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-300">
          {formattedDate && formattedTime ? `${formattedDate}, ${formattedTime}` : formattedDate || formattedTime}
        </span>
      </div>
      <p className="text-sm text-darkText dark:text-lightText mt-1 truncate grid">
        {messageSender}: {latestMessage || 'No messages yet'}
      </p>
    </div>
  ) : (
    <h4 className="font-bold text-darkText dark:text-lightText grid">Other user not found</h4>
  )}
</div>

  );
};

export default Chat;
