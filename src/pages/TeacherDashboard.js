import { useState } from "react";
import API from "../services/api";
import "../styles/styles.css";

function TeacherDashboard() {
  const [session, setSession] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [otp, setOtp] = useState(null);

  const [sessionsList, setSessionsList] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const createSession = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await API.post("/session/create", {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });

        setSession(res.data.session);
        setQrImage(res.data.qrImage);
        setOtp(null);
      } catch (err) {
        alert("Failed to create session");
      }
    });
  };

  const endSession = async () => {
    try {
      const res = await API.post(`/session/end/${session.id}`);
      setOtp(res.data.otp);
    } catch (err) {
      alert("Failed to end session");
    }
  };

  // 🔥 NEW: Get sessions
  const fetchSessions = async () => {
    try {
      const res = await API.get("/session/teacher/sessions");
      setSessionsList(res.data);
      setAttendance([]);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch sessions");
    }
  };

  // 🔥 NEW: Get attendance
  const fetchAttendance = async (session_id) => {
    console.log("clicked");
    try {
      const res = await API.get(`/session/attendance/${session_id}`);
      setAttendance(res.data);
    } catch (err) {
      alert("Failed to fetch attendance");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>👨‍🏫 Teacher Panel</h2>

        <button onClick={createSession}>
          🚀 Start Session
        </button>

        {/* ACTIVE SESSION */}
        {session && (
          <div className="qr-box">
            <h3>Scan QR</h3>

            {qrImage && (
              <img src={qrImage} alt="QR Code" width="200" />
            )}

            <button onClick={endSession}>
              ⛔ Stop Session
            </button>

            {otp && (
              <div className="otp">
                OTP: {otp}
              </div>
            )}
          </div>
        )}

        <hr />

        {/* 🔥 VIEW ATTENDANCE BUTTON */}
        <button onClick={fetchSessions}>
          📋 View Attendance
        </button>

        {/* 🔥 SESSION LIST */}
        {sessionsList.length > 0 && (
          <div>
            <h3>Sessions</h3>

            {sessionsList.map((s) => (
              <div key={s.id} style={{ marginBottom: "10px" }}>
                <span>
                  {new Date(s.start_time).toLocaleString()} - Session {s.id}
                </span>

                <button onClick={() => fetchAttendance(s.id)}>
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 ATTENDANCE LIST */}
        {attendance.length > 0 && (
          <div>
            <h3>Attendance</h3>

            <ul>
              {attendance.map((student, index) => (
                <li key={index}>
                  {student.name} ({student.reg_no})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;