import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("userInfo") as string);
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
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
    const status = error.response ? error.response.status : null;
    const user = JSON.parse(localStorage.getItem("userInfo") as string);

    if (status === 401) {
      if (user) {
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
        toast.error("Your session has expired! Enter credentials to login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
