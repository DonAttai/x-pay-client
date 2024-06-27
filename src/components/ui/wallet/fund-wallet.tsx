import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth-store";
import axiosInstance from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "../card";

const formSchema = z.object({
  amount: z.coerce
    .number()
    .gte(100, { message: "Amount must not be less than N100" }),
});

type FormDataType = z.infer<typeof formSchema>;

export const FundWallet = () => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (userData: { amount: number; email: string }) => {
      const res = await axiosInstance.post("/paystack/initialize", userData);
      return res.data;
    },
    onSuccess: (data) => {
      window.location.href = data.data.authorization_url;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const erroMessage: string =
          error.response?.data.message || error.message;
        toast.error(erroMessage);
      }
    },
  });

  const credentials = useAuth()!;

  const onSubmit = (values: FormDataType) => {
    mutate({ ...values, email: credentials?.email });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">Fund Wallet</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 md:w-3/4 sm:w-ful"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Minimum amount is N100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="font-bold text-lg self-center md:w-2/3 sm:w-full"
            >
              {isPending ? (
                <Loader className="animate-spin inline-block" />
              ) : (
                "Fund Wallet"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
};
