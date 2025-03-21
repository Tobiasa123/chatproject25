import { useState } from 'react';


//sidebar to select  what dasboard page to view
const DashboardSidebar = ({ onSelect }) => {
  const [selectedKey, setSelectedKey] = useState('users');  
  const menuItems = [
    { name: "Users", key: "users" },
    { name: "Analytics", key: "analytics" },
    { name: "Reports", key: "reports" },
  ];

  const handleSelect = (key) => {
    setSelectedKey(key);   
    onSelect(key);        
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-black  flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white w-full text-left px-4 pt-4">Dashboard</h2>
      <ul className="grid gap-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => handleSelect(item.key)}  
              className={`w-full text-left px-4 py-2 dark:text-white transition-colors ${
                selectedKey === item.key
                  ? "bg-purpleAccent text-white"
                  : "hover:bg-slate-500 hover:text-white"
              }`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
