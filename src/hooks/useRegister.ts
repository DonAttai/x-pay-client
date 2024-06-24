import axiosInstance from "@/lib/axios";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type CredentialType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (credentials: CredentialType) => {
      const res = await axiosInstance.post("/auth/register", credentials);
      return res.data;
    },

    onSuccess: (data) => {
      navigate("/not-verified");
      toastSuccessMessage(data.message);
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage: string =
          error.response?.data.message || error.message;
        toastErrorMessage(errorMessage);
      }
    },
  });
};
