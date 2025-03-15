import DashboardSidebar from "./DashboardSidebar";
import { useState } from "react";
import UsersList from "./UsersList";

const DashboardContent = () => {
    const [selectedSection, setSelectedSection] = useState("users");
  
    return (
      <div className="grid grid-cols-[auto_1fr] h-full">
        <div className="w-64">
          <DashboardSidebar onSelect={setSelectedSection} />
        </div>
  
        <section className="p-6 bg-lightBackground dark:bg-darkBackground rounded-r-md text-darkText dark:text-lightText">
          {selectedSection === "users" && <UsersList />}
          {selectedSection === "analytics" && <p>Showing Analytics...</p>}
          {selectedSection === "reports" && <p>Showing Reports...</p>}
        </section>
      </div>
    );
  };
  
  export default DashboardContent;