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
    <div className="border-b-2 border-b-purpleAccent dark:border-b-purpleAccent flex items-center h-20 w-full">
      <UserIcon username={otherUser?.username} otherUserId={otherUser?._id} />
      {otherUser ? (
        <div
          onClick={handleClick}
          className="bg-lightBackground dark:bg-darkBackground hover:bg-purpleAccent dark:hover:bg-purpleAccent hover:cursor-pointer transition flex flex-col justify-center w-full h-full p-3"
        >
          <div className="flex justify-between items-center w-full">
            <h4 className="font-bold text-lg text-darkText dark:text-lightText text-left truncate max-w-[65%]">
              {otherUser?.username}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-300 text-right">
              {formattedDate && formattedTime ? `${formattedDate}, ${formattedTime}` : formattedDate || formattedTime}
            </span>
          </div>

          <p className="text-sm text-center text-darkText dark:text-lightText mt-1 overflow-hidden max-w-[80%] mx-auto">
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
