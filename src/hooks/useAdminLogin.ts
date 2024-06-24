import axiosInstance from "@/lib/axios";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { UserCredentialsType, useAuthActions } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const loginMutation = async (credentials: {
  email: string;
  password: string;
}): Promise<UserCredentialsType> => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const { setCredentials } = useAuthActions();
  return useMutation({
    mutationFn: loginMutation,
    onSuccess: (data) => {
      if (
        data.accessToken &&
        data.roles.includes("admin") &&
        data.isVerified &&
        data.isActive
      ) {
        setCredentials(data);
        navigate("/admin/dashboard");
        toastSuccessMessage("Logged in!");
      } else {
        toastErrorMessage("Access denied");
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage = error?.response?.data.message;
        toastErrorMessage(errorMessage);
      } else {
        toastErrorMessage(error.message);
      }
    },
  });
};
