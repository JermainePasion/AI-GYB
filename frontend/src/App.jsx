import "tailwindcss";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import FigureScreen from "./screens/FigureScreen";



function App() {
  return (

      <Routes>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/figures" element={<FigureScreen/>} />
      </Routes>

  );
}

export default App;
