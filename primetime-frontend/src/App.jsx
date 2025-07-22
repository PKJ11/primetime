import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRegistration from "./pages/AdminRegistration";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserLogin from "./pages/UserLogin";
import MatchLobby from "./pages/MatchLobby";
import ResultPage from "./pages/ResultPage";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      {/* Use a div with max-width of 1024px */}
      {/* <div className="max-w-[1024px] p-0"> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<AdminRegistration />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/join-game" element={<UserLogin />} />
        <Route path="/game-lobby/:gameCode" element={<MatchLobby />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
