import "tailwindcss";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import FigureScreen from "./screens/FigureScreen";
import ControlScreen from "./screens/ControlScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import ScoreScreen from "./screens/ScoreScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UploadPhotos from "./screens/UploadPhotos";



function App() {
  return (

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/figures" element={<FigureScreen/>} />
        <Route path="/control" element={<ControlScreen/>}/>
        <Route path="/connection" element={<ConnectionScreen/>}/>
        <Route path="/score" element={<ScoreScreen/>}/>
        <Route path="/upload" element={<UploadPhotos/>}/>
        <Route path="/settings" element={<SettingsScreen/>}/>
      </Routes>

  );
}

export default App;
