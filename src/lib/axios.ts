import { useAuthStore } from "@/store/auth-store";
import { useSessionStore } from "@/store/session-store";
import axios, { AxiosError } from "axios";

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

const axiosInstance = axios.create(baseConfig);
const axiosClient = axios.create(baseConfig);

// request interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    const credentials = useAuthStore.getState().credentials;
    if (credentials?.accessToken) {
      request.headers.Authorization = `Bearer ${credentials.accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const credentials = useAuthStore.getState().credentials!;
    const setCredentials = useAuthStore.getState().actions.setCredentials;

    if (
      error.response?.status === 401 &&
      error.response.data?.message === "expired_token"
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosClient.post("/auth/refresh");
        const { accessToken } = res.data;

        setCredentials({ ...credentials, accessToken });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 403 &&
            error.response.data.message === "expired_refresh_token"
          ) {
            setCredentials(null);
            await axiosClient.post("/auth/logout");
            //    session modal
            useSessionStore.getState().actions.setSessionExpired(true);
          }
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
