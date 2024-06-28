import { Input } from "../input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { TransferMoneyDialog } from "./transfer-money-dialog";
import { useTransferMoney } from "@/hooks/useTransferMoney";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { CardContent, CardHeader, CardTitle } from "../card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

// transfer schema
const formSchema = z.object({
  walletId: z.string().length(10, { message: "WalletId must be 10 digit" }),
  amount: z.coerce
    .number()
    .positive()
    .gte(100, { message: "Amount must not be less that N100" }),
  description: z.string().min(3, { message: "Description is required" }),
});

export type FormDataType = z.infer<typeof formSchema>;
const defaultValues = {
  amount: 100,
  walletId: "",
  description: "",
};

export const TransferMoney = () => {
  const [formData, setFormData] = useState<FormDataType>(defaultValues);
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [searchParams, setSearchParams] = useSearchParams({
    isModalOpen: "false",
  });

  // get searchParams
  const isModalOpen = searchParams.get("isModalOpen") === "true";

  const { data, isSuccess, isError, error, mutate, isPending } =
    useTransferMoney();

  const openModal = () => {
    setSearchParams((prev) => {
      prev.set("isModalOpen", "true");
      return prev;
    });
  };
  const closeModal = () => {
    setSearchParams((prev) => {
      prev.set("isModalOpen", "false");
      return prev;
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toastSuccessMessage(data.message);
      form.reset();
      closeModal();
    }
    if (isError) {
      if (error instanceof AxiosError) {
        const errorMessage: string =
          error.response?.data.message || error.message;
        toastErrorMessage(errorMessage);
      }
    }
  }, [isError, isSuccess, error]);

  const onSubmit = (values: FormDataType) => {
    setFormData(values);
    openModal();
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">Transfer Money</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center w-full fit-content">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 p-2 w-full"
          >
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WalletId</FormLabel>
                  <FormControl>
                    <Input placeholder="walletId" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="font-bold text-lg self-center md:w-2/3 sm:w-full"
              onClick={() => {}}
            >
              Transfer
            </Button>
          </form>
          <TransferMoneyDialog
            isModalOpen={isModalOpen}
            onClose={closeModal}
            mutate={mutate}
            formData={formData}
            isPending={isPending}
          />
        </Form>
      </CardContent>
    </>
  );
};
