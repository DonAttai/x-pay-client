import { Label } from "../label";
import { Input } from "../input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useEffect, useState } from "react";
import { fromError } from "zod-validation-error";
import { AxiosError } from "axios";
import { TransferMoneyDialog } from "./transfer-money-dialog";
import { useTransferMoney } from "@/hooks/useTransferMoney";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

export type FormDataType = {
  amount: string;
  walletId: string;
  description: string;
};

// transfer schema
const transferSchema = z.object({
  walletId: z.string().length(10, { message: "Wallet Id is required" }),
  amount: z
    .number()
    .positive()
    .min(100, { message: "Amount must not be less that N100" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export const TransferMoney = () => {
  const [formData, setFormData] = useState<FormDataType>({
    amount: "",
    walletId: "",
    description: "",
  });
  const [searchParams, setSearchParams] = useSearchParams({
    isModalOpen: "false",
  });

  // get searchParams
  const isModalOpen = searchParams.get("isModalOpen") === "true";

  const { data, isSuccess, isError, error, mutate, isPending } =
    useTransferMoney();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
      closeModal();
      setFormData({ amount: "", walletId: "", description: "" });
    }
    if (isError) {
      if (error instanceof AxiosError) {
        const errorMessage: string =
          error.response?.data.message || error.message;
        toastErrorMessage(errorMessage);
      }
    }
  }, [isError, isSuccess, error]);

  const validateData = () => {
    const data = transferSchema.safeParse({
      ...formData,
      amount: Number(formData.amount),
    });
    if (!data.success) {
      const error = fromError(data.error);
      toastErrorMessage(error.message);
      return;
    }
    setFormData({ ...data.data, amount: String(data.data.amount) });
    openModal();
  };

  // handle submit
  const handleSubmit = (data: FormDataType) => {
    mutate({ ...data, amount: Number(data.amount), type: "transfer" });
  };

  return (
    <>
      <form>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="wallet-id" className="text-right">
              WalletId
            </Label>
            <Input
              id="wallet-id"
              name="walletId"
              value={formData.walletId}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
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
              value={formData.description}
              className="col-span-3 outline-none"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 flex justify-center">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  validateData();
                }}
              >
                Transfer
              </Button>
            </div>
          </div>
        </div>
      </form>
      <TransferMoneyDialog
        isModalOpen={isModalOpen}
        onClose={closeModal}
        handleSubmit={handleSubmit}
        data={formData}
        isPending={isPending}
      />
    </>
  );
};
