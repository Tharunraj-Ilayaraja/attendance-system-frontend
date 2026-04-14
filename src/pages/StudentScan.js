import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import API from "../services/api";

function StudentScan() {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 5 });

    scanner.render(async (decodedText) => {
      try {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const res = await API.post("/session/scan", {
            qr_token: decodedText,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });

          alert(res.data.message);

          window.location.href = "/secure?session_id=" + res.data.session_id;
        });
      } catch (err) {
        alert(err.response?.data?.message || "Scan failed");
      }
    });

    // ✅ Cleanup
    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return <div id="reader"></div>;
}

export default StudentScan;