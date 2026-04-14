import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentScan from "./pages/StudentScan";
import SecurePage from "./pages/SecurePage";
import TeacherDashboard from "./pages/TeacherDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scan" element={<StudentScan />} />
        <Route path="/secure" element={<SecurePage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;