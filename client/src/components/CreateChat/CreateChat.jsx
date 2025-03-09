import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const CreateChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isUserSelected, setIsUserSelected] = useState(false); // Track if a user is selected

  useEffect(() => {
    if (username.trim() === "" || isUserSelected) {
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
  }, [username, isUserSelected]);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    setMessage("");
    setIsUserSelected(false); // Reset selection when the input changes
  };

  const handleSelectUser = (selectedUsername) => {
    setUsername(selectedUsername);
    setSuggestions([]);
    setIsUserSelected(true); // Mark as selected
  };

  const handleSearch = () => {
    // When clicking the search button, close the dropdown if it's open
    setSuggestions([]);
    setIsUserSelected(false);
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
    } catch (error) {
      setMessage("Error creating chat");
      console.error(error);
    }
  };

  return (
    <div className="create-chat-container bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText rounded-t-md flex flex-col p-2">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Enter recipient's username"
          value={username}
          onChange={handleInputChange}
          className="border border-lightBorder dark:border-darkBorder p-2 rounded bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText w-full"
        />
        <button
          onClick={handleSearch} // Updated to call handleSearch
          className="bg-purpleAccent text-darkText dark:text-lightText py-2 px-4 rounded whitespace-nowrap"
        >
          Create Chat
        </button>
      </div>

      {suggestions.length > 0 && !isUserSelected && (
        <ul className="bg-white dark:bg-gray-800 border rounded mt-1 shadow-md">
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
      )}

      {message && <p className="text-purpleAccent mt-2">{message}</p>}
    </div>
  );
};

export default CreateChat;
