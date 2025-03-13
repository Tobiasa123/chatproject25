import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DeleteProfileBtn from '../../components/DeleteProfileBtn/DeleteProfileBtn';
import BlockUserButton from '../../components/BlockUserBtn/BlockUserBtn';
import UserIcon from '../../components/UserIcon/UserIcon';
import BackArrow from '../BackArrow/BackArrow';

const ProfileContent = () => {
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedUser({ username: user.username, email: user.email, password: '' });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex flex-col items-center bg-lightBackground dark:bg-darkBackground h-full p-6 rounded-md text-left">

      <div className="flex items-center w-full">
          <BackArrow className="self-start" />
        </div>
        
      <div className="pointer-events-none">
        <UserIcon username={user.username} />
      </div>
      <h1 className="text-3xl font-semibold text-darkText dark:text-lightText">{user.username}</h1>
      
      {isEditing ? (
        <div className="flex flex-col space-y-4 w-full">
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
            className="border border-lightBorder dark:border-darkBorder p-3 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="New username"
          />
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            className="border border-lightBorder dark:border-darkBorder p-3 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="New email"
          />
          <input
            type="password"
            name="password"
            value={updatedUser.password}
            onChange={handleChange}
            className="border border-lightBorder dark:border-darkBorder p-3 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="New password (optional)"
          />
          <div className="flex space-x-4">
            <button onClick={handleSave} className="bg-purpleAccent text-white p-3 rounded-lg w-full hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors">
              Save Changes
            </button>
            <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-3 rounded-lg w-full hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-lg text-darkText dark:text-lightText">
            <strong>Username:</strong> {user.username}
          </p>
          {!userId && (
            <p className="text-lg text-darkText dark:text-lightText">
              <strong>Email:</strong> {user.email}
            </p>
          )}
          <p className="text-lg text-darkText dark:text-lightText">
            <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </p>
          {!userId && (
            <button 
              onClick={handleEditToggle} 
              className="bg-purpleAccent text-white p-3 rounded-lg mt-4 w-full hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors">
              Edit Profile
            </button>
          )}
        </div>
      )}

      {/* Blocked Users Section */}
      {!userId && user.blockedUsers?.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-darkText dark:text-lightText mt-6">Blocked Users</h2>
          <ul>
            {user.blockedUsers.map((blockedUser) => (
              <li key={blockedUser._id} className="flex items-center justify-between border border-lightBorder dark:border-darkBorder p-4 rounded-lg mt-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-darkText dark:text-lightText">{blockedUser.username}</span>
                <BlockUserButton userId={blockedUser._id} actionType="unblock" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Block/Unblock User Button */}
      {userId && (
        <div className="mt-6">
          {isBlocked ? (
            <BlockUserButton userId={userId} actionType="unblock" />
          ) : (
            <BlockUserButton userId={userId} actionType="block" />
          )}
        </div>
      )}

      {/* Delete Profile Button */}
      {!userId && (
        <div className="mt-auto pt-6">
          <DeleteProfileBtn />
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
