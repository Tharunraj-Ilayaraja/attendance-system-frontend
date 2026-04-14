import { useState } from "react";
import API from "../services/api";

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

        // ✅ store correctly
        setSession(res.data.session);
        setQrImage(res.data.qrImage);
        setOtp(null); // reset OTP
      } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Failed to create session");
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
    <div>
      <button onClick={createSession}>Start Session</button>

      {session && (
        <div>
          <h3>Scan this QR</h3>

          {/* ✅ QR IMAGE */}
          {qrImage && <img src={qrImage} alt="QR Code" />}

          {/* ✅ End session button */}
          <br />
          <button onClick={endSession}>Stop QR & Reveal OTP</button>

          {/* ✅ OTP shown ONLY after end */}
          {otp && <h3>OTP: {otp}</h3>}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;