import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../button";
import { FormDataType } from "./transfer-money";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

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
  // const { data: user } = useUser();

  // get beneficiary wallet
  const { data: payeeWallet } = useQuery({
    queryKey: ["beneficiaryWallet", data.walletId],
    queryFn: async () => {
      const res = await axiosInstance.get(`users/wallets/${data.walletId}`);
      return res.data;
    },
    enabled: !!data.walletId,
  });

  // if (user?.wallet.id === data.walletId) {
  //   toast.error("You are not allowed to make transfer to yourself");
  //   return null;
  // }

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
