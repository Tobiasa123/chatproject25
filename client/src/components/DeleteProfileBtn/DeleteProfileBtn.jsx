import React from 'react';

const DeleteProfileBtn = () => {
  const deleteProfile = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be reversed.");

    if (!confirmDelete) return; 

    const token = sessionStorage.getItem('authToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        sessionStorage.removeItem('authToken');
        window.location.href = '/'; 
      }
    } catch (err) {
      alert('Error deleting profile. Please try again.');
      console.error('Error:', err);
    }
  };

  return (
    <button 
    onClick={deleteProfile}
    className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600">
    Delete profile
    </button>
  );
};

export default DeleteProfileBtn;