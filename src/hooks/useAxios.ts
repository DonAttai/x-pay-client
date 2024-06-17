import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toastErrorMessage } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "@/store/auth-store";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxios = () => {
  const navigate = useNavigate();
  const { logOut } = useAuthActions();
  useEffect(() => {
    const interceptorRequest = axiosInstance.interceptors.request.use(
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

    const interceptorResponse = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const user = JSON.parse(localStorage.getItem("credentials") as string);

        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data?.message.includes("jwt expired") &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const res = await axiosInstance.post("/auth/refresh");
            const { accessToken } = res.data;
            localStorage.setItem(
              "credentials",
              JSON.stringify({ ...user, accessToken })
            );
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            if (refreshError instanceof AxiosError) {
              if (
                refreshError.response &&
                refreshError.response.status === 403 &&
                refreshError.response.data?.message.includes("jwt expired")
              ) {
                logOut();
                toast("Your session has expired, login again", {
                  duration: 4000,
                  position: "top-right",
                });
                navigate("/login");
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

    return () => {
      axiosInstance.interceptors.request.eject(interceptorRequest);
      axiosInstance.interceptors.response.eject(interceptorResponse);
    };
  }, []);

  return axiosInstance;
};

export default useAxios;
