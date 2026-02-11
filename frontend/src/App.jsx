import "tailwindcss";
import { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import ControlScreen from "./screens/ControlScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import ScoreScreen from "./screens/ScoreScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UploadPhotos from "./screens/UploadPhotos";
import AuthScreen from "./screens/AuthScreen";
import LandingScreen from "./screens/LandingScreen";
import PrivateRoute from "./components/PrivateRoute";
import AboutUsScreen from "./screens/AboutUsScreen";
import AdminScreen from "./screens/AdminScreen";
import DoctorRegisterScreen from "./screens/DoctorRegisterScreen";
import PatientGraphs from "./screens/PatientGraphs";

import UploadPopup from "./components/UploadPopup";
import LoadingOverlay from "./components/Spinner/LoadingOverlay";
import ToastProvider from "./components/notification/ToastProvider";
import BluetoothShortcut from "./components/bluetooth/BluetoothShortcut";

import { BluetoothContext, BluetoothProvider } from "./context/BluetoothContext";
import { UserProvider } from "./context/UserContext";

function App() {
  const { showUploadPopup, isUploading } = useContext(BluetoothContext);
  const location = useLocation();
  const hideBluetoothRoutes = [
    "/",
    "/signup",
    "/doctorsignup",
    "/about",
  ];
  const shouldHideBluetooth = hideBluetoothRoutes.includes(location.pathname);

  return (
    <>
    <UserProvider>
      <BluetoothProvider>
    
        <ToastProvider />

        <UploadPopup visible={showUploadPopup} />
        <LoadingOverlay visible={isUploading} />

        {!shouldHideBluetooth && <BluetoothShortcut />}

        <Routes>

          <Route path="/signup" element={<AuthScreen />} />
          <Route path="/about" element={<AboutUsScreen />} />
          <Route path="/" element={<LandingScreen />} />
          <Route path="/doctorsignup" element={<DoctorRegisterScreen />} />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomeScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/control"
            element={
              <PrivateRoute>
                <ControlScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/connection"
            element={
              <PrivateRoute>
                <ConnectionScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/score"
            element={
              <PrivateRoute>
                <ScoreScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPhotos />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin", "doctor"]}>
                <AdminScreen />
              </PrivateRoute>
            }
          />

          <Route
            path="/patients/:id/graphs"
            element={
              <PrivateRoute roles={["admin", "doctor"]}>
                <PatientGraphs />
              </PrivateRoute>
            }
          />
        </Routes>
      </BluetoothProvider>  
    </UserProvider>
    </>
  );
}

export default App;