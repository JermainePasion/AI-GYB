import React from "react";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Navbar />

      {/* push content below fixed navbar */}
      <div className="pt-16 flex">
        <div className="hidden lg:block"></div>
        <div className="grow mx-5">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
