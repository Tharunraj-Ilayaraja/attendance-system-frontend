import axios from "axios";

const api = process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL: api
  
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