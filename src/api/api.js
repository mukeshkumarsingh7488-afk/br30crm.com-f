import axios from "axios";
import { assertRequestPermission } from "../utils/requestPermissions";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 90000,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    assertRequestPermission({ method: config.method, url: config.url });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes("/auth/login") && !originalRequest?.url?.includes("/auth/refresh")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (!token) {
              reject(error);
              return;
            }

            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post("/auth/refresh");

        const newToken = response.data?.data?.accessToken;

        if (!newToken) {
          throw new Error("Access token refresh failed.");
        }

        localStorage.setItem("token", newToken);

        isRefreshing = false;
        onRefreshed(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(null);
        clearAuthStorage();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const apiRequest = async (config) => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    const data = error.response?.data;

    const message = data?.message || data?.error || error.message || "Something went wrong.";

    const customError = new Error(message);

    customError.status = error.response?.status || 500;
    customError.response = error.response;
    customError.data = data;

    throw customError;
  }
};

export default api;
