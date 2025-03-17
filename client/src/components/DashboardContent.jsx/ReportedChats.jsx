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
    <div className="w-full h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-darkText dark:text-lightText">Reported Chats</h2>
      
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {reportedChats.length > 0 ? (
          reportedChats.map((chat, index) => (
            <li
              key={index}
              className="bg-gray-100 dark:bg-slate-700 mb-4 rounded-lg cursor-pointer "
              onClick={() => handleChatClick(chat._id)} 
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-md text-darkText dark:text-lightText">
                    Chat between {chat.participants.map(participant => participant.username).join(' and ')}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Reported: {chat.reported ? 'Yes' : 'No'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Report Reason: {chat.reportReason || 'No reason provided'}
                  </div>
                </div>

                {/* Resolve Button - Align to the right */}
                {chat.reported && (
                  <div className="ml-auto flex items-center">
                    <button
                      onClick={(event) => resolveChat(chat._id, event)}
                      className="bg-purpleAccent text-white py-2 px-4 mx-1 rounded-md hover:bg-purple-600 focus:outline-none"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
              
              {/* Display the messages of the selected chat */}
              {selectedChatId === chat._id && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-darkText dark:text-lightText">Messages</h3>
                  <ul>
                    {chat.messages.length > 0 ? (
                      chat.messages.map((message, index) => (
                        <li key={index} className="bg-gray-200 dark:bg-slate-600 p-3 mb-2 rounded-md">
                          <div className="font-semibold text-darkText dark:text-lightText">{message.sender.username}:</div>
                          <div className="text-gray-700 dark:text-gray-300">{message.text}</div>
                        </li>
                      ))
                    ) : (
                      <p>No messages available for this chat.</p>
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No reported chats found</p>
        )}
      </ul>
    </div>
  );
};

export default ReportedChats;
