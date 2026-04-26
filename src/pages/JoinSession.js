import { useEffect } from "react";
import API from "../services/api";

function JoinSession() {

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await API.post("/session/precheck", {
            qr_token: token,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });

          // ✅ If success → go secure page
          window.location.href =
             `/secure?session_id=${res.data.session_id}&join_token=${res.data.join_token}`;
        } catch (err) {
        
          alert(err.response?.data?.message || "Not allowed");
          window.location.href = "/";
        }
      },
      () => {
        alert("Location permission required");
        window.location.href = "/";
      }
    );

  }, [token]);

  return <h2>Verifying location...</h2>;
}

export default JoinSession;