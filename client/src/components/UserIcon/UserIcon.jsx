import React from 'react';

const UserIcon = ({ username }) => {
  return (
    <div className="border border-black w-20 h-20 bg-gray-400 flex items-center justify-center text-white font-bold  rounded-full ">
      {username ? username.charAt(0).toUpperCase() : '?'}
    </div>
  );
};

export default UserIcon;
