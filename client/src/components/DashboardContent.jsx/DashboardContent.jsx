import DashboardSidebar from "./DashboardSidebar";
import { useState } from "react";
import UsersList from "./UsersList";
import ReportedChats from "./ReportedChats";
import Analytics from "./Analytics";

//parent component for dashboard pages
const DashboardContent = () => {
    const [selectedSection, setSelectedSection] = useState("users");
  
    return (
      <div className="grid grid-cols-[auto_1fr] h-full ">
        <div className="w-64">
          <DashboardSidebar onSelect={setSelectedSection} />
        </div>
  
        <section className="p-6 bg-lightBackground bg-opacity-50  dark:bg-black dark:bg-opacity-80 text-darkText dark:text-lightText">
          {selectedSection === "users" && <UsersList />}
          {selectedSection === "analytics" && <Analytics/>}
          {selectedSection === "reports" && <ReportedChats/>}
        </section>
      </div>
    );
  };
  
  export default DashboardContent;