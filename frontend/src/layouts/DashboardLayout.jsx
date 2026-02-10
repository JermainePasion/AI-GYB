import React, { useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LoadingOverlay from "../components/Spinner/LoadingOverlay";
import { BluetoothContext } from "../context/BluetoothContext";
import BluetoothShortcut from "../components/bluetooth/BluetoothShortcut";

const DashboardLayout = ({ children }) => {
  const { isUploading } = useContext(BluetoothContext);

  return (
    <div className="h-screen flex flex-col relative">
      <LoadingOverlay
        visible={isUploading}
        text="Uploading session data..."
      />

      <div>
        <Navbar />
      </div>

      <div className="pt-16 flex">
        <Sidebar />
        <main className="flex-1 md:ml-56 p-6 overflow-y-auto relative overflow-x-visible ">
          {children}
          <BluetoothShortcut />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
