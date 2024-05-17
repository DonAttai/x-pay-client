import { Label } from "../label";
import { Input } from "../input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios";
import { useUserId } from "@/store/auth-store";
import { z } from "zod";
import { FormEvent, useEffect, useRef } from "react";
import { ValidationError, fromError } from "zod-validation-error";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const schema = z.object({
  walletId: z.string().length(10, { message: "Wallet Id is required" }),
  amount: z.number().min(100, { message: "Amount must not be less that N100" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export const TransferMoney = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const userId = useUserId();
  const queryClient = useQueryClient();

  const { data, mutate, isSuccess, isError, error } = useMutation({
    mutationFn: async (userData: {
      walletId: string;
      amount: number;
      type: string;
      description: string;
    }) => {
      const res = await axiosInstance.post(`/${userId}/transactions`, userData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      formRef.current?.reset();
      toast.success(data.message);
    }
    if (isError) {
      if (error instanceof AxiosError) {
        const erroMessage: string =
          error.response?.data.message || error.message;
        toast.error(erroMessage, { duration: 4000, position: "top-right" });
      }
    }
  }, [isError, isSuccess, error]);

  // handle submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      const validatedData = schema.safeParse({ ...data, amount: +data.amount });
      if (!validatedData.success) {
        const error = fromError(validatedData.error);
        throw error;
      }
      mutate({
        ...validatedData.data,
        type: "transfer",
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="wallet-id" className="text-right">
              WalletId
            </Label>
            <Input id="wallet-id" name="walletId" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              placeholder="minimum of N100"
              className="col-span-3 outline-none"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              className="col-span-3 outline-none"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Button variant={"outline"}>Send</Button>
          </div>
        </div>
      </form>
    </>
  );
};
