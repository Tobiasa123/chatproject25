import React, { useState, useEffect } from 'react';

const BlockUserButton = ({ userId }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfBlocked = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`http://127.0.0.1:8000/profile`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) throw new Error('Failed to fetch user data');

        
        const blocked = data.blockedUsers.some((user) => user._id === userId);
        setIsBlocked(blocked);
      } catch (err) {
        console.error('Error checking blocked status:', err);
      }
    };

    checkIfBlocked();
  }, [userId]);

  const handleToggleBlock = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('authToken');
      const url = `http://127.0.0.1:8000/${isBlocked ? 'unblock' : 'block'}/${userId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update block status');

      setIsBlocked(!isBlocked);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggleBlock}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white transition ${
          isBlocked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {loading ? 'Updating...' : isBlocked ? 'Unblock User' : 'Block User'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default BlockUserButton;
