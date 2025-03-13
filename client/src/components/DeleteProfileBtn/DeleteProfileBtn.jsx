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
    className="bg-red-700 text-white font-bold py-3 rounded-md 
                hover:bg-red-600 border-2 border-red-500 hover:animate-pulse transition-all duration-200">
    DELETE PROFILE
    </button>
  );
};

export default DeleteProfileBtn;