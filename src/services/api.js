import axios from "axios";

const API = axios.create({
  baseURL: "https://attendance-system-backend-tr-emdjftdja6f8c2fp.centralindia-01.azurewebsites.net/api"
});

// ✅ Auto attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;