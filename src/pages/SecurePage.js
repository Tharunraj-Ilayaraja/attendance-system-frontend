import { useEffect, useState } from "react";
import API from "../services/api";

function SecurePage() {
  const [otp, setOtp] = useState("");

  const params = new URLSearchParams(window.location.search);
  const session_id = params.get("session_id");

  useEffect(() => {

    // 🔒 Fullscreen
    document.documentElement.requestFullscreen().catch(() => {});

    // 🚫 Detect tab switch
    const handleVisibility = () => {
      if (document.hidden) {
        alert("You left the screen! Attendance cancelled.");
        window.location.href = "/";
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };

  }, []);

  const submitOTP = async () => {
    try {
      const res = await API.post("/session/verify", {
        session_id,
        otp
      });

      alert(res.data.message);
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <input onChange={(e) => setOtp(e.target.value)} />
      <button onClick={submitOTP}>Submit</button>
    </div>
  );
}

export default SecurePage;