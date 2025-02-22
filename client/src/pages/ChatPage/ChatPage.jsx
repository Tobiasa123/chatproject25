import React, { useEffect } from "react";
import { io } from "socket.io-client";
import ChatMessages from "../../components/ChatMessages/ChatMessages";
import ChatTextForm from "../../components/ChatTextForm/ChatTextForm";

const ChatPage = () => {

    //just testing websocket here, remove later
  useEffect(() => {

    const socket = io("http://127.0.0.1:8000");  

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="chatmessages-wrapper">
      <ChatMessages />

      <section className="input-section">
        <ChatTextForm />
      </section>
    </div>
  );
};

export default ChatPage;