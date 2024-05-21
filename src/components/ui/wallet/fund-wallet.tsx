import axiosInstance from "@/hooks/axios";
import { useUser } from "@/hooks/use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { ValidationError, fromError } from "zod-validation-error";
import { Label } from "../label";
import { Input } from "../input";
import { Button } from "@/components/ui/button";

const fundWalletSchema = z.object({
  amount: z.number().min(100),
});

export const FundWallet = () => {
  const queryClient = useQueryClient();

  const {
    data: paystackData,
    mutate,
    error,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async (userData: { amount: number; email: string }) => {
      const res = await axiosInstance.post("/paystack/initialize", userData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const { data: user } = useUser();

  useEffect(() => {
    if (isSuccess) {
      const {
        data: { authorization_url },
      } = paystackData;
      window.location.href = authorization_url;
    }

    if (isError) {
      if (error instanceof AxiosError) {
        const erroMessage: string =
          error.response?.data.message || error.message;
        toast.error(erroMessage);
      }
    }
  }, [isError, isSuccess, error]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValue = Object.fromEntries(formData);
    try {
      const validatedData = fundWalletSchema.safeParse({
        amount: +formValue.amount,
      });
      if (!validatedData.success) {
        const error = fromError(validatedData.error);
        throw error;
      }

      const { data } = validatedData;
      mutate({ amount: data.amount, email: user?.email! });
    } catch (err) {
      if (err instanceof ValidationError) {
        toast.error(err.message, { duration: 4000, position: "top-right" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <Input
            type="number"
            name="amount"
            id="amount"
            placeholder="minimum of N100"
            className="outline-none border-none col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Button variant={"outline"}>Fund Wallet</Button>
        </div>
      </div>
    </form>
  );
};
