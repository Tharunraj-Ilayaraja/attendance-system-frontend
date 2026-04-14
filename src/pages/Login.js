import { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
        console.log("here1");
    //      const res = fetch("http://127.0.0.1:5000/api/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ email, password })
    // });

      const res = await API.post("/auth/login", { email, password });
      

      localStorage.setItem("token", res.data.token);

      alert("Login success");

      // redirect based on role (optional improvement)
      if(res.data.role === 'student')
         window.location.href = "/scan";
      else 
        window.location.href = "/teacher";
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;