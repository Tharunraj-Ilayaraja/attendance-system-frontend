import { useEffect, useState } from "react";
import API from "../services/api";

function SecurePage() {
  const [otp, setOtp] = useState("");
  const [regNo, setRegNo] = useState("");

  const params = new URLSearchParams(window.location.search);
  const session_id = params.get("session_id");
  const join_token = params.get("join_token");

  useEffect(() => {

    console.log("FULL URL:", window.location.href);
    console.log("SESSION ID:", session_id);
    console.log("JOIN TOKEN:", join_token);

    // 🔒 Fullscreen
    document.documentElement.requestFullscreen().catch(() => {});

    // 🚫 Tab switch detection
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

  }, [session_id, join_token]);

  const submit = async () => {
    if (!regNo || !otp) {
      return alert("Enter Register Number & OTP");
    }

    try {
      const res = await API.post("/session/verify", {
        session_id,
        otp,
        reg_no: regNo,
        join_token
      });

      alert(res.data.message);
      window.location.href = "/";

    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Secure Attendance</h2>

      <input
        placeholder="Register Number"
        onChange={(e) => setRegNo(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <br /><br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default SecurePage;