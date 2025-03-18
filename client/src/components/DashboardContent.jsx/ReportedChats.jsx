import React, { useEffect, useState } from 'react';

const ReportedChats = () => {
  const [reportedChats, setReportedChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportedChats = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/dashboard/chats/reported', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setReportedChats(data.reportedChats || []);
        } else {
          setError(data.message || 'Error fetching reported chats');
        }
      } catch (err) {
        setError('Error fetching reported chats');
      }
    };

    fetchReportedChats();
  }, []);

  const handleChatClick = (chatId) => {
    if (selectedChatId === chatId) {
      setSelectedChatId(null); 
    } else {
      setSelectedChatId(chatId); 
    }
  };


  const resolveChat = async (chatId, event) => {

    event.stopPropagation(); 

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setError('No token found');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/dashboard/chats/${chatId}/resolve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReportedChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === chatId ? { ...chat, reported: false, reportReason: '' } : chat
          )
        );
      } else {
        setError(data.message || 'Error resolving chat');
      }
    } catch (err) {
      setError('Error resolving chat');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-darkText dark:text-lightText mb-4">Reported Chats</h2>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <ul className="grid gap-2">
        {reportedChats.length > 0 ? (
          reportedChats.map((chat) => (
            <li
              key={chat._id}
              className="flex flex-col p-2 bg-white dark:bg-gray-800 rounded border border-black dark:border-white cursor-pointer"
              onClick={() => handleChatClick(chat._id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-md text-darkText dark:text-lightText">
                    Chat between {chat.participants.map((participant) => participant.username).join(" and ")}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Reported: {chat.reported ? "Yes" : "No"}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    User comment {chat.reportReason || "No reason provided"}
                  </div>
                </div>
                
                {chat.reported && (
                  <button
                    onClick={(event) => resolveChat(chat._id, event)}
                    className="h-full px-8 bg-purpleAccent text-white rounded hover:bg-purple-600 transition"
                  >
                    Mark as resolved
                  </button>
                )}
              </div>
              
              {selectedChatId === chat._id && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-darkText dark:text-lightText">Messages</h3>
                  <ul className="grid gap-2 mt-2">
                    {chat.messages.length > 0 ? (
                      chat.messages.map((message, index) => (
                        <li key={index} className="p-3 bg-gray-200 dark:bg-gray-700 rounded">
                          <div className="font-semibold text-darkText dark:text-lightText">{message.sender.username}:</div>
                          <div className="text-gray-700 dark:text-gray-300">{message.text}</div>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No messages available for this chat.</p>
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No reported chats found.</p>
        )}
      </ul>
    </div>
  );

};

export default ReportedChats;
