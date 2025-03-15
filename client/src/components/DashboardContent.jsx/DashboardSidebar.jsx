const DashboardSidebar = ({ onSelect }) => {
  const menuItems = [
    { name: "Users", key: "users" },
    { name: "Analytics", key: "analytics" },
    { name: "Reports", key: "reports" },
  ];

  return (
    <aside className="w-64 h-full bg-gray-200 dark:bg-gray-800 rounded-l-md flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white w-full text-center">Dashboard</h2>
      <ul className="grid gap-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => onSelect(item.key)}
              className="w-full text-left px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white transition-colors"
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
