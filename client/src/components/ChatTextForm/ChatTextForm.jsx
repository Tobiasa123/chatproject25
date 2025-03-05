import { useState } from "react";
import { useParams } from "react-router-dom";

const ChatTextForm = ({ onMessageSent }) => {
  const { chatId } = useParams(); 
  const [message, setMessage] = useState("");
  const token = sessionStorage.getItem('authToken');

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessage("");

      if (onMessageSent) onMessageSent(data.chat); 
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-center h-12">
        <input
          type="text"
          id="message-box"
          className="w-full border border-black"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim() !== "") {
              sendMessage();
            }
          }}
        />
        <button className="bg-blue-400 rounded-md w-14" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatTextForm; 