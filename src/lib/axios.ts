import { UserCredentialsType } from "@/store/auth-store";
import { useSessionStore } from "@/store/session-store";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface FailedRequests {
  resolve: (value: AxiosResponse) => void;
  reject: (value: AxiosError) => void;
  config: AxiosRequestConfig;
  error: AxiosError;
}

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

// request interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    const credentials = JSON.parse(
      localStorage.getItem("credentials") as string
    );
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
let failedRequests: FailedRequests[] = [];
let isTokenRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config!;
    const credentials: UserCredentialsType = JSON.parse(
      localStorage.getItem("credentials") as string
    );

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (isTokenRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequests.push({
          resolve,
          reject,
          config: originalRequest,
          error: error,
        });
      });
    }

    isTokenRefreshing = true;

    try {
      const res = await axiosInstance.post("/auth/refresh");
      const { accessToken = null } = res.data;

      if (!accessToken) {
        throw new Error(
          "Something went wrong while refreshing your access token"
        );
      }

      credentials.accessToken = accessToken;

      localStorage.setItem("credentials", JSON.stringify(credentials));

      failedRequests.forEach(({ resolve, reject, config }) => {
        axiosInstance(config)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    } catch (_error: unknown) {
      failedRequests.forEach(({ reject, error }) => reject(error));
      localStorage.removeItem("credentials");
      await axiosInstance.post("/auth/logout");
      // session modal
      useSessionStore.getState().actions.setSessionExpired(true);
      return Promise.reject(error);
    } finally {
      failedRequests = [];
      isTokenRefreshing = false;
    }

    return axiosInstance(originalRequest);
  }
);

export default axiosInstance;
