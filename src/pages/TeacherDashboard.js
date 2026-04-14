import { useState } from "react";
import API from "../services/api";
import "../styles/styles.css";

function TeacherDashboard() {
  const [session, setSession] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [otp, setOtp] = useState(null);

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

  return (
    <div className="container">
      <div className="card">
        <h2>👨‍🏫 Teacher Panel</h2>

        <button onClick={createSession}>
          🚀 Start Session
        </button>

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
      </div>
    </div>
  );
}

export default TeacherDashboard;