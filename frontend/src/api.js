import axios from "axios";
import { logout } from "./components/Auth";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
});
// apiClient.interceptors.request.use((config) => {
//   config.headers["Content-Type"] = "application/json";
//   return config;
// });
apiClient.interceptors.request.use((config) => {
  const userDetails = localStorage.getItem("user")
  if (userDetails){
    const token = JSON.parse(userDetails).token;
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (err) => {
  return Promise.reject(error);
})

// Public Route
export const login = async (data) => {
  try {
    return await apiClient.post("/auth/login", data);
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post("/auth/register", data);
  } catch (err) {
    error: true, err;
  }
};

// Secure Route
const checkResponseCode = (err) => {
  const responseCode = err?.response?.status;
  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout()
  }
}