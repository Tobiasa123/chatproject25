import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const CreateChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  const inputRef = useRef(null); 

  useEffect(() => {
    if (username.trim() === "" || isUserSelected || isSearchTriggered) {
      setSuggestions([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/users/search?username=${encodeURIComponent(username)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const debounceTimeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [username, isUserSelected, isSearchTriggered]);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    setMessage("");
    setIsUserSelected(false); 
    setIsSearchTriggered(false); 
  };

  const handleSelectUser = (selectedUsername) => {
    setUsername(selectedUsername);
    setSuggestions([]);
    setIsUserSelected(true); 
    inputRef.current.focus(); 
  };

  const handleSearch = () => {
    
    setSuggestions([]);
    setIsUserSelected(false);
    setIsSearchTriggered(true); 
    handleCreateChat();
  };

  const handleCreateChat = async () => {
    if (!username.trim()) return;
    try {
      const response = await fetch("http://127.0.0.1:8000/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Chat already exists") {
          setMessage("Chat already exists!");
        } else {
          setMessage("Chat created successfully!");
        }
      } else {
        setMessage(data.message || "Error creating chat");
      }

      
      setUsername(""); 
      setIsSearchTriggered(false); 
    } catch (error) {
      setMessage("Error creating chat");
      console.error(error);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); 
    }
  };

  return (
    <div className="create-chat-container bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText rounded-t-md flex flex-col p-2 relative">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-xl" />
        <input
          ref={inputRef} 
          type="text"
          placeholder="Enter recipient's username"
          value={username}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} 
          className="border border-lightBorder dark:border-darkBorder p-2 rounded bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText w-full"
        />
        <button
          onClick={handleSearch} 
          className="bg-purpleAccent text-darkText dark:text-lightText py-2 px-4 rounded whitespace-nowrap"
        >
          Create Chat
        </button>
      </div>

      {/* Dropdown */}
      {suggestions.length > 0 && !isUserSelected && !isSearchTriggered && (
        <div className="relative w-full">
          <ul className="bg-white dark:bg-gray-800 border rounded mt-1 shadow-md absolute w-full z-10 max-h-60 overflow-y-auto">
            {suggestions.map((user) => (
              <li
                key={user._id}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelectUser(user.username)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && <p className="text-purpleAccent mt-2">{message}</p>}
    </div>
  );
};

export default CreateChat;
