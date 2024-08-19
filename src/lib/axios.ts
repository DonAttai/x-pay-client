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

const axiosInstance: AxiosInstance = axios.create(baseConfig); // axios instance with interceptors

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
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        const res = await axiosInstance.post("/auth/refresh", {});

        // Update credentials with the new access token
        const credentials = useAuthStore?.getState().credentials!; //get credentials from auth store
        setCredentials({ ...credentials, accessToken: res.data.accessToken }); //update credentials
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (err) {
        // Handle cases where the refresh token fails
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            // Clear credentials and log the user out
            setCredentials(null);
            await axiosInstance.post("/auth/logout");

            // Show session expired modal
            useSessionStore?.getState().actions.setSessionExpired(true);
          }
        }
        return Promise.reject(err); // Reject the promise with the error
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
