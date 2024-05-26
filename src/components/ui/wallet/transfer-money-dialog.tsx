import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../button";
import { FormDataType } from "./transfer-money";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios";
import { capitalizeFirstLetter } from "@/lib/utils";

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
  // get beneficiary wallet

  const { data: beneficiaryWallet } = useQuery({
    queryKey: ["beneficiaryWallet", data.walletId],
    queryFn: async () => {
      const res = await axiosInstance.get(`users/wallets/${data.walletId}`);
      return res.data;
    },
    enabled: !!data.walletId,
  });
  const {
    user: { lastName, firstName },
  } = beneficiaryWallet;
  // return null when modal is closed
  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        {beneficiaryWallet
          ? `Transfer ${formatNaira(+data.amount)} to
          ${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
              lastName
            )}`
          : `${data.walletId} is not a valid walletId`}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {beneficiaryWallet && (
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
