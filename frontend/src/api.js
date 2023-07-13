import axios from "axios";
import { logout } from "./components/Auth";
const END_POINT = import.meta.env.VITE_END_POINT_CERT;
const apiClient = axios.create({
  baseURL: `${END_POINT}/api`,
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
    return await apiClient.post("/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    return {
      error: true,
      err,
    };
  }
};

export const searchUser = async (string) => {
  try {
    return await apiClient.get(`/user?search=${string}`);
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const getChat = async (userId) => {
  try {
    return await apiClient.post(`/chat`, { userId });
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const getAllChat = async (userId) => {
  try {
    return await apiClient.get(`/chat`, { userId });
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const getCallHistory = async (chatId) => {
  try {
    return await apiClient.get(`/chats/${chatId}/callhistory`);
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const createGroup = async (name, users) => {
  try {
    return await apiClient.post("/chat/group", {
      name: name,
      users: JSON.stringify(users.map((u) => u._id)),
    });
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const renameGroup = async (chatId, newName) => {
  try {
    return await apiClient.put("/chat/rename", {
      chatId,
      chatName: newName,
    });
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const addUser = async (chatId, userId) => {
  try {
    return await apiClient.put("/chat/groupadd", {
      chatId,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const removeUser = async (chatId, userId) => {
  try {
    return await apiClient.put("/chat/groupremove", {
      chatId,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const sendMsg = async (chatId, content, chatType) => {
  try {
    return await apiClient.post("/message", {
      chatId,
      content,
      chatType,
    });
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const getMsg = async (chatId) => {
  try {
    return await apiClient.get(`/message/${chatId}`);
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};

export const genRTCToken = async (chatId) => {
  try {
    const resData = await apiClient.post("/agora/rtctoken", {
      chatId,
    });
    return resData.data;
  } catch (err) {
    return {
      error: true,
      err,
    };
  }
};
// Secure Route
const checkResponseCode = (err) => {
  const responseCode = err?.response?.status;
  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout();
  }
};
