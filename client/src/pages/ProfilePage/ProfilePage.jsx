import { useEffect, useState } from 'react';
import DeleteProfileBtn from '../../components/DeleteProfileBtn/DeleteProfileBtn';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('authToken'); 
        const response = await fetch('http://127.0.0.1:8000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex flex-col w-1/2 bg-orange-300 h-full">
      <h1>Min Profil</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <div>
        <strong>Blocked Users:</strong>
        {user.blockedUsers.length > 0 ? (
          <ul>
            {user.blockedUsers.map((blockedUser) => (
              <li key={blockedUser._id}>{blockedUser.username}</li>
            ))}
          </ul>
        ) : (
          <p>No blocked users</p>
        )}
      </div>
      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      <DeleteProfileBtn />
    </div>
  );
};

export default ProfilePage;
