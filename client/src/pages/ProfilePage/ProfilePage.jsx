import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DeleteProfileBtn from '../../components/DeleteProfileBtn/DeleteProfileBtn';
import BlockUserButton from '../../components/BlockUserBtn/BlockUserBtn';

const ProfilePage = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ username: '', email: '', password: '' });

  const fetchProfile = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const url = userId
        ? `http://127.0.0.1:8000/profile/${userId}`
        : `http://127.0.0.1:8000/profile`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
      setUpdatedUser({ username: data.username, email: data.email, password: '' });

      if (userId) {
        const isUserBlocked = data.blockedUsers.some(
          (blockedUser) => blockedUser._id === userId
        );
        setIsBlocked(isUserBlocked);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:8000/profile/edit', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedUser({ username: user.username, email: user.email, password: '' });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex flex-col w-full md:w-[90vw] lg:w-[60vw] bg-orange-300 h-full">
      <h1>{userId ? 'User Profile' : 'My Profile'}</h1>

      {isEditing ? (
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
            className="border p-2"
            placeholder="New username"
          />
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            className="border p-2"
            placeholder="New email"
          />
          <input
            type="password"
            name="password"
            value={updatedUser.password}
            onChange={handleChange}
            className="border p-2"
            placeholder="New password (optional)"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
            Save Changes
          </button>
          {/* Cancel button */}
          <button
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white p-2 rounded mt-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          {!userId && (
            <button onClick={handleEditToggle} className="bg-green-500 text-white p-2 rounded mt-2">
              Edit Profile
            </button>
          )}
        </div>
      )}

      {!userId && (
        <div>
          <h2 className="mt-4">Blocked Users</h2>
          {user.blockedUsers?.length > 0 ? (
            <ul>
              {user.blockedUsers.map((blockedUser) => (
                <li key={blockedUser._id} className="flex items-center justify-between border p-2 mt-2">
                  <span>{blockedUser.username}</span>
                  <BlockUserButton userId={blockedUser._id} actionType="unblock" />
                </li>
              ))}
            </ul>
          ) : (
            <p>No blocked users</p>
          )}
        </div>
      )}

      {userId && (
        <div className="mt-4">
          {isBlocked ? (
            <BlockUserButton userId={userId} actionType="unblock" />
          ) : (
            <BlockUserButton userId={userId} actionType="block" />
          )}
        </div>
      )}

      {!userId && <DeleteProfileBtn />}
    </div>
  );
};

export default ProfilePage;
