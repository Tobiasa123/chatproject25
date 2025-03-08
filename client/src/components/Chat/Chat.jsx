import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserIcon from '../UserIcon/UserIcon';

const Chat = ({ chatId, otherUser, latestMessage, latestTimestamp, latestSenderId, currentUserId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${chatId}/messages`);
  };

  const formattedTimestamp = latestTimestamp
    ? new Date(latestTimestamp).toLocaleString()
    : 'No timestamp available';

  const messageSender = latestSenderId === currentUserId ? 'You' : otherUser?.username;

  return (
    <div className="bg-purpleAccent hover:bg-purpleAccent dark:bg-purpleAccent dark:hover:bg-purpleAccent hover:cursor-pointer transition border border-lightBorder dark:border-darkBorder rounded-md flex items-center h-24 w-full">
      <UserIcon username={otherUser?.username} otherUserId={otherUser?._id} />
      {otherUser ? (
        <div 
          onClick={handleClick} 
          className="bg-lightBackground dark:bg-darkBackground hover:bg-lightBackground dark:hover:bg-darkBackground hover:cursor-pointer transition rounded-r-md flex flex-col justify-center w-full h-full p-4"

        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg text-darkText dark:text-lightText text-left truncate w-3/4">
              {otherUser?.username}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-300 text-right w-1/4">
              {formattedTimestamp}
            </span>
          </div>
  
          <p className="text-lg text-center text-darkText dark:text-lightText mt-1 overflow-hidden">
            {messageSender}: {latestMessage || 'No messages yet'}
          </p>
        </div>
      ) : (
        <h4 className="font-bold text-darkText dark:text-lightText">Other user not found</h4>
      )}
    </div>
  );
  
};

export default Chat;
