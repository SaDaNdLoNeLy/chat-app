import axios from "axios";
import { logout } from "./components/Auth";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
});
apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");
    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

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
};

export const getChat = async (userId) => {
  try {
    return await apiClient.post(`/chat`, { userId });
  } catch (err) {
    error: true, err;
  }
};

export const getAllChat = async (userId) => {
  try {
    return await apiClient.get(`/chat`, { userId });
  } catch (err) {
    error: true, err;
  }
};

export const createGroup = async (name, users) => {
  try {
    return await apiClient.post("/chat/group", {
      name: name,
      users: JSON.stringify(users.map((u) => u._id)),
    });
  } catch (err) {
    error: true, err;
  }
};

export const renameGroup = async (chatId, newName) => {
  try {
    return await apiClient.put("/chat/rename", {
      chatId,
      chatName: newName,
    });
  } catch (err) {
    error: true, err;
  }
};

export const addUser = async (chatId, userId) => {
  try {
    return await apiClient.put("/chat/groupadd", {
      chatId,
      userId
    })
  } catch (err) {
    error: true, err;
  }
}

export const removeUser = async (chatId, userId) => {
  try {
    return await apiClient.put("/chat/groupremove", {
      chatId,
      userId
    })
  } catch (err) {
    error: true, err;
  }
}

export const sendMsg = async (chatId, content) => {
  try {
    return await apiClient.post("/message", {
      chatId,
      content
    })
  } catch (err) {
    error: true, err;
  }
}

export const getMsg = async (chatId) => {
  try {
    return await apiClient.get(`/message/${chatId}`)
  } catch (err) {
    error: true, err;
  }
}

// Secure Route
const checkResponseCode = (err) => {
  const responseCode = err?.response?.status;
  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout();
  }
};
