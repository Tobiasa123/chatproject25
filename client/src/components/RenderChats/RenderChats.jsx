import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from "jwt-decode"; 
import Chat from '../Chat/Chat';
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;


//render chats in home
const RenderChats = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const socketRef = useRef(null);

  const fetchChats = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setError('No token found');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/user/chats`, {
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
      socketRef.current = io(`${BASE_URL}`, { withCredentials: true });
  
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
        fetchChats(); 
      };
  
      const handleChatDeleted = (deletedChat) => {
        console.log(`Chat ${deletedChat.chatId} deleted.`);
        setChats((prevChats) => prevChats.filter(chat => chat.chatId !== deletedChat.chatId));
      };
  
      socketRef.current.on("newChat", handleNewChat);
      socketRef.current.on("updateChatList", handleUpdateChatList);
      socketRef.current.on("chatDeleted", handleChatDeleted);
  
      return () => {
        socketRef.current.off("newChat", handleNewChat);
        socketRef.current.off("updateChatList", handleUpdateChatList);
        socketRef.current.off("chatDeleted", handleChatDeleted);
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [currentUserId]);
  

  return (
    <div className=" w-full h-full bg-lightBackground dark:bg-darkBackground rounded p-4 overflow-y-auto custom-scrollbar ">
      {/* {error && <p className="text-gray-500">{error}</p>} */}
      <section className="grid gap-2">
        {chats.length > 0 ? (
          chats.map(chat => 
            chat?.otherUser ? (
              <Chat 
                key={chat.chatId}
                chatId={chat.chatId} 
                otherUser={chat.otherUser} 
                latestMessage={chat.latestMessage || "No messages yet"}
                latestTimestamp={chat.latestTimestamp}
                latestSenderId={chat.latestSenderId || ""} 
                currentUserId={currentUserId}
                openMenuId={openMenuId} 
                setOpenMenuId={setOpenMenuId} 
              />
            ) : (
              <p key={chat.chatId} className="p-2 bg-gray-100 rounded">Loading chat info...</p>
            )
          )
        ) : (
          <p className="text-gray-500">No chats available</p>
        )}
      </section>
    </div>
  );

};

export default RenderChats;