import { toastErrorMessage } from "@/lib/utils";
import { UserCredentialsType } from "@/store/auth-store";
import { useSessionStore } from "@/store/session-store";
import axios, { AxiosError } from "axios";

const API_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const credentials = JSON.parse(
      localStorage.getItem("credentials") as string
    );
    if (credentials && credentials.accessToken) {
      config.headers.Authorization = `Bearer ${credentials.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    const credentials: UserCredentialsType = JSON.parse(
      localStorage.getItem("credentials") as string
    );
    if (error.response.status === 401) {
      const errorMessage =
        error.response.data.message || error.response.data.error;

      if (errorMessage === "expired_token" && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axiosInstance.post("/auth/refresh");
          const { accessToken: newAccessToken } = res.data;
          credentials.accessToken = newAccessToken;

          localStorage.setItem("credentials", JSON.stringify(credentials));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMesage = error.response?.data.message;
            if (
              error.response?.status === 403 &&
              errorMesage === "expired_refresh_token"
            ) {
              localStorage.removeItem("credentials");
              await axiosInstance.post("/auth/logout");
              // session modal
              useSessionStore.getState().actions.setSessionExpired(true);
            }
          } else {
            toastErrorMessage("something went wrong!");
          }
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
