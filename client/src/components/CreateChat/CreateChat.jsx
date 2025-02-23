import React, { useState } from 'react';


//add socketio to listen if i get added or add a chat to update instantly for both users
const CreateChat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setUsername(e.target.value);

    if (e.target.value.trim() === '') {
        setMessage('');
      }
  };

  const handleCreateChat = async () => {
    if (!username.trim()) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/chats', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`, 
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === 'Chat already exists') {
          setMessage('Chat already exists!');
        } else {
          setMessage('Chat created successfully!');
        }
      } else {
        setMessage(data.message || 'Error creating chat');
      }
    } catch (error) {
      setMessage('Error creating chat');
      console.error(error);
    }
  };

  return (
    <div className="create-chat-container">
      <h2>Create a New Chat</h2>
      <input
        type="text"
        placeholder="Enter recipient's username"
        value={username}
        onChange={handleInputChange}
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={handleCreateChat}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Create Chat
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateChat;
