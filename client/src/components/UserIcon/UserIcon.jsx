const UserIcon = ({ username}) => {

  return (
    <div className="relative">
      <div 
        className=" border-2 border-slate-500 w-20 h-20 bg-gray-400 flex items-center justify-center text-white font-bold rounded-full cursor-pointer"
      >
        {username ? username.charAt(0).toUpperCase() : '?'}
      </div>

    </div>
  );
};

export default UserIcon;