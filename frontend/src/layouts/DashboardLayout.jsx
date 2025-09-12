import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <div>
        <Navbar />
      </div>
      <div className="pt-16 flex">
  
        <Sidebar />
        <main className="flex-1 md:ml-56 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
