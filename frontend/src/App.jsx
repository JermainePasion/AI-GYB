import "tailwindcss";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import FigureScreen from "./screens/FigureScreen";
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


function App() {
   return (
    <Routes>
      {/* Public */}
      <Route path="/signup" element={<AuthScreen />} />
      <Route path="/about" element={<AboutUsScreen />} />
      <Route path="/" element={<LandingScreen />} />
      <Route path="/doctorsignup" element={<DoctorRegisterScreen />} />

      {/* Protected */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomeScreen />
          </PrivateRoute>
        }
      />
      <Route
        path="/figures"
        element={
          <PrivateRoute>
            <FigureScreen />
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
    </Routes>
  );
}

export default App;
