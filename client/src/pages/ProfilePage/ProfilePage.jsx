import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DeleteProfileBtn from '../../components/DeleteProfileBtn/DeleteProfileBtn';
import BlockUserButton from '../../components/BlockUserBtn/BlockUserBtn';

const ProfilePage = () => {
  const { id: userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false); 

  useEffect(() => {
    const fetchProfile = async () => {
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

        if (userId) {
          // Check if the other user is blocked
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
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex flex-col w-1/2 bg-orange-300 h-full p-4">
      <h1>{userId ? 'User Profile' : 'My Profile'}</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

      {/* Show Blocked Users only on the logged-in user's profile */}
      {!userId && (
        <div>
          <h2 className="mt-4">Blocked Users</h2>
          {user.blockedUsers.length > 0 ? (
            <ul>
              {user.blockedUsers.map((blockedUser) => (
                <li key={blockedUser._id} className="flex items-center justify-between border p-2 mt-2">
                  <span>{blockedUser.username}</span>
                  <BlockUserButton
                    userId={blockedUser._id}
                    actionType="unblock" 
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No blocked users</p>
          )}
        </div>
      )}

      {/* Block/Unblock button for other users */}
      {userId && (
        <div className="mt-4">
          {isBlocked ? (
            <BlockUserButton
              userId={userId}
              actionType="unblock"
            />
          ) : (
            <BlockUserButton
              userId={userId}
              actionType="block"
            />
          )}
        </div>
      )}

      {/* Show delete button only for logged-in user */}
      {!userId && <DeleteProfileBtn />}
    </div>
  );
};

export default ProfilePage;
