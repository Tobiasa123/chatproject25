import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  

const ChatMessages = () => {
  const { chatId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = sessionStorage.getItem('authToken');
  
      if (!token) {
        setError('No token found');
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/chats/${chatId}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setMessages(data.messages);  
        } else {
          setError(data.message || 'Error fetching messages');
        }
      } catch (err) {
        setError('Error fetching messages');
      }
    };

    fetchMessages();
  }, [chatId]); 

  return (
    <div className="bg-white text-black flex flex-col gap-4 p-4 rounded-lg shadow-md">
      <h1 className="text-lg font-semibold">Messages for Chat ID: {chatId}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="flex flex-col gap-6 p-0">
        {messages.map((message, index) => {
          const decoded = jwtDecode(sessionStorage.getItem('authToken'));
          const isUserMessage = message.sender === decoded._id;
  
          return (
            <li 
              key={index} 
              className={`max-w-fit p-2 rounded-2xl ${
                isUserMessage 
                  ? "bg-pink-300 self-end" 
                  : "bg-blue-600 text-white self-start"
              }`}
            >
              {isUserMessage ? "You: " : "Other: "} 
              {message.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatMessages;