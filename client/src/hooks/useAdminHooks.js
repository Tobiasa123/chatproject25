import { useState, useEffect } from "react";

const useAdminHooks = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("authToken");

        const response = await fetch("http://127.0.0.1:8000/dashboard/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message || "Error fetching users");
        }
      } catch (error) {
        setError("Error fetching users");
      }
    };

    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("authToken");

        const response = await fetch("http://127.0.0.1:8000/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStats(data);
        } else {
          setError(data.message || "Error fetching statistics");
        }
      } catch (error) {
        setError("Error fetching statistics");
      }
    };

    fetchUsers();
    fetchStats();
  }, []); 

  const deleteUser = async (userId) => {
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await fetch(`http://127.0.0.1:8000/dashboard/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        const data = await response.json();
        setError(data.message || "Error deleting user");
      }
    } catch (error) {
      setError("Error deleting user");
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await fetch(`http://127.0.0.1:8000/dashboard/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, ...updatedData } : user
          )
        );
      } else {
        setError(data.message || "Error updating user");
      }
    } catch (error) {
      setError("Error updating user");
    }
  };

  return { users, stats, error, deleteUser, updateUser };
};

export default useAdminHooks;
