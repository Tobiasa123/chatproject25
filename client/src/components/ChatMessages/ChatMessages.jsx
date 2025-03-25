import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BackArrow from "../BackArrow/BackArrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
const BASE_URL = import.meta.env.VITE_BASE_URL;

//messages for a chat room
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
      const response = await fetch(`${BASE_URL}/chat/${chatId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reportWithUsername }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsReporting(false);
        setReportReason(""); 
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
        const response = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
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
    socketRef.current = io(`${BASE_URL}`);
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
    <div className="relative flex flex-col flex-grow h-0 w-full bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText rounded-md">

      <div className="relative flex items-center justify-between p-4">
        <BackArrow />
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
          Chat with {otherUser ? otherUser.username : "Loading..."}
        </h1>
        <button
          onClick={() => setIsReporting(true)}
          className="bg-red-500 text-white flex items-center justify-center gap-2 px-4 py-2 rounded"
        >
          <FontAwesomeIcon icon={faFlag} />
          Report Chat
        </button>
      </div>


      {error && <p className="text-red-500 text-center">{error}</p>}

      {isReporting && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-gray-200 dark:bg-gray-900 p-6 rounded-2xl w-96">
            <h3 className="text-lg font-semibold text-center">Report Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">Provide a reason for reporting this chat.</p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter reason"
              className="resize-none w-full p-3 mt-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsReporting(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReportChat}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar flex flex-col-reverse bg-lightBackground dark:bg-darkBackground w-full rounded-b-md"
      >
      <ul className="flex flex-col gap-6 p-4">
        {messages.slice(-10).map((message, index, arr) => {
          const reversedIndex = arr.length - 1 - index;
          const opacity = reversedIndex < 10 ? 1 - reversedIndex * 0.1 : 0;
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
                opacity,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {isUserMessage ? "" : `${otherUser?.username || "Other"}: `}
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
