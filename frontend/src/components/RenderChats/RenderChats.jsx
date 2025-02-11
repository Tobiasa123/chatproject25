import { useEffect, useState } from 'react';
import Chat from '../Chat/Chat';
const RenderChats = () => {
    const [chats, setChats] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
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
  
      fetchChats();
    }, []);
  
    return (
      <div className="bg-white shadow-lg rounded-2xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <h3 className="text-lg font-semibold">Chats</h3>
      <div>
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            className="bg-gray-100 hover:bg-gray-200 transition"
          >
            <Chat chatId={chat.chatId} participants={chat.participants} />
          </div>
        ))}
      </div>
    </div>
      );
    };
    
  
  export default RenderChats;