import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from "jwt-decode"; 
import Chat from '../Chat/Chat';
import { io } from "socket.io-client";

const RenderChats = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const socketRef = useRef(null);


  const fetchChats = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setError('No token found');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/user/chats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        setChats(data.chatData);
      } else {
        setError(data.message || 'Error fetching chats');
      }
    } catch (err) {
      setError('Error fetching chats');
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        setCurrentUserId(decodedToken._id);
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
  
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000", { withCredentials: true });
  
      socketRef.current.emit('joinUserRoom', currentUserId);
  
      const handleNewChat = async (newChat) => {
        console.log("New chat received:", newChat);
        fetchChats(); 
      };
  
      const handleUpdateChatList = async ({ chatId, latestMessage, latestTimestamp, latestSenderId }) => {
        console.log("Chat list update received:", chatId, latestMessage, latestSenderId);
  
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === chatId
              ? {
                  ...chat,
                  latestMessage, 
                  latestTimestamp: latestTimestamp || new Date().toISOString(),
                  latestSenderId,  
                }
              : chat
          )
        );
        fetchChats(); //fetch after to update order of message list
      };
  
      socketRef.current.on("newChat", handleNewChat);
      socketRef.current.on("updateChatList", handleUpdateChatList);
  
      return () => {
        socketRef.current.off("newChat", handleNewChat);
        socketRef.current.off("updateChatList", handleUpdateChatList);
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [currentUserId]);

  return (
    <div className="w-full h-full bg-lightBackground dark:bg-darkBackground rounded-b-md">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <h3 className="text-lg font-semibold text-darkText dark:text-lightText">Your chats</h3>
      <div className="flex flex-col gap-1">
        {chats.length > 0 ? (
          chats.map(chat => (
            <div key={chat.chatId}>
              {chat && chat.otherUser ? (
                <Chat 
                  chatId={chat.chatId} 
                  otherUser={chat.otherUser} 
                  latestMessage={chat.latestMessage || "No messages yet"}
                  latestTimestamp={chat.latestTimestamp}
                  latestSenderId={chat.latestSenderId || ""} 
                  currentUserId={currentUserId} 
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">
                  Loading chat information...
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No chats available</p>
        )}
      </div>
    </div>
  );
};

export default RenderChats;
