import React from "react";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
