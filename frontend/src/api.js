import axios from "axios";
import { logout } from "./components/Auth";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
});
apiClient.interceptors.request.use((config) => {
  const userDetails = localStorage.getItem("user")
  if (userDetails){
    const token = JSON.parse(userDetails).token;
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (err) => {
  return Promise.reject(err);
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

export const searchUser = async (string) => {
  try {
    return await apiClient.get(`/user?search=${string}`);
  } catch (err) {
    error: true, err;
  }
}

export const getChat = async (userId) => {
  try {
    return await apiClient.post(`/chat`, {userId})
  } catch (err) {
    error:true, err;
  }
}

export const getAllChat = async (userId) => {
  try {
    return await apiClient.get(`/chat`, {userId})
  } catch (err) {
    error:true, err;
  }
}

// Secure Route
const checkResponseCode = (err) => {
  const responseCode = err?.response?.status;
  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout()
  }
}
