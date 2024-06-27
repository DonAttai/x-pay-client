import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../button";
import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/hooks/axios";
import { capitalizeFirstLetter, toastErrorMessage } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { TransferMoneyType } from "@/hooks/useTransferMoney";
import { FormDataType } from "./transfer-money";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

type PropType = {
  isModalOpen: boolean;
  onClose: () => void;
  mutate: (
    data: TransferMoneyType
  ) => { message: string } | Error | TransferMoneyType | unknown;
  formData: FormDataType;
  isPending: boolean;
};

export const TransferMoneyDialog = ({
  isModalOpen,
  onClose,
  formData,
  mutate,
  isPending,
}: PropType) => {
  const { data: wallet } = useWallet();

  // get beneficiary wallet
  const { data: payeeWallet } = useQuery({
    queryKey: ["payeeWallet", formData.walletId],
    queryFn: async () => {
      const res = await axiosInstance.get(`users/wallets/${formData.walletId}`);
      return res.data;
    },
    enabled: !!formData.walletId,
  });

  useEffect(() => {
    if (wallet?.id === formData.walletId && !isModalOpen) {
      toastErrorMessage("You can't make transfer to yourself");
    }
  }, [formData.walletId]);

  // return null when modal is closed
  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        {payeeWallet?.user
          ? `Transfer ${formatNaira(+formData.amount)} to
          ${capitalizeFirstLetter(
            payeeWallet.user.firstName
          )} ${capitalizeFirstLetter(payeeWallet.user.lastName)}`
          : `${formData.walletId} is not valid, check the walletId again`}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {payeeWallet?.user && (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => mutate({ ...formData, type: "transfer" })}
            >
              {isPending ? "Loading..." : "Confirm"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
