import { useAuthStore } from "@/store/auth-store";
import { useSessionStore } from "@/store/session-store";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL;

const baseConfig = {
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const axiosInstance: AxiosInstance = axios.create(baseConfig);

// Request Interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    const credentials = useAuthStore.getState().credentials;
    if (credentials?.accessToken) {
      request.headers.Authorization = `Bearer ${credentials.accessToken}`;
    }
    return request;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const setCredentials = useAuthStore.getState().actions.setCredentials;

    // Check if the error is a 401 Unauthorized and the request has not been retried yet
    if (
      error.response?.status === 401 &&
      error.response.data.message === "Unauthorized" &&
      !originalRequest._retry
    ) {
      const credentials = useAuthStore.getState().credentials!;
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post("/auth/refresh", {});
        setCredentials({ ...credentials, accessToken: res.data.accessToken });
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (
            err.response?.status === 403 &&
            err.response.data.message === "expired refresh token"
          ) {
            setCredentials(null);
            await axiosInstance.post("/auth/logout", {});
            useSessionStore.getState().actions.setSessionExpired(true);
          }
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
