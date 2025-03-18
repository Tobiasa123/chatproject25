import React from "react";
import useAdminHooks from "../../hooks/useAdminHooks";

const Analytics = () => {
  const { stats, error } = useAdminHooks();

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
        
      {[
        { label: "Total Users", value: stats.totalUsers, color: "text-blue-600" },
        { label: "Total Chats", value: stats.totalChats, color: "text-green-600" },
        { label: "Total Messages", value: stats.totalMessages, color: "text-purpleAccent" },
      ].map((item, index) => (
        <div key={index} className="p-4  rounded-md bg-lightBackground dark:bg-darkBackground">
          <h3 className="text-lg font-semibold">{item.label}</h3>
          <p className={`text-2xl ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
