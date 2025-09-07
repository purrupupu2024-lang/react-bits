import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { NakamasProvider } from "./components/context/NakamasContext";
import SoundEffects from "./components/effects/SoundEffects";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import "./styles/nakamas.css";

function App() {
  useEffect(() => {
    // Configurar tema oscuro por defecto
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <NakamasProvider>
      <Router>
        <div className="nakamas-app">
          <SoundEffects />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </NakamasProvider>
  );
}

export default App;
