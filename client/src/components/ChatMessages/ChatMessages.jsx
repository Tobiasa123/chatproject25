import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ChatMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [error, setError] = useState(null);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef();

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
          setOtherUser(data.otherUser); 
        } else {
          setError(data.message || 'Error fetching messages');
        }
      } catch (err) {
        setError('Error fetching messages');
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:8000");
    socketRef.current.emit("joinChat", chatId);

    socketRef.current.on("newMessage", (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketRef.current.emit("leaveChat", chatId);
      socketRef.current.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col flex-grow h-0 w-full bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText rounded-md">
      <h1 className="text-lg font-semibold my-4 text-center">
        Chat with {otherUser ? otherUser.username : "Loading..."}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto flex flex-col-reverse bg-slate-500 w-full rounded-b-md"
      >
        <ul className="flex flex-col gap-6 p-4">
          {messages.map((message, index) => {
            const decoded = jwtDecode(sessionStorage.getItem('authToken'));
            const isUserMessage = message.sender === decoded._id;
            return (
              <li
                key={index}
                className={`max-w-[80%] break-words p-2 rounded-2xl ${
                  isUserMessage
                    ? "bg-purpleAccent text-white self-end"
                    : "bg-darkBackground text-white self-start"
                }`}
              >
                {isUserMessage ? "You: " : `${otherUser?.username || "Other"}: `}
                {message.text}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
  
  
  
};

export default ChatMessages;