import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const BASE_URL = import.meta.env.VITE_BASE_URL;

//input to create a new chat with a user
const CreateChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (username.trim() === "" || isUserSelected || isSearchTriggered) {
      setSuggestions([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/users/search?username=${encodeURIComponent(username)}`,
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
        setSelectedIndex(-1); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const debounceTimeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [username, isUserSelected, isSearchTriggered]);

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

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
      const response = await fetch(`${BASE_URL}/chats`, {
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
          setTimeout(() => setMessage(""), 2000);
        } else {
          setMessage("Chat created successfully!");
          setTimeout(() => setMessage(""), 2000);
        }
      } else {
        setMessage(data.message || "Error creating chat");
        setTimeout(() => setMessage(""), 2000);
      }

      setUsername("");
      setIsSearchTriggered(false);
    } catch (error) {
      setMessage("Error creating chat");
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prevIndex) => 
            prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : 0
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSelectUser(suggestions[selectedIndex].username);
          } else {
            handleSearch();
          }
          break;
        case "Escape":
          setSuggestions([]);
          break;
        default:
          break;
      }
    } else if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText rounded-md flex flex-col p-2 relative">
      <div className="grid grid-cols-1 gap-2">
        <span className="text-xl font-bold">Create a new chat</span>
        <div className="grid grid-cols-[1fr,auto] items-center gap-2">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter recipient's username or Friend ID"
              value={username}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="border border-lightBorder dark:border-darkBorder p-2 pr-10 rounded bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText w-full"
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-purpleAccent text-lightText py-2 px-4 rounded whitespace-nowrap"
          >
            Create Chat
          </button>
        </div>
      </div>
  
      {/* Dropdown */}
      {suggestions.length > 0 && !isUserSelected && !isSearchTriggered && (
        <div className="relative w-full">
          <ul 
            ref={listRef}
            className="bg-white dark:bg-gray-800 border rounded mt-1 absolute w-full z-10 max-h-60 overflow-y-auto"
          >
            {suggestions.map((user, index) => (
              <li
                key={user._id}
                className={`p-2 cursor-pointer ${
                  index === selectedIndex
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
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