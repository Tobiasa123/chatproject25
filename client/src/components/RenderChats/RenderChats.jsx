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

  //className="bg-white shadow-lg rounded-2xl w-full h-full"

    return (
      <div className=" w-full h-full" >
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <h3 className="text-lg font-semibold">Your chats</h3>
      <div>
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            
          >
            <Chat chatId={chat.chatId} participants={chat.participants} />
          </div>
        ))}
      </div>
    </div>
  );
};
    
  
  export default RenderChats;