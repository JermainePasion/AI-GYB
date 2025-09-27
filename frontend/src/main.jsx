// main.jsx or index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { BluetoothProvider } from "./context/BluetoothContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <BluetoothProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BluetoothProvider>
    </UserProvider>
  </React.StrictMode>
);
