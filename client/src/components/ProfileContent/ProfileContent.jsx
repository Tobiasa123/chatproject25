import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DeleteProfileBtn from '../../components/DeleteProfileBtn/DeleteProfileBtn';
import BlockUserButton from '../../components/BlockUserBtn/BlockUserBtn';
import UserIcon from '../../components/UserIcon/UserIcon';
import BackArrow from '../BackArrow/BackArrow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faChevronDown, faChevronUp, faEye, faEyeSlash, faCopy, faCheck,faLock, faGlobe } from '@fortawesome/free-solid-svg-icons'; 
import { motion } from 'framer-motion';
const BASE_URL = import.meta.env.VITE_BASE_URL;

//component for profile (both current and other users)
const ProfileContent = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ username: '', email: '', password: '' });
  const [isBlockedUsersOpen, setIsBlockedUsersOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false); 

  const fetchProfile = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const url = userId
        ? `${BASE_URL}/profile/${userId}`
        : `${BASE_URL}/profile`;

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

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/profile/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedUser, isPublic: user.isPublic }),
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

  const handleTogglePrivacy = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const newPrivacyValue = !user.isPublic;
      const response = await fetch(`${BASE_URL}/profile/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: newPrivacyValue }),
      });
      if (!response.ok) {
        throw new Error('Failed to update privacy setting');
      }
      setUser(prev => ({ ...prev, isPublic: newPrivacyValue }));
    } catch (err) {
      setError(err.message);
    }
  };
  const handleCopyFriendId = () => {
    if (user.friendId) {
      navigator.clipboard.writeText(user.friendId);
      setCopied(true);
  
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex flex-col items-center bg-lightBackground dark:bg-darkBackground h-screen overflow-y-auto custom-scrollbar rounded-md">
      {/* Back Button */}
      <div className="w-full px-4 py-6 flex items-center">
        <BackArrow className="text-darkText dark:text-lightText" />
      </div>

      {/* Profile Section */}
      <section className="w-full max-w-md flex flex-col items-center py-6">
        <div className="relative mb-4">
          <div>
            <UserIcon username={user.username} />
          </div>
          {user.role === "admin" && (
            <span className="absolute -top-1 -right-1 bg-purpleAccent text-white text-xs px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-darkText dark:text-lightText mb-2">
          {user.username}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 ">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>

        {/* Toggle button for privacy setting (only for current user) */}
        { !userId && (
          <div className="mt-4">
            <button 
              onClick={handleTogglePrivacy} 
              className="flex items-center bg-slate-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 p-2 rounded-md border border-slate-300 dark:border-slate-600"
            >
              <FontAwesomeIcon 
                icon={user.isPublic ? faGlobe : faLock}
                className="mr-2" 
              />
              {user.isPublic ? "Public" : "Private"}
            </button>
          </div>
        )}
      </section>

      {/* Main content */}
      <div className="w-full max-w-md flex flex-col flex-grow">
        <div className="flex-grow">
          {isEditing ? (
            <form className="bg-slate-300 dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-darkText dark:text-lightText mb-4">
                Edit Profile
              </h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={updatedUser.username}
                    onChange={handleChange}
                    className="w-full border border-lightBorder dark:border-darkBorder p-3 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleChange}
                    className="w-full border border-lightBorder dark:border-darkBorder p-3 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText"
                  />
                </div>

                <div className="flex flex-col gap-1 relative mb-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    New Password (optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={updatedUser.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="w-full border border-lightBorder dark:border-darkBorder p-3 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText"
                    />
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 w-5"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-2">
                  <button 
                    onClick={handleSave} 
                    className="bg-purpleAccent text-white p-3 rounded-lg w-full hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors font-medium"
                  >
                    Save
                  </button>
                  <button 
                    onClick={handleCancelEdit}  
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-3 rounded-lg w-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-slate-300 dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-darkText dark:text-lightText mb-4">
                Profile Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Username</span>
                  <span className="text-darkText dark:text-lightText font-medium">{user.username}</span>
                </div>

                {!userId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-darkText dark:text-lightText font-medium">{user.email}</span>
                  </div>
                )}

                {!userId && (
                  <div className="pt-4">
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="bg-purpleAccent text-white p-3 rounded-lg w-full hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        {!userId && user.friendId && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400">Friend ID</span>
            <div className="flex items-center space-x-2">
              <span className="text-darkText dark:text-lightText font-medium">{user.friendId}</span>
                <button onClick={handleCopyFriendId} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                </button>
            </div>
          </div>
        )}


          {/* Blocked Users Section */}
          {user.blockedUsers?.length > 0 && (
            <div className="">
              <button
                className="flex justify-between items-center w-full text-leftfont-semibold text-darkText dark:text-lightText mb-4"
                onClick={() => setIsBlockedUsersOpen(!isBlockedUsersOpen)}
              >
                Blocked Users
                <span className="text-darkText dark:text-lightText">
                  <FontAwesomeIcon
                    icon={isBlockedUsersOpen ? faChevronUp : faChevronDown}
                    className="text-xl"
                  />
                </span>
              </button>

              {/* Blocked users list */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isBlockedUsersOpen ? 1 : 0,
                  height: isBlockedUsersOpen ? 'auto' : 0,
                }}
                transition={{ duration: 0.15 }} 
                className="overflow-hidden"
              >
                <ul className="divide-y divide-lightBorder dark:divide-darkBorder">
                  {user.blockedUsers.map((blockedUser) => (
                    <li key={blockedUser._id} className="flex items-center justify-between py-3">
                      <span className="text-darkText dark:text-lightText">{blockedUser.username}</span>
                      <BlockUserButton userId={blockedUser._id} actionType="unblock" />
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}
        </div>


        {/* Buttons either block or delete */}
        <div className="w-full flex flex-col items-center gap-4 mt-6 pb-6">
          {userId && (
            <div className="w-full flex justify-center">
              {isBlocked ? (
                <BlockUserButton userId={userId} actionType="unblock" fullWidth />
              ) : (
                <BlockUserButton userId={userId} actionType="block" fullWidth />
              )}
            </div>
          )}

          {!userId && (
            <div className="w-full flex justify-center">
              <DeleteProfileBtn />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
