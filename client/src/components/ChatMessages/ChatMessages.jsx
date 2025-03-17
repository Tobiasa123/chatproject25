import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BackArrow from "../BackArrow/BackArrow";

const ChatMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [error, setError] = useState(null);
  const [isReporting, setIsReporting] = useState(false); 
  const [reportReason, setReportReason] = useState("");
  const messagesContainerRef = useRef(null);
  const socketRef = useRef();

  const handleReportChat = async () => {
    if (!reportReason) {
      setError("Please provide a reason for reporting.");
      return;
    }
  
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setError("No token found");
      return;
    }
  
    const decoded = jwtDecode(token); 
  
    const reportWithUsername = `${decoded.username}: ${reportReason}`;
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/chat/${chatId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: reportWithUsername, 
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Chat reported successfully");
        setIsReporting(false); 
      } else {
        setError(data.message || "Error reporting chat");
      }
    } catch (err) {
      setError("Error reporting chat");
    }
  };
  
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
      <div className="p-4 absolute">
        <BackArrow />
      </div>
      <h1 className="text-lg font-semibold my-4 text-center bg">
        Chat with {otherUser ? otherUser.username : "Loading..."}
      </h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Report Chat Button */}
      <button
        onClick={() => setIsReporting(true)}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 self-center"
      >
        Report Chat
      </button>

      {/* Report Form */}
      {isReporting && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="text-lg font-semibold">Provide a reason for reporting</h3>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Enter reason"
            className="w-full p-2 mt-2 border rounded"
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setIsReporting(false)} 
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleReportChat}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar flex flex-col-reverse bg-lightBackground dark:bg-darkBackground w-full rounded-b-md"
      >
        <ul className="flex flex-col gap-6 p-4">
          {messages.map((message, index) => {
            const decoded = jwtDecode(sessionStorage.getItem('authToken'));
            const isUserMessage = message.sender === decoded._id;
            return (
              <li
                key={index}
                className={`max-w-[80%] w-fit p-2 rounded-2xl ${
                  isUserMessage
                    ? "bg-purpleAccent text-white self-end"
                    : "bg-darkBackground dark:bg-slate-800 text-white self-start"
                }`}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
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
