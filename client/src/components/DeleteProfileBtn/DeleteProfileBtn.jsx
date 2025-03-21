import { useState } from 'react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

//button to delete user profile
const DeleteProfileBtn = () => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  const deleteProfile = async () => {
    const token = sessionStorage.getItem('authToken');
    try {
      const response = await fetch(`${BASE_URL}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setPopupMessage(data.message);

      if (response.ok) {
        sessionStorage.removeItem('authToken');
        setShowMessagePopup(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setShowMessagePopup(true);
      }
    } catch (err) {
      setPopupMessage('Error deleting profile. Please try again.');
      setShowMessagePopup(true);
      console.error('Error:', err);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirmPopup(true)}
        className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
      >
        Delete profile
      </button>

      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-96">
            <h3 className="text-lg font-semibold text-center text-red-600 dark:text-red-400">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Are you sure you want to delete your profile? This action cannot be reversed.
            </p>
            <div className="mt-4 flex justify-around">
              <button
                onClick={() => {
                  setShowConfirmPopup(false);
                  deleteProfile();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Popup */}
      {showMessagePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-96">
            <h3 className="text-lg font-semibold text-center text-red-600 dark:text-red-400">
              {popupMessage.includes('Error') ? 'Error' : 'Success'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              {popupMessage}
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowMessagePopup(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteProfileBtn;
