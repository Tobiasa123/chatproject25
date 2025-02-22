import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatId, participants }) => {
    const navigate = useNavigate()
    const HandleClick = () => {
        navigate(`/chat/${chatId}/messages`)
    }

  return (
    <div className="chat" onClick={HandleClick}>
      <h4>Chat ID: {chatId}</h4>
      <p>Participants:</p>
      <ul>
        {participants.map((username, index) => (
          <li key={index}>{username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;