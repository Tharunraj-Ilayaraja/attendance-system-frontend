import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecurePage from "./pages/SecurePage";
import JoinSession from "./pages/JoinSession";
import TeacherDashboard from "./pages/TeacherDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/secure" element={<SecurePage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/join" element={<JoinSession />} />
      </Routes>
    </Router>
  );
}

export default App;