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

  return (
    <div className="container p-4">
      <h2 className="text-2xl font-semibold">Reported Chats</h2>
      
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {reportedChats.length > 0 ? (
          reportedChats.map((chat, index) => (
            <li
              key={index}
              className="bg-gray-100 p-4 mb-4 rounded-lg cursor-pointer"
              onClick={() => handleChatClick(chat._id)} 
            >
              <div className="font-bold text-lg">
                Chat between {chat.participants.map(participant => participant.username).join(' and ')}
              </div>
              <div className="text-sm text-gray-700">Reported: {chat.reported ? 'Yes' : 'No'}</div>
              <div className="text-sm text-gray-500 mt-2">
                Report Reason {chat.reportReason || 'No reason provided'}
              </div>
              
              {/* Display the messages of the selected chat */}
              {selectedChatId === chat._id && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Messages</h3>
                  <ul>
                    {chat.messages.length > 0 ? (
                      chat.messages.map((message, index) => (
                        <li key={index} className="bg-gray-200 p-3 mb-2 rounded-md">
                          <div className="font-semibold">{message.sender.username}:</div>
                          <div>{message.text}</div>
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
