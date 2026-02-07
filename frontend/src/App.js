import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import Tickets from "./pages/Tickets";
import AssignedProjects from "./pages/AssignedProjects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<Tickets />} />
        <Route path="/projects/assigned" element={<AssignedProjects />} />
      </Routes>
    </Router>
  );
}

export default App;