import { useState, useEffect } from "react";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

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

    fetchUsers();
  }, []);

  return { users, error };
};

export default useFetchUsers;
