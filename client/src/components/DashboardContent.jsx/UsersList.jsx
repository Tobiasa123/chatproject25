import useFetchUsers from "../../hooks/useFetchUsers";

const UsersList = () => {
  const { users, error } = useFetchUsers(); 

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <ul className="space-y-2">
      {users.length > 0 ? (
        users.map((user) => (
          <li key={user._id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
            {user.username}
          </li>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </ul>
  );
};

export default UsersList;
