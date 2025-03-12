import React, { useEffect } from "react";
import { io } from "socket.io-client";
import ChatMessages from "../../components/ChatMessages/ChatMessages";
import ChatTextForm from "../../components/ChatTextForm/ChatTextForm";
import Navbar from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";

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
    <div className="grid grid-rows-[auto_1fr_auto] h-screen w-full">
      <Navbar />
      <main className="flex flex-col w-full md:w-[90vw] lg:w-[60vw] mx-auto gap-4 py-6 h-full">
        <ChatMessages />
        <ChatTextForm />
      </main>
      <Footer />
    </div>
  );
  
};

export default ChatPage;