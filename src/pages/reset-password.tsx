import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useAuth } from "@/store/auth-store";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";

const schema = z.object({
  password: z.string().min(1, { message: "field is required" }),
});

type DataType = {
  password: string;
  token: string;
  id: string;
};

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const { id, token } = Object.fromEntries(searchParams);

  const navigate = useNavigate();
  const credentials = useAuth();

  const { isPending, isSuccess, mutate, data, error, isError } = useMutation({
    mutationFn: async (data: DataType): Promise<{ message: string }> => {
      const res = await axiosInstance.post("/auth/reset-password", data);
      return res.data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
      setPassword("");
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

  const handleSubmit = () => {
    const validatedData = schema.safeParse({ password });

    if (!validatedData.success) {
      const error = fromError(validatedData.error);
      toastErrorMessage(error.message);
      return;
    }
    mutate({ ...validatedData.data, id, token });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center  space-y-4">
      <p className="text-5xl text-blue-400 animate-bounce">X-PAY</p>
      <p className="text-xl">Enter your new password</p>

      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <Input
            type="password"
            id="new-password"
            name="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          className="text-lg font-bold"
          disabled={isPending}
          onClick={handleSubmit}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
};
