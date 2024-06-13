import { toastErrorMessage } from "@/lib/utils";
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
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const user = JSON.parse(localStorage.getItem("credentials") as string);

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        //fetch new token from server
        const res = await axiosInstance.post("/auth/refresh");
        const { accessToken } = res.data;
        localStorage.setItem(
          "credentials",
          JSON.stringify({ ...user, accessToken })
        );

        // attach new token to request headers
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        // mark request as retiried once
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (refreshError instanceof AxiosError) {
          // invalid refresh token
          if (refreshError.response && refreshError.response.status === 403) {
            localStorage.removeItem("credentials");
            window.location.href = "/login";
            toastErrorMessage("Your session has expired! Login again");
          }
        } else {
          toastErrorMessage("something went wrong!");
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
