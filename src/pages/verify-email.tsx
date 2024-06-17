import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useAuth } from "@/store/auth-store";
import { AxiosError } from "axios";
import useAxios from "@/hooks/useAxios";

type DataType = {
  token: string;
  id: string;
};

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const allParams = Object.fromEntries(searchParams);

  const credentials = useAuth();

  const axiosInstance = useAxios();

  const navigate = useNavigate();

  const { isPending, isSuccess, mutate, data, isError, error } = useMutation({
    mutationFn: async (data: DataType): Promise<{ message: string }> => {
      const res = await axiosInstance.post("/auth/verify-email", data);
      return res.data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
      toastSuccessMessage(data.message);
    }

    if (isError) {
      if (error instanceof AxiosError) {
        const errorMessage: string =
          error.response?.data.message || error.message;
        toastErrorMessage(errorMessage);
      }
    }
  }, [isSuccess, isError, error]);

  useEffect(() => {
    if (credentials?.accessToken && credentials?.isVerified) {
      navigate("/dashboard");
    }

    if (credentials?.accessToken && !credentials?.isVerified) {
      navigate("/not-verified");
    }
  }, [navigate, credentials?.accessToken, credentials?.isVerified]);

  return (
    <div className="h-screen flex flex-col items-center justify-center  space-y-4">
      <p className="text-5xl text-blue-400 animate-bounce">X-PAY</p>
      <p>Click on the button below to verify your email</p>
      <Button
        variant="secondary"
        disabled={isPending}
        onClick={() => mutate(allParams as DataType)}
      >
        Verify Email
      </Button>
    </div>
  );
};
