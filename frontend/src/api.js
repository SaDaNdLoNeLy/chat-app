import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
});
apiClient.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

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
