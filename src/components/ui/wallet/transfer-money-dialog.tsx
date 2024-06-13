import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../button";
import { FormDataType } from "./transfer-money";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios";
import { capitalizeFirstLetter, toastErrorMessage } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { useEffect } from "react";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

type PropType = {
  isModalOpen: boolean;
  onClose: () => void;
  handleSubmit: (data: FormDataType) => void;
  data: FormDataType;
  isPending: boolean;
};

export const TransferMoneyDialog = ({
  isModalOpen,
  onClose,
  data,
  handleSubmit,
  isPending,
}: PropType) => {
  const { data: wallet } = useWallet();
  // get beneficiary wallet
  const { data: payeeWallet } = useQuery({
    queryKey: ["payeeWallet", data.walletId],
    queryFn: async () => {
      const res = await axiosInstance.get(`users/wallets/${data.walletId}`);
      return res.data;
    },
    enabled: isModalOpen && !!data.walletId,
  });

  useEffect(() => {
    if (wallet?.id === data.walletId && !isModalOpen) {
      toastErrorMessage("You can't make transfer to yourself");
    }
  }, [data.walletId]);

  // return null when modal is closed
  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        {payeeWallet
          ? `Transfer ${formatNaira(+data.amount)} to
          ${capitalizeFirstLetter(
            payeeWallet.user.firstName
          )} ${capitalizeFirstLetter(payeeWallet.user.lastName)}`
          : `${data.walletId} is not a valid walletId`}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {payeeWallet && (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleSubmit(data)}
            >
              {isPending ? "Loading..." : "Confirm"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
