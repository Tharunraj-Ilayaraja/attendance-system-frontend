import { useState } from "react";
import API from "../services/api";
import "../styles/styles.css";

function TeacherDashboard() {
  const [session, setSession] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [otp, setOtp] = useState(null);

  const [sessionsList, setSessionsList] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [aiReport, setAiReport] = useState(null);
 

  const [activeSessionId, setActiveSessionId] = useState(null);

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

  const fetchSessions = async () => {
    try {
      const res = await API.get("/session/teacher/sessions");
      setSessionsList(res.data);
      setAttendance([]);
      setActiveSessionId(null);
    } catch (err) {
      alert("Failed to fetch sessions");
    }
  };

  const fetchAttendance = async (session_id) => {
    // 🔥 Toggle logic
    if (activeSessionId === session_id) {
      setAttendance([]);
      setActiveSessionId(null);
      return;
    }

    try {
      const res = await API.get(`/session/attendance/${session_id}`);
      setAttendance(res.data);
      setActiveSessionId(session_id);
    } catch (err) {
      alert("Failed to fetch attendance");
    }
  };

  const fetchAnalysis = async () => {
  try {
    

    const res = await API.get("/session/analysis");

    setAiReport(res.data.aiReport);

    // clear attendance view
    setAttendance([]);
    setActiveSessionId(null);

  } catch (err) {
    alert(err);
  }
};

  // 🔥 DOWNLOAD CSV FUNCTION
  const downloadCSV = () => {
    const current = sessionsList.find(s => s.id === activeSessionId);

    if (!current || attendance.length === 0) {
      alert("Select a session first");
      return;
    }



    const sessionTitle = `${new Date(current.start_time).toLocaleString()} - #${current.id}`;

     // 🔥 Count
    const count = attendance.length;

     // 🔥 Build CSV
    let csv = "";
     csv += `Session: ${sessionTitle}\n`;
     csv += `Count: ${count}\n\n`;
     csv += "USNID,Name\n";

    attendance.forEach((s) => {
      csv += `'${s.usnid},${s.name}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const fileName = `session_${current.id}_${new Date(current.start_time)
      .toLocaleString()
      .replace(/[/:]/g, "-")}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="main-layout">

      {/* 🔵 SECTION 1 */}
      <div className="section section1">
        <h2>👨‍🏫 Teacher Panel</h2>

        <button onClick={createSession}>🚀 Start Session</button>

        {session && (
          <div className="qr-box">
            <h3>Scan QR</h3>

            {qrImage && <img src={qrImage} alt="QR Code" width="200" />}

            <button onClick={endSession}>⛔ Stop Session</button>

            {otp && <div className="otp">OTP: {otp}</div>}
          </div>
        )}
      </div>

      {/* 🟢 SECTION 2 */}
      <div className="section section2">

        {/* 🔥 VIEW + DOWNLOAD BUTTONS */}
       <div style={{ display: "flex", gap: "10px" }}>
           <button onClick={fetchSessions}>📋 View Sessions</button>

           <button onClick={fetchAnalysis}>
             📊 See Analysis
           </button>

          <button
             onClick={downloadCSV}
             disabled={!activeSessionId}
          >
          ⬇ Download
          </button>
        </div>

        <div className="scroll-box">
          {sessionsList.map((s) => (
            <div key={s.id} className="session-item">
              <span>
                {new Date(s.start_time).toLocaleString()} - #{s.id}
              </span>

              <button onClick={() => fetchAttendance(s.id)}>
                {activeSessionId === s.id ? "Hide" : "View"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🟣 SECTION 3 */}
      <div className="section section3">


       {/* 🔥 HEADER */}
         <h3>
             {aiReport ? "AI Analysis" : `Attendance (${attendance.length})`}
           </h3>

          {/* 🔥 CLEAR BUTTON */}
          {(aiReport || attendance.length > 0) && (
        <button
           onClick={() => {
             setAiReport(null);
           setAttendance([]);
               setActiveSessionId(null);
            }}
                style={{ marginBottom: "10px" }}
                                            >
               ❌ Clear
          </button>
      )}

<div className="scroll-box">

  {/* 🔥 SHOW AI REPORT */}
  {aiReport && (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {aiReport}
    </div>
  )}

  {/* 🔥 SHOW ATTENDANCE */}
  {!aiReport && attendance.map((student, index) => (
    <div key={index}>
      {student.usnid} ({student.name})
    </div>
  ))}

</div>



      </div>

    </div>
  );
}

export default TeacherDashboard;