import React, { useState, useEffect } from "react";
import useAdminHooks from "../../hooks/useAdminHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../Pagination/Pagination";

//a list of all users
const UsersList = () => {
  const { users, error, deleteUser, updateUser } = useAdminHooks();
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", role: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, users]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ email: user.email, role: user.role });
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUser(editingUser._id, formData);
    setEditingUser(null);
  };

  const confirmDelete = async () => {
    if (deletingUser) {
      await deleteUser(deletingUser._id);
      setDeletingUser(null);
    }
  };

 
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by username..."
          className="p-2 pl-3 pr-10 border rounded w-full
            border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 
            text-darkText dark:text-lightText focus:outline-none"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="w-5 h-5 text-gray-500 dark:text-gray-300 absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>

      {/* Users List */}
      <div className="h-full overflow-y-auto mb-4">
        <ul className="grid gap-2">
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded border border-slate-500 dark:border-slate-400"
              >
                <span>{user.username}</span>
                {user.role === "admin" ? (
                  <span className="text-gray-500">Admin</span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="px-3 py-1 text-sm bg-purpleAccent text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
      </div>

      {/* Pagination  */}
      {filteredUsers.length > usersPerPage && (
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={usersPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit user modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-96">
            <h2 className="text-xl font-semibold text-center mb-4">Edit {editingUser.username}</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete user modal */}
      {deletingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Do you really want to delete <strong>{deletingUser.username}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
