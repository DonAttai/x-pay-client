import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios";
import { useAuth } from "@/store/auth-store";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";

const schema = z.object({
  email: z.string().min(1, { message: "field is required" }).email(),
});

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const credentials = useAuth();
  const navigate = useNavigate();

  const { isPending, isSuccess, mutate, data, error, isError } = useMutation({
    mutationFn: async (data: {
      email: string;
    }): Promise<{ message: string }> => {
      const res = await axiosInstance.post("/auth/forgot-password", data);
      return res.data;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setEmail("");
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
    const validatedData = schema.safeParse({ email });

    if (!validatedData.success) {
      const error = fromError(validatedData.error);
      toastErrorMessage(error.message);
      return;
    }
    mutate(validatedData.data!);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center  space-y-4">
      <p className="text-5xl text-blue-400 animate-bounce">X-PAY</p>
      <p className="text-xl">Enter your email to reset your password</p>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          type="button"
          className="text-lg font-bold"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {isPending ? (
            <Loader className="animate-spin inline-block" />
          ) : (
            "Send"
          )}
        </Button>
      </div>
    </div>
  );
};
