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
    <div className="w-full h-[60px] flex-shrink-0">
      <div className="flex flex-row justify-center h-full">
        <input
          type="text"
          className="w-full rounded-l-md bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim() !== "") {
              sendMessage();
            }
          }}
        />
        <button className="rounded-r-md w-14 bg-purpleAccent text-lightText border-2 border-lightText dark:border-darkBackground" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatTextForm; 